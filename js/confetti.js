/**
 * CAMPUS BRAIN BATTLE 2026 — CELEBRATION & REACTION ENGINE
 * 1. Flower & Petal Rain for Correct Answers (🌸 🌺 🌼 🌻 🌷 💐 ✨ 🎉)
 * 2. Playful Sad Emoji Animation for Wrong Answers (🥺 😢 💔 🌧️)
 * 3. Central Dynamic Reaction Pop-up Banner
 * 4. High-performance Canvas Particle Confetti
 */

class ConfettiEngine {
  constructor(canvasId = 'confetti-canvas') {
    this.canvas = document.getElementById(canvasId);
    this.ctx = (this.canvas && typeof this.canvas.getContext === 'function') ? this.canvas.getContext('2d') : null;
    this.particles = [];
    this.animationId = null;

    this.colors = [
      '#FF6F61', // Brand Coral
      '#F6C453', // Warm Gold
      '#10B981', // Emerald
      '#A855F7', // Violet
      '#EC4899', // Pink
      '#06B6D4'  // Cyan
    ];

    if (this.canvas) {
      this.resize();
      window.addEventListener('resize', () => this.resize());
    }

    this.createReactionContainer();
  }

  createReactionContainer() {
    let container = document.getElementById('feedback-reaction-overlay');
    if (!container) {
      container = document.createElement('div');
      container.id = 'feedback-reaction-overlay';
      container.className = 'feedback-reaction-overlay';
      document.body.appendChild(container);
    }
    this.overlay = container;
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  // Classic canvas particle burst
  burst(count = 60) {
    if (!this.canvas || !this.ctx) return;
    this.resize();

    const originX = window.innerWidth / 2;
    const originY = window.innerHeight * 0.4;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 4;
      this.particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        size: Math.random() * 6 + 4,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        opacity: 1,
        life: 1,
        decay: Math.random() * 0.015 + 0.012
      });
    }

    if (!this.animationId) {
      this.loop();
    }
  }

  loop() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.18; // gravity
      p.rotation += p.rotationSpeed;
      p.life -= p.decay;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.globalAlpha = Math.max(0, p.life);
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      this.animationId = requestAnimationFrame(() => this.loop());
    } else {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.animationId = null;
    }
  }

  // 🌸 FLOWER & PETALS RAIN FOR CORRECT ANSWER
  rainFlowers(count = 36) {
    this.burst(30); // Also fire celebratory confetti on canvas
    if (!this.overlay) this.createReactionContainer();

    const flowerEmojis = ['🌸', '🌺', '🌼', '🌷', '🌻', '💐', '✨', '🌸', '🌺'];

    for (let i = 0; i < count; i++) {
      const petal = document.createElement('div');
      petal.className = 'flower-rain-petal';
      petal.textContent = flowerEmojis[Math.floor(Math.random() * flowerEmojis.length)];

      const leftPercent = Math.random() * 96 + 2; // 2% to 98%
      const fontSize = Math.floor(Math.random() * 16 + 22); // 22px to 38px
      const duration = (Math.random() * 1.5 + 2.0).toFixed(2); // 2.0s to 3.5s
      const delay = (Math.random() * 0.4).toFixed(2);
      const swayOffset = Math.floor((Math.random() - 0.5) * 120);

      petal.style.left = `${leftPercent}vw`;
      petal.style.fontSize = `${fontSize}px`;
      petal.style.animationDuration = `${duration}s`;
      petal.style.animationDelay = `${delay}s`;
      petal.style.setProperty('--sway', `${swayOffset}px`);

      this.overlay.appendChild(petal);

      // Clean up after animation finishes
      setTimeout(() => {
        if (petal.parentNode) petal.parentNode.removeChild(petal);
      }, (parseFloat(duration) + parseFloat(delay) + 0.2) * 1000);
    }

    // Show popup
    this.showReactionBanner('correct');
  }

  // 🥺 SAD EMOJI REACTION FOR WRONG ANSWER
  rainSadEmojis(count = 14) {
    if (!this.overlay) this.createReactionContainer();

    const sadEmojis = ['🥺', '😢', '💔', '😭', '🥺', '🤦‍♂️', '🌧️'];

    for (let i = 0; i < count; i++) {
      const emojiEl = document.createElement('div');
      emojiEl.className = 'sad-rain-emoji';
      emojiEl.textContent = sadEmojis[Math.floor(Math.random() * sadEmojis.length)];

      // Concentrate mostly around center and question card area
      const leftPercent = Math.random() * 70 + 15; // 15% to 85%
      const fontSize = Math.floor(Math.random() * 16 + 26); // 26px to 42px
      const duration = (Math.random() * 1.0 + 1.6).toFixed(2); // 1.6s to 2.6s
      const delay = (Math.random() * 0.3).toFixed(2);
      const swayOffset = Math.floor((Math.random() - 0.5) * 60);

      emojiEl.style.left = `${leftPercent}vw`;
      emojiEl.style.fontSize = `${fontSize}px`;
      emojiEl.style.animationDuration = `${duration}s`;
      emojiEl.style.animationDelay = `${delay}s`;
      emojiEl.style.setProperty('--sway', `${swayOffset}px`);

      this.overlay.appendChild(emojiEl);

      setTimeout(() => {
        if (emojiEl.parentNode) emojiEl.parentNode.removeChild(emojiEl);
      }, (parseFloat(duration) + parseFloat(delay) + 0.2) * 1000);
    }

    // Show popup
    this.showReactionBanner('wrong');
  }

  // Central Dynamic Reaction Banner Popup
  showReactionBanner(type = 'correct') {
    if (!this.overlay) this.createReactionContainer();

    // Remove existing banner if any
    const existing = document.querySelector('.reaction-banner-popup');
    if (existing && existing.parentNode) {
      existing.parentNode.removeChild(existing);
    }

    const banner = document.createElement('div');
    banner.className = `reaction-banner-popup ${type}-banner`;

    if (type === 'correct') {
      const praises = [
        { icon: '🌸✨', text: 'SAHI JAWAB! 🎉' },
        { icon: '🌺🌟', text: 'SHABASH! BILKUL SAHI! ⚡' },
        { icon: '💐🎯', text: 'GENIUS MOVE! 🧠' },
        { icon: '🌻🔥', text: 'SUPER SHARP! 🚀' }
      ];
      const pick = praises[Math.floor(Math.random() * praises.length)];
      banner.innerHTML = `
        <span class="banner-icon">${pick.icon}</span>
        <span class="banner-title">${pick.text}</span>
      `;
    } else {
      const regrets = [
        { icon: '🥺💔', text: 'AREY! KOI NAHI, NEXT MEIN CRACK KARO! 💪' },
        { icon: '😢🌧️', text: 'SO CLOSE! BOHOT PAAS THE! 😉' },
        { icon: '🥺⚡', text: 'OOPS! KEEP GOING! 🔥' }
      ];
      const pick = regrets[Math.floor(Math.random() * regrets.length)];
      banner.innerHTML = `
        <span class="banner-icon">${pick.icon}</span>
        <span class="banner-title">${pick.text}</span>
      `;
    }

    this.overlay.appendChild(banner);

    // Fade out and remove after 1.8 seconds
    setTimeout(() => {
      banner.classList.add('fade-out');
      setTimeout(() => {
        if (banner.parentNode) banner.parentNode.removeChild(banner);
      }, 400);
    }, 1600);
  }
}

window.confettiEngine = new ConfettiEngine();
