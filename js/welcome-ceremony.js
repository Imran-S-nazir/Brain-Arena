/**
 * DIMAAG DOJO — CINEMATIC WELCOME CEREMONY ENGINE
 * Delivers a premium, theatrical event opening ceremony after student enters name.
 * Features:
 * - Word-by-word staggered reveal with scale, blur, and subtle soft glow
 * - Canvas-based Sakura / Flower & Petal rain with 3-stage dynamic intensity
 * - Dynamic student personalization ("Ready, Atul?")
 * - Interactive [ ENTER THE ARENA ⚡ ] CTA with smooth transition into Dashboard
 * - Secondary "Skip →" support
 */

class WelcomeCeremony {
  constructor() {
    this.stageEl = document.getElementById('welcome-ceremony-stage');
    this.canvas = document.getElementById('welcome-petals-canvas');
    this.ctx = (this.canvas && typeof this.canvas.getContext === 'function') ? this.canvas.getContext('2d') : null;
    this.phraseBox = document.getElementById('ceremony-phrase-box');
    this.subphraseBox = document.getElementById('ceremony-subphrase-box');
    this.emblemIcon = document.getElementById('ceremony-emblem-icon');
    this.emblemEl = document.getElementById('ceremony-emblem');
    this.ctaWrap = document.getElementById('ceremony-cta-wrap');
    this.enterArenaBtn = document.getElementById('btn-enter-arena');
    this.skipBtn = document.getElementById('ceremony-skip-btn');

    this.particles = [];
    this.animationFrameId = null;
    this.intensityStage = 1;
    this.targetCount = 16;
    this.wordTimers = [];
    this.isRunning = false;
    this.currentUsername = 'Warrior';
    this.onCompleteCallback = null;

    if (this.canvas) {
      this.resizeCanvas();
      window.addEventListener('resize', () => this.resizeCanvas());
    }

    if (this.enterArenaBtn) {
      this.enterArenaBtn.addEventListener('click', () => this.finish());
    }
    if (this.skipBtn) {
      this.skipBtn.addEventListener('click', () => this.skip());
    }
  }

  resizeCanvas() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  start(username, onComplete) {
    this.currentUsername = username || 'Warrior';
    this.onCompleteCallback = onComplete;
    this.clearTimers();
    this.isRunning = true;

    // Show ceremony stage
    if (this.stageEl) {
      this.stageEl.classList.remove('hidden', 'exiting');
    }

    // Reset components
    if (this.emblemEl) {
      this.emblemEl.classList.remove('pulse-brain');
    }
    if (this.emblemIcon) {
      this.emblemIcon.textContent = '🥋';
    }
    if (this.phraseBox) {
      this.phraseBox.innerHTML = '';
      this.phraseBox.classList.remove('phrase-transitioning');
    }
    if (this.subphraseBox) {
      this.subphraseBox.textContent = '';
      this.subphraseBox.classList.remove('revealed');
    }
    if (this.ctaWrap) {
      this.ctaWrap.classList.add('hidden');
      this.ctaWrap.classList.remove('revealed');
    }

    // Start Petals Canvas Engine (Stage 1: Subtle)
    this.intensityStage = 1;
    this.targetCount = 16;
    this.particles = [];
    this.resizeCanvas();
    this.startPetalsLoop();

    // Soft subtle chime if audio enabled
    if (window.soundFX && typeof window.soundFX.playCorrect === 'function') {
      window.soundFX.playCorrect(true);
    }

    // Run Stage 1 word-by-word animation
    this.runPhase1();
  }

  runPhase1() {
    if (!this.isRunning) return;
    this.intensityStage = 1;
    this.targetCount = 16;

    // Message 1: "Welcome to our Dimaag Dojo"
    const words = [
      { text: 'Welcome', style: '' },
      { text: 'to', style: '' },
      { text: 'our', style: '' },
      { text: 'Dimaag', style: 'word-gold' },
      { text: 'Dojo', style: 'word-gold' }
    ];

    this.renderWordByWord(words, 220, () => {
      // Pause 700ms then transition smoothly to Phase 2
      const t = setTimeout(() => {
        if (!this.isRunning) return;
        if (this.phraseBox) this.phraseBox.classList.add('phrase-transitioning');
        const t2 = setTimeout(() => this.runPhase2(), 400);
        this.wordTimers.push(t2);
      }, 700);
      this.wordTimers.push(t);
    });
  }

  runPhase2() {
    if (!this.isRunning) return;
    this.intensityStage = 2;
    this.targetCount = 32;

    if (this.phraseBox) {
      this.phraseBox.innerHTML = '';
      this.phraseBox.classList.remove('phrase-transitioning');
    }

    // Message 2: "Only brilliant minds are here to solve the puzzle."
    const words = [
      { text: 'Only', style: '' },
      { text: 'brilliant', style: 'word-cyan' },
      { text: 'minds', style: 'word-cyan' },
      { text: 'are', style: '' },
      { text: 'here', style: '' },
      { text: 'to', style: '' },
      { text: 'solve', style: '' },
      { text: 'the', style: '' },
      { text: 'puzzle.', style: 'word-gold' }
    ];

    this.renderWordByWord(words, 190, () => {
      // Pause 750ms then transition to Stage 3
      const t = setTimeout(() => {
        if (!this.isRunning) return;
        if (this.phraseBox) this.phraseBox.classList.add('phrase-transitioning');
        const t2 = setTimeout(() => this.runPhase3(), 400);
        this.wordTimers.push(t2);
      }, 750);
      this.wordTimers.push(t);
    });
  }

  runPhase3() {
    if (!this.isRunning) return;
    this.intensityStage = 3;
    this.targetCount = 55;

    // Celebratory audio chime
    if (window.soundFX && typeof window.soundFX.playLevelUp === 'function') {
      window.soundFX.playLevelUp();
    } else if (window.soundFX && typeof window.soundFX.playCorrect === 'function') {
      window.soundFX.playCorrect();
    }

    // Emblem morphs into glowing brain
    if (this.emblemIcon) this.emblemIcon.textContent = '🧠';
    if (this.emblemEl) this.emblemEl.classList.add('pulse-brain');

    if (this.phraseBox) {
      this.phraseBox.innerHTML = '';
      this.phraseBox.classList.remove('phrase-transitioning');

      // Personalized Welcome: "Ready, Atul?"
      const readySpan = document.createElement('span');
      readySpan.className = 'ceremony-word revealed';
      readySpan.textContent = 'Ready, ';

      const nameSpan = document.createElement('span');
      nameSpan.className = 'ceremony-word revealed word-gold';
      nameSpan.textContent = this.currentUsername;

      const qSpan = document.createElement('span');
      qSpan.className = 'ceremony-word revealed';
      qSpan.textContent = '?';

      this.phraseBox.appendChild(readySpan);
      this.phraseBox.appendChild(nameSpan);
      this.phraseBox.appendChild(qSpan);
    }

    if (this.subphraseBox) {
      this.subphraseBox.innerHTML = `Let's see what your dimaag can do. <strong>Your challenge awaits. 🧠</strong>`;
      setTimeout(() => {
        if (this.subphraseBox) this.subphraseBox.classList.add('revealed');
      }, 150);
    }

    // Reveal [ ENTER THE ARENA ⚡ ] CTA Button
    const t = setTimeout(() => {
      if (!this.isRunning) return;
      if (this.ctaWrap) {
        this.ctaWrap.classList.remove('hidden');
        this.ctaWrap.classList.add('revealed');
      }
    }, 400);
    this.wordTimers.push(t);
  }

  renderWordByWord(words, delayPerWord, onDone) {
    if (!this.phraseBox) return;
    this.phraseBox.innerHTML = '';

    const wordSpans = words.map(item => {
      const span = document.createElement('span');
      span.className = `ceremony-word ${item.style || ''}`.trim();
      span.textContent = item.text;
      this.phraseBox.appendChild(span);
      return span;
    });

    let currentIdx = 0;
    const step = () => {
      if (!this.isRunning) return;
      if (currentIdx < wordSpans.length) {
        wordSpans[currentIdx].classList.add('revealed');
        // Gentle tick sound for styled words
        if (words[currentIdx].style && window.soundFX && typeof window.soundFX.playTick === 'function') {
          window.soundFX.playTick();
        }
        currentIdx++;
        const t = setTimeout(step, delayPerWord);
        this.wordTimers.push(t);
      } else {
        if (typeof onDone === 'function') onDone();
      }
    };

    step();
  }

  skip() {
    this.clearTimers();
    this.runPhase3();
  }

  stop() {
    this.isRunning = false;
    this.clearTimers();
    this.stopPetalsLoop();
    if (this.stageEl) {
      this.stageEl.classList.add('hidden');
      this.stageEl.classList.remove('exiting');
    }
  }

  finish() {
    if (!this.isRunning) return;
    this.isRunning = false;
    this.clearTimers();

    if (window.soundFX && typeof window.soundFX.playPowerup === 'function') {
      window.soundFX.playPowerup();
    }

    if (this.stageEl) {
      this.stageEl.classList.add('exiting');
    }

    setTimeout(() => {
      this.stopPetalsLoop();
      if (this.stageEl) {
        this.stageEl.classList.add('hidden');
        this.stageEl.classList.remove('exiting');
      }
      if (typeof this.onCompleteCallback === 'function') {
        this.onCompleteCallback();
      }
    }, 550);
  }

  clearTimers() {
    this.wordTimers.forEach(t => clearTimeout(t));
    this.wordTimers = [];
  }

  // ==========================================
  // PETALS CANVAS RAIN ENGINE (60 FPS)
  // ==========================================
  startPetalsLoop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    const loop = () => {
      if (!this.isRunning) return;
      this.updateAndDrawPetals();
      this.animationFrameId = requestAnimationFrame(loop);
    };
    this.animationFrameId = requestAnimationFrame(loop);
  }

  stopPetalsLoop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.particles = [];
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  createPetal(fromTop = true) {
    const emojis = ['🌸', '🌺', '✨', '🌸', '🌸', '✨'];
    const pickedEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    const w = this.canvas ? this.canvas.width : window.innerWidth;
    const h = this.canvas ? this.canvas.height : window.innerHeight;

    return {
      x: Math.random() * w,
      y: fromTop ? -30 - Math.random() * 40 : Math.random() * h,
      size: Math.floor(Math.random() * 12) + 14, // 14px to 26px
      speedY: Math.random() * 1.5 + 1.2,
      swayAngle: Math.random() * Math.PI * 2,
      swaySpeed: Math.random() * 0.03 + 0.015,
      swayAmp: Math.random() * 2.2 + 1.2,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.03,
      opacity: Math.random() * 0.4 + 0.55,
      emoji: pickedEmoji
    };
  }

  updateAndDrawPetals() {
    if (!this.ctx || !this.canvas) return;
    const w = this.canvas.width;
    const h = this.canvas.height;

    this.ctx.clearRect(0, 0, w, h);

    // Maintain target count based on current intensity stage
    if (this.particles.length < this.targetCount) {
      this.particles.push(this.createPetal(true));
    } else if (this.particles.length > this.targetCount && this.intensityStage < 3) {
      this.particles.pop();
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      p.swayAngle += p.swaySpeed;
      p.x += Math.sin(p.swayAngle) * p.swayAmp;
      p.y += p.speedY;
      p.rotation += p.rotSpeed;

      // Bottom fade out
      let currentOpacity = p.opacity;
      if (p.y > h - 120) {
        currentOpacity = Math.max(0, p.opacity * ((h - p.y) / 120));
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rotation);
      this.ctx.globalAlpha = currentOpacity;
      this.ctx.font = `${p.size}px "Segoe UI Emoji", "Apple Color Emoji", sans-serif`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(p.emoji, 0, 0);
      this.ctx.restore();

      // Reset when falling out of view
      if (p.y > h + 35) {
        if (this.particles.length <= this.targetCount) {
          this.particles[i] = this.createPetal(true);
        } else {
          this.particles.splice(i, 1);
        }
      }
    }
  }
}

// Instantiate globally
window.welcomeCeremony = new WelcomeCeremony();
