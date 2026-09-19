/**
 * DIMAAG ARENA — ABSTRACT & PATTERN RECOGNITION PROCEDURAL GENERATOR
 * Generates dynamic Figure Series, Multi-Domain Odd-One-Out (Shapes, Numbers, Words, Letters),
 * and dynamic 3x3 Matrix Completion grids rendered in clean vector SVGs.
 */

const AbstractGenerator = {
  pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },

  shuffle(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  },

  randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  generate(difficulty = 'medium') {
    const types = ['figure_series', 'odd_one_out', 'matrix'];
    const chosenType = this.pick(types);

    switch (chosenType) {
      case 'figure_series':
        return this.generateFigureSeries(difficulty);
      case 'odd_one_out':
        return this.generateOddOneOut(difficulty);
      case 'matrix':
      default:
        return this.generateMatrix(difficulty);
    }
  },

  // Helper to render an SVG polygon with an internal arrow/dot
  renderShapeSvg(sides = 4, rotation = 0, dotPos = 0, color = '#38BDF8', size = 64) {
    const center = size / 2;
    const radius = size * 0.38;
    const points = [];

    for (let i = 0; i < sides; i++) {
      const angle = (i * (360 / sides) - 90 + rotation) * (Math.PI / 180);
      const px = center + radius * Math.cos(angle);
      const py = center + radius * Math.sin(angle);
      points.push(`${px.toFixed(1)},${py.toFixed(1)}`);
    }

    // Calculate dot position on one of the vertices
    const dotAngle = (dotPos * (360 / sides) - 90 + rotation) * (Math.PI / 180);
    const dotX = center + (radius * 0.65) * Math.cos(dotAngle);
    const dotY = center + (radius * 0.65) * Math.sin(dotAngle);

    return `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <polygon points="${points.join(' ')}" fill="rgba(56, 189, 248, 0.12)" stroke="${color}" stroke-width="2.5" stroke-linejoin="round"/>
        <circle cx="${dotX.toFixed(1)}" cy="${dotY.toFixed(1)}" r="4.5" fill="#F43F5E" />
      </svg>
    `;
  },

  // Render circle with concentric rings
  renderConcentricSvg(ringCount = 1, size = 64, color = '#8B5CF6') {
    const center = size / 2;
    let circles = '';
    for (let r = 1; r <= ringCount; r++) {
      const radius = (size * 0.4 / 4) * r;
      circles += `<circle cx="${center}" cy="${center}" r="${radius.toFixed(1)}" fill="none" stroke="${color}" stroke-width="2"/>`;
    }
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        ${circles}
        <circle cx="${center}" cy="${center}" r="3" fill="#F6C453" />
      </svg>
    `;
  },

  // Render quadrant circle with shaded segments
  renderQuadrantSvg(shadedCount = 1, size = 64) {
    const center = size / 2;
    const r = size * 0.38;
    const colors = ['#38BDF8', '#38BDF8', '#38BDF8', '#38BDF8'];
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <circle cx="${center}" cy="${center}" r="${r}" fill="none" stroke="#64748B" stroke-width="2"/>
        <line x1="${center - r}" y1="${center}" x2="${center + r}" y2="${center}" stroke="#64748B" stroke-width="1.5"/>
        <line x1="${center}" y1="${center - r}" x2="${center}" y2="${center + r}" stroke="#64748B" stroke-width="1.5"/>
        <text x="${center}" y="${center + 4}" font-size="12" font-weight="bold" fill="#F6C453" text-anchor="middle">${shadedCount}/4</text>
      </svg>
    `;
  },

  // 1. DYNAMIC FIGURE SERIES
  generateFigureSeries(difficulty) {
    const seriesType = this.pick(['rotation', 'side_progression', 'concentric']);

    if (seriesType === 'side_progression') {
      // 3 -> 4 -> 5 -> 6 -> [7]
      const startSides = this.pick([3, 4]);
      const seriesItems = [];
      for (let i = 0; i < 4; i++) {
        seriesItems.push(this.renderShapeSvg(startSides + i, 0, 0, '#38BDF8', 68));
      }

      const correctSides = startSides + 4;
      const correctSvg = this.renderShapeSvg(correctSides, 0, 0, '#38BDF8', 68);
      const wrongSvg1 = this.renderShapeSvg(correctSides - 1, 0, 0, '#38BDF8', 68);
      const wrongSvg2 = this.renderShapeSvg(correctSides + 1, 0, 0, '#38BDF8', 68);
      const wrongSvg3 = this.renderShapeSvg(startSides, 45, 0, '#38BDF8', 68);

      const optionsRaw = [
        { svg: correctSvg, isCorrect: true },
        { svg: wrongSvg1, isCorrect: false },
        { svg: wrongSvg2, isCorrect: false },
        { svg: wrongSvg3, isCorrect: false }
      ];
      const shuffled = this.shuffle(optionsRaw);
      const correctIndex = shuffled.findIndex(o => o.isCorrect);

      const visualHtml = `
        <div class="abstract-figure-row">
          ${seriesItems.map((svg, idx) => `
            <div class="abstract-figure-card">
              <span class="figure-label">Step ${idx + 1} (${startSides + idx} sides)</span>
              <div class="option-svg-wrap">${svg}</div>
            </div>
          `).join('')}
          <div class="abstract-figure-card" style="border: 2px dashed var(--accent-abstract);">
            <span class="figure-label" style="color: var(--accent-abstract);">Target (?)</span>
            <div class="matrix-cell target-cell" style="width:68px; height:68px;">?</div>
          </div>
        </div>
      `;

      return {
        category: 'what_next',
        categoryTitle: '🔮 What Comes Next?',
        subcategory: 'Polygon Edge Progression',
        difficulty,
        prompt: 'Analyze the polygon side count expansion in the sequence to predict the missing shape (?):',
        hint: `Count the outer edges of each polygon: ${startSides} → ${startSides + 1} → ${startSides + 2} → ${startSides + 3}...`,
        visualHtml,
        options: shuffled.map(o => `<div class="option-svg-wrap">${o.svg}</div>`),
        correctIndex,
        explanation: `Each subsequent step adds exactly one outer edge: <strong>${startSides} → ${startSides + 1} → ${startSides + 2} → ${startSides + 3} → ${correctSides} sides</strong>. The correct figure is the ${correctSides}-sided polygon.`
      };
    }

    if (seriesType === 'concentric') {
      const seriesItems = [];
      for (let i = 1; i <= 4; i++) {
        seriesItems.push(this.renderConcentricSvg(i, 68, '#8B5CF6'));
      }
      const correctSvg = this.renderConcentricSvg(5, 68, '#8B5CF6');
      const wrongSvg1 = this.renderConcentricSvg(3, 68, '#8B5CF6');
      const wrongSvg2 = this.renderConcentricSvg(4, 68, '#8B5CF6');
      const wrongSvg3 = this.renderConcentricSvg(6, 68, '#8B5CF6');

      const optionsRaw = [
        { svg: correctSvg, isCorrect: true },
        { svg: wrongSvg1, isCorrect: false },
        { svg: wrongSvg2, isCorrect: false },
        { svg: wrongSvg3, isCorrect: false }
      ];
      const shuffled = this.shuffle(optionsRaw);
      const correctIndex = shuffled.findIndex(o => o.isCorrect);

      const visualHtml = `
        <div class="abstract-figure-row">
          ${seriesItems.map((svg, idx) => `
            <div class="abstract-figure-card">
              <span class="figure-label">Step ${idx + 1} (${idx + 1} rings)</span>
              <div class="option-svg-wrap">${svg}</div>
            </div>
          `).join('')}
          <div class="abstract-figure-card" style="border: 2px dashed var(--accent-abstract);">
            <span class="figure-label" style="color: var(--accent-abstract);">Target (?)</span>
            <div class="matrix-cell target-cell" style="width:68px; height:68px;">?</div>
          </div>
        </div>
      `;

      return {
        category: 'what_next',
        categoryTitle: '🔮 What Comes Next?',
        subcategory: 'Concentric Layer Sequence',
        difficulty,
        prompt: 'Identify the rule governing the concentric rings to select the next figure in the progression:',
        hint: `Count the concentric circular rings surrounding the central core!`,
        visualHtml,
        options: shuffled.map(o => `<div class="option-svg-wrap">${o.svg}</div>`),
        correctIndex,
        explanation: `Each successive step adds +1 concentric circular shell (1 → 2 → 3 → 4 → <strong>5 rings</strong>).`
      };
    }

    // Default: rotation + vertex progression
    const sides = this.pick([3, 4, 5, 6]);
    const rotStep = this.pick([45, 60, 90]);
    const seriesItems = [];

    for (let i = 0; i < 4; i++) {
      const rot = i * rotStep;
      const dot = i % sides;
      seriesItems.push(this.renderShapeSvg(sides, rot, dot, '#38BDF8', 68));
    }

    const correctRot = 4 * rotStep;
    const correctDot = 4 % sides;
    const correctSvg = this.renderShapeSvg(sides, correctRot, correctDot, '#38BDF8', 68);

    const wrongSvg1 = this.renderShapeSvg(sides, correctRot + rotStep, correctDot, '#38BDF8', 68);
    const wrongSvg2 = this.renderShapeSvg(sides, correctRot, (correctDot + 2) % sides, '#38BDF8', 68);
    const wrongSvg3 = this.renderShapeSvg(sides, correctRot + 180, (correctDot + 1) % sides, '#38BDF8', 68);

    const optionsRaw = [
      { svg: correctSvg, isCorrect: true },
      { svg: wrongSvg1, isCorrect: false },
      { svg: wrongSvg2, isCorrect: false },
      { svg: wrongSvg3, isCorrect: false }
    ];

    const shuffled = this.shuffle(optionsRaw);
    const correctIndex = shuffled.findIndex(o => o.isCorrect);

    const visualHtml = `
      <div class="abstract-figure-row">
        ${seriesItems.map((svg, idx) => `
          <div class="abstract-figure-card">
            <span class="figure-label">Step ${idx + 1}</span>
            <div class="option-svg-wrap">${svg}</div>
          </div>
        `).join('')}
        <div class="abstract-figure-card" style="border: 2px dashed var(--accent-abstract);">
          <span class="figure-label" style="color: var(--accent-abstract);">Target (?)</span>
          <div class="matrix-cell target-cell" style="width:68px; height:68px;">?</div>
        </div>
      </div>
    `;

    return {
      category: 'what_next',
      categoryTitle: '🔮 What Comes Next?',
      subcategory: 'Geometric Figure Series',
      difficulty,
      prompt: 'Identify the rotation angle and vertex pointer progression to select the next figure in sequence:',
      hint: `Notice how the outer shape rotates by ${rotStep}° each step while the dot shifts to adjacent vertices!`,
      visualHtml,
      options: shuffled.map(o => `<div class="option-svg-wrap">${o.svg}</div>`),
      correctIndex,
      explanation: `1. The outer polygon rotates clockwise by <strong>${rotStep}°</strong> each step.<br>` +
        `2. The internal marker shifts sequentially to the next adjacent vertex.<br>` +
        `Combining both rules yields option <strong>${String.fromCharCode(65 + correctIndex)}</strong>.`
    };
  },

  // 2. MASSIVELY EXPANDED MULTI-DOMAIN ODD-ONE-OUT
  generateOddOneOut(difficulty) {
    const domain = this.pick(['geometric', 'number_prime', 'number_square', 'word_science', 'word_tech', 'letter_pattern']);

    // 2a. Geometric Shape Side Count Mismatch
    if (domain === 'geometric') {
      const targetSides = this.pick([3, 4, 5, 6]);
      const oddSides = targetSides === 3 ? 5 : targetSides - 1;

      const shapes = [
        { sides: targetSides, rot: 0, dot: 1 },
        { sides: targetSides, rot: 45, dot: 2 },
        { sides: targetSides, rot: 90, dot: 0 },
        { sides: oddSides, rot: 30, dot: 1 } // odd one
      ];

      const shuffled = this.shuffle(shapes);
      const correctIndex = shuffled.findIndex(s => s.sides === oddSides);

      const options = shuffled.map(s => {
        const svg = this.renderShapeSvg(s.sides, s.rot, s.dot, '#10B981', 64);
        return `<div class="option-svg-wrap">${svg}</div>`;
      });

      return {
        category: 'odds_ends',
        categoryTitle: '🎯 Odds & Ends',
        subcategory: 'Geometric Shape Classification',
        difficulty,
        prompt: 'Examine the 4 geometric figures below and pinpoint the single figure that violates the edge/vertex rule:',
        hint: `Count the outer polygon edges and vertices of each option carefully!`,
        options,
        correctIndex,
        explanation: `Three of the figures are <strong>${targetSides}-sided polygons</strong>, whereas option <strong>${String.fromCharCode(65 + correctIndex)}</strong> has <strong>${oddSides} sides</strong>, making it the odd one out.`
      };
    }

    // 2b. Number Theory: Prime Numbers vs Composite
    if (domain === 'number_prime') {
      const primes = [13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89];
      const composites = [15, 21, 27, 33, 35, 39, 45, 49, 51, 55, 57, 63, 65, 77, 81, 85, 91];

      const selectedPrimes = this.shuffle(primes).slice(0, 3);
      const selectedComposite = this.pick(composites);

      const items = [
        { val: selectedPrimes[0], isOdd: false },
        { val: selectedPrimes[1], isOdd: false },
        { val: selectedPrimes[2], isOdd: false },
        { val: selectedComposite, isOdd: true }
      ];

      const shuffled = this.shuffle(items);
      const correctIndex = shuffled.findIndex(i => i.isOdd);

      return {
        category: 'odds_ends',
        categoryTitle: '🎯 Odds & Ends',
        subcategory: 'Prime vs Composite Classification',
        difficulty,
        prompt: 'Four numbers are given below. Three share a fundamental mathematical property. Find the <strong>ODD ONE OUT</strong>:',
        contextBox: `Look for prime divisibility factors.`,
        hint: `Check if any number can be factored into two smaller integers!`,
        options: shuffled.map(i => `${i.val}`),
        correctIndex,
        explanation: `The numbers <strong>${selectedPrimes.join(', ')}</strong> are all <strong>Prime Numbers</strong> (divisible only by 1 and themselves), whereas <strong>${selectedComposite}</strong> is a composite number.`
      };
    }

    // 2c. Perfect Squares vs Non-Square
    if (domain === 'number_square') {
      const squarePool = [16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225];
      const nonSquarePool = [28, 45, 52, 72, 85, 96, 110, 130, 150, 180];

      const selectedSquares = this.shuffle(squarePool).slice(0, 3);
      const selectedNonSquare = this.pick(nonSquarePool);

      const items = [
        { val: selectedSquares[0], isOdd: false },
        { val: selectedSquares[1], isOdd: false },
        { val: selectedSquares[2], isOdd: false },
        { val: selectedNonSquare, isOdd: true }
      ];

      const shuffled = this.shuffle(items);
      const correctIndex = shuffled.findIndex(i => i.isOdd);

      return {
        category: 'odds_ends',
        categoryTitle: '🎯 Odds & Ends',
        subcategory: 'Square Number Classification',
        difficulty,
        prompt: 'Find the number that does NOT belong with the others in the group:',
        hint: `Take the square root of each number: which one is NOT an integer?`,
        options: shuffled.map(i => `${i.val}`),
        correctIndex,
        explanation: `The numbers <strong>${selectedSquares.join(', ')}</strong> are all <strong>Perfect Squares</strong> (${selectedSquares.map(s => Math.round(Math.sqrt(s)) + '²').join(', ')}), whereas <strong>${selectedNonSquare}</strong> is not a perfect square.`
      };
    }

    // 2d. Word Semantic: Science
    if (domain === 'word_science') {
      const scienceSets = [
        {
          group: 'Planets of the Solar System',
          items: ['Mars', 'Jupiter', 'Saturn'],
          odd: 'Pluto (Dwarf Planet / Sun)',
          oddVal: 'Pluto',
          logic: 'Mars, Jupiter, and Saturn are classified as major planets of the Solar System, while Pluto is classified by the IAU as a dwarf planet.'
        },
        {
          group: 'Noble Gases',
          items: ['Helium', 'Neon', 'Argon'],
          odd: 'Nitrogen (Diatomic Gas)',
          oddVal: 'Nitrogen',
          logic: 'Helium, Neon, and Argon are chemically inert Noble Gases (Group 18), whereas Nitrogen is a reactive diatomic non-metal (Group 15).'
        },
        {
          group: 'Mammalian Animals',
          items: ['Dolphin', 'Blue Whale', 'Bat'],
          odd: 'Crocodile (Reptile)',
          oddVal: 'Crocodile',
          logic: 'Dolphins, Whales, and Bats are all warm-blooded Mammals, whereas a Crocodile is a cold-blooded Reptile.'
        }
      ];

      const set = this.pick(scienceSets);
      const allOpts = [
        { name: set.items[0], isOdd: false },
        { name: set.items[1], isOdd: false },
        { name: set.items[2], isOdd: false },
        { name: set.oddVal, isOdd: true }
      ];
      const shuffled = this.shuffle(allOpts);
      const correctIndex = shuffled.findIndex(o => o.isOdd);

      return {
        category: 'odds_ends',
        categoryTitle: '🎯 Odds & Ends',
        subcategory: 'Scientific Domain Classification',
        difficulty,
        prompt: 'Identify the <strong>ODD ONE OUT</strong> among the following entities:',
        contextBox: `Identify the scientific category shared by 3 of the options.`,
        hint: `Think about biological classification or astronomical taxonomy!`,
        options: shuffled.map(o => o.name),
        correctIndex,
        explanation: set.logic
      };
    }

    // 2e. Word Semantic: Tech & Programming
    if (domain === 'word_tech') {
      const techSets = [
        {
          items: ['Python', 'Rust', 'TypeScript'],
          odd: 'HTML',
          logic: 'Python, Rust, and TypeScript are Turing-complete programming languages, whereas HTML is a declarative markup language.'
        },
        {
          items: ['PostgreSQL', 'MongoDB', 'Redis'],
          odd: 'Docker',
          logic: 'PostgreSQL, MongoDB, and Redis are database management systems, whereas Docker is a containerization platform.'
        },
        {
          items: ['Linux', 'macOS', 'Windows'],
          odd: 'Apache',
          logic: 'Linux, macOS, and Windows are Operating Systems, whereas Apache is a web server software.'
        }
      ];

      const set = this.pick(techSets);
      const allOpts = [
        { name: set.items[0], isOdd: false },
        { name: set.items[1], isOdd: false },
        { name: set.items[2], isOdd: false },
        { name: set.odd, isOdd: true }
      ];
      const shuffled = this.shuffle(allOpts);
      const correctIndex = shuffled.findIndex(o => o.isOdd);

      return {
        category: 'odds_ends',
        categoryTitle: '🎯 Odds & Ends',
        subcategory: 'Computer Science Classification',
        difficulty,
        prompt: 'Select the technical term that does NOT belong to the same category:',
        hint: `Check which item serves a fundamentally different purpose in software engineering.`,
        options: shuffled.map(o => o.name),
        correctIndex,
        explanation: set.logic
      };
    }

    // 2f. Letter Alphabet Pattern Skip
    // e.g. BDF (+2), GIK (+2), PRT (+2) vs LNP (+2) or JMR (+3)
    const validPats = ['BDF', 'GIK', 'MOQ', 'PRT', 'SUV'];
    const selectedNorms = this.shuffle(validPats).slice(0, 3);
    const oddPat = this.pick(['ACEG', 'JMR', 'WZB', 'KPT', 'DFI']);

    const letterOpts = [
      { code: selectedNorms[0], isOdd: false },
      { code: selectedNorms[1], isOdd: false },
      { code: selectedNorms[2], isOdd: false },
      { code: oddPat, isOdd: true }
    ];

    const shuffled = this.shuffle(letterOpts);
    const correctIndex = shuffled.findIndex(o => o.isOdd);

    return {
      category: 'odds_ends',
      categoryTitle: '🎯 Odds & Ends',
      subcategory: 'Alphabet Step Classification',
      difficulty,
      prompt: 'Find the letter cluster that does NOT follow the common letter-skip rule:',
      hint: `Count the alphabet gap between consecutive letters (+2 skip).`,
      options: shuffled.map(o => o.code),
      correctIndex,
      explanation: `Three of the letter groups advance by exactly +2 positions in the English alphabet (e.g. B → D → F), while <strong>${oddPat}</strong> violates this uniform interval.`
    };
  },

  // 3. DYNAMIC 3x3 MATRIX COMPLETION
  generateMatrix(difficulty) {
    const matrixMode = this.pick(['sides_rotation', 'dot_count', 'arithmetic_sum']);

    if (matrixMode === 'dot_count') {
      // 3x3 where cell (r, c) has (r + c + 1) dots
      const cells = [];
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          if (r === 2 && c === 2) continue; // target cell
          const dots = r + c + 1;
          cells.push(`
            <div class="matrix-cell" style="display:flex; flex-wrap:wrap; align-items:center; justify-content:center; gap:4px; width:54px; height:54px;">
              ${Array(dots).fill('<span style="width:8px; height:8px; background:#F59E0B; border-radius:50%;"></span>').join('')}
            </div>
          `);
        }
      }

      // target cell is r=2, c=2 => dots = 2 + 2 + 1 = 5 dots
      const targetDots = 5;
      const correctHtml = `5 Dots`;
      const wrong1 = `4 Dots`;
      const wrong2 = `6 Dots`;
      const wrong3 = `3 Dots`;

      const options = this.shuffle([correctHtml, wrong1, wrong2, wrong3]);

      const visualHtml = `
        <div class="abstract-matrix-grid">
          ${cells.map(c => c).join('')}
          <div class="matrix-cell target-cell">?</div>
        </div>
      `;

      return {
        category: 'what_next',
        categoryTitle: '🔮 What Comes Next?',
        subcategory: '3x3 Quantitative Element Matrix',
        difficulty,
        prompt: 'Identify the pattern of element count across rows and columns to find the contents of (?):',
        hint: `Check how many dots appear in Row 1 (1, 2, 3), Row 2 (2, 3, 4), and Row 3 (3, 4, ?).`,
        visualHtml,
        options,
        correctIndex: options.indexOf(correctHtml),
        explanation: `• Row 1: 1, 2, 3 dots (+1 each step)<br>` +
          `• Row 2: 2, 3, 4 dots (+1 each step)<br>` +
          `• Row 3: 3, 4, <strong>5 dots</strong>.<br>` +
          `The missing cell must contain exactly <strong>5 dots</strong>.`
      };
    }

    if (matrixMode === 'arithmetic_sum') {
      // Row 1: A, B, A+B
      // Row 2: C, D, C+D
      // Row 3: E, F, ? (E+F)
      const a = this.randInt(3, 8), b = this.randInt(4, 9);
      const c = this.randInt(5, 11), d = this.randInt(6, 12);
      const e = this.randInt(7, 15), f = this.randInt(8, 16);

      const gridNums = [
        a, b, a + b,
        c, d, c + d,
        e, f // target is e + f
      ];

      const ans = e + f;
      const options = this.shuffle([`${ans}`, `${ans - 2}`, `${ans + 3}`, `${ans + 5}`]);

      const visualHtml = `
        <div class="abstract-matrix-grid">
          ${gridNums.map(n => `<div class="matrix-cell" style="font-size:1.3rem; font-weight:800; color:#F6C453;">${n}</div>`).join('')}
          <div class="matrix-cell target-cell">?</div>
        </div>
      `;

      return {
        category: 'what_next',
        categoryTitle: '🔮 What Comes Next?',
        subcategory: '3x3 Numerical Operator Matrix',
        difficulty,
        prompt: 'Calculate the mathematical relationship across each row to find the missing number (?):',
        hint: `Notice the sum of the first two numbers in each row: ${a} + ${b} = ${a + b}!`,
        visualHtml,
        options,
        correctIndex: options.indexOf(`${ans}`),
        explanation: `Across every horizontal row, the third number is the sum of the first two numbers:<br>` +
          `• Row 1: ${a} + ${b} = ${a + b}<br>` +
          `• Row 2: ${c} + ${d} = ${c + d}<br>` +
          `• Row 3: ${e} + ${f} = <strong>${ans}</strong>.`
      };
    }

    // Default: geometric transformation matrix
    const startSides = this.pick([3, 4]);
    const rowSides = [startSides, startSides + 1, startSides + 2];
    const rotStep = this.pick([45, 90]);
    const colRotations = [0, rotStep, rotStep * 2];

    const matrixCells = [];
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (r === 2 && c === 2) continue;
        const svg = this.renderShapeSvg(rowSides[r], colRotations[c], c, '#F59E0B', 54);
        matrixCells.push(svg);
      }
    }

    const correctSvg = this.renderShapeSvg(rowSides[2], colRotations[2], 2, '#F59E0B', 54);
    const wrongSvg1 = this.renderShapeSvg(rowSides[1], colRotations[2], 2, '#F59E0B', 54);
    const wrongSvg2 = this.renderShapeSvg(rowSides[2], colRotations[1], 2, '#F59E0B', 54);
    const wrongSvg3 = this.renderShapeSvg(rowSides[2], colRotations[2], 0, '#F59E0B', 54);

    const optionsRaw = [
      { svg: correctSvg, isCorrect: true },
      { svg: wrongSvg1, isCorrect: false },
      { svg: wrongSvg2, isCorrect: false },
      { svg: wrongSvg3, isCorrect: false }
    ];

    const shuffled = this.shuffle(optionsRaw);
    const correctIndex = shuffled.findIndex(o => o.isCorrect);

    const visualHtml = `
      <div class="abstract-matrix-grid">
        ${matrixCells.map(svg => `<div class="matrix-cell">${svg}</div>`).join('')}
        <div class="matrix-cell target-cell">?</div>
      </div>
    `;

    return {
      category: 'what_next',
      categoryTitle: '🔮 What Comes Next?',
      subcategory: '3x3 Geometric Transform Matrix',
      difficulty,
      prompt: 'Observe the row (polygon edges) and column (rotation) transforms to find the missing figure (?):',
      hint: `Rows determine number of edges (${rowSides[0]} → ${rowSides[1]} → ${rowSides[2]}); columns rotate by ${rotStep}°.`,
      visualHtml,
      options: shuffled.map(o => `<div class="option-svg-wrap">${o.svg}</div>`),
      correctIndex,
      explanation: `• <strong>Row Pattern:</strong> Row 1 has ${rowSides[0]} sides, Row 2 has ${rowSides[1]} sides, Row 3 has <strong>${rowSides[2]} sides</strong>.<br>` +
        `• <strong>Column Pattern:</strong> Col 1 is at 0°, Col 2 is at ${colRotations[1]}°, Col 3 is rotated <strong>${colRotations[2]}°</strong>.<br>` +
        `Target cell: ${rowSides[2]}-sided polygon rotated ${colRotations[2]}° (Option <strong>${String.fromCharCode(65 + correctIndex)}</strong>).`
    };
  }
};

window.AbstractGenerator = AbstractGenerator;
