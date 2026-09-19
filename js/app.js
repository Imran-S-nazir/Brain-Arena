/**
 * CAMPUS BRAIN BATTLE 2026 — DIMAAG ARCADE CONTROLLER
 * Full campus event game loop: Instant Quick Play, 60s Speed Run Blitz,
 * Tricky Brain Teasers, Friend Duels, Live Combo Multiplier,
 * Tactical Power-ups with Hints, Today's 10-Question Challenge,
 * and the "ONE MORE GAME" results loop.
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const els = {
    // Views
    landingView: document.getElementById('landing-view'),
    dashboardView: document.getElementById('arcade-dashboard-view'),
    gamePlayView: document.getElementById('game-play-view'),
    gameOverView: document.getElementById('game-over-view'),

    // Landing View
    warriorForm: document.getElementById('warrior-form'),
    warriorNameInput: document.getElementById('warrior-name-input'),
    landingTopWarriors: document.getElementById('landing-top-warriors'),
    landingAudioBtn: document.getElementById('landing-audio-btn'),

    // Dashboard HUD
    hudPlayerName: document.getElementById('hud-player-name'),
    streakVal: document.getElementById('streak-val'),
    tierBadge: document.getElementById('tier-badge'),
    userLevel: document.getElementById('user-level'),
    xpNumbers: document.getElementById('xp-numbers'),
    xpFill: document.getElementById('xp-fill'),
    arenaPoints: document.getElementById('arena-points'),
    audioToggleBtn: document.getElementById('audio-toggle-btn'),
    audioBtnIcon: document.getElementById('audio-btn-icon'),

    // Dashboard Navigation
    navHomeBtn: document.getElementById('nav-home-btn'),
    navQuickplayBtn: document.getElementById('nav-quickplay-btn'),
    navLeaderboardBtn: document.getElementById('nav-leaderboard-btn'),
    navRewardsBtn: document.getElementById('nav-rewards-btn'),
    navDuelBtn: document.getElementById('nav-duel-btn'),
    brandHomeBtn: document.getElementById('brand-home-btn'),

    // Hero Section
    heroStreakVal: document.getElementById('hero-streak-val'),
    heroXpVal: document.getElementById('hero-xp-val'),
    heroRankVal: document.getElementById('hero-rank-val'),
    heroPlayBtn: document.getElementById('hero-play-btn'),
    heroChallengeBtn: document.getElementById('hero-challenge-btn'),

    // Quick Play & Modes
    quickPlayBtn: document.getElementById('quick-play-btn'),
    modeCards: document.querySelectorAll('.mode-card'),
    startDailyChallengeBtn: document.getElementById('start-daily-challenge-btn'),
    dashCopyCodeBtn: document.getElementById('dash-copy-code-btn'),
    dashOpenDuelModalBtn: document.getElementById('dash-open-duel-modal-btn'),
    dashboardDuelCode: document.getElementById('dashboard-duel-code'),

    // Daily Brain Boss Challenge
    btnChallengeBoss: document.getElementById('btn-challenge-boss'),
    bossActiveName: document.getElementById('boss-active-name'),
    bossCooldownText: document.getElementById('boss-cooldown-text'),
    brainBossCard: document.getElementById('brain-boss-card'),

    // Personal Score Card
    statBestScore: document.getElementById('stat-best-score'),
    statBestCombo: document.getElementById('stat-best-combo'),
    statFastest: document.getElementById('stat-fastest'),
    statPuzzlesSolved: document.getElementById('stat-puzzles-solved'),
    statFestStreak: document.getElementById('stat-fest-streak'),

    // Leaderboard
    leaderboardContainer: document.getElementById('leaderboard-list-container'),
    leaderboardToggleBtn: document.getElementById('leaderboard-toggle-btn'),

    // Game Play Screen
    exitGameBtn: document.getElementById('exit-game-btn'),
    playBrandBtn: document.getElementById('play-brand-btn'),
    liveComboBadge: document.getElementById('live-combo-badge'),
    liveComboText: document.getElementById('live-combo-text'),
    liveRoundScore: document.getElementById('live-round-score'),
    timerRing: document.getElementById('timer-ring'),
    timerContainer: document.getElementById('timer-container'),
    timerNumber: document.getElementById('timer-number'),
    challengeTimerDisplay: document.getElementById('challenge-timer-display'),
    challengeProgressBar: document.getElementById('challenge-progress-bar'),
    mysteryUnlockBtn: document.getElementById('mystery-unlock-btn'),
    surpriseBanner: document.getElementById('surprise-banner'),
    categoryPill: document.getElementById('category-pill'),
    subcategoryTag: document.getElementById('subcategory-tag'),
    adaptiveDifficultyBadge: document.getElementById('adaptive-difficulty-badge'),
    diffText: document.getElementById('diff-text'),
    questionStepTracker: document.getElementById('question-step-tracker'),
    questionCard: document.getElementById('question-card'),
    questionStatementBox: document.getElementById('question-statement-box'),
    questionContextBox: document.getElementById('question-context-box'),
    questionPrompt: document.getElementById('question-prompt'),
    questionVisualStage: document.getElementById('question-visual-stage'),
    optionsGrid: document.getElementById('options-grid'),
    hintBox: document.getElementById('hint-box'),
    hintText: document.getElementById('hint-text'),

    // Power-ups
    btn5050: document.getElementById('powerup-5050'),
    btnTime: document.getElementById('powerup-time'),
    btnHint: document.getElementById('powerup-hint'),
    btnSkip: document.getElementById('powerup-skip'),
    count5050: document.getElementById('count-5050'),
    countTime: document.getElementById('count-time'),
    countHint: document.getElementById('count-hint'),
    countSkip: document.getElementById('count-skip'),

    // Solution Drawer & Next Buttons
    solutionDrawer: document.getElementById('solution-drawer'),
    resultStatusIcon: document.getElementById('result-status-icon'),
    resultHeadline: document.getElementById('result-headline'),
    resultSubtext: document.getElementById('result-subtext'),
    tagBase: document.getElementById('tag-base'),
    tagStreak: document.getElementById('tag-streak'),
    explanationText: document.getElementById('explanation-text'),
    nextQuestionBtn: document.getElementById('next-question-btn'),
    trayNextBtn: document.getElementById('tray-next-btn'),

    // "One More Game" Results Screen
    resScore: document.getElementById('res-score'),
    resCombo: document.getElementById('res-combo'),
    resRank: document.getElementById('res-rank'),
    resPlayAgainBtn: document.getElementById('res-play-again-btn'),
    resNextChallengeBtn: document.getElementById('res-next-challenge-btn'),
    resViewLbBtn: document.getElementById('res-view-lb-btn'),
    resDuelFriendBtn: document.getElementById('res-duel-friend-btn'),

    // Modals
    leaderboardModal: document.getElementById('leaderboard-modal'),
    modalLeaderboardContainer: document.getElementById('modal-leaderboard-container'),
    closeLeaderboardBtn: document.getElementById('close-leaderboard-btn'),

    friendDuelModal: document.getElementById('friend-duel-modal'),
    closeDuelModalBtn: document.getElementById('close-duel-modal-btn'),
    modalDuelCodeDisplay: document.getElementById('modal-duel-code-display'),
    modalCopyLinkBtn: document.getElementById('modal-copy-link-btn'),
    btnStartMyDuel: document.getElementById('btn-start-my-duel'),
    joinCodeInput: document.getElementById('join-code-input'),
    btnJoinDuel: document.getElementById('btn-join-duel'),

    // Duel Results Card
    resDuelCard: document.getElementById('res-duel-card'),
    duelShareBtn: document.getElementById('duel-share-btn'),

    rewardsModal: document.getElementById('rewards-modal'),
    closeRewardsBtn: document.getElementById('close-rewards-btn'),
    rewXpVal: document.getElementById('rew-xp-val'),
    rewCoinsVal: document.getElementById('rew-coins-val'),
    rewStreakVal: document.getElementById('rew-streak-val'),
    rewRankVal: document.getElementById('rew-rank-val'),
    modalBadgesGrid: document.getElementById('modal-badges-grid'),

    levelupModal: document.getElementById('levelup-modal'),
    modalNewTier: document.getElementById('modal-new-tier'),
    modalTierDesc: document.getElementById('modal-tier-desc'),
    levelupContinueBtn: document.getElementById('levelup-continue-btn')
  };

  // Game Runtime State
  let currentMode = 'quick_play'; // 'quick_play' | 'speed_run' | 'brain_teaser' | 'what_next' | 'detective' | 'odds_ends' | 'puzzle_box' | 'daily_challenge' | 'friend_duel'
  let activeDuelCode = null;
  let activeDuelTarget = 0;
  let activeDuelChallenger = null;

  let currentQuestion = null;
  let isAnswered = false;
  let roundScore = 0;
  let roundXp = 0;
  let currentCombo = 0;
  let maxRoundCombo = 0;
  let questionCountInRound = 0;
  let maxQuestionsInRound = 10; // Exactly 10 questions in each section
  let isDoubleXpActive = false;
  let roundSeenQuestions = new Set();
  let sessionRecentKeys = [];

  // Timers
  let timerInterval = null;
  let timeRemaining = 60;
  let totalAllowedTime = 60;
  let questionStartTime = Date.now();
  let isSpeedRunBlitz = false;

  // Snappy Praise & Critique Collections
  const SNAPPY_PRAISES = [
    'Nice one! 🎉',
    'Sharp mind! ⚡',
    'Brain on fire! 🔥',
    'Boom! Nailed it. 🎯',
    'Genius move! 🧠',
    'Lightning fast! ⚡'
  ];

  const SNAPPY_CRITIQUES = [
    'Almost! 😄',
    'Tricky one, right? 😉',
    'So close! Keep going.',
    'Good shot! Notice the twist.'
  ];

  // ==========================================
  // INITIALIZATION
  // ==========================================
  function init() {
    const s = window.stateManager ? window.stateManager.state : null;
    if (!s) return;

    // Prefill name if user previously saved a name, otherwise blank for clean student input
    const savedName = (s.profile && s.profile.username) ? s.profile.username : '';
    if (els.warriorNameInput) {
      els.warriorNameInput.value = savedName;
    }
    const resumeWrap = document.getElementById('landing-resume-wrap');
    if (resumeWrap) {
      if (savedName) {
        resumeWrap.classList.remove('hidden');
        const resumeName = document.getElementById('landing-resume-name');
        if (resumeName) resumeName.textContent = savedName;
      } else {
        resumeWrap.classList.add('hidden');
      }
    }
    if (!savedName) {
      showView('landing-view');
    }

    // Set friend duel code
    const duelCode = (s.friendDuel && s.friendDuel.duelCode) ? s.friendDuel.duelCode : 'BRAIN-4821';
    if (els.dashboardDuelCode) els.dashboardDuelCode.textContent = duelCode;
    if (els.modalDuelCodeDisplay) els.modalDuelCodeDisplay.textContent = duelCode;

    // Check if user came via a friend's duel link
    const params = new URLSearchParams(window.location.search);
    const duelParam = params.get('duel');
    if (duelParam) {
      const challenger = params.get('challenger') || params.get('creator') || 'A Friend';
      const target = parseInt(params.get('target') || '0', 10);
      activeDuelCode = duelParam.trim().toUpperCase();
      activeDuelChallenger = challenger;
      activeDuelTarget = target;

      if (els.joinCodeInput) els.joinCodeInput.value = activeDuelCode;

      setTimeout(() => {
        if (target > 0) {
          showToast(`⚔️ ${challenger} challenged you to beat ${target} pts in Duel ${activeDuelCode}!`, 'achievement');
        } else {
          showToast(`⚔️ Incoming challenge from ${challenger} in Duel ${activeDuelCode}!`, 'achievement');
        }
      }, 700);
    }

    updateHUD();
    renderLandingLeaderboard();
    renderDashboardLeaderboard();
    updatePersonalStats();
    updateBrainBossUI();
    setupEventListeners();

    // Fetch live leaderboard from MongoDB so deleted users are removed immediately
    if (window.leaderboardManager && typeof window.leaderboardManager.fetchFromBackend === 'function') {
      window.leaderboardManager.fetchFromBackend(() => {
        renderLandingLeaderboard();
        renderDashboardLeaderboard();
      });
    }
  }

  function updateBrainBossUI(targetUsername) {
    if (!window.BrainBossEngine) return;
    const user = targetUsername || (window.stateManager && window.stateManager.state && window.stateManager.state.profile.username) || '';
    const todayBoss = window.BrainBossEngine.getTodayBoss(user);
    if (els.bossActiveName && todayBoss) {
      els.bossActiveName.innerHTML = `Today's Opponent: <strong>${todayBoss.bossName}</strong> — <em>${todayBoss.bossTitle}</em>`;
    }
    const isDefeated = window.BrainBossEngine.isBossDefeatedToday(user);
    const isAttempted = window.BrainBossEngine.isBossAttemptedToday(user);

    if (els.btnChallengeBoss) {
      if (isDefeated) {
        els.btnChallengeBoss.classList.add('defeated');
        els.btnChallengeBoss.disabled = true;
        els.btnChallengeBoss.innerHTML = '🗡️ BOSS DEFEATED TODAY ✓';
        if (els.bossCooldownText) els.bossCooldownText.textContent = 'Supreme Victory! Next Boss Awakens Tomorrow at Midnight';
      } else if (isAttempted) {
        els.btnChallengeBoss.classList.add('defeated');
        els.btnChallengeBoss.disabled = true;
        els.btnChallengeBoss.innerHTML = '💀 RAID FAILED TODAY (1/1)';
        if (els.bossCooldownText) els.bossCooldownText.textContent = '1 Attempt Used • Come Back Tomorrow at Midnight';
      } else {
        els.btnChallengeBoss.classList.remove('defeated');
        els.btnChallengeBoss.disabled = false;
        els.btnChallengeBoss.innerHTML = 'CHALLENGE THE BOSS ⚔️';
        if (els.bossCooldownText) els.bossCooldownText.textContent = '1 Attempt Today • Solve to Earn Boss Slayer Badge';
      }
    }
  }

  function renderLandingLeaderboard() {
    if (window.leaderboardManager && els.landingTopWarriors) {
      window.leaderboardManager.renderLandingLeaderboard(els.landingTopWarriors, window.stateManager ? window.stateManager.state : null);
    }
  }

  function renderDashboardLeaderboard() {
    if (window.leaderboardManager && els.leaderboardContainer) {
      window.leaderboardManager.renderTo(els.leaderboardContainer, 'today', window.stateManager ? window.stateManager.state : null);
    }
  }

  function updateHUD() {
    const s = window.stateManager ? window.stateManager.state : null;
    if (!s) return;
    const lvlInfo = window.gamificationEngine.getLevelInfo(s.stats.xp || 0);

    const displayName = s.profile.username || 'Student Player';
    const isSlayer = (window.BrainBossEngine && typeof window.BrainBossEngine.isBossSlayer === 'function') ?
                     window.BrainBossEngine.isBossSlayer(displayName) : false;

    if (els.hudPlayerName) {
      if (isSlayer) {
        els.hudPlayerName.innerHTML = `${displayName} <span class="boss-slayer-title-badge">🗡️ Boss Slayer</span>`;
      } else {
        els.hudPlayerName.textContent = displayName;
      }
    }
    if (els.userLevel) els.userLevel.textContent = `Lvl ${lvlInfo.level}`;
    if (els.tierBadge) {
      els.tierBadge.textContent = lvlInfo.tier.toUpperCase();
      els.tierBadge.style.background = `linear-gradient(135deg, ${lvlInfo.tierColor}, #FF6F61)`;
    }
    if (els.xpNumbers) els.xpNumbers.textContent = `${(s.stats.xp || 0).toLocaleString()} XP`;
    if (els.xpFill) els.xpFill.style.width = `${lvlInfo.percent}%`;

    if (els.arenaPoints) els.arenaPoints.textContent = (s.stats.coins || 0).toLocaleString();
    if (els.streakVal) els.streakVal.textContent = s.stats.streak || 0;

    // Hero stats
    if (els.heroStreakVal) els.heroStreakVal.textContent = s.stats.streak || 0;
    if (els.heroXpVal) els.heroXpVal.textContent = (s.stats.xp || 0).toLocaleString();
    if (els.heroRankVal) els.heroRankVal.textContent = s.stats.campusRank || '#1';

    const hudRankText = document.getElementById('hud-rank-text');
    if (hudRankText) hudRankText.textContent = `🏆 ${s.stats.campusRank || '#1'} Rank`;

    const rankPill = document.getElementById('user-rank-status-pill');
    if (rankPill) {
      rankPill.textContent = `🔥 Live Fest Rank ${s.stats.campusRank || '#1'}`;
    }

    updatePowerupCounts();
  }

  function updatePersonalStats() {
    const s = window.stateManager ? window.stateManager.state : null;
    if (!s) return;
    if (els.statBestScore) els.statBestScore.textContent = (s.stats.bestScore || 0).toLocaleString();
    if (els.statBestCombo) els.statBestCombo.textContent = `${s.stats.highestCombo || 0} 🔥`;
    if (els.statFastest) els.statFastest.textContent = (s.stats.fastestAnswerSec && s.stats.fastestAnswerSec > 0) ? `${s.stats.fastestAnswerSec}s` : '—';
    if (els.statPuzzlesSolved) els.statPuzzlesSolved.textContent = s.stats.totalSolved || 0;
    if (els.statFestStreak) els.statFestStreak.textContent = `${s.stats.streak || 0} Days`;
  }

  function updatePowerupCounts() {
    if (!window.stateManager || !window.stateManager.state) return;
    const inv = window.stateManager.state.inventory;
    if (els.count5050) els.count5050.textContent = inv.fiftyFifty || 0;
    if (els.countTime) els.countTime.textContent = inv.extraTime || 0;
    if (els.countHint) els.countHint.textContent = inv.hints || 0;
    if (els.countSkip) els.countSkip.textContent = inv.skip || 0;

    // Never disable buttons so user clicks are always handled with helpful feedback
    if (els.btn5050) els.btn5050.disabled = false;
    if (els.btnTime) els.btnTime.disabled = false;
    if (els.btnHint) els.btnHint.disabled = false;
    if (els.btnSkip) els.btnSkip.disabled = false;
  }

  // ==========================================
  // VIEW SWITCHING
  // ==========================================
  function showView(viewId) {
    const ceremonyStage = document.getElementById('welcome-ceremony-stage');
    [els.landingView, els.dashboardView, els.gamePlayView, els.gameOverView, ceremonyStage].forEach(v => {
      if (v) v.classList.add('hidden');
    });

    const active = document.getElementById(viewId);
    if (active) {
      active.classList.remove('hidden');
      window.scrollTo(0, 0);
    }
  }

  // ==========================================
  // STARTING GAMES & MODES
  // ==========================================
  function startGame(mode = 'quick_play') {
    currentMode = mode;
    roundScore = 0;
    roundXp = 0;
    currentCombo = 0;
    maxRoundCombo = 0;
    questionCountInRound = 0;
    maxQuestionsInRound = 10; // Exactly 10 questions in EACH section
    roundSeenQuestions.clear();
    if (els.liveRoundScore) els.liveRoundScore.textContent = '0 XP';
    updateComboBadge();

    // Force close any open modals so gameplay is completely unobstructed
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.add('hidden'));

    showView('game-play-view');

    if (mode === 'brain_boss') {
      maxQuestionsInRound = 1;
      isSpeedRunBlitz = false;
      // Guarantee a fresh, distinct master puzzle on every attempt
      if (window.BrainBossEngine && typeof window.BrainBossEngine.advanceToNextBoss === 'function') {
        window.BrainBossEngine.advanceToNextBoss();
      }
      loadNextQuestion();
      showToast('👑 BRAIN BOSS HAS ARRIVED! 90s • 500 XP at stake!', 'achievement');
    } else if (mode === 'speed_run') {
      isSpeedRunBlitz = false;
      loadNextQuestion();
      showToast('⚡ SPEED RUN! 10 Rapid Questions. Move fast!', 'achievement');
    } else if (mode === 'daily_challenge') {
      isSpeedRunBlitz = false;
      loadNextQuestion();
      showToast('🔥 TODAY\'S CHALLENGE: 10 Curated Puzzles. Let\'s go!', 'normal');
    } else if (mode === 'friend_duel') {
      isSpeedRunBlitz = false;
      loadNextQuestion();
      showToast('👥 FRIEND DUEL: 10 Rapid Questions!', 'normal');
    } else {
      isSpeedRunBlitz = false;
      loadNextQuestion();
    }
  }

  // ==========================================
  // TIMER MECHANICS & FORMATTING
  // ==========================================
  function formatTime(seconds) {
    const s = Math.max(0, seconds);
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  function startQuestionTimer(seconds = 60) {
    if (isSpeedRunBlitz) return; // Blitz timer manages itself

    clearInterval(timerInterval);
    totalAllowedTime = seconds;
    timeRemaining = seconds;
    questionStartTime = Date.now();
    updateTimerDisplay();

    timerInterval = setInterval(() => {
      timeRemaining -= 1;
      updateTimerDisplay();

      if (timeRemaining <= 0) {
        clearInterval(timerInterval);
        handleTimeout();
      }
    }, 1000);
  }

  function startSpeedRunTimer(seconds = 60) {
    clearInterval(timerInterval);
    totalAllowedTime = seconds;
    timeRemaining = seconds;
    questionStartTime = Date.now();
    updateTimerDisplay();

    timerInterval = setInterval(() => {
      timeRemaining -= 1;
      updateTimerDisplay();

      if (timeRemaining <= 0) {
        clearInterval(timerInterval);
        endRound();
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    const formatted = formatTime(timeRemaining);
    if (els.timerNumber) els.timerNumber.textContent = formatted;
    if (els.challengeTimerDisplay) els.challengeTimerDisplay.textContent = formatted;

    if (els.timerRing) {
      const radius = 20;
      const circumference = 2 * Math.PI * radius;
      const fraction = Math.max(0, timeRemaining / totalAllowedTime);
      const offset = circumference * (1 - fraction);
      els.timerRing.style.strokeDasharray = `${circumference}`;
      els.timerRing.style.strokeDashoffset = `${offset}`;
    }

    if (els.timerContainer) {
      if (timeRemaining <= 5) {
        els.timerContainer.classList.add('urgent');
        if (window.soundFX && typeof window.soundFX.playTick === 'function') {
          window.soundFX.playTick();
        }
      } else {
        els.timerContainer.classList.remove('urgent');
      }
    }
  }

  function stopTimer() {
    clearInterval(timerInterval);
  }

  // ==========================================
  // COMBO MECHANICS
  // ==========================================
  function updateComboBadge() {
    if (currentCombo >= 4) {
      els.liveComboBadge.className = 'combo-indicator on-fire';
      els.liveComboText.textContent = `×${currentCombo} ON FIRE! 🔥`;
    } else if (currentCombo > 0) {
      els.liveComboBadge.className = 'combo-indicator';
      els.liveComboText.textContent = `×${currentCombo}`;
    } else {
      els.liveComboBadge.className = 'combo-indicator';
      els.liveComboText.textContent = `×1`;
    }
  }

  // ==========================================
  // DYNAMIC ANTI-DUPLICATION ENGINE
  // ==========================================
  function getQuestionKey(q) {
    if (!q) return '';
    const cleanPrompt = (q.prompt || '').replace(/<[^>]*>/g, '').trim().toLowerCase();
    const subcat = (q.subcategory || '').toLowerCase();
    return `${subcat}::${cleanPrompt}`;
  }

  function generateQuestionForMode(mode, diff = 'medium') {
    switch (mode) {
      case 'brain_teaser':
        return window.PuzzleGenerator.generate(diff);

      case 'what_next': {
        const r = Math.random();
        if (r < 0.4 && window.QuantGenerator) {
          return window.QuantGenerator.generateSeries(diff);
        } else if (r < 0.7 && window.AbstractGenerator) {
          return window.AbstractGenerator.generateFigureSeries(diff);
        } else if (window.AbstractGenerator) {
          return window.AbstractGenerator.generateMatrix(diff);
        }
        return window.PuzzleGenerator.generate(diff);
      }

      case 'detective': {
        if (Math.random() < 0.35 && window.CriticalGenerator) {
          return window.CriticalGenerator.generate(diff);
        }
        return window.LogicalGenerator.generate(diff);
      }

      case 'odds_ends':
        return window.AbstractGenerator.generateOddOneOut ? window.AbstractGenerator.generateOddOneOut(diff) : window.AbstractGenerator.generate(diff);

      case 'puzzle_box':
        return window.PuzzleGenerator.generate(diff);

      case 'speed_run': {
        const gens = [window.QuantGenerator, window.LogicalGenerator, window.AbstractGenerator, window.PuzzleGenerator].filter(Boolean);
        const pickedGen = gens[Math.floor(Math.random() * gens.length)];
        return pickedGen.generate(diff);
      }

      case 'daily_challenge': {
        // Guarantee 10 distinct puzzle styles across all categories
        const availableGens = [
          () => window.LogicalGenerator.generate(diff),
          () => window.QuantGenerator.generateSeries(diff),
          () => window.AbstractGenerator.generateFigureSeries(diff),
          () => window.PuzzleGenerator.generateClockAngle(diff),
          () => window.AbstractGenerator.generateOddOneOut(diff),
          () => window.PuzzleGenerator.generateBalance(diff),
          () => (window.CriticalGenerator ? window.CriticalGenerator.generate(diff) : window.LogicalGenerator.generate(diff)),
          () => window.PuzzleGenerator.generateWaterJug(diff),
          () => window.QuantGenerator.generateProfitLoss(diff),
          () => window.PuzzleGenerator.generateRiddle(diff)
        ];
        const index = (questionCountInRound - 1) % availableGens.length;
        return availableGens[index]();
      }

      case 'brain_boss': {
        const user = (window.stateManager && window.stateManager.state && window.stateManager.state.profile.username) || '';
        return window.BrainBossEngine ? window.BrainBossEngine.getTodayBoss(user) : window.PuzzleGenerator.generate(diff);
      }

      case 'friend_duel':
      case 'quick_play':
      default: {
        const gens = [window.LogicalGenerator, window.QuantGenerator, window.AbstractGenerator, window.PuzzleGenerator, window.CriticalGenerator].filter(Boolean);
        const pickedGen = gens[Math.floor(Math.random() * gens.length)];
        return pickedGen.generate(diff);
      }
    }
  }

  function getDynamicQuestion(mode, diff = 'medium') {
    let bestQuestion = null;
    const maxAttempts = 15;

    for (let i = 0; i < maxAttempts; i++) {
      const candidate = generateQuestionForMode(mode, diff);
      if (!candidate) continue;
      const key = getQuestionKey(candidate);

      if (!roundSeenQuestions.has(key) && !sessionRecentKeys.includes(key)) {
        roundSeenQuestions.add(key);
        sessionRecentKeys.push(key);
        if (sessionRecentKeys.length > 40) sessionRecentKeys.shift();
        return candidate;
      }
      bestQuestion = candidate;
    }

    if (bestQuestion) {
      roundSeenQuestions.add(getQuestionKey(bestQuestion));
    }
    return bestQuestion;
  }

  // ==========================================
  // QUESTION GENERATION & STEP TRACKING
  // ==========================================
  function loadNextQuestion() {
    isAnswered = false;
    questionCountInRound += 1;
    if (els.solutionDrawer) els.solutionDrawer.classList.add('hidden');
    if (els.trayNextBtn) els.trayNextBtn.classList.add('hidden');
    if (els.hintBox) els.hintBox.classList.add('hidden');
    if (els.questionCard) els.questionCard.classList.remove('shake', 'bounce-win');

    // Surprise Double XP event (15% chance)
    if (Math.random() < 0.15) {
      isDoubleXpActive = true;
      if (els.surpriseBanner) {
        els.surpriseBanner.classList.remove('hidden');
        els.surpriseBanner.innerHTML = `<span>🎁 BONUS ROUND! Double XP for this puzzle!</span>`;
      }
    } else {
      isDoubleXpActive = false;
      if (els.surpriseBanner) els.surpriseBanner.classList.add('hidden');
    }

    if (currentMode === 'brain_boss') {
      if (els.questionStepTracker) {
        els.questionStepTracker.textContent = '👑 BRAIN BOSS RAID • 1 EXPERT PUZZLE';
      }
      if (els.challengeProgressBar) {
        els.challengeProgressBar.style.width = '100%';
      }
    } else {
      // Step tracker and progress bar: exactly 10 questions per section
      const currentPad = String(questionCountInRound).padStart(2, '0');
      const maxPad = String(maxQuestionsInRound).padStart(2, '0');
      if (els.questionStepTracker) {
        els.questionStepTracker.textContent = `Challenge ${currentPad} / ${maxPad}`;
      }
      if (els.challengeProgressBar) {
        const progressPercent = Math.min(100, Math.round((questionCountInRound / maxQuestionsInRound) * 100));
        els.challengeProgressBar.style.width = `${progressPercent}%`;
      }
    }

    // Get guaranteed unique & fresh dynamic question
    const diff = 'medium';
    const q = getDynamicQuestion(currentMode, diff);

    currentQuestion = q;
    renderQuestion(q);
    updatePowerupCounts();

    const timerSeconds = currentMode === 'speed_run' ? 30 : (currentMode === 'brain_boss' ? 90 : 60);
    startQuestionTimer(timerSeconds);
  }

  function renderQuestion(q) {
    if (els.categoryPill) els.categoryPill.textContent = (q.categoryTitle || '🧩 BRAIN TEASER').toUpperCase();
    if (els.subcategoryTag) els.subcategoryTag.textContent = q.subcategory || 'Puzzle';

    // Update Difficulty Badge for Brain Boss vs Normal
    if (els.diffText) {
      if (currentMode === 'brain_boss') {
        els.diffText.textContent = 'EXTREME / MASTER 🔥';
        if (els.adaptiveDifficultyBadge) {
          els.adaptiveDifficultyBadge.style.background = 'rgba(236, 72, 153, 0.2)';
          els.adaptiveDifficultyBadge.style.borderColor = '#EC4899';
          els.adaptiveDifficultyBadge.style.color = '#FBCFE8';
        }
      } else {
        els.diffText.textContent = 'Medium';
        if (els.adaptiveDifficultyBadge) {
          els.adaptiveDifficultyBadge.style.background = '';
          els.adaptiveDifficultyBadge.style.borderColor = '';
          els.adaptiveDifficultyBadge.style.color = '';
        }
      }
    }

    // Render Problem Statement & Clues Dossier (Crucial for Boss Raids, Detective Mode, Seating, Syllogisms, Critical Reasoning)
    if (els.questionStatementBox) {
      const rawContent = q.statement || q.contextBox;
      const isBoss = currentMode === 'brain_boss' || q.categoryTitle?.includes('BOSS');
      const hasExplicitStatement = !!q.statement;

      if (rawContent && (isBoss || hasExplicitStatement || q.category === 'detective' || q.category === 'critical' || q.category === 'puzzle_box')) {
        let badgeTitle = '📋 PROBLEM STATEMENTS & PREMISES';
        if (isBoss) {
          badgeTitle = '👑 MASTER LOGIC PREMISES & CONSTRAINTS';
          els.questionStatementBox.classList.add('boss-statement-box');
        } else if (q.category === 'detective') {
          badgeTitle = '🕵️ CASE CLUES & STATEMENTS';
          els.questionStatementBox.classList.remove('boss-statement-box');
        } else {
          els.questionStatementBox.classList.remove('boss-statement-box');
        }

        els.questionStatementBox.innerHTML = `
          <div class="statement-badge">${badgeTitle}</div>
          <div class="statement-text">${rawContent}</div>
        `;
        els.questionStatementBox.classList.remove('hidden');
      } else {
        els.questionStatementBox.innerHTML = '';
        els.questionStatementBox.classList.add('hidden');
        els.questionStatementBox.classList.remove('boss-statement-box');
      }
    }

    // DO NOT show strategy inside solution drawer before answering — keep hidden
    if (els.questionContextBox) {
      els.questionContextBox.classList.add('hidden');
      els.questionContextBox.innerHTML = '';
    }

    // Hide solution drawer until answer
    if (els.solutionDrawer) {
      els.solutionDrawer.classList.add('hidden');
    }

    if (currentMode === 'brain_boss' && window.BrainBossEngine && q && q.id) {
      const user = (window.stateManager && window.stateManager.state && window.stateManager.state.profile.username) || '';
      if (typeof window.BrainBossEngine.recordBossAttempt === 'function') {
        window.BrainBossEngine.recordBossAttempt(user, q.id);
      }
    }

    if (els.questionPrompt) els.questionPrompt.innerHTML = q.prompt;

    if (q.visualHtml) {
      if (els.questionVisualStage) {
        els.questionVisualStage.innerHTML = q.visualHtml;
        els.questionVisualStage.classList.remove('hidden');
      }
    } else {
      if (els.questionVisualStage) {
        els.questionVisualStage.innerHTML = '';
        els.questionVisualStage.classList.add('hidden');
      }
    }

    // Render Options A, B, C, D
    const optionLetters = ['A', 'B', 'C', 'D'];
    let optionsHtml = '';

    q.options.forEach((optText, index) => {
      const letter = optionLetters[index];
      optionsHtml += `
        <button class="option-btn" data-index="${index}" id="opt-btn-${index}">
          <span class="option-badge">${letter}</span>
          <span class="option-content">${optText}</span>
        </button>
      `;
    });

    if (els.optionsGrid) els.optionsGrid.innerHTML = optionsHtml;

    document.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const selectedIndex = parseInt(btn.getAttribute('data-index'), 10);
        handleAnswer(selectedIndex);
      });
    });

    // Card animation
    if (els.questionCard) {
      els.questionCard.classList.remove('card-entering');
      void els.questionCard.offsetWidth;
      els.questionCard.classList.add('card-entering');
    }
  }

  // ==========================================
  // ANSWER PROCESSING & COMBO MULTIPLIER
  // ==========================================
  function handleAnswer(selectedIndex) {
    if (isAnswered) return;
    isAnswered = true;

    if (!isSpeedRunBlitz) {
      stopTimer();
    }

    const timeTaken = Math.max(1, Math.round((Date.now() - questionStartTime) / 1000));
    const isCorrect = selectedIndex === currentQuestion.correctIndex;
    const prevLevel = window.gamificationEngine.getLevelInfo(window.stateManager.state.stats.xp).level;

    // Highlight options
    const optionButtons = document.querySelectorAll('.option-btn');
    optionButtons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === currentQuestion.correctIndex) {
        btn.classList.add('correct');
      } else if (idx === selectedIndex) {
        btn.classList.add('wrong');
      }
    });

    if (isCorrect) {
      currentCombo += 1;
      if (currentCombo > maxRoundCombo) {
        maxRoundCombo = currentCombo;
      }

      window.soundFX.playCorrect();
      if (els.questionCard) els.questionCard.classList.add('bounce-win');

      // 🌸 Flower & Petal Rain + Success Banner
      if (window.confettiEngine && typeof window.confettiEngine.rainFlowers === 'function') {
        window.confettiEngine.rainFlowers(36);
      }

      if (currentCombo >= 3) {
        setTimeout(() => window.soundFX.playStreak(currentCombo), 200);
      }
    } else {
      currentCombo = 0;
      window.soundFX.playIncorrect();
      if (els.questionCard) els.questionCard.classList.add('shake');

      // 🥺 Sad Emoji Float & Encouragement Banner
      if (window.confettiEngine && typeof window.confettiEngine.rainSadEmojis === 'function') {
        window.confettiEngine.rainSadEmojis(14);
      }
    }

    updateComboBadge();

    // Calculate Arcade Score & XP with safe fallbacks
    let xpEarned = isCorrect ? 25 : 5;
    let pointsEarned = isCorrect ? 250 : 0;
    let coinsEarned = isCorrect ? 10 : 0;

    if (currentMode === 'brain_boss') {
      const user = (window.stateManager && window.stateManager.state && window.stateManager.state.profile.username) || '';
      if (isCorrect) {
        xpEarned = 500;
        pointsEarned = 5000;
        coinsEarned = 50;
        if (window.BrainBossEngine) {
          window.BrainBossEngine.markBossAttempted(user, true);
        }
        if (window.stateManager && typeof window.stateManager.unlockBadge === 'function') {
          window.stateManager.unlockBadge('boss_slayer');
        }
        setTimeout(() => {
          showBossSlayerCelebration();
        }, 500);
      } else {
        xpEarned = 15;
        pointsEarned = 50;
        coinsEarned = 0;
        if (window.BrainBossEngine) {
          window.BrainBossEngine.markBossAttempted(user, false);
        }
      }
    }

    try {
      if (currentMode !== 'brain_boss') {
        if (window.gamificationEngine) {
          const calcFn = window.gamificationEngine.calculateScore || window.gamificationEngine.calculateArcadeScore;
          if (typeof calcFn === 'function') {
            const scoreInfo = calcFn.call(
              window.gamificationEngine,
              isCorrect,
              timeRemaining,
              totalAllowedTime,
              currentCombo
            );
            if (scoreInfo) {
              xpEarned = scoreInfo.xpEarned || scoreInfo.totalXp || xpEarned;
              pointsEarned = (scoreInfo.totalPoints !== undefined) ? scoreInfo.totalPoints : (scoreInfo.totalXp ? scoreInfo.totalXp * 10 : pointsEarned);
              coinsEarned = (scoreInfo.coinsEarned !== undefined) ? scoreInfo.coinsEarned : coinsEarned;
            }
          }
        }

        if (isDoubleXpActive && isCorrect) {
          xpEarned *= 2;
          pointsEarned *= 2;
        }
      }

      roundScore += pointsEarned;
      roundXp += xpEarned;
      if (els.liveRoundScore) {
        els.liveRoundScore.textContent = `${roundXp} XP`;
      }

      // Record into persistent state
      if (window.stateManager && typeof window.stateManager.recordAnswer === 'function') {
        window.stateManager.recordAnswer(
          currentQuestion.category,
          isCorrect,
          timeTaken,
          pointsEarned,
          xpEarned,
          coinsEarned,
          currentCombo,
          currentMode
        );
      }

      // Check level up
      if (window.gamificationEngine && typeof window.gamificationEngine.getLevelInfo === 'function' && window.stateManager) {
        const newLvl = window.gamificationEngine.getLevelInfo(window.stateManager.state.stats.xp);
        if (newLvl && newLvl.level > prevLevel) {
          triggerLevelUp(newLvl);
        }
      }

      // Check event badges
      if (window.gamificationEngine && typeof window.gamificationEngine.checkBadges === 'function' && window.stateManager) {
        const newBadges = window.gamificationEngine.checkBadges(window.stateManager, {
          isCorrect,
          timeTaken,
          category: currentQuestion.category,
          mode: currentMode,
          combo: currentCombo
        });

        if (newBadges && newBadges.length > 0) {
          newBadges.forEach(b => {
            if (b) showToast(`Unlocked Event Badge: ${b.title} ${b.icon}`, 'achievement');
          });
          if (window.confettiEngine) window.confettiEngine.burst(50);
        }
      }

      updateHUD();
      updatePersonalStats();
      renderDashboardLeaderboard();
      renderLandingLeaderboard();
    } catch (err) {
      console.error('Scoring error handled safely:', err);
    }

    // ALWAYS reveal the solution drawer and NEXT button
    renderSolutionDrawer(isCorrect, xpEarned, pointsEarned, coinsEarned);
  }

  function handleTimeout() {
    if (isAnswered) return;
    showToast('Time expired! Combo reset.', 'normal');
    handleAnswer(-1);
  }

  function renderSolutionDrawer(isCorrect, xpEarned, pointsEarned, coinsEarned) {
    if (isCorrect) {
      els.resultStatusIcon.className = 'result-status-icon correct-icon';
      els.resultStatusIcon.textContent = '✓';
      if (currentMode === 'brain_boss') {
        els.resultHeadline.textContent = '👑 🗡️ BOSS CONQUERED!';
        els.resultSubtext.textContent = 'You proved yourself worthy of the Boss Slayer Badge! +500 XP Awarded!';
        els.tagBase.textContent = `+500 XP`;
        els.tagStreak.textContent = `🗡️ Boss Slayer Unlocked`;
        els.tagStreak.style.display = 'inline-block';
      } else {
        els.resultHeadline.textContent = '🎉 PERFECT!';
        els.resultSubtext.textContent = `+${xpEarned} XP • 🔥 COMBO ×${Math.max(1, currentCombo)}`;
        els.tagBase.textContent = `+${xpEarned} XP`;
        els.tagStreak.textContent = `🔥 ×${Math.max(1, currentCombo)} Combo`;
        els.tagStreak.style.display = 'inline-block';
      }
    } else {
      els.resultStatusIcon.className = 'result-status-icon wrong-icon';
      els.resultStatusIcon.textContent = '✕';
      if (currentMode === 'brain_boss') {
        els.resultHeadline.textContent = '👑 THE BOSS PREVAILED!';
        els.resultSubtext.textContent = 'The 90-second puzzle bested you. Refine your logic and try again!';
        els.tagBase.textContent = '+15 Effort XP';
        els.tagStreak.style.display = 'none';
      } else {
        els.resultHeadline.textContent = '😅 ALMOST!';
        els.resultSubtext.textContent = 'Keep going!';
        els.tagBase.textContent = '+5 Effort XP';
        els.tagStreak.style.display = 'none';
      }
    }

    // Solution strategy: revealed ONLY after answering
    if (currentQuestion && currentQuestion.contextBox) {
      els.questionContextBox.innerHTML = `
        <div class="solution-strategy-box">
          <div class="strategy-badge-label">💡 KEY STRATEGY</div>
          <div class="strategy-text">${currentQuestion.contextBox}</div>
        </div>
      `;
      els.questionContextBox.classList.remove('hidden');
    } else if (els.questionContextBox) {
      els.questionContextBox.classList.add('hidden');
    }

    els.explanationText.innerHTML = currentQuestion.explanation;

    // Show prominent solution drawer inside question card
    els.solutionDrawer.classList.remove('hidden');

    // Update NEXT button text on both buttons
    const isFinalQuestion = questionCountInRound >= maxQuestionsInRound;
    const btnHtml = isFinalQuestion 
      ? '<span>SEE FINAL RESULTS 🏆</span> <span class="btn-arrow-anim">→</span> <kbd class="btn-kbd">Space</kbd>' 
      : '<span>⚡ NEXT PUZZLE</span> <span class="btn-arrow-anim">→</span> <kbd class="btn-kbd">Space</kbd>';

    if (els.nextQuestionBtn) {
      els.nextQuestionBtn.innerHTML = btnHtml;
    }

    if (els.trayNextBtn) {
      els.trayNextBtn.innerHTML = btnHtml;
      els.trayNextBtn.classList.remove('hidden');
    }

    // Scroll smoothly into view
    els.solutionDrawer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function onNextButtonClicked() {
    if (questionCountInRound >= maxQuestionsInRound) {
      endRound();
    } else {
      loadNextQuestion();
    }
  }

  function endRound() {
    stopTimer();
    window.soundFX.playLevelUp();
    window.confettiEngine.burst(80);

    // Update results screen with clean numbers
    els.resScore.textContent = `${roundXp} XP`;
    els.resCombo.textContent = `×${maxRoundCombo}`;
    els.resRank.textContent = window.stateManager.state.stats.campusRank || '#1';

    // Daily Challenge completion reward
    if (currentMode === 'daily_challenge' && questionCountInRound >= 10) {
      window.stateManager.recordDailyCompletion();
      showToast('🔥 10/10 Challenge Complete! +300 XP & 50 Coins Awarded!', 'achievement');
    }

    // Daily Brain Boss completion
    if (currentMode === 'brain_boss') {
      updateBrainBossUI();
      if (roundXp >= 500) {
        showToast('🏆 👑 BOSS DEFEATED! 500 XP & Boss Slayer Badge Unlocked!', 'achievement');
      }
    }

    // Friend Duel comparison & score saving
    if (els.resDuelCard) {
      if (currentMode === 'friend_duel') {
        els.resDuelCard.classList.remove('hidden');
        const playerName = window.stateManager.state.profile.username || 'Student Player';
        const duelCode = activeDuelCode || (window.stateManager.state.friendDuel ? window.stateManager.state.friendDuel.duelCode : 'BRAIN-9448');

        const outcomeIcon = document.getElementById('duel-outcome-icon');
        const outcomeTitle = document.getElementById('duel-outcome-title');
        const outcomeDesc = document.getElementById('duel-outcome-desc');

        if (activeDuelTarget > 0) {
          if (roundScore > activeDuelTarget) {
            if (outcomeIcon) outcomeIcon.textContent = '🏆';
            if (outcomeTitle) outcomeTitle.textContent = 'YOU WON THE DUEL!';
            if (outcomeDesc) outcomeDesc.innerHTML = `You defeated <strong>${activeDuelChallenger}</strong>! <br>Your Score: <strong>${roundScore} pts</strong> vs ${activeDuelChallenger}: <strong>${activeDuelTarget} pts</strong>.`;
            if (window.confettiEngine && typeof window.confettiEngine.rainFlowers === 'function') {
              window.confettiEngine.rainFlowers(40);
            }
          } else if (roundScore === activeDuelTarget) {
            if (outcomeIcon) outcomeIcon.textContent = '🤝';
            if (outcomeTitle) outcomeTitle.textContent = "IT'S A DEAD TIE!";
            if (outcomeDesc) outcomeDesc.innerHTML = `Both scored exactly <strong>${roundScore} pts</strong>! Rematch needed.`;
          } else {
            if (outcomeIcon) outcomeIcon.textContent = '💔';
            if (outcomeTitle) outcomeTitle.textContent = `${activeDuelChallenger.toUpperCase()} WON THIS ROUND!`;
            if (outcomeDesc) outcomeDesc.innerHTML = `${activeDuelChallenger}: <strong>${activeDuelTarget} pts</strong> vs You: <strong>${roundScore} pts</strong>. Rematch them!`;
          }
        } else {
          // You set the benchmark!
          const duelStore = JSON.parse(localStorage.getItem('campus_friend_duels_v2') || '{}');
          duelStore[duelCode] = {
            creator: playerName,
            targetScore: roundScore,
            xp: roundXp,
            date: Date.now()
          };
          localStorage.setItem('campus_friend_duels_v2', JSON.stringify(duelStore));

          if (outcomeIcon) outcomeIcon.textContent = '🎯';
          if (outcomeTitle) outcomeTitle.textContent = `DUEL BENCHMARK SET: ${roundScore} PTS!`;
          if (outcomeDesc) outcomeDesc.innerHTML = `You scored <strong>${roundScore} pts</strong> in Duel ${duelCode}. Share the link to dare your friend to beat it!`;
        }
      } else {
        els.resDuelCard.classList.add('hidden');
      }
    }

    renderDashboardLeaderboard();
    showView('game-over-view');
  }

  // ==========================================
  // POWER-UPS
  // ==========================================
  function activate5050() {
    if (isAnswered) {
      showToast("Option already selected! Click NEXT PUZZLE →", "normal");
      return;
    }
    const inv = window.stateManager.state.inventory;
    if ((inv.fiftyFifty || 0) <= 0) {
      showToast("No 50:50 power-ups left!", "normal");
      return;
    }

    window.stateManager.usePowerup('fiftyFifty');
    window.soundFX.playPowerup();
    if (els.btn5050) {
      els.btn5050.classList.add('powerup-activated');
      setTimeout(() => els.btn5050.classList.remove('powerup-activated'), 400);
    }

    const wrongIndices = [0, 1, 2, 3].filter(idx => idx !== currentQuestion.correctIndex);
    const shuffledWrong = wrongIndices.sort(() => Math.random() - 0.5).slice(0, 2);

    shuffledWrong.forEach(idx => {
      const btn = document.getElementById(`opt-btn-${idx}`);
      if (btn) {
        btn.classList.add('eliminated');
        btn.disabled = true;
      }
    });

    updatePowerupCounts();
    showToast('✂️ 50:50 Activated: Two wrong answers removed!', 'normal');
  }

  function activateExtraTime() {
    if (isAnswered) {
      showToast("Option already selected! Click NEXT PUZZLE →", "normal");
      return;
    }
    const inv = window.stateManager.state.inventory;
    if ((inv.extraTime || 0) <= 0) {
      showToast("No extra time power-ups left!", "normal");
      return;
    }

    window.stateManager.usePowerup('extraTime');
    window.soundFX.playPowerup();
    if (els.btnTime) {
      els.btnTime.classList.add('powerup-activated');
      setTimeout(() => els.btnTime.classList.remove('powerup-activated'), 400);
    }

    timeRemaining += 20;
    totalAllowedTime += 20;
    updateTimerDisplay();
    updatePowerupCounts();
    showToast('⏱ +20 Seconds added to timer!', 'normal');
  }

  function activateHint() {
    if (els.hintBox) {
      const isVisible = !els.hintBox.classList.contains('hidden');
      if (isVisible) {
        els.hintBox.classList.add('hidden');
        return;
      }
    }

    const hintMsg = (currentQuestion && currentQuestion.hint) ? currentQuestion.hint : 'Analyze the pattern or logic carefully!';
    if (els.hintText) els.hintText.innerHTML = hintMsg;
    if (els.hintBox) els.hintBox.classList.remove('hidden');

    const inv = window.stateManager.state.inventory;
    if ((inv.hints || 0) > 0) {
      window.stateManager.usePowerup('hints');
    }

    window.soundFX.playPowerup();
    if (els.btnHint) {
      els.btnHint.classList.add('powerup-activated');
      setTimeout(() => els.btnHint.classList.remove('powerup-activated'), 400);
    }

    updatePowerupCounts();
    showToast('💡 Clue revealed below the question!', 'normal');
  }

  function activateSkip() {
    // If the user already answered, SKIP acts as an instant "Next Puzzle" shortcut!
    if (isAnswered) {
      onNextButtonClicked();
      return;
    }

    const inv = window.stateManager.state.inventory;
    if ((inv.skip || 0) <= 0) {
      showToast("No skips left! Select an option to proceed.", "normal");
      return;
    }

    window.stateManager.usePowerup('skip');
    window.soundFX.playPowerup();
    if (els.btnSkip) {
      els.btnSkip.classList.add('powerup-activated');
      setTimeout(() => els.btnSkip.classList.remove('powerup-activated'), 400);
    }

    updatePowerupCounts();
    showToast('⏭️ Puzzle Skipped without penalty!', 'normal');
    loadNextQuestion();
  }

  // ==========================================
  // LEVEL-UP CELEBRATION
  // ==========================================
  function triggerLevelUp(lvlInfo) {
    window.soundFX.playLevelUp();
    window.confettiEngine.burst(100);

    els.modalNewTier.textContent = `${lvlInfo.tier.toUpperCase()} (Lvl ${lvlInfo.level})`;
    els.modalTierDesc.textContent = lvlInfo.tierDesc;
    els.levelupModal.classList.remove('hidden');
  }

  // ==========================================
  // BOSS SLAYER CELEBRATION
  // ==========================================
  function showBossSlayerCelebration() {
    if (window.soundFX && typeof window.soundFX.playLevelUp === 'function') {
      window.soundFX.playLevelUp();
    }
    if (window.confettiEngine) {
      window.confettiEngine.burst(120);
      if (typeof window.confettiEngine.rainFlowers === 'function') {
        window.confettiEngine.rainFlowers(60);
      }
    }

    const modal = document.getElementById('boss-slayer-modal');
    if (modal) {
      modal.classList.remove('hidden');
    }
    showToast('🏆 🗡️ BOSS CONQUERED! Boss Slayer Badge & +500 XP Unlocked!', 'achievement');
  }


  // ==========================================
  // MODALS & HELPERS
  // ==========================================
  function openLeaderboardModal() {
    window.soundFX.playTick();
    window.leaderboardManager.renderTo(els.modalLeaderboardContainer, 'today', window.stateManager.state);
    els.leaderboardModal.classList.remove('hidden');

    // Live refresh from MongoDB: if an admin deleted a user, the modal updates instantly
    if (window.leaderboardManager && typeof window.leaderboardManager.fetchFromBackend === 'function') {
      window.leaderboardManager.fetchFromBackend(() => {
        window.leaderboardManager.renderTo(els.modalLeaderboardContainer, 'today', window.stateManager.state);
      });
    }
  }

  function closeLeaderboardModal() {
    els.leaderboardModal.classList.add('hidden');
  }

  function generateNewDuelCode() {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newCode = `BRAIN-${randomNum}`;
    if (window.stateManager && window.stateManager.state && window.stateManager.state.friendDuel) {
      window.stateManager.state.friendDuel.duelCode = newCode;
      window.stateManager.save();
    }
    const display = document.getElementById('modal-duel-code-display');
    if (display) display.textContent = newCode;
    const dashCode = document.getElementById('dashboard-duel-code');
    if (dashCode) dashCode.textContent = newCode;
    return newCode;
  }

  function openFriendDuelModal() {
    window.soundFX.playTick();
    generateNewDuelCode();
    const m = els.friendDuelModal || document.getElementById('friend-duel-modal');
    if (m) m.classList.remove('hidden');
  }

  function closeFriendDuelModal() {
    const m = els.friendDuelModal || document.getElementById('friend-duel-modal');
    if (m) m.classList.add('hidden');
  }

  function openRewardsModal() {
    window.soundFX.playTick();
    const s = window.stateManager.state;
    els.rewXpVal.textContent = s.stats.xp.toLocaleString();
    els.rewCoinsVal.textContent = (s.stats.coins || 50).toLocaleString();
    els.rewStreakVal.textContent = s.stats.streak;
    els.rewRankVal.textContent = s.stats.campusRank || '#4';

    const badges = window.gamificationEngine.badges;
    let html = '';
    badges.forEach(b => {
      const isUnlocked = s.unlockedBadges.includes(b.id);
      html += `
        <div class="badge-item ${isUnlocked ? 'unlocked' : 'locked'}">
          <div class="badge-icon">${b.icon}</div>
          <div class="badge-title">${b.title}</div>
          <div class="badge-desc">${b.desc}</div>
        </div>
      `;
    });
    els.modalBadgesGrid.innerHTML = html;
    els.rewardsModal.classList.remove('hidden');
  }

  function closeRewardsModal() {
    els.rewardsModal.classList.add('hidden');
  }

  function copyDuelLink() {
    const s = window.stateManager ? window.stateManager.state : null;
    const code = (s && s.friendDuel && s.friendDuel.duelCode) ? s.friendDuel.duelCode : 'BRAIN-4821';
    const name = (s && s.profile && s.profile.username) ? s.profile.username : 'Friend';
    const link = `${window.location.origin}${window.location.pathname}?duel=${code}&challenger=${encodeURIComponent(name)}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link).catch(() => {});
    }
    showToast(`Copied Challenge Link: ${code} 🚀 Send to your friend!`, 'achievement');
  }

  function copyOrShareDuelScore() {
    const s = window.stateManager ? window.stateManager.state : null;
    const code = activeDuelCode || (s && s.friendDuel && s.friendDuel.duelCode ? s.friendDuel.duelCode : 'BRAIN-4821');
    const name = (s && s.profile && s.profile.username) ? s.profile.username : 'Player';
    const score = roundScore || 0;
    const link = `${window.location.origin}${window.location.pathname}?duel=${code}&challenger=${encodeURIComponent(name)}&target=${score}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link).catch(() => {});
    }
    showToast(`Copied Challenge Link to beat your score (${score} pts)! 🚀`, 'achievement');
  }

  function showToast(message, type = 'normal') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // ==========================================
  // EVENT LISTENERS
  // ==========================================
  function setupEventListeners() {
    // 1. Landing Warrior Form
    if (els.warriorForm) {
      els.warriorForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const entered = els.warriorNameInput.value.trim();
        const name = entered || 'Student_Player';

        // Check if student is an existing/returning user before switching
        const isReturning = window.stateManager && typeof window.stateManager.isExistingStudent === 'function' && window.stateManager.isExistingStudent(name);

        window.stateManager.setUsername(name);

        // Immediately sync with the real leaderboard
        if (window.leaderboardManager) {
          window.leaderboardManager.syncUser(window.stateManager.state);
        }

        updateHUD();
        renderLandingLeaderboard();
        renderDashboardLeaderboard();
        updatePersonalStats();
        updateBrainBossUI(name);

        if (isReturning) {
          // Returning student: DO NOT play the welcome ceremony!
          if (window.welcomeCeremony && typeof window.welcomeCeremony.stop === 'function') {
            window.welcomeCeremony.stop();
          }
          if (window.soundFX && typeof window.soundFX.playPowerup === 'function') {
            window.soundFX.playPowerup();
          }
          showView('arcade-dashboard-view');
          const curPts = (window.stateManager.state && window.stateManager.state.stats) ? (window.stateManager.state.stats.bestScore || 0) : 0;
          showToast(`Welcome back, ${name}! Your ${curPts.toLocaleString()} PTS & belt are ready! 🥋⚡`, 'achievement');
        } else {
          // Brand NEW student: mark as entered and trigger Cinematic Welcome Ceremony
          if (window.stateManager && window.stateManager.state) {
            window.stateManager.state.hasEntered = true;
            window.stateManager.save();
          }

          // Trigger Cinematic Welcome Ceremony for first-time visitor
          if (window.welcomeCeremony && typeof window.welcomeCeremony.start === 'function') {
            if (els.landingView) els.landingView.classList.add('hidden');
            window.welcomeCeremony.start(name, () => {
              showView('arcade-dashboard-view');
              showToast(`Welcome to Campus Brain Battle, ${name}! 🧠⚡`, 'achievement');
            });
          } else {
            if (window.soundFX && typeof window.soundFX.playPowerup === 'function') {
              window.soundFX.playPowerup();
            }
            showView('arcade-dashboard-view');
            showToast(`Welcome to Campus Brain Battle, ${name}! 🧠⚡`, 'achievement');
          }
        }
      });
    }

    // Audio Buttons
    const toggleAudio = () => {
      const isEnabled = window.soundFX.toggle();
      els.audioBtnIcon.textContent = isEnabled ? '🔊' : '🔇';
      showToast(isEnabled ? 'Sound Effects Enabled' : 'Sound Effects Muted', 'normal');
    };

    if (els.landingAudioBtn) els.landingAudioBtn.addEventListener('click', toggleAudio);
    if (els.audioToggleBtn) els.audioToggleBtn.addEventListener('click', toggleAudio);

    // Dojo Home & Switch Student Navigation
    const goToLandingHome = () => {
      stopTimer();
      renderLandingLeaderboard();
      if (window.leaderboardManager && typeof window.leaderboardManager.fetchFromBackend === 'function') {
        window.leaderboardManager.fetchFromBackend(() => renderLandingLeaderboard());
      }
      const currentName = (window.stateManager && window.stateManager.state && window.stateManager.state.profile.username) || '';
      if (els.warriorNameInput) {
        els.warriorNameInput.value = currentName;
      }
      const resumeWrap = document.getElementById('landing-resume-wrap');
      const resumeName = document.getElementById('landing-resume-name');
      if (resumeWrap) {
        if (currentName) {
          resumeWrap.classList.remove('hidden');
          if (resumeName) resumeName.textContent = currentName;
        } else {
          resumeWrap.classList.add('hidden');
        }
      }
      showView('landing-view');
      showToast('Welcome to Dojo Home! Enter name to switch student.', 'normal');
    };

    // Dashboard Navigation
    if (els.brandHomeBtn) els.brandHomeBtn.addEventListener('click', goToLandingHome);
    if (els.navHomeBtn) els.navHomeBtn.addEventListener('click', goToLandingHome);
    const hudSwitchBtn = document.getElementById('hud-switch-btn');
    if (hudSwitchBtn) hudSwitchBtn.addEventListener('click', goToLandingHome);
    const landingResumeBtn = document.getElementById('landing-resume-btn');
    if (landingResumeBtn) {
      landingResumeBtn.addEventListener('click', () => {
        const inputVal = els.warriorNameInput ? els.warriorNameInput.value.trim() : '';
        const nameToUse = inputVal || (window.stateManager && window.stateManager.state && window.stateManager.state.profile.username) || 'Student_Player';
        if (window.stateManager) window.stateManager.setUsername(nameToUse);
        if (window.leaderboardManager) window.leaderboardManager.syncUser(window.stateManager.state);
        updateHUD();
        renderDashboardLeaderboard();
        updatePersonalStats();
        updateBrainBossUI(nameToUse);
        if (window.soundFX && typeof window.soundFX.playPowerup === 'function') {
          window.soundFX.playPowerup();
        }
        showView('arcade-dashboard-view');
        const curPts = (window.stateManager.state && window.stateManager.state.stats) ? (window.stateManager.state.stats.bestScore || 0) : 0;
        showToast(`Welcome back, ${nameToUse}! Your ${curPts.toLocaleString()} PTS are ready! 🥋⚡`, 'normal');
      });
    }

    // Live sync of resume button as user types warrior name
    if (els.warriorNameInput) {
      els.warriorNameInput.addEventListener('input', () => {
        const val = els.warriorNameInput.value.trim();
        const resumeWrap = document.getElementById('landing-resume-wrap');
        const resumeName = document.getElementById('landing-resume-name');
        if (val && window.stateManager && typeof window.stateManager.isExistingStudent === 'function' && window.stateManager.isExistingStudent(val)) {
          if (resumeWrap) resumeWrap.classList.remove('hidden');
          if (resumeName) resumeName.textContent = val;
        } else {
          const activeName = (window.stateManager && window.stateManager.state && window.stateManager.state.profile.username) || '';
          if (val && activeName && val.toLowerCase() === activeName.toLowerCase()) {
            if (resumeWrap) resumeWrap.classList.remove('hidden');
            if (resumeName) resumeName.textContent = activeName;
          } else {
            if (resumeWrap) resumeWrap.classList.add('hidden');
          }
        }
      });
    }

    const gameExitHomeBtn = document.getElementById('game-exit-home-btn');
    if (gameExitHomeBtn) gameExitHomeBtn.addEventListener('click', goToLandingHome);

    if (els.navQuickplayBtn) els.navQuickplayBtn.addEventListener('click', () => startGame('quick_play'));
    if (els.navLeaderboardBtn) els.navLeaderboardBtn.addEventListener('click', openLeaderboardModal);
    if (els.navRewardsBtn) els.navRewardsBtn.addEventListener('click', openRewardsModal);
    if (els.navDuelBtn) els.navDuelBtn.addEventListener('click', openFriendDuelModal);

    // Hero & Quick Play
    if (els.heroPlayBtn) els.heroPlayBtn.addEventListener('click', () => startGame('quick_play'));
    if (els.heroChallengeBtn) els.heroChallengeBtn.addEventListener('click', () => startGame('daily_challenge'));
    if (els.quickPlayBtn) els.quickPlayBtn.addEventListener('click', () => startGame('quick_play'));

    // Mode Mini-Game Cards
    if (els.modeCards) {
      els.modeCards.forEach(card => {
        card.addEventListener('click', () => {
          const mode = card.getAttribute('data-mode') || 'quick_play';
          startGame(mode);
        });
      });
    }

    // Today's Challenge, Mystery Puzzle & Friend Duel on Dashboard
    if (els.startDailyChallengeBtn) els.startDailyChallengeBtn.addEventListener('click', () => startGame('daily_challenge'));
    if (els.btnChallengeBoss) {
      els.btnChallengeBoss.addEventListener('click', () => {
        const user = (window.stateManager && window.stateManager.state && window.stateManager.state.profile.username) || '';
        if (window.BrainBossEngine) {
          if (window.BrainBossEngine.isBossDefeatedToday(user)) {
            showToast(`🗡️ ${user ? user : 'You'} have already defeated today's Brain Boss! Come back tomorrow!`, 'achievement');
            return;
          }
          if (window.BrainBossEngine.isBossAttemptedToday(user)) {
            showToast(`💀 ${user ? user : 'You'} already used your 1 attempt for today! Come back tomorrow!`, 'normal');
            return;
          }
        }
        startGame('brain_boss');
      });
    }
    if (els.mysteryUnlockBtn) {
      els.mysteryUnlockBtn.addEventListener('click', () => {
        if (window.soundFX && typeof window.soundFX.playPowerup === 'function') {
          window.soundFX.playPowerup();
        }
        if (window.confettiEngine && typeof window.confettiEngine.rainFlowers === 'function') {
          window.confettiEngine.rainFlowers(40);
        }
        showToast('🔓 MYSTERY PUZZLE UNLOCKED! Double XP Active!', 'achievement');
        isDoubleXpActive = true;
        startGame('brain_teaser');
      });
    }
    if (els.dashCopyCodeBtn) els.dashCopyCodeBtn.addEventListener('click', copyDuelLink);
    if (els.dashOpenDuelModalBtn) els.dashOpenDuelModalBtn.addEventListener('click', openFriendDuelModal);

    // Leaderboard button in HUD and Dashboard
    if (els.leaderboardToggleBtn) els.leaderboardToggleBtn.addEventListener('click', openLeaderboardModal);
    if (els.closeLeaderboardBtn) els.closeLeaderboardBtn.addEventListener('click', closeLeaderboardModal);
    const dashOpenLbBtn = document.getElementById('dash-open-lb-btn');
    if (dashOpenLbBtn) dashOpenLbBtn.addEventListener('click', openLeaderboardModal);

    if (els.leaderboardModal) {
      els.leaderboardModal.addEventListener('click', (e) => {
        if (e.target === els.leaderboardModal) closeLeaderboardModal();
      });
    }

    // Duel Modal & Actions
    if (els.closeDuelModalBtn) els.closeDuelModalBtn.addEventListener('click', closeFriendDuelModal);
    if (els.modalCopyLinkBtn) els.modalCopyLinkBtn.addEventListener('click', copyDuelLink);

    const startMyDuelBtn = document.getElementById('btn-start-my-duel');
    if (startMyDuelBtn) {
      startMyDuelBtn.onclick = (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        closeFriendDuelModal();
        const codeDisplay = document.getElementById('modal-duel-code-display');
        activeDuelCode = (codeDisplay ? codeDisplay.textContent.trim() : '') || 'BRAIN-9448';
        activeDuelTarget = 0;
        activeDuelChallenger = null;
        startGame('friend_duel');
      };
    }

    const refreshCodeBtn = document.getElementById('btn-refresh-duel-code');
    if (refreshCodeBtn) {
      refreshCodeBtn.onclick = (e) => {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        window.soundFX.playTick();
        const freshCode = generateNewDuelCode();
        showToast(`Generated new duel code: ${freshCode} 🎲`, 'normal');
      };
    }

    if (els.btnJoinDuel) {
      els.btnJoinDuel.addEventListener('click', () => {
        const raw = els.joinCodeInput ? els.joinCodeInput.value.trim() : '';
        if (!raw) {
          showToast('Please enter a duel code or paste a challenge link.', 'normal');
          return;
        }

        let code = raw.toUpperCase();
        let targetScore = 0;
        let challengerName = 'Friend';

        // Check if user pasted a full challenge URL
        if (raw.includes('duel=') || raw.includes('?')) {
          try {
            const urlStr = raw.startsWith('http') ? raw : `http://localhost/${raw}`;
            const urlObj = new URL(urlStr);
            const d = urlObj.searchParams.get('duel');
            if (d) code = d.toUpperCase();
            const t = urlObj.searchParams.get('target');
            if (t) targetScore = parseInt(t, 10);
            const c = urlObj.searchParams.get('challenger') || urlObj.searchParams.get('creator');
            if (c) challengerName = decodeURIComponent(c);
          } catch (e) {
            const m = raw.match(/duel=([a-zA-Z0-9_-]+)/i);
            if (m) code = m[1].toUpperCase();
          }
        }

        // Extract 4-digit or BRAIN-XXXX pattern
        const match = code.match(/BRAIN-\d+/i) || code.match(/\d{4}/) || code.match(/[A-Z0-9_-]{4,12}/i);
        if (match) {
          let matchedStr = match[0].toUpperCase();
          if (/^\d{4}$/.test(matchedStr)) matchedStr = `BRAIN-${matchedStr}`;
          code = matchedStr;
        }

        closeFriendDuelModal();
        activeDuelCode = code;

        // Check local storage for benchmark
        const duelStore = JSON.parse(localStorage.getItem('campus_friend_duels_v2') || '{}');
        const existing = duelStore[code];

        if (targetScore > 0) {
          activeDuelTarget = targetScore;
          activeDuelChallenger = challengerName;
          showToast(`⚔️ Challenging ${challengerName}! Target to beat: ${targetScore} pts!`, 'achievement');
        } else if (existing) {
          activeDuelTarget = existing.targetScore || 0;
          activeDuelChallenger = existing.creator || 'Friend';
          showToast(`⚔️ Challenging ${activeDuelChallenger}! Target to beat: ${activeDuelTarget} pts!`, 'achievement');
        } else {
          activeDuelTarget = 0;
          activeDuelChallenger = null;
          showToast(`Joined Duel ${code}! 5 Questions blitz!`, 'achievement');
        }

        startGame('friend_duel');
      });
    }

    // Duel Share buttons in results screen
    if (els.duelShareBtn) els.duelShareBtn.addEventListener('click', copyOrShareDuelScore);

    // Rewards Modal
    if (els.closeRewardsBtn) els.closeRewardsBtn.addEventListener('click', closeRewardsModal);
    if (els.rewardsModal) {
      els.rewardsModal.addEventListener('click', (e) => {
        if (e.target === els.rewardsModal) closeRewardsModal();
      });
    }

    // Level-up Modal
    if (els.levelupContinueBtn) {
      els.levelupContinueBtn.addEventListener('click', () => {
        if (els.levelupModal) els.levelupModal.classList.add('hidden');
      });
    }

    // Boss Slayer Celebration Modal
    const bossSlayerContinueBtn = document.getElementById('boss-slayer-continue-btn');
    if (bossSlayerContinueBtn) {
      bossSlayerContinueBtn.addEventListener('click', () => {
        const modal = document.getElementById('boss-slayer-modal');
        if (modal) modal.classList.add('hidden');
        updateHUD();
        updatePersonalStats();
        renderDashboardLeaderboard();
        updateBrainBossUI();
      });
    }

    // Playing Screen
    if (els.exitGameBtn) {
      els.exitGameBtn.addEventListener('click', () => {
        stopTimer();
        showView('arcade-dashboard-view');
      });
    }

    if (els.playBrandBtn) {
      els.playBrandBtn.addEventListener('click', () => {
        stopTimer();
        showView('arcade-dashboard-view');
      });
    }

    if (els.nextQuestionBtn) els.nextQuestionBtn.addEventListener('click', onNextButtonClicked);
    if (els.trayNextBtn) {
      els.trayNextBtn.addEventListener('click', onNextButtonClicked);
    }

    // Power-ups
    if (els.btn5050) els.btn5050.addEventListener('click', activate5050);
    if (els.btnTime) els.btnTime.addEventListener('click', activateExtraTime);
    if (els.btnHint) els.btnHint.addEventListener('click', activateHint);
    if (els.btnSkip) els.btnSkip.addEventListener('click', activateSkip);

    // Results / "One More Game" screen buttons
    if (els.resPlayAgainBtn) els.resPlayAgainBtn.addEventListener('click', () => startGame(currentMode));
    if (els.resNextChallengeBtn) els.resNextChallengeBtn.addEventListener('click', () => startGame('daily_challenge'));
    if (els.resViewLbBtn) els.resViewLbBtn.addEventListener('click', openLeaderboardModal);
    if (els.resDuelFriendBtn) els.resDuelFriendBtn.addEventListener('click', openFriendDuelModal);

    const goBackToDashboard = () => {
      stopTimer();
      updateHUD();
      updatePersonalStats();
      renderDashboardLeaderboard();
      updateBrainBossUI();
      showView('arcade-dashboard-view');
    };

    const resBackBtn = document.getElementById('res-back-to-dash-btn');
    if (resBackBtn) resBackBtn.addEventListener('click', goBackToDashboard);

    const resHomeBtn = document.getElementById('res-home-btn');
    if (resHomeBtn) resHomeBtn.addEventListener('click', goBackToDashboard);

    const resBrandLogo = document.getElementById('res-brand-logo-btn');
    if (resBrandLogo) resBrandLogo.addEventListener('click', goBackToDashboard);

    const resLandingHomeBtn = document.getElementById('res-landing-home-btn');
    if (resLandingHomeBtn) resLandingHomeBtn.addEventListener('click', goToLandingHome);

    const resExitHomeBottomBtn = document.getElementById('res-exit-home-bottom-btn');
    if (resExitHomeBottomBtn) resExitHomeBottomBtn.addEventListener('click', goToLandingHome);

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      // Modals escape
      if (e.key === 'Escape') {
        closeLeaderboardModal();
        closeFriendDuelModal();
        closeRewardsModal();
        els.levelupModal.classList.add('hidden');
        return;
      }

      // If in game play view
      if (!els.gamePlayView.classList.contains('hidden')) {
        if ((e.code === 'Space' || e.key === 'Enter') && isAnswered) {
          e.preventDefault();
          onNextButtonClicked();
          return;
        }

        if (!isAnswered) {
          let optIdx = -1;
          if (e.key === '1' || e.key.toLowerCase() === 'a') optIdx = 0;
          else if (e.key === '2' || e.key.toLowerCase() === 'b') optIdx = 1;
          else if (e.key === '3' || e.key.toLowerCase() === 'c') optIdx = 2;
          else if (e.key === '4' || e.key.toLowerCase() === 'd') optIdx = 3;

          if (optIdx !== -1) {
            const btn = document.getElementById(`opt-btn-${optIdx}`);
            if (btn && !btn.classList.contains('eliminated')) {
              handleAnswer(optIdx);
            }
          }
        }
      }
    });
  }

  // Launch!
  init();
});
