/**
 * CAMPUS BRAIN BATTLE 2026 — GAMIFICATION & ARCADE ENGINE
 * Calculates XP, Coins, Combos, Speed Run Scoring, and Event Badges.
 */

const TIERS = [
  { name: 'White Belt', belt: '⚪', minLevel: 1, maxLevel: 3, color: '#E2E8F0', desc: 'Rookie Brain Fighter' },
  { name: 'Yellow Belt', belt: '🟡', minLevel: 4, maxLevel: 7, color: '#F6C453', desc: 'Fast Reflexes & Logic' },
  { name: 'Green Belt', belt: '🟢', minLevel: 8, maxLevel: 12, color: '#10B981', desc: 'Consistent Problem Crusher' },
  { name: 'Blue Belt', belt: '🔵', minLevel: 13, maxLevel: 18, color: '#3B82F6', desc: 'Master of Patterns' },
  { name: 'Brown Belt', belt: '🟤', minLevel: 19, maxLevel: 25, color: '#D97706', desc: 'Lightning Deduction Sense' },
  { name: 'Black Belt', belt: '🥋', minLevel: 26, maxLevel: 999, color: '#A855F7', desc: 'Campus Brain Arena Legend' }
];

const EVENT_BADGES = [
  { id: 'brainiac', title: 'Brainiac', desc: 'Cracked 5 tricky brain teasers.', icon: '🧠' },
  { id: 'speed_demon', title: 'Speed Demon', desc: 'Solved a puzzle in under 4 seconds.', icon: '⚡' },
  { id: 'hot_streak', title: 'Hot Streak', desc: 'Hit a 5-question solve streak.', icon: '🔥' },
  { id: 'sharp_shooter', title: 'Sharp Shooter', desc: 'Nailed 3 consecutive pattern sequences.', icon: '🎯' },
  { id: 'master_detective', title: 'Master Detective', desc: 'Solved 5 detective deductive clues.', icon: '🕵️' },
  { id: 'puzzle_crusher', title: 'Puzzle Crusher', desc: 'Conquered 5 brain box riddles.', icon: '🧩' },
  { id: 'brain_champion', title: 'Brain Champion', desc: 'Completed Today’s 10-Puzzle Challenge.', icon: '🏆' },
  { id: 'duelist', title: 'Friend Duelist', desc: 'Generated or played a Friend Brain Battle.', icon: '👥' },
  { id: 'boss_slayer', title: 'Boss Slayer', desc: 'Conquered the Daily Brain Boss in 90 seconds.', icon: '🗡️' }
];

class GamificationEngine {
  constructor() {
    this.badges = EVENT_BADGES;
  }

  getXpForLevel(level) {
    return Math.floor(160 * Math.pow(level, 1.2));
  }

  getLevelInfo(totalXp) {
    let level = 1;
    let xpAccum = 0;

    while (true) {
      const nextXp = this.getXpForLevel(level);
      if (totalXp >= xpAccum + nextXp) {
        xpAccum += nextXp;
        level += 1;
      } else {
        const currentLevelXp = totalXp - xpAccum;
        const percent = Math.min(100, Math.round((currentLevelXp / nextXp) * 100));
        const tier = this.getTierForLevel(level);
        return {
          level,
          tier: tier.name,
          belt: tier.belt,
          tierColor: tier.color,
          tierDesc: tier.desc,
          currentLevelXp,
          nextLevelXp: nextXp,
          percent
        };
      }
    }
  }

  getTierForLevel(level) {
    for (let i = TIERS.length - 1; i >= 0; i--) {
      if (level >= TIERS[i].minLevel) {
        return TIERS[i];
      }
    }
    return TIERS[0];
  }

  // Combo multiplier: 1x, 2x, 3x, 4x+ (ON FIRE!)
  getComboMultiplier(combo) {
    if (combo >= 4) return 2.0;
    if (combo === 3) return 1.5;
    if (combo === 2) return 1.25;
    return 1.0;
  }

  // Arcade Score & XP Calculation (supports both calculateScore and calculateArcadeScore)
  calculateScore(isCorrect, timeRemaining, totalTime, combo, isSurpriseBonus = false) {
    return this.calculateArcadeScore(isCorrect, timeRemaining, totalTime, combo, isSurpriseBonus);
  }

  calculateArcadeScore(isCorrect, timeRemaining, totalTime, combo, isSurpriseBonus = false) {
    if (!isCorrect) {
      return {
        baseXp: 0,
        speedBonus: 0,
        comboMultiplier: 1.0,
        totalXp: 5, // consolation
        xpEarned: 5,
        totalPoints: 0,
        coinsEarned: 0,
        isOnFire: false
      };
    }

    const baseXp = 25;
    const speedRatio = Math.max(0, timeRemaining / totalTime);
    const speedBonus = Math.round(speedRatio * 15);
    const comboMultiplier = this.getComboMultiplier(combo);
    const surpriseMultiplier = isSurpriseBonus ? 2.0 : 1.0;

    const totalXp = Math.round((baseXp + speedBonus) * comboMultiplier * surpriseMultiplier);
    const totalPoints = Math.round((baseXp + speedBonus) * 10 * comboMultiplier * surpriseMultiplier);
    const coinsEarned = Math.round(10 * comboMultiplier);
    const isOnFire = combo >= 4;

    return {
      baseXp,
      speedBonus,
      comboMultiplier,
      surpriseMultiplier,
      totalXp,
      xpEarned: totalXp,
      totalPoints,
      coinsEarned,
      isOnFire
    };
  }

  // Check event badges
  checkBadges(stateTarget, lastSolveInfo = {}) {
    const mgr = (stateTarget && typeof stateTarget.unlockBadge === 'function') 
      ? stateTarget 
      : (window.appState || { unlockBadge: () => false });
    const s = (stateTarget && stateTarget.state) ? stateTarget.state : stateTarget;
    if (!s || !s.stats) return [];

    const newlyUnlocked = [];

    // Speed Demon (< 4s)
    if (lastSolveInfo.isCorrect && lastSolveInfo.timeTaken <= 4 && mgr.unlockBadge('speed_demon')) {
      newlyUnlocked.push(this.badges.find(b => b.id === 'speed_demon'));
    }

    // Hot Streak (streak >= 5)
    if (s.stats.streak >= 5 && mgr.unlockBadge('hot_streak')) {
      newlyUnlocked.push(this.badges.find(b => b.id === 'hot_streak'));
    }

    // Brainiac (brain teasers >= 5)
    if (s.modeRecords?.brain_teaser?.solved >= 5 && mgr.unlockBadge('brainiac')) {
      newlyUnlocked.push(this.badges.find(b => b.id === 'brainiac'));
    }

    // Master Detective (detective >= 5)
    if (s.modeRecords?.detective?.solved >= 5 && mgr.unlockBadge('master_detective')) {
      newlyUnlocked.push(this.badges.find(b => b.id === 'master_detective'));
    }

    // Puzzle Crusher (puzzle_box >= 5)
    if (s.modeRecords?.puzzle_box?.solved >= 5 && mgr.unlockBadge('puzzle_box')) {
      newlyUnlocked.push(this.badges.find(b => b.id === 'puzzle_crusher'));
    }

    // Sharp Shooter (highestCombo >= 4)
    if (s.stats.highestCombo >= 4 && mgr.unlockBadge('sharp_shooter')) {
      newlyUnlocked.push(this.badges.find(b => b.id === 'sharp_shooter'));
    }

    // Brain Champion (10 questions today)
    if (s.todayChallenge?.isCompleted && mgr.unlockBadge('brain_champion')) {
      newlyUnlocked.push(this.badges.find(b => b.id === 'brain_champion'));
    }

    // Boss Slayer (Defeated the Daily Brain Boss)
    if (lastSolveInfo.mode === 'brain_boss' && lastSolveInfo.isCorrect && mgr.unlockBadge('boss_slayer')) {
      newlyUnlocked.push(this.badges.find(b => b.id === 'boss_slayer'));
    }

    return newlyUnlocked;
  }
}

window.gamificationEngine = new GamificationEngine();
