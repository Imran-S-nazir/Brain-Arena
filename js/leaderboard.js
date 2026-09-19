/**
 * DIMAAG ARENA — 100% REAL DYNAMIC LEADERBOARD
 * NO hardcoded/fake players.
 * Only players who actually enter their name appear on the leaderboard.
 * Scores, XP, and ranks update live as players play the game.
 */

const LEADERBOARD_STORAGE_KEY = 'campus_battle_real_leaderboard_v7';

// Clear legacy dummy/stale data keys if present
[
  'campus_battle_real_leaderboard_v6',
  'campus_battle_real_leaderboard_v5',
  'dimaag_arena_event_leaderboard_v2',
  'campus_battle_real_leaderboard_v3',
  'dimaag_arena_leaderboard_v1'
].forEach(k => {
  try { localStorage.removeItem(k); } catch(e) {}
});

class LeaderboardManager {
  constructor() {
    this.storageKey = LEADERBOARD_STORAGE_KEY;
    this.data = this.loadData();
    this.currentTab = 'today';
    this.fetchFromBackend();

    // Live auto-sync: when window gains focus or every 4s, refresh from MongoDB
    if (typeof window !== 'undefined') {
      window.addEventListener('focus', () => this.fetchFromBackend());
      setInterval(() => this.fetchFromBackend(), 4000);
    }
  }

  async fetchFromBackend(callback) {
    try {
      const res = await fetch('/api/leaderboard');
      if (!res.ok) return;
      const json = await res.json();
      if (json && json.success && Array.isArray(json.users)) {
        const activeName = (window.stateManager && window.stateManager.state && window.stateManager.state.profile.username) ? 
          window.stateManager.state.profile.username.trim().toLowerCase() : '';

        const backendUsers = json.users.map(u => ({
          name: u.name,
          score: u.score || 0,
          xp: u.xp || 0,
          solved: u.solved || 0,
          belt: u.belt || 'White Belt',
          badges: u.badges || ['⚡'],
          isBossSlayer: !!u.isBossSlayer,
          isUser: activeName ? (u.name.trim().toLowerCase() === activeName) : false
        }));

        // MongoDB is the ONLY source of truth:
        // Any user deleted in MongoDB is completely removed from the leaderboard!
        this.data.today = [...backendUsers];
        this.data.overall = [...backendUsers];
        this.save();

        if (window.stateManager && typeof window.stateManager.pruneDeletedUsers === 'function') {
          window.stateManager.pruneDeletedUsers(json.users.map(u => u.name.toLowerCase()));
        }

        if (typeof callback === 'function') {
          callback(this.data);
        }

        // Automatically re-render any visible leaderboard elements
        if (typeof document !== 'undefined') {
          const landingEl = document.getElementById('landing-top-warriors');
          if (landingEl) {
            this.renderLandingLeaderboard(landingEl, window.stateManager ? window.stateManager.state : null);
          }
          const dashEl = document.getElementById('leaderboard-list-container');
          if (dashEl) {
            this.renderTo(dashEl, this.currentTab || 'today', window.stateManager ? window.stateManager.state : null);
          }
          const modalEl = document.getElementById('modal-leaderboard-container');
          if (modalEl && !modalEl.closest('.hidden')) {
            this.renderTo(modalEl, this.currentTab || 'today', window.stateManager ? window.stateManager.state : null);
          }
        }
      }
    } catch (e) {
      // Fallback to local storage if offline
    }
  }

  loadData() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.today) && Array.isArray(parsed.overall)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to read leaderboard from localStorage:', e);
    }
    return { today: [], overall: [] };
  }

  save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    } catch (e) {
      console.error('Failed to save leaderboard to localStorage:', e);
    }
  }

  // Sync active user's real name, score, and XP
  syncUser(userState) {
    if (!userState || !userState.profile) return;
    const rawName = userState.profile.username || '';
    const username = rawName.trim();
    if (!username) return;

    const userScore = (userState.stats && userState.stats.bestScore !== undefined) ? userState.stats.bestScore : 0;
    const userXp = (userState.stats && userState.stats.xp !== undefined) ? userState.stats.xp : 0;
    const userSolved = (userState.stats && userState.stats.totalSolved !== undefined) ? userState.stats.totalSolved : 0;

    ['today', 'overall'].forEach(timeframe => {
      let list = this.data[timeframe] || [];

      // Find by exact name
      const existingIdx = list.findIndex(p => p.name.toLowerCase() === username.toLowerCase());

      const isSlayer = (window.BrainBossEngine && typeof window.BrainBossEngine.isBossSlayer === 'function') ? 
                       window.BrainBossEngine.isBossSlayer(username) : false;

      if (existingIdx !== -1) {
        list[existingIdx].name = username;
        if (userScore > 0 || !list[existingIdx].score) {
          list[existingIdx].score = userScore;
        }
        if (userXp > 0 || !list[existingIdx].xp) {
          list[existingIdx].xp = userXp;
        }
        if (userSolved > 0 || !list[existingIdx].solved) {
          list[existingIdx].solved = userSolved;
        }
        list[existingIdx].isUser = true;
        list[existingIdx].isBossSlayer = isSlayer;
      } else {
        // Add new real student
        list.push({
          name: username,
          score: userScore,
          xp: userXp,
          solved: userSolved,
          badges: ['⚡'],
          isUser: true,
          isBossSlayer: isSlayer
        });
      }

      // Mark other users in list as not current user
      list.forEach(p => {
        if (p.name.toLowerCase() !== username.toLowerCase()) {
          p.isUser = false;
        }
      });

      // Sort by score descending
      list.sort((a, b) => b.score - a.score);
      this.data[timeframe] = list;
    });

    this.save();

    // Dynamically calculate user's real rank based on their standing
    const userRankToday = this.data.today.findIndex(p => p.name.toLowerCase() === username.toLowerCase()) + 1;
    if (userRankToday > 0 && userState.stats) {
      userState.stats.campusRank = `#${userRankToday}`;
    }
  }

  getRankings(timeframe = 'today', userState) {
    if (userState && userState.profile && userState.profile.username) {
      this.syncUser(userState);
    }
    const list = [...(this.data[timeframe] || this.data.today || [])];
    list.sort((a, b) => b.score - a.score);
    return list;
  }

  // Renders the Top Warriors on the Landing Page
  renderLandingLeaderboard(containerEl, userState) {
    if (!containerEl) return;
    const rankings = this.getRankings('today', userState);

    if (rankings.length === 0) {
      containerEl.innerHTML = `
        <div style="padding: 1.25rem; text-align: center; color: var(--text-secondary); font-size: 0.88rem; background: rgba(255,255,255,0.03); border-radius: 12px; border: 1px dashed rgba(255,255,255,0.1);">
          ⚡ Enter your name above to claim <strong>#1</strong> on the leaderboard!
        </div>
      `;
      return;
    }

    const medals = ['🥇', '🥈', '🥉', '4.', '5.'];
    let html = '';

    rankings.slice(0, 5).forEach((entry, idx) => {
      const isCurrentUser = !!entry.isUser;
      const medal = medals[idx] || `${idx + 1}.`;
      const displayName = entry.name;
      const scoreVal = entry.score || 0;

      const isSlayer = (window.BrainBossEngine && typeof window.BrainBossEngine.isBossSlayer === 'function') ?
                       window.BrainBossEngine.isBossSlayer(displayName) : false;
      const slayerBadgeHtml = isSlayer ? '<span class="boss-slayer-title-badge">🗡️ Boss Slayer</span>' : '';

      html += `
        <div class="warrior-rank-row ${isCurrentUser ? 'is-current-user' : ''}">
          <div class="warrior-rank-left">
            <span class="rank-medal">${medal}</span>
            <span class="warrior-name">${displayName}${slayerBadgeHtml} ${isCurrentUser ? '<span class="you-tag">YOU</span>' : ''}</span>
          </div>
          <div class="warrior-rank-right">
            <span class="warrior-xp">${scoreVal.toLocaleString()} PTS</span>
          </div>
        </div>
      `;
    });

    containerEl.innerHTML = html;
  }

  // Renders full leaderboard inside Dashboard or Modal
  renderTo(containerEl, timeframe = 'today', userState) {
    if (!containerEl) return;
    this.currentTab = timeframe;
    const rankings = this.getRankings(timeframe, userState);

    // Calculate real proximity to next rank or rank #1
    let proximityNoticeHtml = '';
    const userIndex = rankings.findIndex(p => p.isUser);
    if (userIndex > 0) {
      const targetPlayer = rankings[userIndex - 1];
      const targetRank = userIndex; // e.g. if user is at index 3 (Rank 4), target is Rank 3
      const targetXp = (targetPlayer.xp || targetPlayer.score || 0);
      const myXp = (rankings[userIndex].xp || rankings[userIndex].score || 0);
      const diffXp = Math.max(10, (targetXp - myXp) > 0 ? (targetXp - myXp) : 40);
      proximityNoticeHtml = `
        <div class="lb-proximity-pill">
          ⚡ You're <strong>${diffXp} XP</strong> away from Rank #${targetRank}!
        </div>
      `;
    } else if (userIndex === 0 && rankings.length > 1) {
      proximityNoticeHtml = `
        <div class="lb-proximity-pill" style="border-color: rgba(246, 196, 83, 0.4); background: rgba(246, 196, 83, 0.08); color: #F6C453;">
          👑 You're in <strong>Rank #1</strong>! Defend your campus crown!
        </div>
      `;
    } else if (rankings.length > 0) {
      const topPlayer = rankings[0];
      const myXp = userState && userState.stats ? (userState.stats.xp || 0) : 0;
      const diffXp = Math.max(25, (topPlayer.xp || 100) - myXp);
      proximityNoticeHtml = `
        <div class="lb-proximity-pill">
          ⚡ You're <strong>${diffXp} XP</strong> away from Rank #1!
        </div>
      `;
    }

    let html = `
      <div class="event-leaderboard-header">
        <div class="leaderboard-tabs">
          <button class="lb-tab-btn ${timeframe === 'today' ? 'active' : ''}" onclick="window.leaderboardManager.switchTab('today')">Today's Fest</button>
          <button class="lb-tab-btn ${timeframe === 'overall' ? 'active' : ''}" onclick="window.leaderboardManager.switchTab('overall')">Overall Event</button>
        </div>
      </div>
      ${proximityNoticeHtml}
      <div class="event-leaderboard-list">
    `;

    if (rankings.length === 0) {
      html += `
        <div style="padding: 2rem; text-align: center; color: var(--text-secondary); font-size: 0.95rem; background: rgba(255,255,255,0.02); border-radius: 14px; border: 1px dashed rgba(255,255,255,0.1);">
          🎯 No players have entered scores yet.<br>
          <strong style="color:#FF6F61;">Play a Quick Game</strong> to take the #1 spot!
        </div>
      `;
    } else {
      rankings.forEach((entry, idx) => {
        const rankNum = idx + 1;
        let rankBadge = `${rankNum}.`;
        let rowClass = entry.isUser ? 'user-rank-row is-current-user' : '';
        if (rankNum === 1) { rankBadge = '🥇'; rowClass += ' top-gold'; }
        else if (rankNum === 2) { rankBadge = '🥈'; rowClass += ' top-silver'; }
        else if (rankNum === 3) { rankBadge = '🥉'; rowClass += ' top-bronze'; }

        const isSlayer = (window.BrainBossEngine && typeof window.BrainBossEngine.isBossSlayer === 'function') ?
                         window.BrainBossEngine.isBossSlayer(entry.name) : false;
        const slayerBadgeHtml = isSlayer ? '<span class="boss-slayer-title-badge">🗡️ Boss Slayer</span>' : '';

        html += `
          <div class="event-rank-row ${rowClass}">
            <div class="rank-pos-col">
              <span class="rank-badge-icon">${rankBadge}</span>
            </div>
            <div class="rank-info-col">
              <div class="rank-player-row">
                <span class="rank-player-name">${entry.name}${slayerBadgeHtml} ${entry.isUser ? '<span class="you-tag">YOU</span>' : ''}</span>
                ${entry.isUser ? `<span class="rank-move-up">🔥 Live Rank #${rankNum}</span>` : ''}
              </div>
              <div class="rank-sub-details">
                <span>🧩 Solved: <strong>${entry.solved || 0}</strong></span>
                <span>⭐ <strong>${(entry.xp || 0).toLocaleString()} XP</strong></span>
              </div>
            </div>
            <div class="rank-score-col">
              <span class="event-score-val">${(entry.score || 0).toLocaleString()}</span>
              <span class="score-lbl">SCORE</span>
            </div>
          </div>
        `;
      });
    }

    html += `</div>`;
    containerEl.innerHTML = html;
  }

  switchTab(tabName) {
    this.currentTab = tabName;
    const container = document.getElementById('leaderboard-list-container');
    const modalContainer = document.getElementById('modal-leaderboard-container');
    const uState = (window.stateManager && window.stateManager.state) ? window.stateManager.state : null;

    if (container && uState) {
      this.renderTo(container, tabName, uState);
    }
    if (modalContainer && uState) {
      this.renderTo(modalContainer, tabName, uState);
    }
  }
}

window.leaderboardManager = new LeaderboardManager();
