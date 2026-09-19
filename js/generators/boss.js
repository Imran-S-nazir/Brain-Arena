/**
 * DAILY BRAIN BOSS GENERATOR
 * Each day features an extremely difficult, legendary master puzzle.
 * Timer: 90 Seconds.
 * Reward: +500 XP & "Boss Slayer" Badge.
 */

(function () {
  'use strict';

  const BOSS_PUZZLES = [
    {
      id: 'boss_zebra',
      bossName: 'Cerebrus, The Logic Architect',
      bossTitle: 'The Five Houses Zebra Deduction',
      categoryTitle: '👑 BRAIN BOSS RAID',
      subcategory: 'Master Deduction',
      difficulty: 'MASTER',
      timeLimit: 90,
      rewardXp: 500,
      statement: `Five colored houses (Red, Green, White, Yellow, Blue) stand in a row from left to right (positions 1 to 5):<br>
1. The Englishman lives in the Red house.<br>
2. The Spaniard owns the Dog.<br>
3. Coffee is drunk in the Green house.<br>
4. The Green house is to the immediate right of the White house.<br>
5. The sculptor owns snails.<br>
6. Milk is drunk in the middle (3rd) house.<br>
7. The Norwegian lives in the first (1st) house.<br>
8. The Norwegian lives next to the Blue house.<br>
9. The Japanese is a diplomat.`,
      prompt: 'Based on these logical constraints, in which color house does the Norwegian reside?',
      options: [
        'A. Yellow house',
        'B. Blue house',
        'C. White house',
        'D. Red house'
      ],
      correctIndex: 0,
      hint: 'The Norwegian is in House 1. House 2 must be Blue (adj to Norwegian). The Englishman is in Red, so House 1 cannot be Red. Green is right of White (so Green is 4 or 5). What remains for House 1?',
      explanation: 'Analysis: House 1 is Norwegian. House 2 must be Blue (clue 8). Green is immediately right of White, so White & Green must occupy houses (3,4) or (4,5). Since House 3 drinks Milk and Green drinks Coffee, (White, Green) must be (4, 5). House 1 is left for Yellow, and the Englishman is in Red (House 3). Hence, the Norwegian lives in the <strong>Yellow house</strong>!'
    },
    {
      id: 'boss_torch_bridge',
      bossName: 'Chronos, Keeper of the Chasm',
      bossTitle: 'The Midnight Abyss Bridge Crossing',
      categoryTitle: '👑 BRAIN BOSS RAID',
      subcategory: 'Extreme Constraint Optimization',
      difficulty: 'MASTER',
      timeLimit: 90,
      rewardXp: 500,
      statement: `Four travelers (A, B, C, D) must cross a narrow rope bridge at midnight with only one torch.<br>
- The bridge can hold at most 2 people simultaneously.<br>
- Any party crossing must carry the torch.<br>
- Walking speeds: A takes 1 min, B takes 2 min, C takes 7 min, D takes 10 min.<br>
- When two people cross together, they move at the slower traveler's pace.<br>
- The torch must be brought back across the bridge for the next crossing.`,
      prompt: 'What is the absolute MINIMUM total time (in minutes) for all four travelers to safely reach the other side?',
      options: [
        'A. 19 minutes',
        'B. 17 minutes',
        'C. 21 minutes',
        'D. 15 minutes'
      ],
      correctIndex: 1,
      hint: 'Sending the two slowest travelers (C and D) together saves time, but who should bring the torch back?',
      explanation: 'Step-by-step optimal strategy:<br>1. A & B cross forward = 2 min.<br>2. A returns with torch = 1 min.<br>3. C & D cross forward together = 10 min.<br>4. B returns with torch = 2 min.<br>5. A & B cross forward together = 2 min.<br>Total elapsed time: 2 + 1 + 10 + 2 + 2 = <strong>17 minutes</strong>.'
    },
    {
      id: 'boss_counterfeit_coins',
      bossName: 'The Alchemist King',
      bossTitle: 'The 12 Coin Balance Paradox',
      categoryTitle: '👑 BRAIN BOSS RAID',
      subcategory: 'Ternary Weighing Tree',
      difficulty: 'MASTER',
      timeLimit: 90,
      rewardXp: 500,
      statement: `You are given 12 identical-looking gold coins. Exactly one coin is counterfeit and has an abnormal weight (either heavier OR lighter than the 11 genuine coins, which all weigh identical amounts).<br>
You have a two-pan balance scale without numeric weights.`,
      prompt: 'What is the minimum number of balance scale weighings required to guarantee identifying the counterfeit coin AND determining whether it is heavier or lighter?',
      options: [
        'A. 2 weighings',
        'B. 3 weighings',
        'C. 4 weighings',
        'D. 5 weighings'
      ],
      correctIndex: 1,
      hint: 'A balance scale produces 3 distinct outcomes per weighing: left tilts, right tilts, or balances. How many states can 3 weighings distinguish?',
      explanation: 'With 3 weighings, a balance scale can distinguish 3³ = 27 unique outcomes. With 12 coins and 2 possible states (heavy or light), there are 12 × 2 = 24 possible states. Since 24 ≤ 27, dividing the coins into groups of 4 vs 4 allows 100% identification in exactly <strong>3 weighings</strong>.'
    },
    {
      id: 'boss_mislabeled_boxes',
      bossName: 'The Grand Inquisitor',
      bossTitle: 'The Three Mislabeled Vaults',
      categoryTitle: '👑 BRAIN BOSS RAID',
      subcategory: 'Deductive Elimination',
      difficulty: 'MASTER',
      timeLimit: 90,
      rewardXp: 500,
      statement: `You are in front of three sealed crates labeled:<br>
1. "APPLES ONLY"<br>
2. "ORANGES ONLY"<br>
3. "MIXED (APPLES & ORANGES)"<br>
You are explicitly guaranteed that <strong>EVERY SINGLE LABEL IS 100% FALSE</strong> (no crate contains what its label says). You are permitted to reach into exactly ONE crate with your eyes closed and draw out exactly ONE fruit.`,
      prompt: 'From which crate should you draw a fruit to definitively determine the true contents of all three crates?',
      options: [
        'A. The crate labeled "APPLES ONLY"',
        'B. The crate labeled "ORANGES ONLY"',
        'C. The crate labeled "MIXED (APPLES & ORANGES)"',
        'D. Any crate will work equally well'
      ],
      correctIndex: 2,
      hint: 'The label "MIXED" is false, so that crate CANNOT contain a mix. It must be 100% pure!',
      explanation: 'Draw from the crate labeled <strong>"MIXED"</strong>. Because every label is false, this crate must be purely Apples or purely Oranges. If you pull out an Apple, it is 100% Apples. Then the crate labeled "Oranges" cannot be Oranges (label is false) and cannot be Apples (already found), so it MUST be Mixed. The remaining crate labeled "Apples" must be Oranges. One draw solves all three!'
    },
    {
      id: 'boss_nim_21',
      bossName: 'Lord Ignis, Master of Paradoxes',
      bossTitle: 'The 21 Embers Game Theory',
      categoryTitle: '👑 BRAIN BOSS RAID',
      subcategory: 'Strategic Game Theory',
      difficulty: 'MASTER',
      timeLimit: 90,
      rewardXp: 500,
      statement: `Two grandmasters play a game with a single heap of 21 cursed coins.<br>
- Players take turns removing 1, 2, or 3 coins from the heap.<br>
- The player who is forced to take the very last coin LOSES the game (Misère Nim).<br>
- Both players play with flawless mathematical perfection.`,
      prompt: 'Which player has a mathematically guaranteed winning strategy, and how?',
      options: [
        'A. Player 1, by taking 1 coin on turn 1',
        'B. Player 1, by taking 2 coins on turn 1',
        'C. Player 1, by taking 3 coins on turn 1',
        'D. Player 2, regardless of Player 1’s first move'
      ],
      correctIndex: 3,
      hint: 'To force your opponent to take the 1st coin, you want to leave them with 1 coin. Work backward in intervals of (1 + 3) = 4 coins.',
      explanation: 'Key losing positions to face are those congruent to 1 (mod 4): 1, 5, 9, 13, 17, 21. Since the game begins at exactly 21 (= 4×5 + 1), Player 1 starts in a losing state! Whatever count k (1, 2, or 3) Player 1 removes, Player 2 responds by taking (4 - k) coins, always returning the pile to a 4m + 1 losing state. Hence, <strong>Player 2 has the guaranteed win</strong>.'
    },
    {
      id: 'boss_two_fuses',
      bossName: 'The Oracle of Delphi',
      bossTitle: 'The Non-Uniform Fuses of Time',
      categoryTitle: '👑 BRAIN BOSS RAID',
      subcategory: 'Temporal Measurement Paradox',
      difficulty: 'MASTER',
      timeLimit: 90,
      rewardXp: 500,
      statement: `You have two independent fuses (ropes) of varying thicknesses and materials.<br>
- Each fuse takes exactly 60 minutes to burn completely from one end to the other.<br>
- However, neither fuse burns at a constant rate (e.g., half the fuse might burn in 5 minutes, and the remaining half in 55 minutes).<br>
- You have a lighter, but no clock, ruler, or other timing device.`,
      prompt: 'How can you measure an exact interval of 45 minutes using these two fuses?',
      options: [
        'A. Light Fuse 1 at both ends and Fuse 2 at one end; when Fuse 1 finishes, light the other end of Fuse 2',
        'B. Cut Fuse 1 into 4 equal length sections and burn 3 sections sequentially',
        'C. Light both fuses at one end; when Fuse 1 reaches halfway, light its other end',
        'D. Light Fuse 1 for 30 minutes, extinguish it, then burn Fuse 2 completely'
      ],
      correctIndex: 0,
      hint: 'A fuse lit at BOTH ends burns twice as fast, expiring in exactly 60/2 = 30 minutes regardless of non-uniform density.',
      explanation: 'Optimal Protocol:<br>1. Light Fuse 1 at <strong>both ends</strong> (A & B) and Fuse 2 at <strong>one end</strong> (C) simultaneously.<br>2. When Fuse 1 burns out completely, exactly <strong>30 minutes</strong> have elapsed. At this precise instant, exactly 30 minutes of burn-life remains in Fuse 2.<br>3. Immediately light the other end (D) of Fuse 2. The remaining 30 minutes of fuse will now burn from both ends, lasting exactly <strong>15 minutes</strong>.<br>Total elapsed time: 30 + 15 = <strong>45 minutes</strong>.'
    },
    {
      id: 'boss_blue_eyes',
      bossName: 'The Sage of the Isolated Isle',
      bossTitle: 'The 100 Blue Eyes Common Knowledge Induction',
      categoryTitle: '👑 BRAIN BOSS RAID',
      subcategory: 'Common Knowledge Induction',
      difficulty: 'MASTER',
      timeLimit: 90,
      rewardXp: 500,
      statement: `On an isolated island live 100 perfectly rational logicians, all of whom have Blue eyes.<br>
- By ancient law, if any logician deduces their own eye color, they must leave the island on the midnight ferry.<br>
- There are no mirrors, reflective surfaces, or communication about eye colors.<br>
- Everyone sees that the other 99 logicians have blue eyes, but no one knows their own color.<br>
- A traveler arrives and announces to all residents: <em>"At least one person on this island has Blue eyes."</em>`,
      prompt: 'Assuming all 100 logicians reason with flawless mathematical deduction, what happens?',
      options: [
        'A. All 100 logicians leave on the 100th night',
        'B. Exactly one logician leaves on the 1st night',
        'C. No one ever leaves because everyone already saw at least 99 blue-eyed people',
        'D. All 100 logicians leave on the 1st night simultaneously'
      ],
      correctIndex: 0,
      hint: 'Use inductive proof: What would happen if there was only 1 blue-eyed person? What if there were 2?',
      explanation: 'By Mathematical Induction:<br>- Base Case k=1: The 1 blue-eyed person sees 0 others and leaves on Night 1.<br>- Case k=2: Each sees 1 blue-eyed person. When neither leaves on Night 1, both deduce k=2 and leave on Night 2.<br>- For k=100: The traveler’s statement creates <strong>Common Knowledge</strong> ("everyone knows that everyone knows..."). Through 99 days of non-departure, every logician eliminates all k < 100 possibilities.<br>On the <strong>100th night, all 100 leave simultaneously</strong>!'
    },
    {
      id: 'boss_hat_parity',
      bossName: 'The Cryptographer of Babel',
      bossTitle: 'The 100 Prisoners Hat Parity Theorem',
      categoryTitle: '👑 BRAIN BOSS RAID',
      subcategory: 'Parity Code Theory',
      difficulty: 'MASTER',
      timeLimit: 90,
      rewardXp: 500,
      statement: `100 prisoners are placed in a single-file line, all facing forward.<br>
- Each prisoner is randomly given a Red or Blue hat.<br>
- Prisoner 100 (at the very back) sees all 99 hats in front of them.<br>
- Prisoner 1 (at the front) sees no one.<br>
- Starting from the back (Prisoner 100), each must say only "Red" or "Blue". Any wrong guess leads to execution.<br>
- Prisoners may agree on a mutual strategy before lining up, but cannot communicate once lined up.`,
      prompt: 'What is the maximum number of prisoners whose survival can be mathematically guaranteed with 100% certainty?',
      options: [
        'A. Exactly 99 prisoners',
        'B. Exactly 50 prisoners',
        'C. Exactly 100 prisoners',
        'D. Exactly 75 prisoners'
      ],
      correctIndex: 0,
      hint: 'Prisoner 100 can encode the parity (odd/even count) of Red hats he sees in front of him using his single word.',
      explanation: 'Strategy:<br>1. Prisoner 100 counts all Red hats visible among the 99 prisoners in front. He says "Red" if the count is Odd, or "Blue" if Even. (Prisoner 100 has a 50% survival chance).<br>2. Prisoner 99 counts the Red hats in front of him. If the parity differs from what Prisoner 100 called, his own hat must be Red; if same, it is Blue. He is 100% saved.<br>3. Every subsequent prisoner continues subtracting known hat colors to maintain the parity equation.<br>Result: <strong>Exactly 99 prisoners are guaranteed 100% survival</strong>.'
    }
  ];

  function getActiveUsername(overrideUsername) {
    if (overrideUsername && typeof overrideUsername === 'string' && overrideUsername.trim()) {
      return overrideUsername.trim().toLowerCase();
    }
    if (typeof window !== 'undefined' && window.stateManager && window.stateManager.state && window.stateManager.state.profile && window.stateManager.state.profile.username) {
      const u = window.stateManager.state.profile.username.trim();
      if (u) return u.toLowerCase();
    }
    if (typeof document !== 'undefined') {
      const input = document.getElementById('warrior-name-input');
      if (input && input.value && input.value.trim()) {
        return input.value.trim().toLowerCase();
      }
    }
    return 'student_player';
  }

  function getUserBossHistory(username) {
    const user = getActiveUsername(username);
    try {
      const allHistory = JSON.parse(localStorage.getItem('boss_user_history_v2') || '{}');
      const record = allHistory[user] || {};
      return {
        lastSlainDate: record.lastSlainDate || null,
        attemptedQuestionIds: Array.isArray(record.attemptedQuestionIds) ? record.attemptedQuestionIds : [],
        solvedQuestionIds: Array.isArray(record.solvedQuestionIds) ? record.solvedQuestionIds : []
      };
    } catch (e) {
      return { lastSlainDate: null, attemptedQuestionIds: [], solvedQuestionIds: [] };
    }
  }

  function saveUserBossHistory(username, historyObj) {
    const user = getActiveUsername(username);
    try {
      const allHistory = JSON.parse(localStorage.getItem('boss_user_history_v2') || '{}');
      allHistory[user] = historyObj;
      localStorage.setItem('boss_user_history_v2', JSON.stringify(allHistory));
    } catch (e) {
      console.error('Failed to save boss history for user:', user, e);
    }
  }

  function getUserDailyRecord(username) {
    const user = getActiveUsername(username);
    const todayStr = new Date().toISOString().slice(0, 10);
    try {
      const all = JSON.parse(localStorage.getItem('boss_user_daily_v5') || '{}');
      const rec = all[user] || {};
      if (rec.date !== todayStr) {
        return { attempted: false, solved: false, date: todayStr, everSolved: !!rec.everSolved };
      }
      return rec;
    } catch (e) {
      return { attempted: false, solved: false, date: todayStr, everSolved: false };
    }
  }

  function saveUserDailyRecord(username, rec) {
    const user = getActiveUsername(username);
    try {
      const all = JSON.parse(localStorage.getItem('boss_user_daily_v5') || '{}');
      all[user] = rec;
      localStorage.setItem('boss_user_daily_v5', JSON.stringify(all));
    } catch (e) {
      console.error(e);
    }
  }

  // Exactly 1 boss question assigned per user per day
  function getTodayBoss(username) {
    const user = getActiveUsername(username);
    const todayStr = new Date().toISOString().slice(0, 10);
    let hash = 0;
    const seedStr = todayStr + '::' + user;
    for (let i = 0; i < seedStr.length; i++) {
      hash = (hash * 31 + seedStr.charCodeAt(i)) % BOSS_PUZZLES.length;
    }
    const boss = BOSS_PUZZLES[Math.abs(hash)];
    return { ...boss, todayDate: todayStr };
  }

  function isBossDefeatedToday(username) {
    const rec = getUserDailyRecord(username);
    return !!(rec.attempted && rec.solved);
  }

  function isBossAttemptedToday(username) {
    const rec = getUserDailyRecord(username);
    return !!rec.attempted;
  }

  function markBossAttempted(username, solved = false) {
    const user = getActiveUsername(username);
    const todayStr = new Date().toISOString().slice(0, 10);
    const rec = getUserDailyRecord(username);
    rec.attempted = true;
    rec.solved = !!solved;
    rec.date = todayStr;
    if (solved) rec.everSolved = true;
    saveUserDailyRecord(user, rec);
  }

  function markBossDefeatedForUser(username, puzzleId) {
    markBossAttempted(username, true);
  }

  function recordBossAttempt(username, puzzleId) {
    const user = getActiveUsername(username);
    const rec = getUserDailyRecord(user);
    rec.attempted = true;
    if (puzzleId) rec.puzzleId = puzzleId;
    saveUserDailyRecord(user, rec);
  }

  function advanceToNextBoss() {
    // Rotation is deterministic daily per user
  }

  function isBossSlayer(username) {
    const user = getActiveUsername(username);
    const rec = getUserDailyRecord(user);
    return !!(rec.everSolved || (rec.attempted && rec.solved));
  }

  window.BrainBossEngine = {
    getTodayBoss,
    isBossDefeatedToday,
    isBossAttemptedToday,
    markBossAttempted,
    recordBossAttempt,
    advanceToNextBoss,
    markBossDefeatedForUser,
    isBossSlayer,
    puzzles: BOSS_PUZZLES
  };
})();



