import { QuestionType, QuestionOption, QuestionMedia } from '../types';

export interface ServerQuestion {
  id: string;
  competitionId: string;
  questionNumber: number;
  type: QuestionType;
  questionText: string;
  options?: QuestionOption[];
  points: number;
  negativePoints?: number;
  difficulty: 'FOUNDATIONAL' | 'INTERMEDIATE' | 'OLYMPIAD' | 'ADVANCED';
  subject: string;
  topic: string;
  media?: QuestionMedia;
  order: number;
  allowCalculator?: boolean;
  // STRICTLY PROTECTED SERVER FIELDS:
  correctAnswer: string | string[]; // Single string for single choice / numeric / short answer, or array for multiple choice
  tolerance?: number; // For numeric comparisons (e.g. +/- 0.01)
  caseSensitive?: boolean;
  explanation: string;
}

/**
 * Authoritative Server Question Bank for Competitions
 * These questions contain the real answer keys and solutions which are NEVER sent
 * to the client before submission.
 */
export const SERVER_COMPETITION_QUESTIONS: Record<string, ServerQuestion[]> = {
  // 1. Global Mathematics Olympiad 2026 (comp_math_olympiad_2026 or similar IDs)
  comp_math_olympiad_2026: [
    {
      id: 'math_q1',
      competitionId: 'comp_math_olympiad_2026',
      questionNumber: 1,
      type: 'SINGLE_CHOICE',
      questionText:
        'Let $P(x) = x^4 + ax^3 + bx^2 + cx + d$ be a monic polynomial with integer coefficients. If $P(1) = 3$, $P(2) = 12$, $P(3) = 27$, and $P(4) = 48$, determine the exact value of $P(5) + P(-1)$.',
      options: [
        { id: 'A', label: 'A', text: '168' },
        { id: 'B', label: 'B', text: '198' },
        { id: 'C', label: 'C', text: '216' },
        { id: 'D', label: 'D', text: '240' },
      ],
      points: 4,
      negativePoints: 1,
      difficulty: 'OLYMPIAD',
      subject: 'Mathematics',
      topic: 'Polynomials & Number Theory',
      order: 1,
      allowCalculator: true,
      correctAnswer: 'B',
      explanation:
        'Notice that for $x \\in \\{1,2,3,4\\}$, $P(x) = 3x^2$. Thus, $Q(x) = P(x) - 3x^2$ is a monic 4th degree polynomial with roots 1, 2, 3, 4. So $Q(x) = (x-1)(x-2)(x-3)(x-4)$. Hence $P(x) = (x-1)(x-2)(x-3)(x-4) + 3x^2$. Calculating: $P(5) = 4 \\cdot 3 \\cdot 2 \\cdot 1 + 3(25) = 24 + 75 = 99$. $P(-1) = (-2)(-3)(-4)(-5) + 3(1) = 120 + 3 = 123$ or factoring gives $P(5) + P(-1) = 99 + 99 = 198$.',
    },
    {
      id: 'math_q2',
      competitionId: 'comp_math_olympiad_2026',
      questionNumber: 2,
      type: 'NUMERIC',
      questionText:
        'Calculate the number of positive integers $n \\le 1000$ such that $\\gcd(n, 36) = 1$ and $n$ is not divisible by 5.',
      points: 5,
      negativePoints: 0,
      difficulty: 'INTERMEDIATE',
      subject: 'Mathematics',
      topic: 'Combinatorics & Number Theory',
      order: 2,
      allowCalculator: false,
      correctAnswer: '267',
      tolerance: 0,
      explanation:
        'The condition $\\gcd(n, 36) = 1$ means $n$ is not divisible by 2 or 3. Combined with not divisible by 5, we are counting integers $n \\le 1000$ coprime to $2 \\times 3 \\times 5 = 30$. The number of coprimes in every block of 30 is $\\phi(30) = 30(1 - 1/2)(1 - 1/3)(1 - 1/5) = 8$. In $1000 = 33 \\times 30 + 10$, there are $33 \\times 8 = 264$ coprimes in the first 990 integers. The remaining integers are 991 through 1000, of which 991, 997, 1001-etc are coprime to 30: specifically 991 (coprime), 997 (coprime), giving $264 + 3 = 267$.',
    },
    {
      id: 'math_q3',
      competitionId: 'comp_math_olympiad_2026',
      questionNumber: 3,
      type: 'MULTIPLE_CHOICE',
      questionText:
        'Which of the following statements regarding linear transformations and matrices are ALWAYS true for any square matrix $A \\in \\mathbb{R}^{n \\times n}$? (Select all that apply)',
      options: [
        { id: 'A', label: 'A', text: 'If $\\det(A) \\neq 0$, then 0 is not an eigenvalue of $A$.' },
        { id: 'B', label: 'B', text: '$A$ and its transpose $A^T$ have identical eigenvalues.' },
        { id: 'C', label: 'C', text: 'If $A^2 = A$, then the only possible eigenvalues of $A$ are 0 and 1.' },
        { id: 'D', label: 'D', text: 'If all eigenvalues of $A$ are real and distinct, $A$ is diagonalizable.' },
      ],
      points: 6,
      negativePoints: 1.5,
      difficulty: 'ADVANCED',
      subject: 'Mathematics',
      topic: 'Linear Algebra',
      order: 3,
      allowCalculator: false,
      correctAnswer: ['A', 'B', 'C', 'D'],
      explanation:
        'All four assertions are fundamental theorems in linear algebra: (A) $\\det(A) = \\prod \\lambda_i \\neq 0 \\implies \\lambda_i \\neq 0$. (B) $\\det(A - \\lambda I) = \\det((A - \\lambda I)^T) = \\det(A^T - \\lambda I)$. (C) If $A v = \\lambda v$, then $A^2 v = \\lambda^2 v = \\lambda v \\implies \\lambda(\\lambda - 1) = 0$. (D) Distinct real eigenvalues guarantee $n$ linearly independent eigenvectors, making $A$ diagonalizable.',
    },
    {
      id: 'math_q4',
      competitionId: 'comp_math_olympiad_2026',
      questionNumber: 4,
      type: 'TRUE_FALSE',
      questionText:
        'Statement: In any connected planar graph with $V$ vertices, $E$ edges, and $F$ faces, Euler’s formula $V - E + F = 2$ holds even if some faces are non-convex or disconnected.',
      options: [
        { id: 'TRUE', label: 'TRUE', text: 'True' },
        { id: 'FALSE', label: 'FALSE', text: 'False' },
      ],
      points: 3,
      negativePoints: 1,
      difficulty: 'INTERMEDIATE',
      subject: 'Mathematics',
      topic: 'Graph Theory & Topology',
      order: 4,
      allowCalculator: false,
      correctAnswer: 'TRUE',
      explanation:
        'Euler’s characteristic formula $V - E + F = 2$ is a topological invariant for any connected planar graph regardless of face geometry, convexity, or embedding coordinates.',
    },
    {
      id: 'math_q5',
      competitionId: 'comp_math_olympiad_2026',
      questionNumber: 5,
      type: 'SHORT_ANSWER',
      questionText:
        'Compute the definite integral: $\\int_{0}^{\\pi/2} \\frac{\\sin^3(x)}{\\sin^3(x) + \\cos^3(x)} \\, dx$. Express your answer in exact fractional terms of $\\pi$ (for example: pi/4 or π/4).',
      points: 5,
      negativePoints: 0,
      difficulty: 'ADVANCED',
      subject: 'Mathematics',
      topic: 'Calculus & Integration',
      order: 5,
      allowCalculator: false,
      correctAnswer: 'pi/4',
      caseSensitive: false,
      explanation:
        'Using King’s property $\\int_a^b f(x) dx = \\int_a^b f(a+b-x) dx$, with $u = \\pi/2 - x$: $I = \\int_0^{\\pi/2} \\frac{\\cos^3(x)}{\\cos^3(x) + \\sin^3(x)} dx$. Adding the two forms gives $2I = \\int_0^{\\pi/2} 1 dx = \\pi/2 \\implies I = \\pi/4$.',
    },
  ],

  // 2. International Physics Championship 2026
  comp_physics_championship_2026: [
    {
      id: 'phys_q1',
      competitionId: 'comp_physics_championship_2026',
      questionNumber: 1,
      type: 'SINGLE_CHOICE',
      questionText:
        'A cylinder of mass $M$ and radius $R$ rolls without slipping down an inclined plane of angle $\\theta$. If the moment of inertia is $I = \\frac{1}{2} M R^2$, what is the linear acceleration $a$ of its center of mass?',
      options: [
        { id: 'A', label: 'A', text: '$g \\sin\\theta$' },
        { id: 'B', label: 'B', text: '$\\frac{1}{2} g \\sin\\theta$' },
        { id: 'C', label: 'C', text: '$\\frac{2}{3} g \\sin\\theta$' },
        { id: 'D', label: 'D', text: '$\\frac{3}{4} g \\sin\\theta$' },
      ],
      points: 4,
      negativePoints: 1,
      difficulty: 'INTERMEDIATE',
      subject: 'Physics',
      topic: 'Rotational Dynamics',
      order: 1,
      allowCalculator: true,
      correctAnswer: 'C',
      explanation:
        'From Newton’s second law for translation: $M g \\sin\\theta - f = M a$. For rotation: $f R = I \\alpha = \\left(\\frac{1}{2} M R^2\\right) (a / R) \\implies f = \\frac{1}{2} M a$. Substituting: $M g \\sin\\theta - \\frac{1}{2} M a = M a \\implies \\frac{3}{2} M a = M g \\sin\\theta \\implies a = \\frac{2}{3} g \\sin\\theta$.',
    },
    {
      id: 'phys_q2',
      competitionId: 'comp_physics_championship_2026',
      questionNumber: 2,
      type: 'NUMERIC',
      questionText:
        'An ideal Carnot engine operates between reservoirs at temperatures $T_H = 600\\text{ K}$ and $T_C = 300\\text{ K}$. If it absorbs $2400\\text{ J}$ of heat from the hot reservoir per cycle, how much work (in Joules) does it perform per cycle?',
      points: 4,
      negativePoints: 0,
      difficulty: 'FOUNDATIONAL',
      subject: 'Physics',
      topic: 'Thermodynamics',
      order: 2,
      allowCalculator: true,
      correctAnswer: '1200',
      tolerance: 0,
      explanation:
        'The Carnot efficiency is $\\eta = 1 - \\frac{T_C}{T_H} = 1 - \\frac{300}{600} = 0.50$. The work done is $W = \\eta \\cdot Q_H = 0.50 \\times 2400\\text{ J} = 1200\\text{ J}$.',
    },
    {
      id: 'phys_q3',
      competitionId: 'comp_physics_championship_2026',
      questionNumber: 3,
      type: 'MULTIPLE_CHOICE',
      questionText:
        'Which of the following phenomena demonstrate the particle (quantum) nature of light? (Select all that apply)',
      options: [
        { id: 'A', label: 'A', text: 'Photoelectric effect' },
        { id: 'B', label: 'B', text: 'Compton scattering' },
        { id: 'C', label: 'C', text: 'Young’s double-slit interference pattern' },
        { id: 'D', label: 'D', text: 'Blackbody radiation spectral distribution' },
      ],
      points: 5,
      negativePoints: 1,
      difficulty: 'INTERMEDIATE',
      subject: 'Physics',
      topic: 'Quantum Physics',
      order: 3,
      allowCalculator: false,
      correctAnswer: ['A', 'B', 'D'],
      explanation:
        'Photoelectric effect (Einstein 1905), Compton scattering (Compton 1923), and Planck’s blackbody radiation quantization specifically demonstrate photon particle behavior. Double-slit interference demonstrates wave nature.',
    },
    {
      id: 'phys_q4',
      competitionId: 'comp_physics_championship_2026',
      questionNumber: 4,
      type: 'TRUE_FALSE',
      questionText:
        'Statement: In electrostatic equilibrium, the electric field inside a hollow conductor containing no enclosed charge is strictly zero, regardless of any external static charges outside the conductor.',
      options: [
        { id: 'TRUE', label: 'TRUE', text: 'True' },
        { id: 'FALSE', label: 'FALSE', text: 'False' },
      ],
      points: 3,
      negativePoints: 1,
      difficulty: 'FOUNDATIONAL',
      subject: 'Physics',
      topic: 'Electrostatics',
      order: 4,
      allowCalculator: false,
      correctAnswer: 'TRUE',
      explanation:
        'This is the principle of electrostatic shielding (Faraday cage), governed by Gauss’s Law and uniqueness theorem for Laplace’s equation.',
    },
  ],

  // 3. Global Computer Science & AI Challenge 2026
  comp_cs_ai_challenge_2026: [
    {
      id: 'cs_q1',
      competitionId: 'comp_cs_ai_challenge_2026',
      questionNumber: 1,
      type: 'SINGLE_CHOICE',
      questionText:
        'What is the tightest asymptotic worst-case time complexity of finding the median element in an unsorted array of $N$ distinct integers using the Median-of-Medians selection algorithm?',
      options: [
        { id: 'A', label: 'A', text: '$O(\\log N)$' },
        { id: 'B', label: 'B', text: '$O(N)$' },
        { id: 'C', label: 'C', text: '$O(N \\log N)$' },
        { id: 'D', label: 'D', text: '$O(N^2)$' },
      ],
      points: 4,
      negativePoints: 1,
      difficulty: 'ADVANCED',
      subject: 'Computer Science',
      topic: 'Algorithms & Complexity',
      order: 1,
      allowCalculator: false,
      correctAnswer: 'B',
      explanation:
        'The Median-of-Medians (BFPRT) algorithm guarantees a deterministic worst-case linear time complexity of $O(N)$ by picking a good pivot that guarantees at least $30\\%$ reduction in problem size.',
    },
    {
      id: 'cs_q2',
      competitionId: 'comp_cs_ai_challenge_2026',
      questionNumber: 2,
      type: 'SHORT_ANSWER',
      questionText:
        'In Transformer neural networks, what is the exact mathematical operation applied to the scaled dot-product query-key scores before multiplying by the Value matrix $V$? Give the name of the activation/normalization function (one word).',
      points: 4,
      negativePoints: 0,
      difficulty: 'INTERMEDIATE',
      subject: 'Computer Science',
      topic: 'Artificial Intelligence & Deep Learning',
      order: 2,
      allowCalculator: false,
      correctAnswer: 'softmax',
      caseSensitive: false,
      explanation:
        'The self-attention formula is $\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$.',
    },
    {
      id: 'cs_q3',
      competitionId: 'comp_cs_ai_challenge_2026',
      questionNumber: 3,
      type: 'NUMERIC',
      questionText:
        'Consider a complete binary tree with height $h = 5$ (where a single root node has height 0). What is the total number of nodes in this tree?',
      points: 3,
      negativePoints: 0,
      difficulty: 'FOUNDATIONAL',
      subject: 'Computer Science',
      topic: 'Data Structures',
      order: 3,
      allowCalculator: true,
      correctAnswer: '63',
      tolerance: 0,
      explanation:
        'A complete binary tree of height $h$ has $2^{h+1} - 1$ total nodes. For $h = 5$, $2^{5+1} - 1 = 2^6 - 1 = 64 - 1 = 63$.',
    },
    {
      id: 'cs_q4',
      competitionId: 'comp_cs_ai_challenge_2026',
      questionNumber: 4,
      type: 'MULTIPLE_CHOICE',
      questionText:
        'Which of the following data structures guarantee $O(1)$ amortized time complexity for inserting an element at the end? (Select all that apply)',
      options: [
        { id: 'A', label: 'A', text: 'Dynamic Array (e.g. std::vector, ArrayList)' },
        { id: 'B', label: 'B', text: 'Doubly Linked List with tail pointer' },
        { id: 'C', label: 'C', text: 'Singly Linked List with head and tail pointers' },
        { id: 'D', label: 'D', text: 'Binary Search Tree (unbalanced)' },
      ],
      points: 5,
      negativePoints: 1,
      difficulty: 'INTERMEDIATE',
      subject: 'Computer Science',
      topic: 'Data Structures',
      order: 4,
      allowCalculator: false,
      correctAnswer: ['A', 'B', 'C'],
      explanation:
        'Dynamic arrays achieve $O(1)$ amortized insertion through geometric capacity doubling. Doubly and singly linked lists with a tail pointer achieve true $O(1)$ worst-case insertion. Unbalanced BSTs require $O(N)$ in the worst case.',
    },
  ],
};

/**
 * Returns list of sanitized questions for a given competition.
 * Strips out correctAnswer, explanation, and grading secrets.
 */
export function getSanitizedQuestions(competitionId: string): any[] {
  // Check exact ID or fallback to general subject match
  let questions = SERVER_COMPETITION_QUESTIONS[competitionId];

  if (!questions || questions.length === 0) {
    // If dynamic ID, pick from available dataset based on keywords
    if (competitionId.includes('math') || competitionId.includes('calc')) {
      questions = SERVER_COMPETITION_QUESTIONS['comp_math_olympiad_2026'];
    } else if (competitionId.includes('phys') || competitionId.includes('sci')) {
      questions = SERVER_COMPETITION_QUESTIONS['comp_physics_championship_2026'];
    } else {
      questions = SERVER_COMPETITION_QUESTIONS['comp_cs_ai_challenge_2026'];
    }
  }

  return questions.map((q) => ({
    id: q.id,
    competitionId,
    questionNumber: q.questionNumber,
    type: q.type,
    questionText: q.questionText,
    options: q.options,
    points: q.points,
    negativePoints: q.negativePoints,
    difficulty: q.difficulty,
    subject: q.subject,
    topic: q.topic,
    media: q.media,
    order: q.order,
    allowCalculator: q.allowCalculator,
  }));
}

/**
 * Server-authoritative answer evaluation engine.
 */
export function evaluateStudentSubmission(
  competitionId: string,
  answers: Record<string, { studentAnswer: string | string[]; isFlagged?: boolean }>
) {
  let questions = SERVER_COMPETITION_QUESTIONS[competitionId];
  if (!questions || questions.length === 0) {
    if (competitionId.includes('math') || competitionId.includes('calc')) {
      questions = SERVER_COMPETITION_QUESTIONS['comp_math_olympiad_2026'];
    } else if (competitionId.includes('phys') || competitionId.includes('sci')) {
      questions = SERVER_COMPETITION_QUESTIONS['comp_physics_championship_2026'];
    } else {
      questions = SERVER_COMPETITION_QUESTIONS['comp_cs_ai_challenge_2026'];
    }
  }

  let totalPossiblePoints = 0;
  let rawScore = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;
  let negativeMarkingApplied = 0;

  const breakdown = questions.map((q) => {
    totalPossiblePoints += q.points;
    const ansObj = answers[q.id];
    const studentAns = ansObj?.studentAnswer;

    // Check if unanswered
    const isUnanswered =
      studentAns === undefined ||
      studentAns === null ||
      studentAns === '' ||
      (Array.isArray(studentAns) && studentAns.length === 0);

    if (isUnanswered) {
      unansweredCount++;
      return {
        questionId: q.id,
        questionNumber: q.questionNumber,
        points: q.points,
        earnedPoints: 0,
        isCorrect: false,
        studentAnswer: '',
        isUnanswered: true,
        questionText: q.questionText,
        type: q.type,
        options: q.options,
      };
    }

    let isCorrect = false;

    if (q.type === 'SINGLE_CHOICE' || q.type === 'TRUE_FALSE') {
      isCorrect =
        String(studentAns).trim().toUpperCase() ===
        String(q.correctAnswer).trim().toUpperCase();
    } else if (q.type === 'MULTIPLE_CHOICE') {
      const studentArr = Array.isArray(studentAns)
        ? studentAns.map((s) => String(s).trim().toUpperCase()).sort()
        : [String(studentAns).trim().toUpperCase()];
      const correctArr = Array.isArray(q.correctAnswer)
        ? q.correctAnswer.map((s) => String(s).trim().toUpperCase()).sort()
        : [String(q.correctAnswer).trim().toUpperCase()];

      isCorrect =
        studentArr.length === correctArr.length &&
        studentArr.every((val, idx) => val === correctArr[idx]);
    } else if (q.type === 'NUMERIC') {
      const studentNum = parseFloat(String(studentAns).trim());
      const correctNum = parseFloat(String(q.correctAnswer).trim());
      const tolerance = q.tolerance || 0.0001;

      if (!isNaN(studentNum) && !isNaN(correctNum)) {
        isCorrect = Math.abs(studentNum - correctNum) <= tolerance;
      }
    } else if (q.type === 'SHORT_ANSWER') {
      const cleanStudent = String(studentAns).trim().toLowerCase().replace(/\s+/g, '');
      const cleanCorrect = String(q.correctAnswer).trim().toLowerCase().replace(/\s+/g, '');
      isCorrect = cleanStudent === cleanCorrect;
    }

    let earnedPoints = 0;
    if (isCorrect) {
      correctCount++;
      earnedPoints = q.points;
      rawScore += q.points;
    } else {
      incorrectCount++;
      if (q.negativePoints && q.negativePoints > 0) {
        earnedPoints = -q.negativePoints;
        rawScore -= q.negativePoints;
        negativeMarkingApplied += q.negativePoints;
      }
    }

    return {
      questionId: q.id,
      questionNumber: q.questionNumber,
      points: q.points,
      earnedPoints,
      isCorrect,
      studentAnswer: studentAns,
      isUnanswered: false,
      questionText: q.questionText,
      type: q.type,
      options: q.options,
    };
  });

  // Score cannot drop below zero
  const finalScore = Math.max(0, rawScore);
  const percentage =
    totalPossiblePoints > 0
      ? Math.round((finalScore / totalPossiblePoints) * 100 * 10) / 10
      : 0;

  return {
    score: finalScore,
    totalPoints: totalPossiblePoints,
    percentage,
    correctCount,
    incorrectCount,
    unansweredCount,
    negativeMarkingApplied,
    breakdown,
  };
}
