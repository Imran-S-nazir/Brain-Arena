const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
  playerId: { type: String, required: true },
  socketId: { type: String },
  name: { type: String, required: true },
  avatar: { type: String, default: '👤' },
  score: { type: Number, default: 0 },
  speedBonusTotal: { type: Number, default: 0 },
  correctCount: { type: Number, default: 0 },
  isReady: { type: Boolean, default: false },
  connected: { type: Boolean, default: true },
  disconnectedAt: { type: Date, default: null }
}, { _id: false });

const AnswerRecordSchema = new mongoose.Schema({
  questionIndex: { type: Number, required: true },
  questionId: { type: String, required: true },
  playerId: { type: String, required: true },
  answer: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
  timeTaken: { type: Number, required: true }, // in seconds
  basePoints: { type: Number, default: 0 },
  speedBonus: { type: Number, default: 0 },
  totalPoints: { type: Number, default: 0 },
  submittedAt: { type: Date, default: Date.now }
}, { _id: false });

const BattleRoomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true, index: true },
  roomCode: { type: String, required: true, unique: true, index: true }, // e.g., BRAIN-9841
  hostPlayerId: { type: String, required: true },
  guestPlayerId: { type: String, default: null },
  status: {
    type: String,
    enum: ['WAITING', 'READY', 'COUNTDOWN', 'IN_PROGRESS', 'FINISHED', 'EXPIRED'],
    default: 'WAITING',
    index: true
  },
  players: [PlayerSchema],
  questionIndex: { type: Number, default: 0 },
  totalQuestions: { type: Number, default: 10 },
  questionIds: [{ type: String }],
  answers: [AnswerRecordSchema],
  currentQuestionStartedAt: { type: Date, default: null },
  currentQuestionDeadline: { type: Date, default: null },
  winnerId: { type: String, default: null },
  isDraw: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, expires: 86400 }, // TTL 24h
  startedAt: { type: Date, default: null },
  finishedAt: { type: Date, default: null }
}, {
  timestamps: true
});

module.exports = mongoose.models.BattleRoom || mongoose.model('BattleRoom', BattleRoomSchema);
