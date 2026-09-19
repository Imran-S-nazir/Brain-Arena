const mongoose = require('mongoose');

const BattleMatchSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  roomCode: { type: String, required: true },
  playerA: {
    playerId: String,
    name: String,
    score: Number,
    correctCount: Number,
    speedBonus: Number,
    avgTime: Number
  },
  playerB: {
    playerId: String,
    name: String,
    score: Number,
    correctCount: Number,
    speedBonus: Number,
    avgTime: Number
  },
  winnerId: { type: String, default: null },
  isDraw: { type: Boolean, default: false },
  questionsPlayed: { type: Number, default: 10 },
  completedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.models.BattleMatch || mongoose.model('BattleMatch', BattleMatchSchema);
