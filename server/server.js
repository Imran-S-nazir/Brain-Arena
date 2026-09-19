const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch(e) {}
const http = require('http');
const path = require('path');
const express = require('express');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const { initBattleSocket, activeRooms } = require('./socket/battleHandler');
const User = require('./models/User');

const app = express();
const server = http.createServer(app);

// Enable CORS for LAN and multi-device connections
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE']
}));

app.use(express.json());

// Serve static frontend files from the root directory
const publicDir = path.resolve(__dirname, '..');
app.use(express.static(publicDir));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    activeRoomsCount: activeRooms.size,
    mongoConnected: mongoose.connection.readyState === 1
  });
});

// ==========================================
// MONGODB USER & LEADERBOARD REST APIS
// ==========================================

// 1. Sync User / Score with MongoDB
app.post('/api/users/sync', async (req, res) => {
  try {
    const data = req.body || {};
    const username = (data.username || (data.profile && data.profile.username) || '').trim();
    if (!username) {
      return res.status(400).json({ success: false, error: 'Username is required' });
    }

    const stats = data.stats || {};
    const bestScore = (stats.bestScore !== undefined) ? stats.bestScore : (data.bestScore !== undefined ? data.bestScore : 0);
    const xp = (stats.xp !== undefined) ? stats.xp : (data.xp !== undefined ? data.xp : 0);
    const coins = (stats.coins !== undefined) ? stats.coins : (data.coins !== undefined ? data.coins : 0);
    const level = stats.level || data.level || 1;
    const belt = stats.belt || data.belt || 'White Belt';
    const totalSolved = stats.totalSolved || data.totalSolved || 0;
    const totalCorrect = stats.totalCorrect || data.totalCorrect || 0;
    const streak = stats.streak || data.streak || 0;
    const highestCombo = stats.highestCombo || data.highestCombo || 0;
    const fastestAnswerSec = stats.fastestAnswerSec || data.fastestAnswerSec || 0;
    const unlockedBadges = Array.isArray(data.unlockedBadges) ? data.unlockedBadges : [];
    const isBossSlayer = !!data.isBossSlayer || unlockedBadges.includes('boss_slayer');

    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        warning: 'MongoDB not connected, accepted in memory',
        user: { username, bestScore, xp, coins, belt, isBossSlayer }
      });
    }

    let user = null;
    try {
      user = await User.findOne({ username }).collation({ locale: 'en', strength: 2 });
    } catch (e) {}

    if (!user) {
      try {
        user = await User.findOne({ username: new RegExp('^' + username + '$', 'i') });
      } catch (e) {}
    }

    if (user) {
      user.username = username;
      if (bestScore > 0 || user.bestScore === 0) {
        user.bestScore = Math.max(user.bestScore, bestScore);
      }
      if (xp > 0 || user.xp === 0) {
        user.xp = Math.max(user.xp, xp);
      }
      if (coins > 0 || user.coins === 0) {
        user.coins = Math.max(user.coins, coins);
      }
      user.level = Math.max(user.level, level);
      if (belt && belt !== 'White Belt') user.belt = belt;
      user.totalSolved = Math.max(user.totalSolved, totalSolved);
      user.totalCorrect = Math.max(user.totalCorrect, totalCorrect);
      user.streak = Math.max(user.streak, streak);
      user.highestCombo = Math.max(user.highestCombo, highestCombo);
      if (fastestAnswerSec > 0) {
        user.fastestAnswerSec = (user.fastestAnswerSec === 0) ? fastestAnswerSec : Math.min(user.fastestAnswerSec, fastestAnswerSec);
      }
      if (isBossSlayer) user.isBossSlayer = true;
      unlockedBadges.forEach(b => {
        if (!user.unlockedBadges.includes(b)) user.unlockedBadges.push(b);
      });
      user.lastActive = new Date();
      user.hasEntered = true;
      await user.save();
    } else {
      try {
        user = await User.create({
          username,
          bestScore,
          xp,
          coins,
          level,
          belt,
          totalSolved,
          totalCorrect,
          streak,
          highestCombo,
          fastestAnswerSec,
          unlockedBadges,
          isBossSlayer,
          hasEntered: true,
          lastActive: new Date()
        });
      } catch (createErr) {
        if (createErr.code === 11000) {
          // Handled duplicate key race condition: user was created concurrently
          user = (await User.findOne({ username }).collation({ locale: 'en', strength: 2 })) ||
                 (await User.findOne({ username: new RegExp('^' + username + '$', 'i') }));
          if (user) {
            user.bestScore = Math.max(user.bestScore, bestScore);
            user.xp = Math.max(user.xp, xp);
            user.coins = Math.max(user.coins, coins);
            await user.save();
          }
        } else {
          throw createErr;
        }
      }
    }

    return res.json({ success: true, user });
  } catch (err) {
    console.error('Error in /api/users/sync:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Fetch Leaderboard from MongoDB (Source of Truth)
// NOTE: If a user is deleted from MongoDB, they will automatically NOT appear here!
app.get('/api/leaderboard', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, source: 'fallback', users: [] });
    }

    const users = await User.find({})
      .sort({ bestScore: -1, xp: -1, totalSolved: -1 })
      .lean();

    return res.json({
      success: true,
      source: 'mongodb',
      count: users.length,
      users: users.map(u => ({
        name: u.username,
        score: u.bestScore || 0,
        xp: u.xp || 0,
        solved: u.totalSolved || 0,
        belt: u.belt || 'White Belt',
        isBossSlayer: !!u.isBossSlayer,
        badges: (u.unlockedBadges && u.unlockedBadges.length > 0) ? u.unlockedBadges : ['⚡']
      }))
    });
  } catch (err) {
    console.error('Error in /api/leaderboard:', err);
    return res.status(500).json({ success: false, error: err.message, users: [] });
  }
});

// 3. Get Single User Profile from MongoDB
app.get('/api/users/:username', async (req, res) => {
  try {
    const raw = (req.params.username || '').trim();
    if (!raw) return res.status(400).json({ success: false, error: 'Username required' });

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ success: false, error: 'MongoDB not connected' });
    }

    const user = await User.findOne({ username: new RegExp('^' + raw + '$', 'i') }).lean();
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found in MongoDB' });
    }
    return res.json({ success: true, user });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Delete User from MongoDB
app.delete('/api/users/:username', async (req, res) => {
  try {
    const raw = (req.params.username || '').trim();
    if (!raw) return res.status(400).json({ success: false, error: 'Username required' });

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ success: false, error: 'MongoDB not connected' });
    }

    const result = await User.deleteOne({ username: new RegExp('^' + raw + '$', 'i') });
    return res.json({ success: true, deletedCount: result.deletedCount });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Room validation endpoint for instant frontend feedback
app.get('/api/battle/:code', (req, res) => {
  const code = (req.params.code || '').trim().toUpperCase();
  const room = activeRooms.get(code);

  if (!room) {
    return res.status(404).json({ success: false, error: 'Battle not found. Please verify the code.' });
  }

  if (room.status === 'EXPIRED') {
    return res.status(410).json({ success: false, error: 'Battle expired. Create a new challenge.' });
  }

  if (room.players.length >= 2 && room.status !== 'WAITING') {
    return res.status(409).json({ success: false, error: 'Battle already has 2 players.' });
  }

  res.json({
    success: true,
    roomCode: room.roomCode,
    status: room.status,
    hostPlayer: room.players[0] ? room.players[0].name : 'Host'
  });
});

// Socket.IO configuration with CORS
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  },
  pingTimeout: 10000,
  pingInterval: 5000
});

// Initialize Battle Game Socket Handler
initBattleSocket(io);

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/brain_arena';
mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 6000
})
.then(() => {
  console.log('✅ Connected to MongoDB successfully on', MONGO_URI.replace(/:[^:]*@/, ':****@'));
})
.catch((err) => {
  console.warn('⚠️ MongoDB connection notice (using in-memory resilient state):', err.message);
});

const PORT = process.env.PORT || 5500;

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${PORT} is already in use by another running process.`);
    console.error(`💡 Tip: Close the other terminal or run with a different port:\n   $env:PORT=5501; npm start\n`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Brain Arena Real-Time Server running on http://127.0.0.1:${PORT}`);
  console.log(`🌐 Ready for LAN/Multi-Device connections on port ${PORT}`);
});

