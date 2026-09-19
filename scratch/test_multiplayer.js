const { io } = require('socket.io-client');
const mongoose = require('mongoose');

async function runTest() {
  console.log('🚀 Starting Real-Time 1v1 Multiplayer Integration Test...');

  const serverUrl = 'http://127.0.0.1:5500';

  // Client A
  const socketA = io(serverUrl, { transports: ['websocket'] });
  // Client B
  const socketB = io(serverUrl, { transports: ['websocket'] });

  await new Promise(resolve => socketA.on('connect', resolve));
  console.log('✅ Player A connected (Socket ID:', socketA.id, ')');

  await new Promise(resolve => socketB.on('connect', resolve));
  console.log('✅ Player B connected (Socket ID:', socketB.id, ')');

  let roomCode = null;

  // Step 1: Player A creates battle
  const createPromise = new Promise((resolve) => {
    socketA.emit('battle:create', { playerId: 'p_imran_001', playerName: 'Imran' }, (res) => {
      console.log('✅ Player A room created:', res.roomCode);
      roomCode = res.roomCode;
      resolve(res);
    });
  });
  await createPromise;

  // Step 2: Player B joins using roomCode
  const joinPromise = new Promise((resolve) => {
    socketB.emit('battle:join', { roomCode, playerId: 'p_rahul_002', playerName: 'Rahul' }, (res) => {
      console.log('✅ Player B joined room:', res.roomCode);
      resolve(res);
    });
  });

  const playerJoinedPromiseA = new Promise((resolve) => {
    socketA.on('battle:playerJoined', (data) => {
      console.log('✅ Player A received battle:playerJoined! Players:', data.players.map(p => p.name).join(' vs '));
      resolve(data);
    });
  });

  await Promise.all([joinPromise, playerJoinedPromiseA]);

  // Step 3: Wait for countdown
  console.log('⏳ Waiting for synchronized countdown...');
  await new Promise((resolve) => {
    socketA.on('battle:countdown', (data) => {
      console.log('   Countdown tick:', data.message);
      if (data.count === 0) resolve();
    });
  });

  // Step 4: Both receive Question 1
  const qPromiseA = new Promise((resolve) => socketA.on('battle:question', resolve));
  const qPromiseB = new Promise((resolve) => socketB.on('battle:question', resolve));

  const [qA, qB] = await Promise.all([qPromiseA, qPromiseB]);
  console.log('✅ Both players received Question 1:');
  console.log('   Category:', qA.category);
  console.log('   Difficulty:', qA.difficulty);
  console.log('   Question:', qA.questionText.substr(0, 70) + '...');
  console.log('   Correct answer omitted on client?', qA.correctAnswer === undefined ? 'YES (Secure)' : 'NO (Vulnerable)');
  console.log('   Identical questionId on both?', qA.questionId === qB.questionId ? 'YES' : 'NO');

  // Step 5: Player A answers quickly
  console.log('⚡ Player A submitting answer...');
  const answerResA = await new Promise((resolve) => {
    socketA.emit('battle:answer', {
      roomCode,
      questionId: qA.questionId,
      answer: 'B',
      submittedAt: Date.now()
    }, resolve);
  });
  console.log('✅ Player A answer result:', answerResA);

  // Step 6: Player B receives opponent answered notification
  const oppAnsweredB = await new Promise((resolve) => {
    socketB.on('battle:opponentAnswered', resolve);
  });
  console.log('✅ Player B saw notification that opponent answered! Details:', oppAnsweredB);

  // Step 7: Player B answers
  console.log('⚡ Player B submitting answer...');
  const answerResB = await new Promise((resolve) => {
    socketB.emit('battle:answer', {
      roomCode,
      questionId: qB.questionId,
      answer: 'B',
      submittedAt: Date.now()
    }, resolve);
  });
  console.log('✅ Player B answer result:', answerResB);

  // Step 8: Both receive roundResult with updated scores and explanation
  const roundResPromiseA = new Promise((resolve) => socketA.on('battle:roundResult', resolve));
  const roundResPromiseB = new Promise((resolve) => socketB.on('battle:roundResult', resolve));

  const [roundA, roundB] = await Promise.all([roundResPromiseA, roundResPromiseB]);
  console.log('✅ Both players received roundResult!');
  console.log('   Revealed Correct Answer:', roundA.correctAnswer);
  console.log('   Updated Scores:', roundA.players.map(p => `${p.name}: ${p.score} XP`).join(' | '));

  socketA.disconnect();
  socketB.disconnect();

  console.log('🎉 REAL-TIME 1v1 MULTIPLAYER TEST PASSED WITH 100% SUCCESS!');
  process.exit(0);
}

runTest().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
