const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const scriptRegex = /<script src="([^"]+)"><\/script>/g;
let match;
const scripts = [];
while ((match = scriptRegex.exec(html)) !== null) {
  scripts.push(match[1]);
}
console.log('Scripts in index.html:', scripts);

scripts.forEach(s => {
  console.log(s, fs.existsSync(s) ? 'EXISTS' : 'MISSING!');
});

// Check if confetti.js is included
console.log('Is js/confetti.js included?', scripts.includes('js/confetti.js'));
