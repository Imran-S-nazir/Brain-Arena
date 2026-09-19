const fs = require('fs');

// Simple DOM Mock
const document = {
  createElement(tag) {
    return this.getElementById('mock-' + Math.random());
  },
  elements: {},
  getElementById(id) {
    if (!this.elements[id]) {
      this.elements[id] = {
        id,
        classList: {
          classes: new Set(),
          add(c) { this.classes.add(c); },
          remove(c) { this.classes.delete(c); },
          contains(c) { return this.classes.has(c); }
        },
        style: {},
        textContent: '',
        value: '',
        innerHTML: '',
        listeners: {},
        addEventListener(event, fn) {
          if (!this.listeners[event]) this.listeners[event] = [];
          this.listeners[event].push(fn);
        },
        click() {
          (this.listeners['click'] || []).forEach(fn => fn({ preventDefault: () => {} }));
        },
        querySelector() { return null; },
        querySelectorAll() { return []; }
      };
    }
    return this.elements[id];
  },
  querySelectorAll() { return []; },
  addEventListener() {},
  body: { appendChild() {} }
};

global.document = document;
global.window = {
  document,
  addEventListener() {},
  location: { origin: 'http://localhost:5500', pathname: '/index.html', search: '' },
  scrollTo() {},
  localStorage: {
    getItem: () => null,
    setItem: () => {}
  }
};
global.localStorage = global.window.localStorage;

// Load files
require('../js/state.js');
require('../js/audio.js');
require('../js/generators/logical.js');
require('../js/generators/quant.js');
require('../js/generators/abstract.js');
require('../js/generators/puzzles.js');
require('../js/gamification.js');
require('../js/leaderboard.js');
require('../js/confetti.js');

console.log('confettiEngine loaded:', !!global.window.confettiEngine);

// Run app.js
let domContentLoadedHandler = null;
global.document.addEventListener = (ev, handler) => {
  if (ev === 'DOMContentLoaded') domContentLoadedHandler = handler;
};

try {
  const appCode = fs.readFileSync('js/app.js', 'utf8');
  eval(appCode);
  console.log('app.js loaded');
  if (domContentLoadedHandler) {
    domContentLoadedHandler();
    console.log('DOMContentLoaded fired successfully!');
    
    // Now simulate clicking btnStartMyDuel
    const btn = document.getElementById('btn-start-my-duel');
    console.log('btn-start-my-duel click listeners count:', (btn.listeners['click'] || []).length);
    btn.click();
    console.log('btn-start-my-duel clicked successfully!');
    
    // Check view state
    console.log('game-play-view hidden?:', document.getElementById('game-play-view').classList.contains('hidden'));
    console.log('friend-duel-modal hidden?:', document.getElementById('friend-duel-modal').classList.contains('hidden'));
  }
} catch (e) {
  console.error('Execution error:', e);
}
