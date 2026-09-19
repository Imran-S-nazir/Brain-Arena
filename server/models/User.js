const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  bestScore: {
    type: Number,
    default: 0,
    index: true
  },
  xp: {
    type: Number,
    default: 0
  },
  coins: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  belt: {
    type: String,
    default: 'White Belt'
  },
  streak: {
    type: Number,
    default: 0
  },
  highestCombo: {
    type: Number,
    default: 0
  },
  fastestAnswerSec: {
    type: Number,
    default: 0
  },
  totalSolved: {
    type: Number,
    default: 0
  },
  totalCorrect: {
    type: Number,
    default: 0
  },
  unlockedBadges: [{
    type: String
  }],
  isBossSlayer: {
    type: Boolean,
    default: false
  },
  hasEntered: {
    type: Boolean,
    default: true
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collation: { locale: 'en', strength: 2 } // Case-insensitive unique index
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
