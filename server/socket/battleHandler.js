const BattleRoom = require('../models/BattleRoom');
const BattleMatch = require('../models/BattleMatch');
const { expertQuestions } = require('../questions/expertQuestions');

// In-memory active room cache for zero-latency authoritative real-time state
const activeRooms = new Map();
// Socket ID to Player mapping
const socketPlayerMap = new Map();

/**
 * Generate a unique 4-digit room code: BRAIN-XXXX
 */
function generateRoomCode() {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `BRAIN-${code}`;
}

/**
 * Select 10 questions with progressive difficulty:
 * Q1-Q3: HARD
 * Q4-Q7: EXPERT
 * Q8-Q10: MASTER
 */
function pickMatchQuestions() {
  const hardPool = expertQuestions.filter(q => q.difficulty === 'HARD');
  const expertPool = expertQuestions.filter(q => q.difficulty === 'EXPERT');
  const masterPool = expertQuestions.filter(q => q.difficulty === 'MASTER');

  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

  const selectedHard = shuffle(hardPool).slice(0, 3);
  const selectedExpert = shuffle(expertPool).slice(0, 4);
  const selectedMaster = shuffle(masterPool).slice(0, 3);

  // If pool count is short, fill from all questions
  const chosen = [...selectedHard, ...selectedExpert, ...selectedMaster];
  if (chosen.length < 10) {
    const remaining = shuffle(expertQuestions.filter(q => !chosen.includes(q)));
    while (chosen.length < 10 && remaining.length > 0) {
      chosen.push(remaining.pop());
    }
  }

  return chosen.slice(0, 10);
}

/**
 * Calculate speed bonus (0 - 50 points) based on seconds elapsed
 */
function calculateSpeedBonus(timeTakenSeconds) {
  if (timeTakenSeconds <= 5) return 50;
  if (timeTakenSeconds <= 10) return 40;
  if (timeTakenSeconds <= 20) return 25;
  if (timeTakenSeconds <= 35) return 10;
  return 5;
}

function initBattleSocket(io) {
  io.on('connection', (socket) => {
    // ----------------------------------------------------
    // 1. CREATE BATTLE ROOM
    // ----------------------------------------------------
    socket.on('battle:create', async (data, callback) => {
      try {
        const { playerId, playerName } = data || {};
        if (!playerId || !playerName) {
          if (callback) callback({ success: false, error: 'Player info required' });
          return;
        }

        // Generate unique code
        let roomCode = generateRoomCode();
        while (activeRooms.has(roomCode)) {
          roomCode = generateRoomCode();
        }

        const roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const questions = pickMatchQuestions();

        const hostPlayer = {
          playerId,
          socketId: socket.id,
          name: playerName.trim(),
          score: 0,
          speedBonusTotal: 0,
          correctCount: 0,
          isReady: true,
          connected: true,
          disconnectedAt: null
        };

        const roomState = {
          roomId,
          roomCode,
          hostPlayerId: playerId,
          guestPlayerId: null,
          status: 'WAITING',
          players: [hostPlayer],
          questions,
          questionIndex: 0,
          totalQuestions: 10,
          answers: [],
          roundAnswers: new Map(), // playerId -> answer object for current round
          currentQuestionStartedAt: null,
          currentQuestionDeadline: null,
          roundTimer: null,
          disconnectTimers: new Map(),
          rematchVotes: new Set(),
          createdAt: Date.now()
        };

        activeRooms.set(roomCode, roomState);
        socketPlayerMap.set(socket.id, { roomCode, playerId });
        socket.join(roomCode);

        // Auto-expire waiting room after 10 minutes if no guest joins
        setTimeout(() => {
          const r = activeRooms.get(roomCode);
          if (r && r.status === 'WAITING') {
            r.status = 'EXPIRED';
            io.to(roomCode).emit('battle:expired', { message: 'Battle challenge expired after 10 minutes.' });
            activeRooms.delete(roomCode);
          }
        }, 10 * 60 * 1000);

        // Save initial state to MongoDB (non-blocking)
        try {
          await BattleRoom.create({
            roomId,
            roomCode,
            hostPlayerId: playerId,
            status: 'WAITING',
            players: [hostPlayer],
            questionIds: questions.map(q => q.questionId)
          });
        } catch (dbErr) {
          console.warn('MongoDB room create notice:', dbErr.message);
        }

        if (callback) {
          callback({
            success: true,
            roomId,
            roomCode,
            player: hostPlayer
          });
        }

        socket.emit('battle:created', {
          roomId,
          roomCode,
          player: hostPlayer,
          status: 'WAITING'
        });
      } catch (err) {
        console.error('Error creating battle:', err);
        if (callback) callback({ success: false, error: err.message });
      }
    });

    // ----------------------------------------------------
    // 2. JOIN BATTLE ROOM
    // ----------------------------------------------------
    socket.on('battle:join', async (data, callback) => {
      try {
        const { roomCode: rawCode, playerId, playerName } = data || {};
        if (!rawCode || !playerId || !playerName) {
          if (callback) callback({ success: false, error: 'Room code and player name required' });
          return;
        }

        const roomCode = rawCode.trim().toUpperCase();
        const room = activeRooms.get(roomCode);

        if (!room) {
          if (callback) callback({ success: false, error: 'Battle not found. Please check code.' });
          return;
        }

        if (room.status === 'EXPIRED') {
          if (callback) callback({ success: false, error: 'Battle expired. Create a new challenge.' });
          return;
        }

        // If joining from another tab or socket, check if playerId collided with hostPlayerId
        let joiningPlayerId = playerId;
        if (room.hostPlayerId === joiningPlayerId) {
          // If different socket, this is definitely Player 2 joining from another tab or window
          if (socket.id !== room.players[0].socketId) {
            joiningPlayerId = 'ply_guest_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 6);
          } else {
            // Identical socket re-entering
            socketPlayerMap.set(socket.id, { roomCode, playerId: joiningPlayerId });
            socket.join(roomCode);
            if (callback) callback({ success: true, room, role: 'host' });
            return;
          }
        }

        if (room.guestPlayerId && room.guestPlayerId !== joiningPlayerId) {
          if (callback) callback({ success: false, error: 'Battle already has 2 players.' });
          return;
        }

        // Add guest player
        const guestPlayer = {
          playerId: joiningPlayerId,
          socketId: socket.id,
          name: playerName.trim(),
          score: 0,
          speedBonusTotal: 0,
          correctCount: 0,
          isReady: true,
          connected: true,
          disconnectedAt: null
        };

        room.guestPlayerId = joiningPlayerId;
        room.status = 'READY';
        room.players = [room.players[0], guestPlayer];

        activeRooms.set(roomCode, room);
        socketPlayerMap.set(socket.id, { roomCode, playerId: joiningPlayerId });
        socket.join(roomCode);

        // Update DB
        try {
          await BattleRoom.updateOne(
            { roomCode },
            { $set: { guestPlayerId: joiningPlayerId, status: 'READY', players: room.players } }
          );
        } catch (dbErr) {
          console.warn('MongoDB room update notice:', dbErr.message);
        }

        if (callback) {
          callback({
            success: true,
            roomId: room.roomId,
            roomCode: room.roomCode,
            assignedPlayerId: joiningPlayerId,
            players: room.players
          });
        }

        // Notify both players that opponent is found!
        io.to(roomCode).emit('battle:playerJoined', {
          players: room.players,
          status: 'READY'
        });

        // Trigger synchronized 3-2-1 countdown immediately
        startCountdown(io, roomCode);

      } catch (err) {
        console.error('Error joining battle:', err);
        if (callback) callback({ success: false, error: err.message });
      }
    });

    // ----------------------------------------------------
    // 3. SUBMIT ANSWER
    // ----------------------------------------------------
    socket.on('battle:answer', (data, callback) => {
      try {
        const { roomCode, questionId, answer, submittedAt } = data || {};
        const mapping = socketPlayerMap.get(socket.id);
        const playerId = mapping ? mapping.playerId : data.playerId;

        if (!roomCode || !playerId) {
          if (callback) callback({ success: false, error: 'Invalid submission' });
          return;
        }

        const room = activeRooms.get(roomCode);
        if (!room || room.status !== 'IN_PROGRESS') {
          if (callback) callback({ success: false, error: 'Game not currently in progress' });
          return;
        }

        const currentQ = room.questions[room.questionIndex];
        if (!currentQ || currentQ.questionId !== questionId) {
          if (callback) callback({ success: false, error: 'Invalid or inactive question' });
          return;
        }

        // Check if player already submitted this round
        if (room.roundAnswers.has(playerId)) {
          if (callback) callback({ success: false, error: 'Answer already submitted for this question' });
          return;
        }

        // Validate time against deadline
        const now = Date.now();
        const startTime = room.currentQuestionStartedAt;
        const timeTakenSec = Math.min(currentQ.timeLimit, Math.max(0.1, (now - startTime) / 1000));

        const isCorrect = answer === currentQ.correctAnswer;
        let basePoints = 0;
        let speedBonus = 0;

        if (isCorrect) {
          basePoints = currentQ.points || 100;
          speedBonus = calculateSpeedBonus(timeTakenSec);
        }

        const totalPoints = basePoints + speedBonus;

        // Update player score in memory
        const playerObj = room.players.find(p => p.playerId === playerId);
        if (playerObj) {
          playerObj.score += totalPoints;
          if (isCorrect) {
            playerObj.correctCount += 1;
            playerObj.speedBonusTotal += speedBonus;
          }
        }

        const answerRecord = {
          questionIndex: room.questionIndex,
          questionId,
          playerId,
          answer,
          isCorrect,
          timeTaken: Math.round(timeTakenSec * 10) / 10,
          basePoints,
          speedBonus,
          totalPoints,
          submittedAt: now
        };

        room.roundAnswers.set(playerId, answerRecord);
        room.answers.push(answerRecord);

        // Immediate acknowledgment to the submitting player
        if (callback) {
          callback({
            success: true,
            isCorrect,
            basePoints,
            speedBonus,
            totalPoints,
            correctAnswer: currentQ.correctAnswer // Returned to answering player for feedback
          });
        }

        // Notify the OPPONENT that this player has answered (without revealing their choice!)
        socket.to(roomCode).emit('battle:opponentAnswered', {
          playerId,
          playerName: playerObj ? playerObj.name : 'Opponent',
          hasAnswered: true
        });

        // If BOTH players have answered, immediately resolve the round!
        if (room.roundAnswers.size >= room.players.length) {
          if (room.roundTimer) {
            clearTimeout(room.roundTimer);
            room.roundTimer = null;
          }
          resolveRound(io, roomCode);
        }

      } catch (err) {
        console.error('Error submitting answer:', err);
        if (callback) callback({ success: false, error: err.message });
      }
    });

    // ----------------------------------------------------
    // 4. REMATCH FLOW
    // ----------------------------------------------------
    socket.on('battle:rematch', (data) => {
      const mapping = socketPlayerMap.get(socket.id);
      if (!mapping) return;
      const { roomCode, playerId } = mapping;
      const room = activeRooms.get(roomCode);
      if (!room) return;

      room.rematchVotes.add(playerId);

      // Inform opponent about rematch request
      socket.to(roomCode).emit('battle:rematchRequested', {
        requestedBy: playerId,
        votesCount: room.rematchVotes.size
      });

      // If both players agreed to rematch, create a fresh match!
      if (room.rematchVotes.size >= 2) {
        const newCode = generateRoomCode();
        const newRoomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const freshQuestions = pickMatchQuestions();

        const freshPlayers = room.players.map(p => ({
          ...p,
          score: 0,
          speedBonusTotal: 0,
          correctCount: 0,
          isReady: true
        }));

        const newRoomState = {
          roomId: newRoomId,
          roomCode: newCode,
          hostPlayerId: freshPlayers[0].playerId,
          guestPlayerId: freshPlayers[1].playerId,
          status: 'READY',
          players: freshPlayers,
          questions: freshQuestions,
          questionIndex: 0,
          totalQuestions: 10,
          answers: [],
          roundAnswers: new Map(),
          currentQuestionStartedAt: null,
          currentQuestionDeadline: null,
          roundTimer: null,
          disconnectTimers: new Map(),
          rematchVotes: new Set(),
          createdAt: Date.now()
        };

        activeRooms.set(newCode, newRoomState);

        // Tell all players in old room to move to new room
        io.to(roomCode).emit('battle:rematchStarted', {
          newRoomCode: newCode,
          players: freshPlayers
        });

        // Clean up old room
        activeRooms.delete(roomCode);

        // Start countdown in new room
        setTimeout(() => {
          startCountdown(io, newCode);
        }, 1500);
      }
    });

    // ----------------------------------------------------
    // 5. RECONNECT HANDLING
    // ----------------------------------------------------
    socket.on('battle:reconnect', (data, callback) => {
      try {
        const { roomCode, playerId } = data || {};
        if (!roomCode || !playerId) {
          if (callback) callback({ success: false, error: 'Missing room or player ID' });
          return;
        }

        const room = activeRooms.get(roomCode);
        if (!room) {
          if (callback) callback({ success: false, error: 'Room no longer active' });
          return;
        }

        const player = room.players.find(p => p.playerId === playerId);
        if (!player) {
          if (callback) callback({ success: false, error: 'Player not recognized in this battle' });
          return;
        }

        // Cancel any pending disconnect timer
        if (room.disconnectTimers && room.disconnectTimers.has(playerId)) {
          clearTimeout(room.disconnectTimers.get(playerId));
          room.disconnectTimers.delete(playerId);
        }

        player.socketId = socket.id;
        player.connected = true;
        player.disconnectedAt = null;

        socketPlayerMap.set(socket.id, { roomCode, playerId });
        socket.join(roomCode);

        const currentQ = room.questions[room.questionIndex];
        const hasAnsweredCurrent = room.roundAnswers.has(playerId);

        const sanitizedQuestion = currentQ ? {
          questionIndex: room.questionIndex,
          totalQuestions: room.totalQuestions,
          questionId: currentQ.questionId,
          category: currentQ.category,
          difficulty: currentQ.difficulty,
          questionText: currentQ.questionText,
          options: currentQ.options,
          timeLimit: currentQ.timeLimit,
          points: currentQ.points,
          deadline: room.currentQuestionDeadline
        } : null;

        if (callback) {
          callback({
            success: true,
            status: room.status,
            questionIndex: room.questionIndex,
            totalQuestions: room.totalQuestions,
            players: room.players,
            currentQuestion: sanitizedQuestion,
            hasAnswered: hasAnsweredCurrent,
            serverTime: Date.now()
          });
        }

        // Notify other player that opponent reconnected
        socket.to(roomCode).emit('battle:playerReconnected', {
          playerId,
          playerName: player.name
        });

      } catch (err) {
        console.error('Error during reconnect:', err);
        if (callback) callback({ success: false, error: err.message });
      }
    });

    // ----------------------------------------------------
    // 6. DISCONNECTION
    // ----------------------------------------------------
    socket.on('disconnect', () => {
      const mapping = socketPlayerMap.get(socket.id);
      if (!mapping) return;
      const { roomCode, playerId } = mapping;
      socketPlayerMap.delete(socket.id);

      const room = activeRooms.get(roomCode);
      if (!room) return;

      const player = room.players.find(p => p.playerId === playerId);
      if (!player) return;

      player.connected = false;
      player.disconnectedAt = Date.now();

      // Notify the opponent of temporary connection drop
      socket.to(roomCode).emit('battle:playerDisconnected', {
        playerId,
        playerName: player.name,
        graceSeconds: 30
      });

      // 30-Second Grace Period
      const disconnectTimer = setTimeout(async () => {
        const currentRoom = activeRooms.get(roomCode);
        if (!currentRoom) return;

        // If player never returned and game was active, forfeit to remaining player
        if (!player.connected && currentRoom.status === 'IN_PROGRESS') {
          const remainingPlayer = currentRoom.players.find(p => p.playerId !== playerId);
          currentRoom.status = 'FINISHED';
          currentRoom.winnerId = remainingPlayer ? remainingPlayer.playerId : null;

          io.to(roomCode).emit('battle:opponentForfeited', {
            disconnectedPlayer: player.name,
            winner: remainingPlayer ? remainingPlayer.name : null,
            reason: 'Opponent disconnected and did not return within 30 seconds.'
          });

          // Finalize match
          finalizeMatch(io, roomCode);
        }
      }, 30 * 1000);

      room.disconnectTimers.set(playerId, disconnectTimer);
    });
  });
}

/**
 * Synchronized Countdown: 3, 2, 1, GO!
 */
function startCountdown(io, roomCode) {
  const room = activeRooms.get(roomCode);
  if (!room) return;

  room.status = 'COUNTDOWN';
  let counter = 3;

  // Immediately emit initial 3 tick so players see countdown immediately
  io.to(roomCode).emit('battle:countdown', {
    count: counter,
    message: `${counter}`
  });
  counter--;

  const interval = setInterval(() => {
    io.to(roomCode).emit('battle:countdown', {
      count: counter,
      message: counter > 0 ? `${counter}` : 'GO! ⚡'
    });

    if (counter <= 0) {
      clearInterval(interval);
      room.status = 'IN_PROGRESS';
      // Deliver Question 1
      sendQuestion(io, roomCode);
    }
    counter--;
  }, 1000);
}

/**
 * Deliver Question to both clients (Omitting correctAnswer)
 */
function sendQuestion(io, roomCode) {
  const room = activeRooms.get(roomCode);
  if (!room || room.status !== 'IN_PROGRESS') return;

  const currentQ = room.questions[room.questionIndex];
  if (!currentQ) {
    finalizeMatch(io, roomCode);
    return;
  }

  room.roundAnswers.clear();
  const startTime = Date.now();
  const deadline = startTime + (currentQ.timeLimit * 1000);

  room.currentQuestionStartedAt = startTime;
  room.currentQuestionDeadline = deadline;

  // Safe client payload: Strictly omit correctAnswer!
  const clientPayload = {
    questionIndex: room.questionIndex,
    totalQuestions: room.totalQuestions,
    questionId: currentQ.questionId,
    category: currentQ.category,
    difficulty: currentQ.difficulty,
    questionText: currentQ.questionText,
    options: currentQ.options,
    timeLimit: currentQ.timeLimit,
    points: currentQ.points,
    serverTime: startTime,
    deadline: deadline
  };

  io.to(roomCode).emit('battle:question', clientPayload);

  // Set server-authoritative timer for the question deadline (+ 1 second buffer)
  if (room.roundTimer) clearTimeout(room.roundTimer);
  room.roundTimer = setTimeout(() => {
    resolveRound(io, roomCode);
  }, (currentQ.timeLimit + 1) * 1000);
}

/**
 * Authoritative Round Resolution
 */
function resolveRound(io, roomCode) {
  const room = activeRooms.get(roomCode);
  if (!room) return;

  if (room.roundTimer) {
    clearTimeout(room.roundTimer);
    room.roundTimer = null;
  }

  const currentQ = room.questions[room.questionIndex];
  if (!currentQ) return;

  // Prepare round results for each player
  const roundResults = room.players.map(p => {
    const ans = room.roundAnswers.get(p.playerId);
    return {
      playerId: p.playerId,
      name: p.name,
      answered: !!ans,
      answerChosen: ans ? ans.answer : null,
      isCorrect: ans ? ans.isCorrect : false,
      timeTaken: ans ? ans.timeTaken : currentQ.timeLimit,
      basePoints: ans ? ans.basePoints : 0,
      speedBonus: ans ? ans.speedBonus : 0,
      totalPoints: ans ? ans.totalPoints : 0,
      newTotalScore: p.score
    };
  });

  // Broadcast round result with the revealed correct answer and explanation
  io.to(roomCode).emit('battle:roundResult', {
    questionIndex: room.questionIndex,
    correctAnswer: currentQ.correctAnswer,
    explanation: currentQ.explanation,
    results: roundResults,
    players: room.players.map(p => ({
      playerId: p.playerId,
      name: p.name,
      score: p.score,
      correctCount: p.correctCount
    }))
  });

  // 3.5-second feedback delay before next question or match finish
  setTimeout(() => {
    room.questionIndex++;
    if (room.questionIndex < room.totalQuestions) {
      sendQuestion(io, roomCode);
    } else {
      finalizeMatch(io, roomCode);
    }
  }, 3500);
}

/**
 * Finalize 10-Question Match & Store in MongoDB
 */
async function finalizeMatch(io, roomCode) {
  const room = activeRooms.get(roomCode);
  if (!room) return;

  room.status = 'FINISHED';

  const [p1, p2] = room.players;
  let winner = null;
  let isDraw = false;

  if (p1 && p2) {
    if (p1.score > p2.score) {
      winner = p1;
    } else if (p2.score > p1.score) {
      winner = p2;
    } else {
      isDraw = true;
    }
  } else if (p1) {
    winner = p1;
  }

  room.winnerId = winner ? winner.playerId : null;
  room.isDraw = isDraw;

  const matchStats = {
    roomCode,
    isDraw,
    winner: winner ? { playerId: winner.playerId, name: winner.name, score: winner.score } : null,
    players: room.players.map(p => {
      const playerAnswers = room.answers.filter(a => a.playerId === p.playerId);
      const totalTime = playerAnswers.reduce((acc, a) => acc + (a.timeTaken || 0), 0);
      const avgTime = playerAnswers.length > 0 ? (totalTime / playerAnswers.length).toFixed(1) : 0;
      return {
        playerId: p.playerId,
        name: p.name,
        score: p.score,
        correctCount: p.correctCount,
        speedBonusTotal: p.speedBonusTotal,
        avgTime: parseFloat(avgTime)
      };
    })
  };

  io.to(roomCode).emit('battle:matchFinished', matchStats);

  // Persist to MongoDB
  try {
    if (p1 && p2) {
      await BattleMatch.create({
        roomId: room.roomId,
        roomCode,
        playerA: matchStats.players[0],
        playerB: matchStats.players[1],
        winnerId: winner ? winner.playerId : null,
        isDraw,
        questionsPlayed: room.totalQuestions
      });
    }

    await BattleRoom.updateOne(
      { roomCode },
      {
        $set: {
          status: 'FINISHED',
          winnerId: winner ? winner.playerId : null,
          isDraw,
          finishedAt: new Date()
        }
      }
    );
  } catch (dbErr) {
    console.warn('MongoDB match save notice:', dbErr.message);
  }
}

module.exports = { initBattleSocket, activeRooms };
