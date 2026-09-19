/**
 * CAMPUS BRAIN BATTLE 2026 — STATE & LOCAL STORAGE PERSISTENCE
 * Manages active student profile, real gameplay scores, XP, coins,
 * combos, streaks, inventory, and dynamic leaderboard syncing.
 */

const STORAGE_KEY = 'campus_brain_battle_state_v5';
const STUDENTS_STORE_KEY = 'campus_students_store_v3';
const ACTIVE_STUDENT_KEY = 'campus_active_student_v3';

// ONE-TIME COMPLETE FRESH START RESET - WIPE ALL PREVIOUS PLAYERS & RECORDS
(function() {
  if (typeof localStorage !== 'undefined' && localStorage.getItem('fresh_start_reset_2026_v1') !== 'true') {
    const keysToWipe = [
      'campus_battle_real_leaderboard_v5',
      'campus_battle_real_leaderboard_v4',
      'campus_battle_real_leaderboard_v3',
      'campus_battle_real_leaderboard_v2',
      'campus_battle_real_leaderboard_v1',
      'campus_brain_battle_state_v4',
      'campus_brain_battle_state_v3',
      'campus_brain_battle_state_v2',
      'campus_brain_battle_state_v1',
      'campus_students_store_v2',
      'campus_students_store_v1',
      'campus_active_student_v2',
      'campus_active_student_v1',
      'campus_active_username_v1',
      'boss_user_daily_v4',
      'boss_user_daily_v3',
      'boss_user_history_v2',
      'campus_friend_duels_v2',
      'dimaag_arena_user_state_v1',
      'dimaag_arena_event_leaderboard_v2',
      'dimaag_arena_leaderboard_v1'
    ];
    keysToWipe.forEach(k => {
      try { localStorage.removeItem(k); } catch (e) {}
    });
    localStorage.setItem('fresh_start_reset_2026_v1', 'true');
  }
})();

const INITIAL_STATE = {
  profile: {
    username: '',
    avatar: '⚡',
    university: 'Visiting Student',
    createdAt: new Date().toISOString()
  },
  event: {
    name: 'Campus Brain Battle 2026',
    day: 2,
    totalDays: 4,
    dateString: new Date().toISOString().slice(0, 10)
  },
  stats: {
    xp: 0,
    coins: 0,
    level: 1,
    belt: 'White Belt',
    streak: 0,
    bestStreak: 0,
    highestCombo: 0,
    currentCombo: 0,
    bestScore: 0,
    fastestAnswerSec: 0,
    totalSolved: 0,
    totalCorrect: 0,
    campusRank: '#1',
    rankMovement: 'Just entered the arena!'
  },
  inventory: {
    fiftyFifty: 3,
    extraTime: 3,
    hints: 3,
    skip: 2
  },
  modeRecords: {
    brain_teaser: { solved: 0, bestScore: 0 },
    speed_run: { solved: 0, bestScore: 0, maxCombo: 0 },
    what_next: { solved: 0, bestScore: 0 },
    detective: { solved: 0, bestScore: 0 },
    odds_ends: { solved: 0, bestScore: 0 },
    puzzle_box: { solved: 0, bestScore: 0 }
  },
  todayChallenge: {
    date: new Date().toISOString().slice(0, 10),
    totalNeeded: 10,
    currentCount: 0,
    isCompleted: false,
    rewardClaimed: false
  },
  friendDuel: {
    duelCode: 'BRAIN-' + Math.floor(1000 + Math.random() * 9000),
    duelsPlayed: 0,
    duelsWon: 0
  },
  unlockedBadges: []
};

class StateManager {
  constructor() {
    this.cleanLegacyContamination();
    this.state = this.loadState();
    this.checkDailyReset();
  }

  getStore() {
    try {
      return JSON.parse(localStorage.getItem(STUDENTS_STORE_KEY) || '{}');
    } catch (e) {
      return {};
    }
  }

  saveStore(store) {
    try {
      localStorage.setItem(STUDENTS_STORE_KEY, JSON.stringify(store));
    } catch (e) {
      console.error(e);
    }
  }

  cleanLegacyContamination() {
    // 100% clean start - no hardcoded seeded names
  }

  loadState() {
    const store = this.getStore();
    const activeName = localStorage.getItem(ACTIVE_STUDENT_KEY);

    if (activeName && activeName.trim()) {
      const lower = activeName.trim().toLowerCase();
      if (store[lower]) {
        return this.sanitizeState(store[lower], activeName.trim());
      }
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const u = (parsed && parsed.profile && parsed.profile.username) ? parsed.profile.username.trim() : '';
        if (u) {
          return this.sanitizeState(parsed, u);
        }
      }
    } catch (e) {
      console.error('Failed to load state from localStorage:', e);
    }

    return JSON.parse(JSON.stringify(INITIAL_STATE));
  }

  recoverPointsFromLeaderboard(cleanName) {
    if (!cleanName) return { score: 0, xp: 0, solved: 0 };
    const lower = cleanName.toLowerCase();
    let score = 0;
    let xp = 0;
    let solved = 0;

    if (typeof window !== 'undefined' && window.leaderboardManager && window.leaderboardManager.data) {
      const allEntries = [
        ...(window.leaderboardManager.data.today || []),
        ...(window.leaderboardManager.data.overall || [])
      ];
      for (const p of allEntries) {
        if (p && p.name && p.name.trim().toLowerCase() === lower) {
          if ((p.score || 0) > score) score = p.score;
          if ((p.xp || 0) > xp) xp = p.xp;
          if ((p.solved || 0) > solved) solved = p.solved;
        }
      }
    }
    return { score, xp, solved };
  }

  isExistingStudent(name) {
    if (!name || !name.trim()) return false;
    const cleanName = name.trim();
    const lowerKey = cleanName.toLowerCase();

    // 1. Check student store
    const store = this.getStore();
    if (store[lowerKey]) {
      const u = store[lowerKey];
      if (u.hasEntered === true) return true;
      if (u.stats && ((u.stats.bestScore || 0) > 0 || (u.stats.xp || 0) > 0 || (u.stats.totalSolved || 0) > 0)) {
        return true;
      }
      if (u.profile && (u.profile.hasEntered || u.profile.createdAt)) {
        return true;
      }
    }

    // 2. Check leaderboard data
    if (typeof window !== 'undefined' && window.leaderboardManager && window.leaderboardManager.data) {
      const allEntries = [
        ...(window.leaderboardManager.data.today || []),
        ...(window.leaderboardManager.data.overall || [])
      ];
      const match = allEntries.find(p => p && p.name && p.name.trim().toLowerCase() === lowerKey);
      if (match) return true;
    }

    // 3. Check boss records
    if (typeof window !== 'undefined' && window.BrainBossEngine && typeof window.BrainBossEngine.hasUserAttemptedToday === 'function') {
      if (window.BrainBossEngine.hasUserAttemptedToday(cleanName)) return true;
    }

    return false;
  }

  sanitizeState(raw, username) {
    const base = JSON.parse(JSON.stringify(INITIAL_STATE));
    const merged = {
      ...base,
      ...raw,
      profile: { ...base.profile, ...(raw.profile || {}) },
      event: { ...base.event, ...(raw.event || {}) },
      stats: { ...base.stats, ...(raw.stats || {}) },
      inventory: { ...base.inventory, ...(raw.inventory || {}) },
      modeRecords: { ...base.modeRecords, ...(raw.modeRecords || {}) },
      todayChallenge: { ...base.todayChallenge, ...(raw.todayChallenge || {}) },
      friendDuel: { ...base.friendDuel, ...(raw.friendDuel || {}) },
      unlockedBadges: Array.isArray(raw.unlockedBadges) ? [...raw.unlockedBadges] : []
    };
    merged.profile.username = username;
    if (raw.hasEntered !== undefined) {
      merged.hasEntered = !!raw.hasEntered;
    } else {
      merged.hasEntered = (merged.stats.bestScore > 0 || merged.stats.xp > 0 || merged.stats.totalSolved > 0);
    }

    // Recover points from leaderboard if higher
    const lb = this.recoverPointsFromLeaderboard(username);
    if (lb.score > (merged.stats.bestScore || 0)) {
      merged.stats.bestScore = lb.score;
    }
    if (lb.xp > (merged.stats.xp || 0)) {
      merged.stats.xp = lb.xp;
    }
    if (lb.solved > (merged.stats.totalSolved || 0)) {
      merged.stats.totalSolved = lb.solved;
    }
    if (merged.stats.bestScore > 0 && (!merged.stats.coins || merged.stats.coins === 0)) {
      merged.stats.coins = merged.stats.bestScore;
    }

    if (typeof window !== 'undefined' && window.BrainBossEngine && typeof window.BrainBossEngine.isBossSlayer === 'function') {
      const isSlayer = window.BrainBossEngine.isBossSlayer(username);
      if (!isSlayer) {
        merged.unlockedBadges = merged.unlockedBadges.filter(b => b !== 'boss_slayer');
      } else if (!merged.unlockedBadges.includes('boss_slayer')) {
        merged.unlockedBadges.push('boss_slayer');
      }
    }

    return merged;
  }

  pruneDeletedUsers(validLowerNames) {
    if (!Array.isArray(validLowerNames)) return;
    const store = this.getStore();
    let changed = false;
    Object.keys(store).forEach(k => {
      // If student in store is no longer present in MongoDB, prune it
      if (!validLowerNames.includes(k.toLowerCase())) {
        delete store[k];
        changed = true;
      }
    });
    if (changed) {
      this.saveStore(store);
      const active = (this.state && this.state.profile && this.state.profile.username) ? this.state.profile.username.trim().toLowerCase() : '';
      if (active && !validLowerNames.includes(active)) {
        try { localStorage.removeItem(ACTIVE_STUDENT_KEY); } catch(e) {}
      }
    }
  }

  syncToBackend() {
    if (typeof window === 'undefined' || typeof fetch === 'undefined') return;
    if (!this.state || !this.state.profile || !this.state.profile.username) return;
    const username = this.state.profile.username.trim();
    if (!username) return;

    const payload = {
      username,
      stats: this.state.stats,
      unlockedBadges: this.state.unlockedBadges,
      isBossSlayer: (typeof window !== 'undefined' && window.BrainBossEngine && typeof window.BrainBossEngine.isBossSlayer === 'function') ?
                    window.BrainBossEngine.isBossSlayer(username) : false
    };

    fetch('/api/users/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(res => res.json()).then(data => {
      if (data && data.success && data.user) {
        // Confirmed MongoDB sync
      }
    }).catch(() => {});
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      if (this.state && this.state.profile && this.state.profile.username) {
        const u = this.state.profile.username.trim();
        if (u) {
          const store = this.getStore();
          store[u.toLowerCase()] = JSON.parse(JSON.stringify(this.state));
          this.saveStore(store);
          localStorage.setItem(ACTIVE_STUDENT_KEY, u);
          this.syncToBackend();
        }
      }
    } catch (e) {
      console.error('Failed to persist user state:', e);
    }
  }

  checkDailyReset() {
    const today = new Date().toISOString().slice(0, 10);
    if (this.state.todayChallenge.date !== today) {
      this.state.todayChallenge = {
        date: today,
        totalNeeded: 10,
        currentCount: 0,
        isCompleted: false,
        rewardClaimed: false
      };
      this.save();
    }
  }

  setUsername(name) {
    if (!name || !name.trim()) return;
    const cleanName = name.trim();
    const lowerKey = cleanName.toLowerCase();

    // 1. Save current student's progress before switching
    if (this.state && this.state.profile && this.state.profile.username) {
      const prevName = this.state.profile.username.trim();
      if (prevName && prevName.toLowerCase() !== lowerKey) {
        const prevKey = prevName.toLowerCase();
        const store = this.getStore();
        store[prevKey] = JSON.parse(JSON.stringify(this.state));
        this.saveStore(store);
      }
    }

    // 2. Check if student is an existing student
    const isExisting = this.isExistingStudent(cleanName);
    const store = this.getStore();

    if (store[lowerKey]) {
      // Returning student! Restore their stats
      this.state = this.sanitizeState(store[lowerKey], cleanName);
    } else if (isExisting) {
      // Returning student found in leaderboard or boss engine
      const lb = this.recoverPointsFromLeaderboard(cleanName);
      this.state = JSON.parse(JSON.stringify(INITIAL_STATE));
      this.state.profile.username = cleanName;
      this.state.profile.createdAt = new Date().toISOString();
      this.state.stats.bestScore = lb.score;
      this.state.stats.xp = lb.xp;
      this.state.stats.coins = lb.score;
      this.state.stats.totalSolved = lb.solved;
      this.state.hasEntered = true;
      this.state = this.sanitizeState(this.state, cleanName);
      store[lowerKey] = JSON.parse(JSON.stringify(this.state));
      this.saveStore(store);
    } else {
      // Brand NEW student! Fresh 0 score, 0 XP, 0 badges!
      this.state = JSON.parse(JSON.stringify(INITIAL_STATE));
      this.state.profile.username = cleanName;
      this.state.profile.createdAt = new Date().toISOString();
      this.state.stats.xp = 0;
      this.state.stats.coins = 0;
      this.state.stats.level = 1;
      this.state.stats.belt = 'White Belt';
      this.state.stats.bestScore = 0;
      this.state.stats.totalSolved = 0;
      this.state.stats.totalCorrect = 0;
      this.state.stats.streak = 0;
      this.state.stats.highestCombo = 0;
      this.state.stats.currentCombo = 0;
      this.state.hasEntered = false;
      this.state.unlockedBadges = [];

      if (typeof window !== 'undefined' && window.BrainBossEngine && typeof window.BrainBossEngine.isBossSlayer === 'function') {
        if (window.BrainBossEngine.isBossSlayer(cleanName)) {
          this.state.unlockedBadges.push('boss_slayer');
        }
      }

      store[lowerKey] = JSON.parse(JSON.stringify(this.state));
      this.saveStore(store);
    }

    localStorage.setItem(ACTIVE_STUDENT_KEY, cleanName);
    this.save();

    // 3. Immediately sync with real leaderboard
    if (typeof window !== 'undefined' && window.leaderboardManager && window.leaderboardManager.syncUser) {
      window.leaderboardManager.syncUser(this.state);
    }
  }

  recordAnswer(category, isCorrect, timeTaken = 5, pointsEarned = 0, xpEarned = 0, coinsEarned = 0, combo = 0, mode = 'quick_play') {
    this.state.stats.totalSolved += 1;

    if (isCorrect) {
      this.state.stats.totalCorrect += 1;
      this.state.stats.streak += 1;
      if (this.state.stats.streak > this.state.stats.bestStreak) {
        this.state.stats.bestStreak = this.state.stats.streak;
      }

      this.state.stats.currentCombo = combo;
      if (combo > this.state.stats.highestCombo) {
        this.state.stats.highestCombo = combo;
      }

      if (timeTaken > 0 && (this.state.stats.fastestAnswerSec === 0 || timeTaken < this.state.stats.fastestAnswerSec)) {
        this.state.stats.fastestAnswerSec = parseFloat(timeTaken.toFixed(1));
      }
    } else {
      this.state.stats.streak = 0;
      this.state.stats.currentCombo = 0;
    }

    this.state.stats.xp += xpEarned;
    this.state.stats.coins += coinsEarned;
    this.state.stats.bestScore += pointsEarned;

    // Track mode-specific records
    if (mode && this.state.modeRecords[mode]) {
      this.state.modeRecords[mode].solved += 1;
      this.state.modeRecords[mode].bestScore += pointsEarned;
    }

    this.save();

    // Sync score directly with real leaderboard
    if (window.leaderboardManager && window.leaderboardManager.syncUser) {
      window.leaderboardManager.syncUser(this.state);
    }
  }

  recordDailyCompletion() {
    this.state.todayChallenge.isCompleted = true;
    this.state.stats.xp += 300;
    this.state.stats.coins += 50;
    this.save();

    if (window.leaderboardManager && window.leaderboardManager.syncUser) {
      window.leaderboardManager.syncUser(this.state);
    }
  }

  usePowerup(type) {
    if (this.state.inventory[type] && this.state.inventory[type] > 0) {
      this.state.inventory[type] -= 1;
      this.save();
      return true;
    }
    return false;
  }

  addPowerups(type, count = 1) {
    if (this.state.inventory[type] !== undefined) {
      this.state.inventory[type] += count;
      this.save();
    }
  }

  unlockBadge(badgeId) {
    if (!this.state.unlockedBadges.includes(badgeId)) {
      this.state.unlockedBadges.push(badgeId);
      this.state.stats.coins += 25;
      this.save();
      return true;
    }
    return false;
  }
}

// Export both names to prevent any undefined reference errors
window.stateManager = new StateManager();
window.appState = window.stateManager;
