/**
 * DIMAAG ARENA — QUANTITATIVE APTITUDE PROCEDURAL GENERATOR
 * Generates dynamic Number Series (with interactive visual sequence tiles),
 * Percentages & Profit/Loss, Time-Speed-Distance, Time & Work, and Data Interpretation.
 */

const QuantGenerator = {
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
    const types = ['series', 'percent_profit', 'tsd', 'time_work', 'data_interpretation'];
    const chosenType = this.pick(types);

    switch (chosenType) {
      case 'series':
        return this.generateSeries(difficulty);
      case 'percent_profit':
        return this.generateProfitLoss(difficulty);
      case 'tsd':
        return this.generateSpeedDistance(difficulty);
      case 'time_work':
        return this.generateWorkTime(difficulty);
      case 'data_interpretation':
      default:
        return this.generateDataInterpretation(difficulty);
    }
  },

  // 1. DYNAMIC NUMBER SERIES (Interactive sequence tiles)
  generateSeries(difficulty) {
    const patterns = [
      'arithmetic_diff',
      'geometric_double',
      'alternating_op',
      'squares_offset',
      'cubes_offset',
      'fibonacci_like',
      'triangular'
    ];
    const pat = this.pick(patterns);

    let sequence = [];
    let answer = 0;
    let explanation = '';

    if (pat === 'arithmetic_diff') {
      const start = this.randInt(3, 15);
      const step = this.randInt(3, 7);
      let curr = start;
      sequence.push(curr);

      for (let i = 1; i <= 4; i++) {
        curr += step * i;
        sequence.push(curr);
      }
      answer = curr + (step * 5);
      explanation = `The difference between consecutive terms increases by <strong>+${step}</strong> each step (+${step}, +${step * 2}, +${step * 3}, +${step * 4}, +${step * 5}). Next term: ${curr} + ${step * 5} = <strong>${answer}</strong>.`;
    } else if (pat === 'geometric_double') {
      const start = this.randInt(2, 6);
      let curr = start;
      sequence.push(curr);
      for (let i = 0; i < 4; i++) {
        curr = curr * 2 + 1;
        sequence.push(curr);
      }
      answer = curr * 2 + 1;
      explanation = `Pattern: <strong>(Previous Term × 2) + 1</strong>. Next term: (${curr} × 2) + 1 = <strong>${answer}</strong>.`;
    } else if (pat === 'alternating_op') {
      const start = this.randInt(10, 25);
      const add = this.randInt(6, 12);
      const sub = this.randInt(2, 5);
      let curr = start;
      sequence.push(curr);

      for (let i = 0; i < 2; i++) {
        curr += add;
        sequence.push(curr);
        curr -= sub;
        sequence.push(curr);
      }
      answer = curr + add;
      explanation = `Alternating rule: <strong>+${add}, -${sub}, +${add}, -${sub}, +${add}</strong>. Next term: ${curr} + ${add} = <strong>${answer}</strong>.`;
    } else if (pat === 'squares_offset') {
      const offset = this.pick([-1, 1, 2]);
      const startN = this.randInt(2, 5);
      for (let n = startN; n <= startN + 4; n++) {
        sequence.push((n * n) + offset);
      }
      const targetN = startN + 5;
      answer = (targetN * targetN) + offset;
      explanation = `Pattern: <strong>n² ${offset >= 0 ? '+' : ''}${offset}</strong> for consecutive integers n=${startN} to ${targetN}. Target: ${targetN}² ${offset >= 0 ? '+' : ''}${offset} = ${targetN * targetN} ${offset >= 0 ? '+' : ''}${offset} = <strong>${answer}</strong>.`;
    } else if (pat === 'fibonacci_like') {
      const a = this.randInt(2, 6);
      const b = this.randInt(3, 7);
      sequence = [a, b, a + b, a + 2 * b, 2 * a + 3 * b];
      answer = (a + 2 * b) + (2 * a + 3 * b);
      explanation = `Fibonacci additive rule: each term is the sum of the two preceding terms. Next term: ${sequence[3]} + ${sequence[4]} = <strong>${answer}</strong>.`;
    } else {
      // Triangular numbers: n(n+1)/2
      const start = this.randInt(1, 3);
      for (let n = start; n < start + 5; n++) {
        sequence.push((n * (n + 1)) / 2);
      }
      const nTarget = start + 5;
      answer = (nTarget * (nTarget + 1)) / 2;
      explanation = `Triangular numbers: n(n+1)/2. For n=${nTarget}: (${nTarget} × ${nTarget + 1}) / 2 = <strong>${answer}</strong>.`;
    }

    const visualHtml = `
      <div class="quant-series-display">
        ${sequence.map(n => `<div class="series-tile">${n}</div>`).join('')}
        <div class="series-tile target-tile">?</div>
      </div>
    `;

    const d1 = answer + this.pick([2, 4, 6]);
    const d2 = answer - this.pick([2, 3, 5]);
    const d3 = answer + this.pick([8, 10, 12]);

    const options = this.shuffle([`${answer}`, `${d1}`, `${d2}`, `${d3}`]);

    return {
      category: 'what_next',
      categoryTitle: '🔮 What Comes Next?',
      subcategory: 'Procedural Number Series',
      difficulty,
      prompt: 'Uncover the mathematical law governing the sequence to determine the missing number (?):',
      hint: `Compute the first and second differences between adjacent tiles!`,
      visualHtml,
      options,
      correctIndex: options.indexOf(`${answer}`),
      explanation
    };
  },

  // 2. PROFIT & LOSS / PERCENTAGES
  generateProfitLoss(difficulty) {
    const cp = this.pick([200, 300, 400, 500, 800, 1000]);
    const profitPct = this.pick([10, 15, 20, 25, 30]);
    const sp = cp * (1 + profitPct / 100);

    const prompt = `A shopkeeper buys an electronic gadget for <strong>₹${cp}</strong> and sells it at a profit margin of <strong>${profitPct}%</strong>. What is the selling price?`;
    const correct = `₹${sp}`;
    const wrong1 = `₹${sp + 20}`;
    const wrong2 = `₹${cp + profitPct}`;
    const wrong3 = `₹${sp - 30}`;

    const options = this.shuffle([correct, wrong1, wrong2, wrong3]);

    return {
      category: 'speed_run',
      categoryTitle: '⚡ Quantitative Speed Run',
      subcategory: 'Commercial Arithmetic',
      difficulty,
      prompt,
      hint: `Selling Price = Cost Price × (1 + Profit% / 100).`,
      options,
      correctIndex: options.indexOf(correct),
      explanation: `Profit = ${profitPct}% of ₹${cp} = ₹${(cp * profitPct) / 100}.<br>` +
        `Selling Price = Cost Price + Profit = ₹${cp} + ₹${(cp * profitPct) / 100} = <strong>₹${sp}</strong>.`
    };
  },

  // 3. SPEED, TIME & DISTANCE (Trains & Harmonic Mean)
  generateSpeedDistance(difficulty) {
    const isHarmonic = Math.random() > 0.5;

    if (isHarmonic) {
      // Round trip average speed: 2xy / (x + y)
      // Pick numbers that yield integers, e.g. 20 and 30 => 24; 30 and 60 => 40; 40 and 60 => 48
      const pairs = [
        { v1: 20, v2: 30, avg: 24 },
        { v1: 30, v2: 60, avg: 40 },
        { v1: 40, v2: 60, avg: 48 },
        { v1: 12, v2: 24, avg: 16 }
      ];
      const p = this.pick(pairs);

      const prompt = `A commuter travels from City A to City B at a constant speed of <strong>${p.v1} km/h</strong> and returns along the same route at <strong>${p.v2} km/h</strong>. What is the average speed for the entire round trip?`;
      const correct = `${p.avg} km/h`;
      const wrong1 = `${(p.v1 + p.v2) / 2} km/h`; // common arithmetic mean trap!
      const wrong2 = `${p.avg + 4} km/h`;
      const wrong3 = `${p.avg - 3} km/h`;

      const options = this.shuffle([correct, wrong1, wrong2, wrong3]);

      return {
        category: 'speed_run',
        categoryTitle: '⚡ Quantitative Speed Run',
        subcategory: 'Harmonic Average Velocity',
        difficulty,
        prompt,
        contextBox: `Common Trap Alert: Average speed over equal distances is the Harmonic Mean, NOT the simple arithmetic average!`,
        hint: `Formula: Average Speed = (2 × V₁ × V₂) / (V₁ + V₂).`,
        options,
        correctIndex: options.indexOf(correct),
        explanation: `Since the distance in both directions is identical, average speed = <strong>2 × ${p.v1} × ${p.v2} / (${p.v1} + ${p.v2})</strong> = ${2 * p.v1 * p.v2} / ${p.v1 + p.v2} = <strong>${p.avg} km/h</strong> (not ${(p.v1 + p.v2) / 2} km/h).`
      };
    }

    // Train crossing stationary pole
    // Length = speed * time. Pick speeds like 54 km/h (15 m/s), 72 km/h (20 m/s), 90 km/h (25 m/s)
    const speeds = [
      { kmh: 54, ms: 15 },
      { kmh: 72, ms: 20 },
      { kmh: 90, ms: 25 },
      { kmh: 36, ms: 10 }
    ];
    const s = this.pick(speeds);
    const time = this.pick([10, 12, 15, 20]);
    const length = s.ms * time;

    const prompt = `A high-speed train travelling at a uniform speed of <strong>${s.kmh} km/h</strong> crosses a vertical signal post in exactly <strong>${time} seconds</strong>. What is the length of the train?`;
    const correct = `${length} meters`;
    const wrong1 = `${length + 50} meters`;
    const wrong2 = `${length - 30} meters`;
    const wrong3 = `${s.kmh * time} meters`;

    const options = this.shuffle([correct, wrong1, wrong2, wrong3]);

    return {
      category: 'speed_run',
      categoryTitle: '⚡ Quantitative Speed Run',
      subcategory: 'Relative Motion & Kinematics',
      difficulty,
      prompt,
      hint: `Convert km/h to m/s by multiplying by (5/18) first!`,
      options,
      correctIndex: options.indexOf(correct),
      explanation: `1. Speed in m/s = ${s.kmh} × (5/18) = <strong>${s.ms} m/s</strong>.<br>` +
        `2. Length of train = Speed × Time = ${s.ms} m/s × ${time} s = <strong>${length} meters</strong>.`
    };
  },

  // 4. TIME & WORK
  generateWorkTime(difficulty) {
    // Person A takes A days, B takes B days.
    // Clean pairs: A=10, B=15 => 6 days; A=12, B=24 => 8 days; A=20, B=30 => 12 days; A=15, B=30 => 10 days
    const pairs = [
      { a: 10, b: 15, days: 6 },
      { a: 12, b: 24, days: 8 },
      { a: 20, b: 30, days: 12 },
      { a: 15, b: 30, days: 10 }
    ];
    const p = this.pick(pairs);

    const prompt = `Dev can complete a programming project in <strong>${p.a} days</strong>, while Tanvi can complete the same project in <strong>${p.b} days</strong>. If both work together at their standard rates, in how many days will the project be completed?`;
    const correct = `${p.days} days`;
    const wrong1 = `${(p.a + p.b) / 2} days`;
    const wrong2 = `${p.days + 2} days`;
    const wrong3 = `${p.days - 2} days`;

    const options = this.shuffle([correct, wrong1, wrong2, wrong3]);

    return {
      category: 'speed_run',
      categoryTitle: '⚡ Quantitative Speed Run',
      subcategory: 'Collaborative Work Rates',
      difficulty,
      prompt,
      hint: `Formula: Combined Time = (A × B) / (A + B).`,
      options,
      correctIndex: options.indexOf(correct),
      explanation: `1. 1-day work of Dev = 1/${p.a}; 1-day work of Tanvi = 1/${p.b}.<br>` +
        `2. Combined 1-day work = 1/${p.a} + 1/${p.b} = (${p.a + p.b}) / (${p.a * p.b}) = 1/${p.days}.<br>` +
        `Total days required = <strong>${p.days} days</strong>.`
    };
  },

  // 5. DATA INTERPRETATION
  generateDataInterpretation(difficulty) {
    const students = ['Aarav', 'Ananya', 'Rohan'];
    const s1 = this.randInt(70, 95);
    const s2 = this.randInt(65, 90);
    const s3 = this.randInt(80, 98);

    const avg = Math.round((s1 + s2 + s3) / 3);

    const tableHtml = `
      <table style="width:100%; border-collapse:collapse; margin:0.75rem 0; font-size:0.9rem; text-align:center;">
        <tr style="background:rgba(255,255,255,0.08); border-bottom:1px solid rgba(255,255,255,0.15);">
          <th style="padding:0.5rem;">Student</th>
          <th style="padding:0.5rem;">AI Engineering Score</th>
        </tr>
        <tr style="border-bottom:1px solid rgba(255,255,255,0.08);">
          <td style="padding:0.4rem;">${students[0]}</td>
          <td style="padding:0.4rem; color:#38BDF8; font-weight:700;">${s1}</td>
        </tr>
        <tr style="border-bottom:1px solid rgba(255,255,255,0.08);">
          <td style="padding:0.4rem;">${students[1]}</td>
          <td style="padding:0.4rem; color:#38BDF8; font-weight:700;">${s2}</td>
        </tr>
        <tr>
          <td style="padding:0.4rem;">${students[2]}</td>
          <td style="padding:0.4rem; color:#38BDF8; font-weight:700;">${s3}</td>
        </tr>
      </table>
    `;

    const prompt = `Based on the scores table below, calculate the <strong>average score</strong> achieved across all three students (rounded to nearest integer):`;
    const correct = `${avg}`;
    const wrong1 = `${avg + 3}`;
    const wrong2 = `${avg - 4}`;
    const wrong3 = `${avg + 7}`;

    const options = this.shuffle([correct, wrong1, wrong2, wrong3]);

    return {
      category: 'speed_run',
      categoryTitle: '⚡ Quantitative Speed Run',
      subcategory: 'Tabular Data Interpretation',
      difficulty,
      prompt,
      visualHtml: tableHtml,
      hint: `Sum all 3 scores and divide by 3!`,
      options,
      correctIndex: options.indexOf(correct),
      explanation: `Total sum = ${s1} + ${s2} + ${s3} = ${s1 + s2 + s3}.<br>Average = ${s1 + s2 + s3} / 3 = <strong>${avg}</strong>.`
    };
  }
};

window.QuantGenerator = QuantGenerator;
