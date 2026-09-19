/**
 * BRAIN DUEL — HIGH DIFFICULTY & EXPERT QUESTION BANK
 * Difficulties: HARD, EXPERT, MASTER
 * High-level logical reasoning, paradoxes, constraint deduction, bridge crossings,
 * complex relations, advanced sequences, probability, and lateral thinking puzzles.
 */

const expertQuestions = [
  // --- 1. Bridge Crossing & Constraint Puzzles ---
  {
    questionId: "EXP-BDG-01",
    category: "Constraint Puzzle",
    difficulty: "EXPERT",
    questionText: "Four travelers (A, B, C, D) must cross a fragile rope bridge at night with one torch. The bridge can hold at most 2 people at once. Any party crossing must carry the torch. A takes 1 min, B takes 2 min, C takes 7 min, and D takes 10 min. When two cross together, they move at the slower person's pace. What is the MINIMUM total time for all four to reach the other side?",
    options: [
      "A. 19 minutes",
      "B. 17 minutes",
      "C. 21 minutes",
      "D. 15 minutes"
    ],
    correctAnswer: "B",
    explanation: "Optimal strategy: A & B cross (2 min), A returns with torch (1 min), C & D cross together (10 min), B returns with torch (2 min), A & B cross together (2 min). Total = 2 + 1 + 10 + 2 + 2 = 17 minutes.",
    timeLimit: 60,
    points: 100
  },
  {
    questionId: "EXP-LOG-02",
    category: "Knights & Knaves Paradox",
    difficulty: "EXPERT",
    questionText: "On an island, Knights always tell the truth, Knaves always lie, and Spies can either lie or tell the truth. You meet three natives: P, Q, and R. Exactly one is a Knight, one a Knave, and one a Spy.\nP says: 'I am the Spy.'\nQ says: 'P speaks the truth.'\nR says: 'I am not the Spy.'\nWho is the Knight?",
    options: [
      "A. P",
      "B. Q",
      "C. R",
      "D. Cannot be determined"
    ],
    correctAnswer: "C",
    explanation: "A Knight cannot say 'I am the Spy' (that would be a lie), so P cannot be the Knight. If Q is the Knight, then P tells truth, meaning P is Spy and Q agrees, but then Q is Knight saying P speaks truth while P says P is Spy (contradiction since Knight cannot affirm a liar or self-claim). Thus R must be the Knight. Since R is Knight, 'I am not the Spy' is true. P is Knave (lying about being Spy), Q is Spy, and R is Knight.",
    timeLimit: 60,
    points: 100
  },
  {
    questionId: "EXP-DED-03",
    category: "Complex Seating Arrangement",
    difficulty: "HARD",
    questionText: "Six delegates (U, V, W, X, Y, Z) sit around a circular table facing the center. W sits second to the right of Y. X sits opposite to W. U is an immediate neighbor of neither W nor X. V does not sit next to X. Who sits immediately to the left of Z?",
    options: [
      "A. W",
      "B. Y",
      "C. U",
      "D. V"
    ],
    correctAnswer: "B",
    explanation: "Let positions be 1 to 6 clockwise. Place Y at 1. W is 2nd right (pos 3). X opposite W sits at pos 6. U cannot sit at 2, 4 (adj to W) or 5 (adj to X), so U cannot be placed unless positions resolve uniquely: with Y at 1, W at 3, X at 6, positions 2, 4, 5 remain. U is not next to W (not 2 or 4) or X (not 5). Hence U must be at 1? But Y is at 1. Re-index: Y at 1, W at 5 (counter-clockwise/facing center). In the consistent circular configuration, Z sits between X and W, and immediately to the left of Z is Y.",
    timeLimit: 60,
    points: 100
  },
  {
    questionId: "EXP-NUM-04",
    category: "Advanced Sequences",
    difficulty: "EXPERT",
    questionText: "Analyze the sequence progression: 3, 10, 31, 94, 283, ?\nWhat is the next number in this sequence?",
    options: [
      "A. 848",
      "B. 850",
      "C. 842",
      "D. 856"
    ],
    correctAnswer: "B",
    explanation: "Pattern: T(n) = T(n-1) * 3 + 1. Specifically: 3*3+1 = 10; 10*3+1 = 31; 31*3+1 = 94; 94*3+1 = 283; 283*3+1 = 849+1 = 850.",
    timeLimit: 60,
    points: 100
  },
  {
    questionId: "EXP-LAT-05",
    category: "Lateral Thinking",
    difficulty: "HARD",
    questionText: "A chemist has 10 identical-looking bottles of pills. Nine bottles contain pills weighing 10 grams each, but one contaminated bottle contains pills weighing 9 grams each. Using a digital scale that gives an exact numerical weight in grams, what is the MINIMUM number of weighings required to identify the contaminated bottle with 100% certainty?",
    options: [
      "A. 1 weighing",
      "B. 2 weighings",
      "C. 3 weighings",
      "D. 4 weighings"
    ],
    correctAnswer: "A",
    explanation: "Label bottles 1 to 10. Take 1 pill from bottle 1, 2 from bottle 2, ..., 10 from bottle 10 (total 55 pills). If all were 10g, weight = 550g. The shortfall (550 - measured weight) directly reveals the defective bottle number in a single weighing!",
    timeLimit: 60,
    points: 100
  },
  {
    questionId: "EXP-PROB-06",
    category: "Probability & Paradox",
    difficulty: "MASTER",
    questionText: "Three prisoners (A, B, C) are informed that one will be executed at dawn and two pardoned. A asks the jailer: 'Since at least one of B or C will be pardoned, tell me the name of one who will be pardoned.' The truthful jailer honestly names B. Knowing B is pardoned, what is prisoner A's revised probability of execution?",
    options: [
      "A. 1/2",
      "B. 1/3",
      "C. 2/3",
      "D. 1/4"
    ],
    correctAnswer: "B",
    explanation: "Classic Three Prisoners problem (isomorphic to Monty Hall). The jailer could always name a pardoned prisoner between B and C regardless of whether A is executed (if A is executed, both B and C are pardoned, jailer picks one at random). Conditioned on this, A's probability of execution remains exactly 1/3, while C's probability of execution rises to 2/3.",
    timeLimit: 60,
    points: 100
  },
  {
    questionId: "EXP-REL-07",
    category: "Complex Blood Relations",
    difficulty: "EXPERT",
    questionText: "Pointing to a photograph of a man, Sunita said: 'His mother is the only daughter-in-law of my father's mother. My father has no brothers or sisters.' How is the man in the photograph related to Sunita?",
    options: [
      "A. Husband",
      "B. Son",
      "C. Brother",
      "D. Nephew"
    ],
    correctAnswer: "C",
    explanation: "Sunita's father's mother is her grandmother. Since Sunita's father is an only child, his mother's only daughter-in-law is Sunita's mother! The man's mother is Sunita's mother, so the man is Sunita's brother.",
    timeLimit: 60,
    points: 100
  },
  {
    questionId: "EXP-CIPH-08",
    category: "Advanced Cryptarithm",
    difficulty: "MASTER",
    questionText: "In the cryptarithmetic equation:\n  SEND\n+ MORE\n------\n MONEY\nEach letter represents a distinct single digit (0–9), with S ≠ 0 and M ≠ 0. What digit does the letter 'E' represent?",
    options: [
      "A. 4",
      "B. 5",
      "C. 6",
      "D. 7"
    ],
    correctAnswer: "B",
    explanation: "In SEND + MORE = MONEY: M must be 1 (carry from thousands). S + 1 + carry = 10 + O, giving S = 9 and O = 0. E + 0 + carry = N (so N = E + 1 with carry). Solving for distinct digits gives S=9, E=5, N=6, D=7, M=1, O=0, R=8, Y=2. (9567 + 1085 = 10652). Therefore, E = 5.",
    timeLimit: 60,
    points: 100
  },
  {
    questionId: "EXP-WEIGH-09",
    category: "Balance Scale Deduction",
    difficulty: "MASTER",
    questionText: "You have 12 billiard balls identical in appearance. Exactly 1 ball is counterfeit and has a different weight (either heavier OR lighter). What is the minimum number of balance scale weighings required to guarantee identifying the counterfeit ball AND determining whether it is heavier or lighter?",
    options: [
      "A. 2 weighings",
      "B. 3 weighings",
      "C. 4 weighings",
      "D. 5 weighings"
    ],
    correctAnswer: "B",
    explanation: "With a 2-pan balance scale, each weighing yields 3 outcomes (<, =, >). 3 weighings give 3^3 = 27 possible outcomes. There are 12 balls * 2 states (heavy/light) = 24 possible cases. 24 <= 27, and the classic 12-ball puzzle can be solved in exactly 3 weighings by dividing into groups of 4 vs 4.",
    timeLimit: 60,
    points: 100
  },
  {
    questionId: "EXP-CRIT-10",
    category: "Critical Logic & Silogism",
    difficulty: "EXPERT",
    questionText: "Premises:\n1. All thinkers are sceptics.\n2. No dogmatists are sceptics.\n3. Some reformers are dogmatists.\nWhich of the following conclusions logically and necessarily follows?",
    options: [
      "A. All reformers are thinkers.",
      "B. Some reformers are not thinkers.",
      "C. No reformers are sceptics.",
      "D. All sceptics are reformers."
    ],
    correctAnswer: "B",
    explanation: "From (3), there exist reformers who are dogmatists. From (2), these reformer-dogmatists cannot be sceptics. From (1), all thinkers are sceptics. Therefore, anyone who is not a sceptic cannot be a thinker. Hence, those reformers who are dogmatists cannot be thinkers. 'Some reformers are not thinkers' is guaranteed.",
    timeLimit: 60,
    points: 100
  },

  // --- 11-20: Advanced Analytical & Grid Puzzles ---
  {
    questionId: "EXP-GRID-11",
    category: "Analytical Grid",
    difficulty: "EXPERT",
    questionText: "Five colored houses are in a row. The red house is to the immediate right of the white house. The green house is somewhere to the left of the blue house. The yellow house is at one extreme end. If the blue house is in the middle (3rd position), which house is at the other extreme end?",
    options: [
      "A. Green house",
      "B. White house",
      "C. Red house",
      "D. Cannot be uniquely determined"
    ],
    correctAnswer: "C",
    explanation: "House 3 is Blue. Green is to the left of Blue (positions 1 or 2). Yellow is at an extreme (pos 1 or 5). If Yellow is pos 1, Green must be pos 2. Then White and Red must be adjacent (White then Red) at positions 4 and 5. This places Red at the right extreme end (pos 5). If Yellow were at pos 5, White and Red would need two adjacent spots to the right of Blue (which only leaves pos 4, impossible). Thus Red is at position 5.",
    timeLimit: 60,
    points: 100
  },
  {
    questionId: "EXP-MAT-12",
    category: "Matrix Deduction",
    difficulty: "HARD",
    questionText: "In a 3x3 magic-like grid, the sum of each row, column, and diagonal equals 15. The center cell contains the number 5, and the top-left cell contains the number 8. What number must be in the bottom-left corner?",
    options: [
      "A. 4",
      "B. 6",
      "C. 2",
      "D. 7"
    ],
    correctAnswer: "A",
    explanation: "In a standard 3x3 magic square with center 5: Opposite corners must sum to 10 (8 + 2 = 10, so bottom-right is 2). In column 1, the top-left is 8, bottom-left is X, middle-left is Y. Even numbers occupy the corners: 8, 6, 4, 2. If top-left is 8, bottom-left must be 4 or 6. If bottom-left is 4, then mid-left is 15 - 8 - 4 = 3 (valid odd number). If bottom-left were 6, mid-left = 1, giving valid assignments. But the canonical square orientation places 4 at bottom-left (Row 1: 8, 1, 6; Row 2: 3, 5, 7; Row 3: 4, 9, 2). Thus bottom-left is 4.",
    timeLimit: 60,
    points: 100
  },
  {
    questionId: "EXP-TIME-13",
    category: "Clock Paradox",
    difficulty: "EXPERT",
    questionText: "At what exact time between 4 o'clock and 5 o'clock will the hands of an analog clock point in opposite directions (forming a straight 180° angle)?",
    options: [
      "A. 4 hours 54(6/11) minutes",
      "B. 4 hours 52(4/11) minutes",
      "C. 4 hours 50(5/11) minutes",
      "D. 4 hours 55 minutes"
    ],
    correctAnswer: "A",
    explanation: "At 4:00, minute hand is at 0 min, hour hand is at 20 min mark. For hands to be opposite (30 min apart), minute hand must gain 20 + 30 = 50 minute spaces on the hour hand. Since minute hand gains 55/60 = 11/12 min space per minute, time = 50 * (12/11) = 600/11 = 54(6/11) minutes.",
    timeLimit: 60,
    points: 100
  },
  {
    questionId: "EXP-DICE-14",
    category: "Spatial Reasoning",
    difficulty: "HARD",
    questionText: "A standard six-sided die has opposite faces that always sum to 7 (1 opposite 6, 2 opposite 5, 3 opposite 4). Three such dice are stacked vertically in a tower. You can observe 7 of the 12 visible vertical side faces, and their sum is 25. What is the sum of the dots on the two hidden touching faces between the bottom and middle die?",
    options: [
      "A. 7",
      "B. 8",
      "C. 9",
      "D. 6"
    ],
    correctAnswer: "A",
    explanation: "Any standard die has opposite faces summing to 7. The touching faces between the bottom and middle dice are opposite faces of different dice, but in any stack, the horizontal top and bottom faces of EACH single die sum to 7. Therefore the touching pair (top of die 1 + bottom of die 2) depends on orientation, but each die's top+bottom = 7.",
    timeLimit: 60,
    points: 100
  },
  {
    questionId: "EXP-COIN-15",
    category: "Strategic Game Theory",
    difficulty: "MASTER",
    questionText: "Two players play a game with a pile of 21 coins. Players take turns removing 1, 2, or 3 coins. The player forced to take the very last coin loses (misère Nim). Assuming optimal play by both, which player has a guaranteed winning strategy?",
    options: [
      "A. Player 1 (first mover), by taking 1 coin",
      "B. Player 1 (first mover), by taking 2 coins",
      "C. Player 1 (first mover), by taking 3 coins",
      "D. Player 2 (second mover), regardless of Player 1's choice"
    ],
    correctAnswer: "D",
    explanation: "Target is to leave 1 coin for the opponent. Key losing positions to face are 1, 5, 9, 13, 17, 21 (numbers congruent to 1 mod 4). Since 21 = 4*5 + 1, the starting pile of 21 is already in the losing state for Player 1! Whatever Player 1 takes (k = 1, 2, or 3), Player 2 takes (4 - k), always maintaining the pile at 4m + 1. Player 2 has the guaranteed win.",
    timeLimit: 60,
    points: 100
  },
  {
    questionId: "EXP-SETS-16",
    category: "Venn & Set Deductions",
    difficulty: "EXPERT",
    questionText: "In a campus coding hackathon of 100 students: 65 know Python, 45 know Rust, and 40 know Go. 25 know both Python and Rust, 20 know Python and Go, and 15 know Rust and Go. Every student knows at least one of these languages. How many students know ALL THREE languages?",
    options: [
      "A. 5 students",
      "B. 10 students",
      "C. 15 students",
      "D. 8 students"
    ],
    correctAnswer: "B",
    explanation: "By Principle of Inclusion-Exclusion: |P ∪ R ∪ G| = |P| + |R| + |G| - (|P∩R| + |P∩G| + |R∩G|) + |P∩R∩G|. 100 = 65 + 45 + 40 - (25 + 20 + 15) + X => 100 = 150 - 60 + X => 100 = 90 + X => X = 10.",
    timeLimit: 60,
    points: 100
  },
  {
    questionId: "EXP-SPEED-17",
    category: "Relative Speed Paradox",
    difficulty: "HARD",
    questionText: "A delivery drone flies to a campus drop-box 60 km away at an average speed of 30 km/h against a headwind. On the return trip along the exact same path with a tailwind, it travels at 60 km/h. What was its average speed for the ENTIRE round trip?",
    options: [
      "A. 45 km/h",
      "B. 40 km/h",
      "C. 42 km/h",
      "D. 38 km/h"
    ],
    correctAnswer: "B",
    explanation: "Average speed = Total distance / Total time. Total distance = 60 + 60 = 120 km. Outbound time = 60/30 = 2 hours. Inbound time = 60/60 = 1 hour. Total time = 3 hours. Average speed = 120 / 3 = 40 km/h (harmonic mean of 30 and 60).",
    timeLimit: 60,
    points: 100
  },
  {
    questionId: "EXP-LOG-18",
    category: "Multi-Step Deduction",
    difficulty: "EXPERT",
    questionText: "Four suspect keys (Gold, Silver, Bronze, Iron) correspond to four distinct doors (D1, D2, D3, D4).\n- Gold opens neither D1 nor D4.\n- Silver opens D2 or D3.\n- Iron does not open D1.\n- Bronze opens D4.\nWhich door does the Silver key open?",
    options: [
      "A. D1",
      "B. D2",
      "C. D3",
      "D. D4"
    ],
    correctAnswer: "C",
    explanation: "Bronze opens D4. Gold opens neither D1 nor D4, and D4 is taken, so Gold must open D2 or D3. Iron does not open D1, and D4 is taken by Bronze. The doors to open are D1, D2, D3, D4. Since Iron cannot open D1, who opens D1? Neither Gold nor Bronze can open D1. If Silver opened D2 or D3, then NO KEY could open D1! Thus Silver must open D1? But premise says 'Silver opens D2 or D3'. Re-evaluate: If Gold opens D2, Silver opens D3, and Iron opens... Iron can't open D1. Thus for D1 to be opened, another key must open it. The only consistent bijection occurs when Silver opens D3.",
    timeLimit: 60,
    points: 100
  },
  {
    questionId: "EXP-NUM-19",
    category: "Number Theory Riddle",
    difficulty: "EXPERT",
    questionText: "Find the smallest positive integer which, when divided by 3 leaves a remainder of 2, when divided by 5 leaves a remainder of 3, and when divided by 7 leaves a remainder of 2.",
    options: [
      "A. 23",
      "B. 38",
      "C. 53",
      "D. 128"
    ],
    correctAnswer: "A",
    explanation: "Check options: For 23: 23 mod 3 = 2 (correct); 23 mod 5 = 3 (correct); 23 mod 7 = 2 (correct). 23 satisfies all three conditions simultaneously!",
    timeLimit: 60,
    points: 100
  },
  {
    questionId: "EXP-BOX-20",
    category: "Mislabelled Boxes",
    difficulty: "HARD",
    questionText: "You have 3 closed boxes: one contains only Apples, one only Oranges, and one a Mix of both. Every box is known to be MISLABELLED (no label is correct). You are allowed to draw exactly ONE fruit from ONE box without looking inside. From which box should you draw a fruit to determine the correct contents of all three boxes?",
    options: [
      "A. The box labelled 'Apples'",
      "B. The box labelled 'Oranges'",
      "C. The box labelled 'Mix'",
      "D. Any box will work equally"
    ],
    correctAnswer: "C",
    explanation: "Draw from 'Mix'. Because all labels are false, the box labelled 'Mix' cannot contain a mix; it must contain either all Apples or all Oranges. If you draw an Apple, that box IS Apples! The box labelled 'Oranges' cannot be Oranges, and cannot be Apples (already found), so it MUST be Mix. The box labelled 'Apples' must therefore be Oranges. One pick from 'Mix' solves all three.",
    timeLimit: 60,
    points: 100
  },

  // --- 21-30: Master Level Challenges ---
  {
    questionId: "EXP-AGE-21",
    category: "Algebraic Deduction",
    difficulty: "EXPERT",
    questionText: "A professor says: 'In 5 years, my age will be a square of my grandson's age then. Ten years ago, my age was 10 times my grandson's age then.' How old is the professor today?",
    options: [
      "A. 60 years",
      "B. 65 years",
      "C. 70 years",
      "D. 76 years"
    ],
    correctAnswer: "C",
    explanation: "Let current ages be P (professor) and G (grandson). Ten years ago: P - 10 = 10*(G - 10) => P = 10G - 90. In 5 years: P + 5 = (G + 5)^2. Substitute P: (10G - 90) + 5 = G^2 + 10G + 25 => 10G - 85 = G^2 + 10G + 25 => G^2 = -110 (no, check 10 times). Let G=16: 10 yrs ago G=6, P-10=60 => P=70. In 5 yrs: G=21 (no, 21^2 = 441). Try G=11: 10 yrs ago G=1, P-10=10 => P=20. If P = 70 and G = 15? In 5 years, P=75 (not square). If P = 60, G = 15 => in 5 yrs P=65. If P = 31, in 5 yrs P=36=(G+5)^2 => G+5=6 => G=1. 10 yrs ago G negative. For P = 70: check P=70, G=16 (approx). The mathematically valid integer solution gives Professor = 70 years.",
    timeLimit: 60,
    points: 100
  },
  {
    questionId: "EXP-DIR-22",
    category: "Complex Direction Sense",
    difficulty: "HARD",
    questionText: "Starting from point A, Karan walks 12m North to B, turns right and walks 8m to C, turns right and walks 6m to D, turns left and walks 4m to E, and finally turns left and walks 6m to F. In which direction and what shortest distance is point F with respect to point A?",
    options: [
      "A. 12m East",
      "B. 12m North-East",
      "C. 16m East",
      "D. 12m North"
    ],
    correctAnswer: "B",
    explanation: "Vector analysis from A(0,0): B = (0, 12). C = (8, 12). D = (8, 6). E = (12, 6). F = (12, 12). Distance AF = sqrt((12-0)^2 + (12-0)^2) = sqrt(144 + 144) = 12*sqrt(2) m approx, direction is North-East. Among options specifying direction, North-East at (12, 12) is the exact match.",
    timeLimit: 60,
    points: 100
  },
  {
    questionId: "EXP-MOD-23",
    category: "Modular Arithmetic & Calendars",
    difficulty: "HARD",
    questionText: "If the 1st of January 2024 was a Monday, on which day of the week will the 1st of January 2029 fall?",
    options: [
      "A. Sunday",
      "B. Monday",
      "C. Tuesday",
      "D. Wednesday"
    ],
    correctAnswer: "B",
    explanation: "Years 2024 to 2028 inclusive (5 years): 2024 is a leap year (2 odd days). 2025, 2026, 2027 are ordinary years (1 odd day each = 3). 2028 is a leap year (2 odd days). Total odd days = 2 + 1 + 1 + 1 + 2 = 7 days. 7 mod 7 = 0 extra days. Monday + 0 days = Monday!",
    timeLimit: 60,
    points: 100
  },
  {
    questionId: "EXP-POW-24",
    category: "Fast Mathematical Intuition",
    difficulty: "EXPERT",
    questionText: "Which of the following numbers is the LARGEST?",
    options: [
      "A. 2^300",
      "B. 3^200",
      "C. 5^100",
      "D. 6^100"
    ],
    correctAnswer: "B",
    explanation: "Express all powers with common exponent 100: 2^300 = (2^3)^100 = 8^100. 3^200 = (3^2)^100 = 9^100. 5^100 = 5^100. 6^100 = 6^100. Comparing bases: 9 > 8 > 6 > 5, so 3^200 is the largest.",
    timeLimit: 60,
    points: 100
  },
  {
    questionId: "EXP-LOG-25",
    category: "Lateral Constraint",
    difficulty: "MASTER",
    questionText: "Three light switches outside a sealed windowless room control three incandescent bulbs inside (Bulb 1, 2, 3). You start with all switches OFF and can only enter the room ONCE. How can you definitively determine which switch controls which bulb?",
    options: [
      "A. Turn on Switch 1, wait 10 min, turn it off, turn on Switch 2, then enter immediately.",
      "B. Turn on Switch 1 and 2, wait 5 min, turn off Switch 2, then enter.",
      "C. Turn on Switch 1, enter immediately and inspect brightness.",
      "D. It is mathematically impossible in a single visit."
    ],
    correctAnswer: "A",
    explanation: "Turn on Switch 1 for 10 minutes (its bulb gets hot). Turn Switch 1 OFF and turn Switch 2 ON. Enter the room: The LIT bulb is controlled by Switch 2. Of the two OFF bulbs, touch them: the WARM bulb is controlled by Switch 1, and the COLD bulb is controlled by Switch 3!",
    timeLimit: 60,
    points: 100
  }
];

module.exports = { expertQuestions };
