/**
 * DIMAAG ARENA — LOGICAL REASONING PROCEDURAL GENERATOR
 * Generates dynamic Seating Arrangements (Linear & Circular), Blood Relations,
 * Direction Sense with Pythagorean distances, Syllogisms, and Caesar/Positional Ciphers.
 */

const LogicalGenerator = {
  names: [
    'Aarav', 'Ananya', 'Rohan', 'Priya', 'Kabir', 'Tanvi', 'Dev', 'Meera',
    'Vikram', 'Isha', 'Aditya', 'Sneha', 'Kavya', 'Arjun', 'Riya', 'Siddharth',
    'Neha', 'Rahul', 'Pooja', 'Varun', 'Diya', 'Karan', 'Shreya', 'Sameer', 'Tara'
  ],

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
    const types = ['seating', 'circular_seating', 'blood', 'direction', 'syllogism', 'coding'];
    const chosenType = this.pick(types);

    switch (chosenType) {
      case 'seating':
        return this.generateSeating(difficulty);
      case 'circular_seating':
        return this.generateCircularSeating(difficulty);
      case 'blood':
        return this.generateBlood(difficulty);
      case 'direction':
        return this.generateDirection(difficulty);
      case 'syllogism':
        return this.generateSyllogism(difficulty);
      case 'coding':
      default:
        return this.generateCoding(difficulty);
    }
  },

  // 1. LINEAR SEATING ARRANGEMENT
  generateSeating(difficulty) {
    const count = 5;
    const people = this.shuffle(this.names).slice(0, count);
    const order = [...people]; // Order: [0, 1, 2, 3, 4]

    const clues = [
      `${count} friends (${people.join(', ')}) are sitting in a straight row facing North.`,
      `${order[1]} is sitting immediately to the right of ${order[0]}.`,
      `${order[4]} is sitting at the extreme right end of the row.`,
      `${order[2]} is seated between ${order[1]} and ${order[3]}.`
    ];

    const qTypes = ['middle', 'leftEnd', 'rightOf'];
    const qChoice = this.pick(qTypes);
    let questionText = '';
    let correctAnswer = '';
    let explanation = '';

    if (qChoice === 'middle') {
      questionText = `Who is sitting in the exact middle seat?`;
      correctAnswer = order[2];
      explanation = `Reconstruct the row from the clues (Left to Right): <strong>${order.join(' → ')}</strong>. The middle seat is occupied by <strong>${order[2]}</strong>.`;
    } else if (qChoice === 'leftEnd') {
      questionText = `Who is sitting at the extreme left end of the row?`;
      correctAnswer = order[0];
      explanation = `Reconstructed row: <strong>${order.join(' → ')}</strong>. The extreme left seat is occupied by <strong>${order[0]}</strong>.`;
    } else {
      questionText = `Who sits immediately to the left of ${order[3]}?`;
      correctAnswer = order[2];
      explanation = `The ordered row is: <strong>${order.join(' → ')}</strong>. Immediately to the left of ${order[3]} is <strong>${order[2]}</strong>.`;
    }

    const wrongOptions = people.filter(p => p !== correctAnswer).slice(0, 3);
    const options = this.shuffle([correctAnswer, ...wrongOptions]);

    return {
      category: 'detective',
      categoryTitle: '🕵️ Detective Mode',
      subcategory: 'Linear Seating Clues',
      difficulty,
      prompt: questionText,
      contextBox: clues.join('<br>'),
      options,
      correctIndex: options.indexOf(correctAnswer),
      hint: `💡 Clue: Fix ${order[4]} at the right end first, then fill in the others from left to right!`,
      explanation
    };
  },

  // 2. CIRCULAR SEATING ARRANGEMENT
  generateCircularSeating(difficulty) {
    const people = this.shuffle(this.names).slice(0, 6);
    // [0, 1, 2, 3, 4, 5] clockwise around circular table
    const clues = [
      `6 friends (${people.join(', ')}) sit around a circular table facing towards the center.`,
      `${people[0]} sits directly opposite ${people[3]}.`,
      `${people[1]} sits immediately to the right of ${people[0]}.`,
      `${people[5]} sits immediately to the left of ${people[0]}.`,
      `${people[2]} is between ${people[1]} and ${people[3]}.`
    ];

    const qTypes = ['opposite', 'immediate_left'];
    const qChoice = this.pick(qTypes);
    let questionText = '';
    let correctAnswer = '';
    let explanation = '';

    if (qChoice === 'opposite') {
      questionText = `Who is sitting directly opposite ${people[1]}?`;
      correctAnswer = people[4]; // in 6 person circle, opposite of index 1 is index (1+3)%6 = 4
      explanation = `Tracing the circular arrangement clockwise: <strong>${people.join(' → ')}</strong>.<br>Directly opposite seat of ${people[1]} is <strong>${people[4]}</strong>.`;
    } else {
      questionText = `Who sits immediately to the left of ${people[3]}?`;
      correctAnswer = people[4]; // looking at center, left of 3 is 4
      explanation = `Looking towards the center, moving clockwise is to the left of person ${people[3]}, which leads to <strong>${people[4]}</strong>.`;
    }

    const wrongOptions = people.filter(p => p !== correctAnswer).slice(0, 3);
    const options = this.shuffle([correctAnswer, ...wrongOptions]);

    return {
      category: 'detective',
      categoryTitle: '🕵️ Detective Mode',
      subcategory: 'Circular Table Deduction',
      difficulty,
      prompt: questionText,
      contextBox: clues.join('<br>'),
      options,
      correctIndex: options.indexOf(correctAnswer),
      hint: `Remember: Facing the center, a person's left is in the clockwise direction, and their right is counter-clockwise!`,
      explanation
    };
  },

  // 3. BLOOD RELATIONS
  generateBlood(difficulty) {
    const templates = [
      {
        prompt: (speaker, target) => `Pointing to a photo, ${speaker} says: "His mother is the only daughter-in-law of my grandmother." How is ${speaker} related to the person in the photo?`,
        correct: 'Brother or Sister (Sibling)',
        wrong: ['Cousin', 'Uncle', 'Father'],
        logic: (speaker, target) => `Grandmother's only daughter-in-law is ${speaker}'s mother. The person's mother is also ${speaker}'s mother, making them siblings.`
      },
      {
        prompt: (speaker, target) => `Introducing a woman, ${speaker} said: "She is the only daughter of the father of my sister's brother." How is the woman related to ${speaker}?`,
        correct: 'Sister',
        wrong: ['Mother', 'Aunt', 'Daughter'],
        logic: (speaker, target) => `Sister's brother is ${speaker} (or ${speaker}'s brother). Father of that person is the father. The only daughter of the father is Sister.`
      },
      {
        prompt: (speaker, target) => `${speaker} is the son of ${target}'s father's sister. How is ${speaker} related to ${target}?`,
        correct: 'Cousin',
        wrong: ['Nephew', 'Brother', 'Uncle'],
        logic: (speaker, target) => `${target}'s father's sister is ${target}'s paternal aunt. The son of an aunt is a Cousin.`
      },
      {
        prompt: (speaker, target) => `A is the father of B, but B is not the son of A. How is B related to A?`,
        correct: 'Daughter',
        wrong: ['Niece', 'Sister', 'Cousin'],
        logic: () => `If A is the father of B and B is not the son, B must be the Daughter.`
      },
      {
        prompt: (speaker, target) => `Looking at a man, ${speaker} says: "His father is my father's only son." How is the man related to ${speaker}?`,
        correct: 'Son',
        wrong: ['Father', 'Brother', 'Grandson'],
        logic: (speaker) => `"My father's only son" is ${speaker} himself. Hence, "His father is ${speaker}" → The man is ${speaker}'s <strong>Son</strong>.`
      },
      {
        prompt: (speaker, target) => `${speaker} said to ${target}: "That boy playing on the field is the younger of the two brothers of the daughter of my father's wife." How is the boy related to ${speaker}?`,
        correct: 'Brother',
        wrong: ['Nephew', 'Son', 'Cousin'],
        logic: () => `Father's wife is mother. Daughter of mother is sister. Brother of sister is <strong>Brother</strong>.`
      }
    ];

    const t = this.pick(templates);
    const speaker = this.pick(this.names);
    const target = this.pick(this.names.filter(n => n !== speaker));

    const prompt = t.prompt(speaker, target);
    const options = this.shuffle([t.correct, ...t.wrong]);
    const explanation = typeof t.logic === 'function' ? t.logic(speaker, target) : t.logic;

    return {
      category: 'detective',
      categoryTitle: '🕵️ Detective Mode',
      subcategory: 'Genealogy & Family Tree',
      difficulty,
      prompt,
      contextBox: `Decipher the generational hierarchy step by step:`,
      options,
      correctIndex: options.indexOf(t.correct),
      hint: `💡 Clue: Start with the possessive pronoun at the end and work backwards!`,
      explanation
    };
  },

  // 4. DIRECTION SENSE (With Pythagorean displacement)
  generateDirection(difficulty) {
    const person = this.pick(this.names);
    // Use 3-4-5 or 6-8-10 or 5-12-13 triplets
    const triplets = [
      { dNorth: 6, dEast: 8, dist: 10, dir: 'North-East' },
      { dNorth: 3, dEast: 4, dist: 5, dir: 'North-East' },
      { dNorth: 12, dEast: 5, dist: 13, dir: 'North-East' },
      { dNorth: 8, dEast: 6, dist: 10, dir: 'North-East' }
    ];

    const trip = this.pick(triplets);
    const clues = [
      `${person} starts walking from Point A towards the <strong>North</strong> and walks <strong>${trip.dNorth} meters</strong>.`,
      `Then ${person} turns to their <strong>Right (East)</strong> and walks <strong>${trip.dEast} meters</strong>, stopping at Point B.`
    ];

    const prompt = `What is the shortest straight-line distance and compass direction from Point A (starting point) to Point B?`;
    const correct = `${trip.dist} meters, ${trip.dir}`;
    const wrong1 = `${trip.dNorth + trip.dEast} meters, ${trip.dir}`;
    const wrong2 = `${trip.dist} meters, South-West`;
    const wrong3 = `${trip.dist + 2} meters, North`;

    const options = this.shuffle([correct, wrong1, wrong2, wrong3]);

    return {
      category: 'detective',
      categoryTitle: '🕵️ Detective Mode',
      subcategory: 'Displacement Vector Navigation',
      difficulty,
      prompt,
      contextBox: clues.join('<br>'),
      options,
      correctIndex: options.indexOf(correct),
      hint: `Use the Pythagorean Theorem: Distance = √(North² + East²).`,
      explanation: `1. Displacement vector: Δy = +${trip.dNorth}m (North), Δx = +${trip.dEast}m (East).<br>` +
        `2. Shortest Euclidean distance = √(${trip.dNorth}² + ${trip.dEast}²) = √(${trip.dNorth * trip.dNorth + trip.dEast * trip.dEast}) = <strong>${trip.dist} meters</strong>.<br>` +
        `3. Direction from starting point A is <strong>${trip.dir}</strong>.`
    };
  },

  // 5. CATEGORICAL SYLLOGISMS
  generateSyllogism(difficulty) {
    const syllogisms = [
      {
        statements: [
          'All Algorithms are Logics.',
          'All Logics are Solutions.'
        ],
        conclusions: [
          'I. All Algorithms are Solutions.',
          'II. Some Solutions are Logics.'
        ],
        correct: 'Both Conclusions I and II follow',
        wrong: [
          'Only Conclusion I follows',
          'Only Conclusion II follows',
          'Neither Conclusion I nor II follows'
        ],
        logic: 'Since All Algorithms ⊆ Logics ⊆ Solutions, it follows directly that All Algorithms are Solutions (I follows). Also, since Logics ⊆ Solutions, some portion of Solutions are Logics (II follows).'
      },
      {
        statements: [
          'Some Laptops are Tablets.',
          'All Tablets are Screens.'
        ],
        conclusions: [
          'I. Some Screens are Laptops.',
          'II. All Screens are Laptops.'
        ],
        correct: 'Only Conclusion I follows',
        wrong: [
          'Only Conclusion II follows',
          'Both Conclusions I and II follow',
          'Neither follows'
        ],
        logic: 'The intersection of Laptops and Tablets is non-empty, and all Tablets are inside Screens. Therefore, that common intersection is inside Screens, proving Some Screens are Laptops (I follows). Conclusion II is an unsupported universal claim.'
      },
      {
        statements: [
          'No Bird is an Insect.',
          'All Mosquitoes are Insects.'
        ],
        conclusions: [
          'I. No Mosquito is a Bird.',
          'II. Some Insects are Mosquitoes.'
        ],
        correct: 'Both Conclusions I and II follow',
        wrong: [
          'Only Conclusion I follows',
          'Only Conclusion II follows',
          'Neither follows'
        ],
        logic: 'Mosquitoes ⊆ Insects, and Birds ∩ Insects = ∅. Therefore, Mosquitoes ∩ Birds = ∅ (No Mosquito is a Bird). Also, since Mosquitoes are Insects, Some Insects are Mosquitoes.'
      }
    ];

    const s = this.pick(syllogisms);
    const contextBox = `<strong>Statements:</strong><br>${s.statements.join('<br>')}<br><br><strong>Conclusions:</strong><br>${s.conclusions.join('<br>')}`;
    const options = this.shuffle([s.correct, ...s.wrong]);

    return {
      category: 'detective',
      categoryTitle: '🕵️ Detective Mode',
      subcategory: 'Deductive Syllogism',
      difficulty,
      prompt: 'Assuming the given statements to be entirely true, which of the conclusions logically follow?',
      contextBox,
      options,
      correctIndex: options.indexOf(s.correct),
      hint: `Visualize overlapping Venn diagrams for each category set!`,
      explanation: s.logic
    };
  },

  // 6. PROCEDURAL CODING-DECODING (Caesar shift & Positional cipher)
  generateCoding(difficulty) {
    const cipherType = this.pick(['caesar', 'reverse', 'positional_sum']);

    if (cipherType === 'positional_sum') {
      const words = ['ACE', 'BAD', 'CAB', 'BED', 'CAT'];
      const w = this.pick(words);
      const sum = w.split('').reduce((acc, char) => acc + (char.charCodeAt(0) - 64), 0);

      const prompt = `If in a secret code, A=1, B=2, C=3... and each word is coded as the sum of its letter positions: what is the code for the word <strong>${w}</strong>?`;
      const correct = `${sum}`;
      const wrong1 = `${sum + 3}`;
      const wrong2 = `${sum - 2}`;
      const wrong3 = `${sum + 5}`;

      const options = this.shuffle([correct, wrong1, wrong2, wrong3]);

      return {
        category: 'detective',
        categoryTitle: '🕵️ Detective Mode',
        subcategory: 'Alphabet Value Cipher',
        difficulty,
        prompt,
        hint: `Add the numerical positions of each letter in the word!`,
        options,
        correctIndex: options.indexOf(correct),
        explanation: `${w.split('').map(c => `${c}=${c.charCodeAt(0) - 64}`).join(' + ')} = <strong>${sum}</strong>.`
      };
    }

    if (cipherType === 'reverse') {
      const words = ['ROBOT', 'LOGIC', 'ARENA', 'SMART', 'CYBER'];
      const w = this.pick(words);
      const rev = w.split('').reverse().join('');

      const prompt = `If <strong>CODE</strong> is coded as <strong>EDOC</strong>, what is the code for <strong>${w}</strong>?`;
      const correct = rev;
      const wrong1 = w.slice(1) + w[0];
      const wrong2 = rev.slice(1) + rev[0];
      const wrong3 = w[w.length - 1] + w.slice(0, -1);

      const options = this.shuffle([correct, wrong1, wrong2, wrong3]);

      return {
        category: 'detective',
        categoryTitle: '🕵️ Detective Mode',
        subcategory: 'Reversal Cipher',
        difficulty,
        prompt,
        hint: `Examine the order of characters from right to left!`,
        options,
        correctIndex: options.indexOf(correct),
        explanation: `The coding rule is simply reversing the entire character sequence: <strong>${w} → ${rev}</strong>.`
      };
    }

    // Default: Caesar shift (+1, +2, or +3)
    const shift = this.pick([1, 2, 3]);
    const words = ['MIND', 'FAST', 'PEAK', 'FLOW', 'CODE'];
    const word = this.pick(words);

    function shiftWord(str, s) {
      return str.split('').map(c => {
        const code = c.charCodeAt(0) - 65;
        const newCode = (code + s) % 26;
        return String.fromCharCode(65 + newCode);
      }).join('');
    }

    const sampleWord = 'GAME';
    const sampleCoded = shiftWord(sampleWord, shift);
    const codedWord = shiftWord(word, shift);

    const wrong1 = shiftWord(word, shift + 1);
    const wrong2 = shiftWord(word, (shift + 25) % 26);
    const wrong3 = shiftWord(word, shift + 2);

    const options = this.shuffle([codedWord, wrong1, wrong2, wrong3]);

    return {
      category: 'detective',
      categoryTitle: '🕵️ Detective Mode',
      subcategory: 'Caesar Shift Cipher',
      difficulty,
      prompt: `If in a cryptographic cipher, <strong>${sampleWord}</strong> is written as <strong>${sampleCoded}</strong>, how will <strong>${word}</strong> be coded in that same system?`,
      hint: `Check the alphabetical shift distance from ${sampleWord[0]} to ${sampleCoded[0]} (+${shift}).`,
      options,
      correctIndex: options.indexOf(codedWord),
      explanation: `Each letter advances forward in the alphabet by exactly <strong>+${shift} position(s)</strong>: <strong>${word} → ${codedWord}</strong>.`
    };
  }
};

window.LogicalGenerator = LogicalGenerator;
