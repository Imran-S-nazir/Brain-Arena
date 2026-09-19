/**
 * REAL-TIME 1v1 MULTIPLAYER "BRAIN DUEL" CONTROLLER
 * Connects via Socket.IO to authoritative Node.js backend.
 * Synchronizes timers, dual player status, speed bonuses, and 10 expert questions.
 */

(function () {
  'use strict';

  let socket = null;
  let currentRoom = null;
  let currentQuestion = null;
  let timerInterval = null;
  let hasAnsweredCurrent = false;
  let selectedOption = null;

  // Tab-isolated player ID (sessionStorage prevents multi-tab collisions)
  function getOrCreatePlayerId() {
    try { localStorage.removeItem('brain_duel_player_id'); } catch(e) {}
    let pid = sessionStorage.getItem('brain_duel_player_id');
    if (!pid) {
      pid = 'ply_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 6);
      sessionStorage.setItem('brain_duel_player_id', pid);
    }
    return pid;
  }

  function getPlayerName() {
    if (window.stateManager && window.stateManager.state && window.stateManager.state.profile) {
      const name = window.stateManager.state.profile.username;
      if (name && name.trim()) return name.trim();
    }
    const inputName = document.getElementById('warrior-name-input');
    if (inputName && inputName.value && inputName.value.trim()) {
      return inputName.value.trim();
    }
    return 'Warrior ' + Math.floor(100 + Math.random() * 900);
  }

  let playerId = getOrCreatePlayerId();

  // DOM Elements cache
  const ui = {
    // Dashboard Duel Card Elements
    dashCreateBtn: document.getElementById('btn-dash-create-battle'),
    dashCodeInput: document.getElementById('dash-battle-code-input'),
    dashJoinBtn: document.getElementById('btn-dash-join-battle'),
    dashStatusMsg: document.getElementById('dash-duel-status-msg'),
    dashOpenModalBtn: document.getElementById('dash-open-duel-modal-btn'),

    // Friend Duel Modal Elements
    duelModal: document.getElementById('friend-duel-modal'),
    closeModalBtn: document.getElementById('close-duel-modal-btn'),
    modalCreateSection: document.getElementById('duel-modal-create-section'),
    modalWaitingSection: document.getElementById('duel-modal-waiting-section'),
    btnModalCreate: document.getElementById('modal-create-battle-btn'),
    modalJoinInput: document.getElementById('modal-join-code-input'),
    btnModalJoin: document.getElementById('modal-join-battle-btn'),
    modalStatusMsg: document.getElementById('modal-duel-status-msg'),

    // Waiting Room Elements
    waitingCodeDisplay: document.getElementById('waiting-room-code-display'),
    btnCopyCode: document.getElementById('btn-waiting-copy-code'),
    btnCopyLink: document.getElementById('btn-waiting-copy-link'),
    copyNotice: document.getElementById('waiting-copy-notice'),
    p1Name: document.getElementById('waiting-p1-name'),
    p2Name: document.getElementById('waiting-p2-name'),
    p2Status: document.getElementById('waiting-p2-status'),
    opponentFoundBanner: document.getElementById('opponent-found-banner'),
    countdownDigits: document.getElementById('waiting-countdown-digits'),

    // Multiplayer Game View Elements
    gameView: document.getElementById('multiplayer-game-view'),
    appViews: document.querySelectorAll('.app-stage-view, .landing-view-container'),
    hudQIndex: document.getElementById('mp-q-index'),
    hudProgressBar: document.getElementById('mp-progress-bar'),
    hudTimerNum: document.getElementById('mp-timer-num'),
    hudP1Name: document.getElementById('mp-p1-name'),
    hudP1Score: document.getElementById('mp-p1-score'),
    hudP1Status: document.getElementById('mp-p1-status'),
    hudP2Name: document.getElementById('mp-p2-name'),
    hudP2Score: document.getElementById('mp-p2-score'),
    hudP2Status: document.getElementById('mp-p2-status'),

    // Question Stage
    categoryPill: document.getElementById('mp-category-pill'),
    difficultyBadge: document.getElementById('mp-diff-badge'),
    questionText: document.getElementById('mp-question-text'),
    optionsGrid: document.getElementById('mp-options-grid'),
    roundFeedbackBox: document.getElementById('mp-round-feedback'),
    roundFeedbackText: document.getElementById('mp-feedback-text'),
    roundFeedbackSub: document.getElementById('mp-feedback-sub'),

    // Disconnect Banner
    disconnectBanner: document.getElementById('mp-disconnect-banner'),
    disconnectMsg: document.getElementById('mp-disconnect-msg'),

    // Match Result Modal Elements
    resultModal: document.getElementById('mp-result-modal'),
    resOutcomeTitle: document.getElementById('mp-res-outcome-title'),
    resOutcomeSubtitle: document.getElementById('mp-res-outcome-subtitle'),
    resP1Score: document.getElementById('mp-res-p1-score'),
    resP2Score: document.getElementById('mp-res-p2-score'),
    resP1Correct: document.getElementById('mp-res-p1-correct'),
    resP2Correct: document.getElementById('mp-res-p2-correct'),
    resP1Speed: document.getElementById('mp-res-p1-speed'),
    resP2Speed: document.getElementById('mp-res-p2-speed'),
    resP1AvgTime: document.getElementById('mp-res-p1-avgtime'),
    resP2AvgTime: document.getElementById('mp-res-p2-avgtime'),
    btnRematch: document.getElementById('btn-mp-rematch'),
    rematchNotice: document.getElementById('mp-rematch-notice'),
    btnNewDuel: document.getElementById('btn-mp-new-duel'),
    btnExitDuel: document.getElementById('btn-mp-exit-duel')
  };

  // Sound helper (uses existing window.audioSystem if available)
  function playSound(type) {
    try {
      if (window.audioSystem) {
        if (type === 'countdown') window.audioSystem.play('tick');
        else if (type === 'go' || type === 'start') window.audioSystem.play('streak');
        else if (type === 'correct') window.audioSystem.play('correct');
        else if (type === 'wrong') window.audioSystem.play('wrong');
        else if (type === 'victory') window.audioSystem.play('levelUp');
      }
    } catch (e) {}
  }

  // Initialize Socket.IO connection
  function initSocket() {
    if (socket) return socket;

    if (typeof io === 'undefined') {
      console.warn('Socket.IO client script not yet loaded.');
      return null;
    }

    socket = io({
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000
    });

    socket.on('connect', () => {
      console.log('⚡ Connected to Brain Duel Server! Socket ID:', socket.id);
      // If we were in a room, attempt automatic reconnect
      const savedRoom = sessionStorage.getItem('brain_duel_active_room');
      if (savedRoom) {
        socket.emit('battle:reconnect', { roomCode: savedRoom, playerId }, (res) => {
          if (res && res.success) {
            console.log('🔄 Reconnected to active battle room:', savedRoom);
            if (res.status === 'IN_PROGRESS' && res.currentQuestion) {
              onQuestionReceived(res.currentQuestion);
              updateScoresFromPlayers(res.players);
            }
          } else {
            sessionStorage.removeItem('brain_duel_active_room');
          }
        });
      }
    });

    socket.on('battle:created', onBattleCreated);
    socket.on('battle:playerJoined', onPlayerJoined);
    socket.on('battle:countdown', onCountdown);
    socket.on('battle:question', onQuestionReceived);
    socket.on('battle:opponentAnswered', onOpponentAnswered);
    socket.on('battle:roundResult', onRoundResult);
    socket.on('battle:matchFinished', onMatchFinished);
    socket.on('battle:rematchRequested', onRematchRequested);
    socket.on('battle:rematchStarted', onRematchStarted);
    socket.on('battle:playerDisconnected', onPlayerDisconnected);
    socket.on('battle:playerReconnected', onPlayerReconnected);
    socket.on('battle:opponentForfeited', onOpponentForfeited);
    socket.on('battle:expired', onBattleExpired);

    return socket;
  }

  // ----------------------------------------------------
  // SOCKET EVENT HANDLERS
  // ----------------------------------------------------

  function onBattleCreated(data) {
    currentRoom = data.roomCode;
    sessionStorage.setItem('brain_duel_active_room', currentRoom);

    // Open modal and show Waiting Room state
    openDuelModal();
    showWaitingRoom(data.roomCode, data.player.name);
  }

  function onPlayerJoined(data) {
    playSound('correct');
    const players = data.players || [];
    const p1 = players[0];
    const p2 = players[1];

    // Ensure waiting section is visible
    if (ui.modalCreateSection) ui.modalCreateSection.classList.add('hidden');
    if (ui.modalWaitingSection) ui.modalWaitingSection.classList.remove('hidden');

    if (ui.p1Name) {
      ui.p1Name.textContent = p1 ? (p1.playerId === playerId ? `${p1.name} (You)` : p1.name) : 'Player 1';
    }
    if (ui.p2Name) {
      ui.p2Name.textContent = p2 ? (p2.playerId === playerId ? `${p2.name} (You)` : p2.name) : 'Player 2';
    }
    if (ui.p2Status) {
      ui.p2Status.innerHTML = '<span style="color:#10B981;">🟢 Ready!</span>';
    }

    if (ui.opponentFoundBanner) {
      ui.opponentFoundBanner.classList.remove('hidden');
      ui.opponentFoundBanner.innerHTML = `
        <div style="font-size:1.15rem; font-weight:800; color:#F6C453; margin-bottom:0.25rem;">🎮 OPPONENT FOUND!</div>
        <div style="font-size:0.95rem; color:#FFFFFF;">
          <strong>${p1 ? p1.name : 'Player 1'}</strong> 
          <span style="color:#67E8F9; font-weight:800; margin: 0 0.5rem;">VS</span> 
          <strong>${p2 ? p2.name : 'Player 2'}</strong>
        </div>
      `;
    }
  }

  function onCountdown(data) {
    playSound('countdown');
    if (ui.countdownDigits) {
      ui.countdownDigits.classList.remove('hidden');
      ui.countdownDigits.textContent = data.message;
      ui.countdownDigits.style.transform = 'scale(1.25)';
      setTimeout(() => {
        if (ui.countdownDigits) ui.countdownDigits.style.transform = 'scale(1)';
      }, 200);
    }
    if (data.count === 0) {
      playSound('go');
      closeDuelModal();
      showGameArenaView();
    }
  }

  function onQuestionReceived(data) {
    currentQuestion = data;
    hasAnsweredCurrent = false;
    selectedOption = null;

    // Close any waiting modals & reveal the Multiplayer Game Arena view!
    closeDuelModal();
    showGameArenaView();

    // Reset feedback
    if (ui.roundFeedbackBox) ui.roundFeedbackBox.classList.add('hidden');

    // Update Progress & HUD
    const qNum = data.questionIndex + 1;
    if (ui.hudQIndex) ui.hudQIndex.textContent = `Question ${qNum} / ${data.totalQuestions}`;
    if (ui.hudProgressBar) {
      const pct = (qNum / data.totalQuestions) * 100;
      ui.hudProgressBar.style.width = `${pct}%`;
    }

    // Reset answer status pills
    if (ui.hudP1Status) {
      ui.hudP1Status.className = 'status-pill thinking';
      ui.hudP1Status.innerHTML = '<span>⏳ Thinking...</span>';
    }
    if (ui.hudP2Status) {
      ui.hudP2Status.className = 'status-pill thinking';
      ui.hudP2Status.innerHTML = '<span>⏳ Thinking...</span>';
    }

    // Render Question
    if (ui.categoryPill) ui.categoryPill.textContent = data.category || 'Logical Reasoning';
    if (ui.difficultyBadge) {
      ui.difficultyBadge.textContent = data.difficulty || 'EXPERT';
      ui.difficultyBadge.className = `diff-tag ${(data.difficulty || 'expert').toLowerCase()}`;
    }
    if (ui.questionText) ui.questionText.textContent = data.questionText;

    // Render Options
    if (ui.optionsGrid) {
      ui.optionsGrid.innerHTML = '';
      (data.options || []).forEach((opt, idx) => {
        const letter = String.fromCharCode(65 + idx); // A, B, C, D
        const btn = document.createElement('button');
        btn.className = 'mp-option-card';
        btn.dataset.letter = letter;
        btn.innerHTML = `
          <span class="opt-key">${letter}</span>
          <span class="opt-val">${opt.replace(/^[A-D]\.\s*/, '')}</span>
        `;
        btn.addEventListener('click', () => submitPlayerAnswer(letter, btn));
        ui.optionsGrid.appendChild(btn);
      });
    }

    // Start server-synced deadline countdown
    startTimer(data.deadline, data.timeLimit);
  }

  function startTimer(deadline, totalSeconds) {
    if (timerInterval) clearInterval(timerInterval);

    function update() {
      const now = Date.now();
      const remainingMs = Math.max(0, deadline - now);
      const remainingSec = Math.ceil(remainingMs / 1000);

      if (ui.hudTimerNum) {
        const mm = String(Math.floor(remainingSec / 60)).padStart(2, '0');
        const ss = String(remainingSec % 60).padStart(2, '0');
        ui.hudTimerNum.textContent = `⏱ ${mm}:${ss}`;

        if (remainingSec <= 5) {
          ui.hudTimerNum.style.color = '#EF4444';
        } else if (remainingSec <= 15) {
          ui.hudTimerNum.style.color = '#F59E0B';
        } else {
          ui.hudTimerNum.style.color = '#67E8F9';
        }
      }

      if (remainingSec <= 0) {
        clearInterval(timerInterval);
        timerInterval = null;
        // Disable option buttons if player hasn't answered
        if (!hasAnsweredCurrent && ui.optionsGrid) {
          Array.from(ui.optionsGrid.children).forEach(b => b.classList.add('disabled'));
        }
      }
    }

    update();
    timerInterval = setInterval(update, 250);
  }

  function submitPlayerAnswer(letter, btnEl) {
    if (hasAnsweredCurrent || !socket || !currentRoom || !currentQuestion) return;

    hasAnsweredCurrent = true;
    selectedOption = letter;

    // Highlight selected button
    if (btnEl) btnEl.classList.add('selected');
    if (ui.optionsGrid) {
      Array.from(ui.optionsGrid.children).forEach(b => {
        if (b !== btnEl) b.classList.add('disabled');
      });
    }

    // Update Player 1 HUD status
    if (ui.hudP1Status) {
      ui.hudP1Status.className = 'status-pill answered';
      ui.hudP1Status.innerHTML = '<span>✓ Answered</span>';
    }

    socket.emit('battle:answer', {
      roomCode: currentRoom,
      questionId: currentQuestion.questionId,
      answer: letter,
      submittedAt: Date.now()
    }, (res) => {
      if (res && res.success) {
        if (res.isCorrect) {
          playSound('correct');
          if (btnEl) btnEl.classList.add('correct');
          showQuickPointsToast(res.basePoints, res.speedBonus);
        } else {
          playSound('wrong');
          if (btnEl) btnEl.classList.add('wrong');
        }
      }
    });
  }

  function onOpponentAnswered(data) {
    // Reveal opponent has answered, but NOT their choice!
    if (ui.hudP2Status) {
      ui.hudP2Status.className = 'status-pill answered';
      ui.hudP2Status.innerHTML = '<span>✓ Answered</span>';
    }
  }

  function onRoundResult(data) {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }

    // Reveal correct option across the board
    const correctLetter = data.correctAnswer;
    if (ui.optionsGrid) {
      Array.from(ui.optionsGrid.children).forEach(b => {
        b.classList.add('disabled');
        if (b.dataset.letter === correctLetter) {
          b.classList.add('correct');
        }
      });
    }

    // Update live scores
    updateScoresFromPlayers(data.players);

    // Show round feedback banner
    if (ui.roundFeedbackBox && ui.roundFeedbackText && ui.roundFeedbackSub) {
      ui.roundFeedbackBox.classList.remove('hidden');

      const myResult = (data.results || []).find(r => r.playerId === playerId);
      if (myResult && myResult.isCorrect) {
        ui.roundFeedbackText.innerHTML = `
          <span style="color:#10B981;">🎉 CORRECT!</span> +${myResult.totalPoints} XP 
          ${myResult.speedBonus > 0 ? `<span class="speed-bonus-badge">⚡ +${myResult.speedBonus} Speed Bonus</span>` : ''}
        `;
      } else {
        ui.roundFeedbackText.innerHTML = `
          <span style="color:#EF4444;">❌ INCORRECT</span> (Correct was <strong>${correctLetter}</strong>)
        `;
      }

      ui.roundFeedbackSub.textContent = data.explanation || '';
    }
  }

  function updateScoresFromPlayers(players) {
    if (!players || players.length === 0) return;
    const me = players.find(p => p.playerId === playerId);
    const opponent = players.find(p => p.playerId !== playerId);

    if (me) {
      if (ui.hudP1Name) ui.hudP1Name.textContent = me.name || 'You';
      if (ui.hudP1Score) ui.hudP1Score.textContent = `${me.score || 0} XP`;
    }
    if (opponent) {
      if (ui.hudP2Name) ui.hudP2Name.textContent = opponent.name || 'Opponent';
      if (ui.hudP2Score) ui.hudP2Score.textContent = `${opponent.score || 0} XP`;
    }
  }

  function showQuickPointsToast(base, bonus) {
    const toast = document.createElement('div');
    toast.className = 'duel-point-toast';
    toast.innerHTML = `+${base + bonus} ⚡ <small>(+${bonus} speed)</small>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  }

  function onMatchFinished(data) {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }

    sessionStorage.removeItem('brain_duel_active_room');

    const me = (data.players || []).find(p => p.playerId === playerId);
    const opponent = (data.players || []).find(p => p.playerId !== playerId);

    if (ui.resultModal) {
      ui.resultModal.classList.remove('hidden');

      if (data.isDraw) {
        ui.resOutcomeTitle.textContent = '🤝 IT\'S A DRAW!';
        ui.resOutcomeTitle.style.color = '#F6C453';
        ui.resOutcomeSubtitle.textContent = 'Both warriors matched wit and speed with equal points!';
      } else if (data.winner && data.winner.playerId === playerId) {
        playSound('victory');
        ui.resOutcomeTitle.textContent = '🏆 YOU WON! 🎉';
        ui.resOutcomeTitle.style.color = '#10B981';
        ui.resOutcomeSubtitle.textContent = 'Outstanding speed and deduction! You crowned the duel.';
        // Trigger confetti if available
        try { if (window.confetti) window.confetti({ particleCount: 100, spread: 70 }); } catch (e) {}
      } else {
        ui.resOutcomeTitle.textContent = 'DEFEAT ⚔️';
        ui.resOutcomeTitle.style.color = '#FF6F61';
        ui.resOutcomeSubtitle.textContent = 'Your opponent had the edge this time. Challenge them to a rematch!';
      }

      // Populate head-to-head comparison
      if (ui.resP1Score && me) ui.resP1Score.textContent = `${me.score || 0} XP`;
      if (ui.resP2Score && opponent) ui.resP2Score.textContent = `${opponent.score || 0} XP`;

      if (ui.resP1Correct && me) ui.resP1Correct.textContent = `${me.correctCount || 0} / 10`;
      if (ui.resP2Correct && opponent) ui.resP2Correct.textContent = `${opponent.correctCount || 0} / 10`;

      if (ui.resP1Speed && me) ui.resP1Speed.textContent = `+${me.speedBonusTotal || 0} XP`;
      if (ui.resP2Speed && opponent) ui.resP2Speed.textContent = `+${opponent.speedBonusTotal || 0} XP`;

      if (ui.resP1AvgTime && me) ui.resP1AvgTime.textContent = `${me.avgTime || 0}s`;
      if (ui.resP2AvgTime && opponent) ui.resP2AvgTime.textContent = `${opponent.avgTime || 0}s`;
    }
  }

  function onRematchRequested(data) {
    if (ui.rematchNotice) {
      ui.rematchNotice.classList.remove('hidden');
      ui.rematchNotice.textContent = 'Opponent requested a rematch! Click Rematch to accept.';
    }
  }

  function onRematchStarted(data) {
    currentRoom = data.newRoomCode;
    sessionStorage.setItem('brain_duel_active_room', currentRoom);

    // Hide result modal
    if (ui.resultModal) ui.resultModal.classList.add('hidden');
    if (ui.rematchNotice) ui.rematchNotice.classList.add('hidden');

    // Return to waiting room for countdown
    showWaitingRoom(data.newRoomCode, getPlayerName());
    if (ui.opponentFoundBanner) ui.opponentFoundBanner.classList.remove('hidden');
  }

  function onPlayerDisconnected(data) {
    if (ui.disconnectBanner && ui.disconnectMsg) {
      ui.disconnectBanner.classList.remove('hidden');
      ui.disconnectMsg.textContent = `${data.playerName || 'Opponent'} connection lost. Waiting (${data.graceSeconds || 30}s)...`;
    }
  }

  function onPlayerReconnected(data) {
    if (ui.disconnectBanner) {
      ui.disconnectBanner.classList.add('hidden');
    }
  }

  function onOpponentForfeited(data) {
    if (ui.disconnectBanner) ui.disconnectBanner.classList.add('hidden');
    alert(`🏆 Victory! ${data.reason}`);
  }

  function onBattleExpired(data) {
    alert(data.message || 'Battle expired.');
    closeDuelModal();
  }

  // ----------------------------------------------------
  // UI ACTIONS & HELPERS
  // ----------------------------------------------------

  function openDuelModal() {
    if (ui.duelModal) ui.duelModal.classList.remove('hidden');
  }

  function closeDuelModal() {
    if (ui.duelModal) ui.duelModal.classList.add('hidden');
  }

  function showWaitingRoom(code, p1) {
    if (ui.modalCreateSection) ui.modalCreateSection.classList.add('hidden');
    if (ui.modalWaitingSection) ui.modalWaitingSection.classList.remove('hidden');

    if (ui.waitingCodeDisplay) ui.waitingCodeDisplay.textContent = code;
    if (ui.p1Name) ui.p1Name.textContent = `${p1} (You)`;
    if (ui.p2Name) ui.p2Name.textContent = 'Waiting for opponent...';
    if (ui.p2Status) ui.p2Status.innerHTML = '<span class="pulsing-wait">⏳ Waiting...</span>';
    if (ui.opponentFoundBanner) ui.opponentFoundBanner.classList.add('hidden');
    if (ui.countdownDigits) ui.countdownDigits.classList.add('hidden');
  }

  function showGameArenaView() {
    // Hide all normal dashboard views
    if (ui.appViews) {
      ui.appViews.forEach(v => v.classList.add('hidden'));
    }
    // Show Multiplayer Duel view
    if (ui.gameView) {
      ui.gameView.classList.remove('hidden');
    }
  }

  function exitDuel() {
    if (timerInterval) clearInterval(timerInterval);
    sessionStorage.removeItem('brain_duel_active_room');
    if (ui.gameView) ui.gameView.classList.add('hidden');
    if (ui.resultModal) ui.resultModal.classList.add('hidden');

    // Return to Arcade Dashboard
    const dash = document.getElementById('arcade-dashboard-view');
    if (dash) dash.classList.remove('hidden');
  }

  function createBattle() {
    const s = initSocket();
    if (!s) return;

    const name = getPlayerName();
    s.emit('battle:create', { playerId, playerName: name }, (res) => {
      if (!res.success) {
        showStatusError(res.error || 'Failed to create battle');
      }
    });
  }

  function joinBattle(code) {
    if (!code || !code.trim()) {
      showStatusError('Please enter a valid battle code');
      return;
    }

    const s = initSocket();
    if (!s) return;

    const cleanCode = code.trim().toUpperCase();
    const name = getPlayerName();

    s.emit('battle:join', { roomCode: cleanCode, playerId, playerName: name }, (res) => {
      if (!res.success) {
        showStatusError(res.error || 'Cannot join battle');
      } else {
        if (res.assignedPlayerId) {
          playerId = res.assignedPlayerId;
          sessionStorage.setItem('brain_duel_player_id', playerId);
        }
        currentRoom = cleanCode;
        sessionStorage.setItem('brain_duel_active_room', currentRoom);
        openDuelModal();
        if (res.players && res.players.length >= 2) {
          onPlayerJoined({ players: res.players });
        } else {
          showWaitingRoom(cleanCode, name);
        }
      }
    });
  }

  function showStatusError(msg) {
    if (ui.dashStatusMsg) {
      ui.dashStatusMsg.textContent = msg;
      ui.dashStatusMsg.classList.remove('hidden');
      setTimeout(() => ui.dashStatusMsg.classList.add('hidden'), 5000);
    }
    if (ui.modalStatusMsg) {
      ui.modalStatusMsg.textContent = msg;
      ui.modalStatusMsg.classList.remove('hidden');
      setTimeout(() => ui.modalStatusMsg.classList.add('hidden'), 5000);
    }
  }

  function copyCode() {
    if (!currentRoom) return;
    navigator.clipboard.writeText(currentRoom).then(() => {
      showCopyToast('Room code copied to clipboard!');
    });
  }

  function copyLink() {
    if (!currentRoom) return;
    const url = `${window.location.origin}${window.location.pathname}?duel=${currentRoom}`;
    navigator.clipboard.writeText(url).then(() => {
      showCopyToast('Battle challenge link copied!');
    });
  }

  function showCopyToast(msg) {
    if (ui.copyNotice) {
      ui.copyNotice.textContent = msg;
      ui.copyNotice.classList.remove('hidden');
      setTimeout(() => ui.copyNotice.classList.add('hidden'), 3000);
    }
  }

  // ----------------------------------------------------
  // EVENT LISTENERS BINDING
  // ----------------------------------------------------
  function bindUIEvents() {
    // Dashboard Card
    if (ui.dashCreateBtn) ui.dashCreateBtn.addEventListener('click', createBattle);
    if (ui.dashOpenModalBtn) ui.dashOpenModalBtn.addEventListener('click', () => {
      openDuelModal();
      if (ui.modalCreateSection) ui.modalCreateSection.classList.remove('hidden');
      if (ui.modalWaitingSection) ui.modalWaitingSection.classList.add('hidden');
    });

    if (ui.dashJoinBtn && ui.dashCodeInput) {
      ui.dashJoinBtn.addEventListener('click', () => {
        joinBattle(ui.dashCodeInput.value);
      });
      ui.dashCodeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') joinBattle(ui.dashCodeInput.value);
      });
    }

    // Modal Events
    if (ui.closeModalBtn) ui.closeModalBtn.addEventListener('click', closeDuelModal);
    if (ui.btnModalCreate) ui.btnModalCreate.addEventListener('click', createBattle);
    if (ui.btnModalJoin && ui.modalJoinInput) {
      ui.btnModalJoin.addEventListener('click', () => {
        joinBattle(ui.modalJoinInput.value);
      });
      ui.modalJoinInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') joinBattle(ui.modalJoinInput.value);
      });
    }

    // Waiting Room buttons
    if (ui.btnCopyCode) ui.btnCopyCode.addEventListener('click', copyCode);
    if (ui.btnCopyLink) ui.btnCopyLink.addEventListener('click', copyLink);

    // Results screen buttons
    if (ui.btnRematch) {
      ui.btnRematch.addEventListener('click', () => {
        if (socket) {
          socket.emit('battle:rematch');
          ui.btnRematch.disabled = true;
          ui.btnRematch.textContent = 'Rematch Requested... ⏳';
        }
      });
    }
    if (ui.btnNewDuel) {
      ui.btnNewDuel.addEventListener('click', () => {
        if (ui.resultModal) ui.resultModal.classList.add('hidden');
        exitDuel();
        openDuelModal();
        if (ui.modalCreateSection) ui.modalCreateSection.classList.remove('hidden');
        if (ui.modalWaitingSection) ui.modalWaitingSection.classList.add('hidden');
      });
    }
    if (ui.btnExitDuel) ui.btnExitDuel.addEventListener('click', exitDuel);

    // Check URL parameters for direct challenge link (?duel=BRAIN-XXXX)
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const duelCode = urlParams.get('duel');
      if (duelCode) {
        if (ui.dashCodeInput) ui.dashCodeInput.value = duelCode;
        if (ui.modalJoinInput) ui.modalJoinInput.value = duelCode;
        // Prompt user or automatically open modal
        setTimeout(() => {
          openDuelModal();
        }, 600);
      }
    } catch (e) {}
  }

  // Initialize on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initSocket();
      bindUIEvents();
    });
  } else {
    initSocket();
    bindUIEvents();
  }

  // Expose to window for testing & debugging
  window.duelMultiplayer = {
    initSocket,
    createBattle,
    joinBattle,
    submitPlayerAnswer,
    exitDuel,
    getSocket: () => socket
  };

})();
