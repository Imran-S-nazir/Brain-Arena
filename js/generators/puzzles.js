/**
 * DIMAAG ARENA — PUZZLE & BRAIN TEASERS PROCEDURAL GENERATOR
 * Generates dynamic Clock Angles, Truth-Teller vs Liar, Balance Scale Logic,
 * Water Jug Paradoxes, River Crossings, Snail Wall Puzzles, Torch Bridges,
 * Age Equations, and Lateral Thinking Brain Teasers.
 */

const PuzzleGenerator = {
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
    const types = [
      'clock_angle',
      'truth_liar',
      'balance_puzzle',
      'water_jug',
      'river_crossing',
      'torch_bridge',
      'snail_wall',
      'age_logic',
      'matchstick_math',
      'riddle'
    ];
    const chosenType = this.pick(types);

    switch (chosenType) {
      case 'clock_angle':
        return this.generateClockAngle(difficulty);
      case 'truth_liar':
        return this.generateTruthLiar(difficulty);
      case 'balance_puzzle':
        return this.generateBalance(difficulty);
      case 'water_jug':
        return this.generateWaterJug(difficulty);
      case 'river_crossing':
        return this.generateRiverCrossing(difficulty);
      case 'torch_bridge':
        return this.generateTorchBridge(difficulty);
      case 'snail_wall':
        return this.generateSnailWall(difficulty);
      case 'age_logic':
        return this.generateAgeLogic(difficulty);
      case 'matchstick_math':
        return this.generateMatchstickMath(difficulty);
      case 'riddle':
      default:
        return this.generateRiddle(difficulty);
    }
  },

  // 1. CLOCK ANGLE FORMULA: |30*H - 5.5*M|
  generateClockAngle(difficulty) {
    const hours = this.randInt(1, 12);
    // Use minutes that give nice or clean decimal values: 0, 10, 15, 20, 24, 30, 40, 48
    const minutes = this.pick([0, 10, 15, 20, 24, 30, 36, 40, 48, 50]);

    const hourAngle = (30 * (hours % 12)) + (0.5 * minutes);
    const minuteAngle = 6 * minutes;
    let angle = Math.abs(hourAngle - minuteAngle);
    if (angle > 180) {
      angle = 360 - angle;
    }

    const angleStr = Number.isInteger(angle) ? `${angle}°` : `${angle.toFixed(1)}°`;
    const prompt = `What is the measure of the smaller angle between the hour hand and minute hand of a clock at <strong>${hours}:${minutes < 10 ? '0' + minutes : minutes}</strong>?`;

    const d1 = Number.isInteger(angle + 15) ? `${angle + 15}°` : `${(angle + 15).toFixed(1)}°`;
    const d2 = Number.isInteger(Math.abs(angle - 10)) ? `${Math.abs(angle - 10)}°` : `${Math.abs(angle - 10).toFixed(1)}°`;
    const d3 = Number.isInteger(angle + 30) ? `${angle + 30}°` : `${(angle + 30).toFixed(1)}°`;

    const options = this.shuffle([angleStr, d1, d2, d3]);

    return {
      category: 'brain_teaser',
      categoryTitle: '🧠 Brain Teasers',
      subcategory: 'Analog Clock Angle Geometry',
      difficulty,
      prompt,
      hint: `Recall: Hour hand moves 0.5° every minute; minute hand sweeps 6° every minute.`,
      contextBox: `Formula: θ = |30×H - 5.5×M|. If θ > 180°, reflex angle is 360° - θ.`,
      options,
      correctIndex: options.indexOf(angleStr),
      explanation: `1. Hour hand position: 30 × (${hours % 12}) + 0.5 × ${minutes} = <strong>${hourAngle}°</strong>.<br>` +
        `2. Minute hand position: 6 × ${minutes} = <strong>${minuteAngle}°</strong>.<br>` +
        `3. Absolute difference: |${hourAngle}° - ${minuteAngle}°| = <strong>${angleStr}</strong>.`
    };
  },

  // 2. TRUTH-TELLER VS LIAR PARADOXES
  generateTruthLiar(difficulty) {
    const names = ['Aarav', 'Kabir', 'Dev', 'Rohan', 'Tanvi', 'Isha'];
    const p1 = this.pick(names);
    const p2 = this.pick(names.filter(n => n !== p1));
    const p3 = this.pick(names.filter(n => n !== p1 && n !== p2));

    const scenarios = [
      {
        context: `Two guards stand at a fork in the road: Guard A and Guard B. One ALWAYS tells the truth, and the other ALWAYS lies. One path leads to the Trophy Hall and the other to a bottomless pit.`,
        question: `What single question can you ask Guard A to guarantee identifying the path to the Trophy Hall?`,
        correct: `"Which path would Guard B say leads to the Trophy Hall?" (then take the opposite path)`,
        wrong: [
          `"Are you the honest guard?"`,
          `"Does this path on the left lead to the Trophy Hall?"`,
          `"Which path would you take if you were heading home?"`
        ],
        logic: `If Guard A is truth-teller, Guard B would lie. If Guard A is liar, Guard A lies about Guard B's truthful answer. In both cases, the answer points to the wrong path. Taking the opposite path is 100% guaranteed!`
      },
      {
        context: `Three students — ${p1}, ${p2}, and ${p3} — make statements about who achieved the highest score:<br>• ${p1}: "${p2} scored the highest."<br>• ${p2}: "${p3} scored the highest."<br>• ${p3}: "I did not score the highest."<br>Exactly one student is telling the truth, and exactly one student had the highest score.`,
        question: `Who actually had the highest score?`,
        correct: `${p1}`,
        wrong: [`${p2}`, `${p3}`, `Cannot be determined`],
        logic: `If ${p3} had highest: ${p2} is truth, ${p3} is false (1 truth). But ${p1} also lied, wait: if ${p3} is highest, ${p3} said "I didn't" which is false, and ${p2} said "${p3} scored highest" which is true. But then ${p1} said "${p2} scored highest" which is false. That would mean ${p2} told truth. But what if ${p1} is highest? ${p1} lied, ${p2} lied, and ${p3} said "I did not score highest" which is TRUE. Exactly one truth! Hence, <strong>${p1}</strong> achieved the highest score.`
      },
      {
        context: `On the Island of Knights and Knaves, Knights always speak the truth and Knaves always lie. You meet two islanders, X and Y. Islander X states: "At least one of us is a Knave."`,
        question: `What are islanders X and Y?`,
        correct: `X is a Knight, Y is a Knave`,
        wrong: [
          `Both X and Y are Knights`,
          `Both X and Y are Knaves`,
          `X is a Knave, Y is a Knight`
        ],
        logic: `If X were a Knave, his statement "At least one of us is a Knave" would be a truth, which is a contradiction (Knaves cannot speak truth). Thus, X must be a <strong>Knight</strong> (telling the truth). Since the statement is true and X is a Knight, the other person Y must be the <strong>Knave</strong>.`
      },
      {
        context: `A suspect claims: "Everything I say today is a lie." What can be deduced about this statement?`,
        question: `What is the logical status of this statement?`,
        correct: `It is a self-referential logical paradox (Epimenides Paradox)`,
        wrong: [
          `The suspect is telling the absolute truth`,
          `The suspect is confirmed to be lying`,
          `The suspect has an accomplice`
        ],
        logic: `If the statement is true, then by its own definition it must be a lie (contradiction). If the statement is false, then he does not lie, meaning it is true (contradiction). This is the classic self-referential Liar Paradox.`
      }
    ];

    const s = this.pick(scenarios);
    const options = this.shuffle([s.correct, ...s.wrong]);

    return {
      category: 'puzzle_box',
      categoryTitle: '🧩 Puzzle Box',
      subcategory: 'Truth-Teller vs Liar Paradox',
      difficulty,
      prompt: s.question,
      contextBox: s.context,
      hint: `Analyze each possibility under Knight/Knave rules to check which one avoids contradiction.`,
      options,
      correctIndex: options.indexOf(s.correct),
      explanation: s.logic
    };
  },

  // 3. BALANCE WEIGHING SCALE (Dynamic ternary powers)
  generateBalance(difficulty) {
    const scales = [
      {
        count: 9,
        weighings: 2,
        explanation: `With a 2-pan balance scale, divide 9 coins into 3 groups of 3 (3, 3, 3).<br>Weighing 1: Weigh 3 vs 3. This pinpoints the heavy group of 3.<br>Weighing 2: From the heavy group, weigh 1 vs 1. 3² = 9, so exactly <strong>2 weighings</strong> are needed.`
      },
      {
        count: 27,
        weighings: 3,
        explanation: `Using ternary division (powers of 3): each weighing on a balance scale splits possibilities into 3 equal outcomes (Left heavy, Right heavy, or Balanced). Since 3³ = 27, exactly <strong>3 weighings</strong> are sufficient.`
      },
      {
        count: 81,
        weighings: 4,
        explanation: `Divide into 27, 27, 27. Each balance test eliminates two-thirds of candidates. Since 3⁴ = 81, exactly <strong>4 weighings</strong> are required.`
      },
      {
        count: 12,
        weighings: 3,
        explanation: `For 12 coins where 1 is defective (either heavier OR lighter), 3 weighings can distinguish up to 3³ = 27 states. 12 coins × 2 states = 24 states ≤ 27. Exactly <strong>3 weighings</strong> are required.`
      }
    ];

    const item = this.pick(scales);
    const correctAns = `${item.weighings} weighings`;
    const wrong1 = `${item.weighings - 1} weighings`;
    const wrong2 = `${item.weighings + 1} weighings`;
    const wrong3 = `${item.weighings + 2} weighings`;

    const options = this.shuffle([correctAns, wrong1, wrong2, wrong3]);

    return {
      category: 'puzzle_box',
      categoryTitle: '🧩 Puzzle Box',
      subcategory: 'Two-Pan Balance Logic',
      difficulty,
      prompt: `You have <strong>${item.count} visually identical coins</strong>. All weigh the same except 1 counterfeit coin that is slightly heavier. What is the MINIMUM number of weighings on a two-pan balance scale guaranteed to identify the counterfeit coin in the worst case?`,
      contextBox: `Ternary Logarithm Principle: A balance scale has 3 outcomes per weighing (left tilts, right tilts, or balanced).`,
      hint: `Think in powers of 3: 3¹ = 3, 3² = 9, 3³ = 27...`,
      options,
      correctIndex: options.indexOf(correctAns),
      explanation: item.explanation
    };
  },

  // 4. WATER JUG PROBLEM
  generateWaterJug(difficulty) {
    const jugs = [
      {
        j1: 3,
        j2: 5,
        target: 4,
        steps: 6,
        solution: `1. Fill 5L jug.<br>2. Pour 5L into 3L jug (leaving 2L in 5L jug).<br>3. Empty 3L jug.<br>4. Transfer 2L from 5L jug into 3L jug.<br>5. Fill 5L jug again.<br>6. Pour into 3L jug until full (+1L needed), leaving exactly <strong>4L</strong> in the 5L jug!`
      },
      {
        j1: 5,
        j2: 7,
        target: 6,
        steps: 8,
        solution: `Fill 7L jug, pour into 5L jug (2L left). Empty 5L, pour 2L into 5L. Fill 7L, pour into 5L until full (leaving 4L in 7L). Empty 5L, pour 4L into 5L. Fill 7L, pour 1L into 5L to fill it. 7L - 1L = <strong>6L</strong>!`
      },
      {
        j1: 4,
        j2: 9,
        target: 6,
        steps: 8,
        solution: `By repeating fill-and-pour cycles with 4L and 9L jugs (since gcd(4, 9) = 1), any integer volume from 1 to 9 can be measured accurately.`
      }
    ];

    const j = this.pick(jugs);
    const prompt = `You have an infinite supply of water and two unmarked jugs with capacities of <strong>${j.j1} Litres</strong> and <strong>${j.j2} Litres</strong>. Can you accurately measure exactly <strong>${j.target} Litres</strong>?`;

    const correct = `Yes, by filling and transferring water between jugs`;
    const wrong = [
      `No, because neither jug is an even multiple of ${j.target}L`,
      `No, only multiples of (${j.j1} + ${j.j2})L can be measured`,
      `Only possible if a third measuring vessel is provided`
    ];

    const options = this.shuffle([correct, ...wrong]);

    return {
      category: 'puzzle_box',
      categoryTitle: '🧩 Puzzle Box',
      subcategory: 'Diophantine Water Jug Riddle',
      difficulty,
      prompt,
      contextBox: `Bézout's Identity: Any volume d can be measured if and only if d is a multiple of gcd(A, B) and d ≤ max(A, B).`,
      hint: `Since gcd(${j.j1}, ${j.j2}) = 1, any integer volume between 1L and ${Math.max(j.j1, j.j2)}L is achievable!`,
      options,
      correctIndex: options.indexOf(correct),
      explanation: `Since gcd(${j.j1}, ${j.j2}) = 1 and ${j.target} ≤ ${Math.max(j.j1, j.j2)}, Bézout's identity guarantees that ${j.target}L is measurable.<br><br><strong>Step-by-step sequence:</strong><br>${j.solution}`
    };
  },

  // 5. RIVER CROSSING LOGISTICS
  generateRiverCrossing(difficulty) {
    const scenarios = [
      {
        title: 'Farmer, Fox, Goose, and Grain',
        prompt: `A farmer must transport a Fox, a Goose, and a bag of Grain across a river in a boat that can only hold the farmer and ONE item at a time. The Fox cannot be left alone with the Goose, and the Goose cannot be left alone with the Grain. What is the farmer's first essential step?`,
        correct: `Take the Goose across the river first`,
        wrong: [
          `Take the Fox across first`,
          `Take the Grain across first`,
          `Tie the Fox and Grain together`
        ],
        logic: `If the farmer takes Fox first, the Goose eats the Grain. If he takes Grain first, the Fox eats the Goose. Therefore, the farmer <strong>MUST take the Goose across first</strong>, leaving Fox and Grain safely together on the initial bank.`
      },
      {
        title: '3 Missionaries and 3 Cannibals',
        prompt: `3 Missionaries and 3 Cannibals must cross a river using a 2-person boat. At no point on either shore can the number of Cannibals exceed the number of Missionaries. What is the minimum number of one-way boat trips required?`,
        correct: `11 one-way trips`,
        wrong: [`7 one-way trips`, `9 one-way trips`, `13 one-way trips`],
        logic: `The optimal river-crossing sequence for 3 pairs with capacity 2 requires exactly <strong>11 trips</strong> to navigate the bottleneck where the number of cannibals must never exceed missionaries on either bank.`
      }
    ];

    const sc = this.pick(scenarios);
    const options = this.shuffle([sc.correct, ...sc.wrong]);

    return {
      category: 'puzzle_box',
      categoryTitle: '🧩 Puzzle Box',
      subcategory: 'River Crossing Constraint Logic',
      difficulty,
      prompt: sc.prompt,
      contextBox: `Constraint Satisfaction: Never leave mutually conflicting entities unattended together on either riverbank.`,
      hint: `Identify which pair can safely stay together unattended on the shore without any conflict.`,
      options,
      correctIndex: options.indexOf(sc.correct),
      explanation: sc.logic
    };
  },

  // 6. TORCH AND BRIDGE PUZZLE
  generateTorchBridge(difficulty) {
    const prompt = `Four night travelers (A, B, C, D) must cross a narrow rope bridge that can support at most 2 people at a time. They have only ONE torch, which must be carried across on every crossing. Their crossing times are: <strong>A: 1 min, B: 2 min, C: 5 min, D: 10 min</strong>. When two cross together, they move at the slower person's speed. What is the minimum total time for all 4 to cross?`;

    const correct = `17 minutes`;
    const wrong = [`19 minutes`, `21 minutes`, `15 minutes`];
    const options = this.shuffle([correct, ...wrong]);

    return {
      category: 'brain_teaser',
      categoryTitle: '🧠 Brain Teasers',
      subcategory: 'Torch & Bridge Optimization',
      difficulty,
      prompt,
      contextBox: `Key Strategy: Group the two slowest travelers (C and D) together so their times overlap, rather than wasting separate trips for both!`,
      hint: `Send the fastest two across first, return with the torch, then send the two slowest across together!`,
      options,
      correctIndex: options.indexOf(correct),
      explanation: `Optimal sequence:<br>` +
        `1. A & B cross (2 min, total: 2)<br>` +
        `2. A returns with torch (1 min, total: 3)<br>` +
        `3. C & D cross together (10 min, total: 13)<br>` +
        `4. B returns with torch (2 min, total: 15)<br>` +
        `5. A & B cross together (2 min, total: <strong>17 min</strong>).`
    };
  },

  // 7. SNAIL CLIMBING GREASY WALL
  generateSnailWall(difficulty) {
    const wallHeight = this.pick([20, 25, 30, 36]);
    const dayClimb = this.pick([3, 4, 5]);
    const nightSlide = dayClimb - 1; // net climb = 1m per day

    // Once snail reaches wallHeight during the daytime, it is OUT and does not slide!
    // Days needed = (wallHeight - dayClimb) / netClimb + 1 day
    const netClimb = dayClimb - nightSlide;
    const days = Math.ceil((wallHeight - dayClimb) / netClimb) + 1;

    const prompt = `A snail is at the bottom of a <strong>${wallHeight}-meter</strong> deep well. Each day, it climbs up <strong>${dayClimb} meters</strong> during the daytime, but slips down <strong>${nightSlide} meters</strong> while sleeping at night. On which day will the snail finally reach the top of the well and escape?`;

    const correct = `Day ${days}`;
    const wrong = [`Day ${wallHeight}`, `Day ${days + 2}`, `Day ${days - 2}`];
    const options = this.shuffle([correct, ...wrong]);

    return {
      category: 'brain_teaser',
      categoryTitle: '🧠 Brain Teasers',
      subcategory: 'Boundary Condition Logic',
      difficulty,
      prompt,
      contextBox: `Crucial Catch: Once the snail reaches the top rim during the daytime, it immediately climbs out and never slides down again!`,
      hint: `Calculate where the snail is on day ${days - 1} before its final daytime push!`,
      options,
      correctIndex: options.indexOf(correct),
      explanation: `Each full 24-hour cycle nets +${netClimb}m. At the end of Day ${days - 1}, the snail is at (${days - 1} × ${netClimb}m) = <strong>${(days - 1) * netClimb}m</strong>.<br>` +
        `On Day ${days}, it climbs +${dayClimb}m: ${(days - 1) * netClimb} + ${dayClimb} = <strong>${wallHeight}m</strong>, reaching the top rim before nightfall! Total: <strong>Day ${days}</strong>.`
    };
  },

  // 8. AGE LOGIC EQUATIONS
  generateAgeLogic(difficulty) {
    // Father is F years old, Son is S years old.
    // F = 3 * S. In Y years, (F + Y) = 2 * (S + Y)
    // 3S + Y = 2S + 2Y => S = Y.
    const sonAge = this.randInt(8, 16);
    const multiplier = 3;
    const fatherAge = sonAge * multiplier;
    const futureYears = sonAge; // because 3S + Y = 2(S + Y) => S = Y

    const prompt = `A father's current age is <strong>${multiplier} times</strong> the age of his daughter. In <strong>${futureYears} years</strong>, his age will be exactly <strong>twice</strong> his daughter's age. What is the daughter's current age?`;

    const correct = `${sonAge} years old`;
    const wrong = [
      `${sonAge + 4} years old`,
      `${sonAge - 3} years old`,
      `${sonAge + 6} years old`
    ];

    const options = this.shuffle([correct, ...wrong]);

    return {
      category: 'brain_teaser',
      categoryTitle: '🧠 Brain Teasers',
      subcategory: 'Algebraic Age Riddle',
      difficulty,
      prompt,
      contextBox: `Let daughter's current age = D. Then father's age = ${multiplier}D.`,
      hint: `Set up the equation: (${multiplier}D + ${futureYears}) = 2 × (D + ${futureYears}).`,
      options,
      correctIndex: options.indexOf(correct),
      explanation: `Let current age = D.<br>` +
        `Father = ${multiplier}D.<br>` +
        `In ${futureYears} years: ${multiplier}D + ${futureYears} = 2(D + ${futureYears}) = 2D + ${2 * futureYears}.<br>` +
        `${multiplier}D - 2D = ${2 * futureYears} - ${futureYears} → D = <strong>${sonAge} years old</strong>.`
    };
  },

  // 9. MATCHSTICK ARITHMETIC
  generateMatchstickMath(difficulty) {
    const puzzles = [
      {
        eq: '6 + 4 = 4',
        question: 'By moving exactly ONE matchstick, which valid mathematical equality can be formed from "6 + 4 = 4"?',
        correct: '0 + 4 = 4 (or 8 - 4 = 4)',
        wrong: ['5 + 4 = 9', '6 + 1 = 7', '6 - 2 = 4'],
        logic: 'Move the middle horizontal matchstick of "6" to turn it into "0", giving 0 + 4 = 4; alternatively, take the vertical matchstick from "+" to make it "-" and place it into "6" to make it "8", giving 8 - 4 = 4.'
      },
      {
        eq: '5 + 7 = 2',
        question: 'Move exactly ONE matchstick to make the equation "5 + 7 = 2" mathematically correct:',
        correct: '9 - 7 = 2',
        wrong: ['5 + 2 = 7', '6 + 1 = 7', '8 - 6 = 2'],
        logic: 'Remove the vertical stroke of the "+" sign to make it "-" and add it to the upper-right of "5" to transform it into "9": 9 - 7 = 2.'
      },
      {
        eq: 'VI - II = VII',
        question: 'In Roman numerals, move ONE matchstick to correct "VI - II = VII":',
        correct: 'Move one matchstick from VII to make it VI: V + I = VI (or VII - I = VI)',
        wrong: ['Change - to + without moving stick', 'Turn II into III', 'VI - I = V'],
        logic: 'Pick one stick from VII to leave VI, and turn the minus "-" into a plus "+": VI - II = VII transforms into V + II = VII or VII - I = VI.'
      }
    ];

    const p = this.pick(puzzles);
    const options = this.shuffle([p.correct, ...p.wrong]);

    return {
      category: 'puzzle_box',
      categoryTitle: '🧩 Puzzle Box',
      subcategory: 'Matchstick Spatial Math',
      difficulty,
      prompt: p.question,
      contextBox: `Initial Equation: <strong>${p.eq}</strong>`,
      hint: `Look at operational signs (+, -) or digital 7-segment numbers that can transform with 1 stroke.`,
      options,
      correctIndex: options.indexOf(p.correct),
      explanation: p.logic
    };
  },

  // 10. LATERAL THINKING RIDDLES
  generateRiddle(difficulty) {
    const riddles = [
      {
        prompt: `A scientist has two hourglass timers: one measures 7 minutes, and the other measures 4 minutes. How can she measure exactly 9 minutes using only these two timers?`,
        correct: `Start both; invert 4-min when it ends (t=4); when 7-min ends (t=7, 1 min left in 4-min timer), invert 7-min and let 4-min finish (1 min) + then restart 4-min timer.`,
        wrong: [
          `Run 7 min timer once and estimate half of the 4 min timer.`,
          `It is impossible with 7 and 4 minute timers.`,
          `Run 4 min timer twice and subtract 1 minute by eye.`
        ],
        logic: `Start both at t=0. At t=4, 4-min ends (3 min remain in 7-min). Invert 4-min immediately. At t=7, 7-min ends and 4-min has run 3 min (1 min remains). Run that 1 min + 4 min + 4 min = 9 min.`
      },
      {
        prompt: `A man is looking at a portrait. Someone asks, "Whose picture are you looking at?" He replies: "Brothers and sisters I have none, but this man's father is my father's son." Whose portrait is he looking at?`,
        correct: `His son's portrait`,
        wrong: [`His father's portrait`, `His own portrait`, `His nephew's portrait`],
        logic: `"My father's son" with no siblings must be the man himself. Therefore, "this man's father is [myself]" → The portrait is of <strong>his son</strong>.`
      },
      {
        prompt: `You have two ropes of different lengths and materials. Each rope takes exactly 60 minutes to burn from one end to the other, but they burn unevenly. How can you measure exactly 45 minutes using only these two ropes and a lighter?`,
        correct: `Light Rope 1 from both ends and Rope 2 from one end simultaneously; when Rope 1 finishes burning (30 min), light the other end of Rope 2.`,
        wrong: [
          `Cut Rope 1 into 3 equal lengths with a ruler`,
          `Burn Rope 1 completely, then fold Rope 2 in half and burn it`,
          `Burn both ropes simultaneously from one end until 75% consumed`
        ],
        logic: `Lighting a 60-min rope from both ends burns it in exactly 30 minutes. At t=30 min, Rope 2 has 30 minutes of fuel left. By lighting Rope 2's other end, its remaining 30 min burns in 15 min: 30 + 15 = <strong>45 minutes</strong>!`
      },
      {
        prompt: `In the Monty Hall problem, there are 3 doors: behind one is a sports car, and behind the other two are goats. You pick Door 1. The host, who knows what is behind every door, opens Door 3 to reveal a goat. He offers you: "Do you want to switch to Door 2?" Should you switch?`,
        correct: `Yes, switching doubles your chance of winning from 1/3 to 2/3`,
        wrong: [
          `No, the probability is now exactly 50/50 so it makes no difference`,
          `No, sticking with your initial gut intuition is statistically better`,
          `Yes, but only because Door 2 is the center door`
        ],
        logic: `Your initial choice had a 1/3 chance of being the car, meaning there was a 2/3 chance the car was behind one of the other two doors. Because the host intentionally eliminates a goat, that full 2/3 probability shifts to the remaining unopened door. Switching wins 2 out of 3 times!`
      },
      {
        prompt: `There are 100 closed lockers in a school hallway numbered 1 to 100. Student 1 opens every locker. Student 2 toggles every 2nd locker (2, 4, 6...). Student 3 toggles every 3rd locker, and so forth up to Student 100. At the end, which lockers remain OPEN?`,
        correct: `Only perfect square lockers (1, 4, 9, 16, 25, 36, 49, 64, 81, 100)`,
        wrong: [
          `All prime numbered lockers`,
          `All even numbered lockers`,
          `All odd numbered lockers`
        ],
        logic: `A locker is toggled once for every divisor it has. Most numbers have an even number of factors (in pairs, e.g. 12 has 1×12, 2×6, 3×4). Only <strong>perfect square numbers</strong> have an odd number of factors (e.g. 16 has 1×16, 2×8, 4×4). An odd number of toggles leaves the locker <strong>OPEN</strong>.`
      }
    ];

    const r = this.pick(riddles);
    const options = this.shuffle([r.correct, ...r.wrong]);

    return {
      category: 'puzzle_box',
      categoryTitle: '🧩 Puzzle Box',
      subcategory: 'Lateral Reasoning Riddle',
      difficulty,
      prompt: r.prompt,
      hint: `Think outside the box! Look for counter-intuitive mathematical properties.`,
      options,
      correctIndex: options.indexOf(r.correct),
      explanation: r.logic
    };
  }
};

window.PuzzleGenerator = PuzzleGenerator;
