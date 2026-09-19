const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch(e) {}
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../server/models/User');
const BattleMatch = require('../server/models/BattleMatch');
const BattleRoom = require('../server/models/BattleRoom');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS']
}));

app.use(express.json());

// ============================================================
// SERVERLESS MONGOOSE CONNECTION CACHING FOR VERCEL
// Prevents exhausting database connection pool on lambda invocations
// ============================================================
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    console.warn('⚠️ MONGO_URI environment variable is missing in Vercel settings');
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000
    };
    cached.promise = mongoose.connect(MONGO_URI, opts).then((m) => {
      console.log('✅ Connected to MongoDB Atlas on Vercel');
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Middleware to ensure DB connection before handling API routes
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.warn('MongoDB connection notice in serverless handler:', err.message);
  }
  next();
});

// ==========================================
// REST API ROUTES
// ==========================================

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: 'vercel-serverless',
    uptime: process.uptime(),
    mongoConnected: mongoose.connection.readyState === 1
  });
});

// 2. Sync User / Score with MongoDB
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

    let user = await User.findOne({ username: new RegExp('^' + username + '$', 'i') });

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
    }

    return res.json({ success: true, user });
  } catch (err) {
    console.error('Error in /api/users/sync:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Fetch Leaderboard from MongoDB (Source of Truth)
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

// 4. Get Single User Profile
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

// 5. Delete User from MongoDB
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

// Serve frontend static files and root HTML
const path = require('path');
const fs = require('fs');

const rootDir = fs.existsSync(path.join(__dirname, '..', 'index.html'))
  ? path.resolve(__dirname, '..')
  : (fs.existsSync(path.join(process.cwd(), 'index.html')) ? process.cwd() : __dirname);

app.use(express.static(rootDir));

app.get('/', (req, res) => {
  const indexFile = path.join(rootDir, 'index.html');
  if (fs.existsSync(indexFile)) {
    return res.sendFile(indexFile);
  }
  return res.status(200).send('<h1>Brain Arena Serverless Ready</h1>');
});

module.exports = app;
