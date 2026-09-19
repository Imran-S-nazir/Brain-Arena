/**
 * DIMAAG ARENA — CRITICAL & VERBAL REASONING PROCEDURAL GENERATOR
 * Generates dynamic Statement-Assumptions, Cause & Effect, Course of Action,
 * and Strong vs Weak Arguments with nuanced deductive explanations.
 */

const CriticalGenerator = {
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

  generate(difficulty = 'medium') {
    const types = ['assumptions', 'cause_effect', 'course_of_action', 'arguments'];
    const chosenType = this.pick(types);

    switch (chosenType) {
      case 'assumptions':
        return this.generateAssumptions(difficulty);
      case 'cause_effect':
        return this.generateCauseEffect(difficulty);
      case 'course_of_action':
        return this.generateCourseOfAction(difficulty);
      case 'arguments':
      default:
        return this.generateArguments(difficulty);
    }
  },

  // 1. STATEMENT & ASSUMPTIONS
  generateAssumptions(difficulty) {
    const scenarios = [
      {
        statement: `"To transition into high-paying AI engineering roles, young professionals should prioritize building deployed end-to-end applications over collecting theoretical certificates." — Director of Engineering at a frontier tech lab.`,
        assumptions: [
          `I. Deployed end-to-end applications demonstrate practical problem-solving capability that recruiters value more than passive credentials.`,
          `II. Theoretical certifications have zero relevance in any technical engineering interview.`
        ],
        correct: 'Only Assumption I is implicit',
        wrong: ['Only Assumption II is implicit', 'Both Assumptions I and II are implicit', 'Neither is implicit'],
        logic: `Assumption I is directly taken for granted by the speaker to justify why candidates should prioritize deployed apps. Assumption II is extreme and exaggerated ("zero relevance"), which is never implied by recommending one path over another.`
      },
      {
        statement: `"The municipal transport corporation announced that suburban electric metro lines will run 24/7 on weekends to reduce road traffic congestion and late-night accidents."`,
        assumptions: [
          `I. A substantial volume of citizens travel during late weekend hours and are willing to utilize the metro system.`,
          `II. All road accidents in the city are caused solely by private four-wheelers.`
        ],
        correct: 'Only Assumption I is implicit',
        wrong: ['Only Assumption II is implicit', 'Both Assumptions I and II are implicit', 'Neither is implicit'],
        logic: `For the administration to launch 24/7 transit, they must assume public ridership will adopt it (Assumption I is implicit). Assumption II is an unproven absolute generalization.`
      },
      {
        statement: `"Invest in diversified index funds for long-term wealth compounding rather than attempting day trading based on short-term market noise."`,
        assumptions: [
          `I. Diversified index funds historically capture macroeconomic growth over extended horizons.`,
          `II. Most retail day traders consistently lose capital against market volatility.`
        ],
        correct: 'Both Assumptions I and II are implicit',
        wrong: ['Only Assumption I is implicit', 'Only Assumption II is implicit', 'Neither is implicit'],
        logic: `The recommendation explicitly presupposes both that index funds provide reliable compounding (I) and that day trading on noise is an inferior risk-adjusted strategy (II).`
      }
    ];

    const item = this.pick(scenarios);
    const contextBox = `<strong>Statement:</strong><br>${item.statement}<br><br><strong>Assumptions:</strong><br>${item.assumptions.join('<br>')}`;

    const options = this.shuffle([item.correct, ...item.wrong]);

    return {
      category: 'critical',
      categoryTitle: 'Critical & Verbal',
      subcategory: 'Statement & Implicit Assumptions',
      difficulty,
      prompt: 'Examine the statement and decide which of the given assumptions is implicitly taken for granted:',
      contextBox,
      options,
      correctIndex: options.indexOf(item.correct),
      explanation: item.logic
    };
  },

  // 2. CAUSE AND EFFECT
  generateCauseEffect(difficulty) {
    const pairs = [
      {
        stmtA: `The Reserve Bank unexpectedly raised benchmark repo interest rates by 50 basis points.`,
        stmtB: `Commercial lending institutions immediately increased floating interest rates on home and vehicle loans.`,
        correct: 'Statement A is the cause, and Statement B is its effect',
        wrong: [
          'Statement B is the cause, and Statement A is its effect',
          'Both statements are independent causes',
          'Both statements are effects of an independent cause'
        ],
        logic: `A central bank rate hike increases borrowing costs for commercial banks, directly causing them to pass on higher loan rates to retail consumers.`
      },
      {
        stmtA: `Severe cloudbursts and torrential rains struck the river valley over 48 continuous hours.`,
        stmtB: `Agricultural fields in the low-lying river plains suffered massive waterlogging and crop destruction.`,
        correct: 'Statement A is the cause, and Statement B is its effect',
        wrong: [
          'Statement B is the cause, and Statement A is its effect',
          'Both statements are effects of independent causes',
          'Statement A is the effect, and Statement B is an independent cause'
        ],
        logic: `Continuous torrential rain and cloudburst (Event A) directly caused the physical flooding and crop loss in low-lying areas (Event B).`
      }
    ];

    const item = this.pick(pairs);
    const contextBox = `<strong>Statements:</strong><br><strong>(A)</strong> ${item.stmtA}<br><strong>(B)</strong> ${item.stmtB}`;
    const options = this.shuffle([item.correct, ...item.wrong]);

    return {
      category: 'critical',
      categoryTitle: 'Critical & Verbal',
      subcategory: 'Cause & Effect Dynamics',
      difficulty,
      prompt: 'Determine the causal relationship between Statements (A) and (B):',
      contextBox,
      options,
      correctIndex: options.indexOf(item.correct),
      explanation: item.logic
    };
  },

  // 3. COURSE OF ACTION
  generateCourseOfAction(difficulty) {
    const cases = [
      {
        problem: `A reputable cybersecurity firm detected an unauthorized backdoor breach in the firmware of a smart IoT thermostat installed in over 200,000 households.`,
        actions: [
          `I. The manufacturer should immediately push an emergency authenticated over-the-air firmware patch and publicly advise users to update.`,
          `II. The manufacturer should permanently shut down all smart servers and cease all future IoT development.`
        ],
        correct: 'Only Course of Action I follows',
        wrong: ['Only Course of Action II follows', 'Both Course of Action I and II follow', 'Neither follows'],
        logic: `Course of action I is constructive, proportionate, and directly remediates the security flaw. Action II is disproportionate, economically destructive, and irrational.`
      },
      {
        problem: `Multiple premier engineering universities noticed an unprecedented drop in students attending in-person lectures due to poor engagement and redundant slide-reading by instructors.`,
        actions: [
          `I. The academic council should reform lecture formats into interactive case studies, lab problem sessions, and peer-led workshops.`,
          `II. The administration should enforce mandatory biometric attendance with severe financial fines for missing classes.`
        ],
        correct: 'Only Course of Action I follows',
        wrong: ['Only Course of Action II follows', 'Both I and II follow', 'Neither follows'],
        logic: `Action I addresses the root cause (pedagogical obsolescence and lack of engagement). Action II punishes symptoms without addressing quality, causing deeper student alienation.`
      }
    ];

    const c = this.pick(cases);
    const contextBox = `<strong>Problem Scenario:</strong><br>${c.problem}<br><br><strong>Proposed Courses of Action:</strong><br>${c.actions.join('<br>')}`;
    const options = this.shuffle([c.correct, ...c.wrong]);

    return {
      category: 'critical',
      categoryTitle: 'Critical & Verbal',
      subcategory: 'Course of Action Evaluation',
      difficulty,
      prompt: 'Which of the proposed courses of action is logically sound and practically feasible?',
      contextBox,
      options,
      correctIndex: options.indexOf(c.correct),
      explanation: c.logic
    };
  },

  // 4. STRONG VS WEAK ARGUMENTS
  generateArguments(difficulty) {
    const debates = [
      {
        question: `Should foundational coding and computational logic be introduced into standard middle school curricula?`,
        arguments: [
          `I. Yes, because algorithmic thinking fosters structured problem solving and equips students for a digital economy.`,
          `II. No, because other countries are already ahead so it is useless to start now.`
        ],
        correct: 'Only Argument I is strong',
        wrong: ['Only Argument II is strong', 'Both Arguments I and II are strong', 'Neither argument is strong'],
        logic: `Argument I presents a substantive, direct pedagogical and economic benefit. Argument II is a defeatist fallacy and logically weak.`
      }
    ];

    const d = this.pick(debates);
    const contextBox = `<strong>Statement:</strong><br>${d.question}<br><br><strong>Arguments:</strong><br>${d.arguments.join('<br>')}`;
    const options = this.shuffle([d.correct, ...d.wrong]);

    return {
      category: 'critical',
      categoryTitle: 'Critical & Verbal',
      subcategory: 'Strong vs Weak Arguments',
      difficulty,
      prompt: 'Evaluate which of the arguments is logically robust and substantively strong:',
      contextBox,
      options,
      correctIndex: options.indexOf(d.correct),
      explanation: d.logic
    };
  }
};

window.CriticalGenerator = CriticalGenerator;
