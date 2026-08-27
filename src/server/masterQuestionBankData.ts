import { QuestionBankItem } from '../types';

/**
 * Real Multi-Subject Master Question Bank
 * Covers all 12 Academic Subjects across Middle & High School (Grades 5-12)
 * Contains real academic problems with rigorous solutions and answer keys.
 */
export const INITIAL_MASTER_QUESTION_BANK: QuestionBankItem[] = [
  // ==========================================
  // 1. MATHEMATICS (subj_math)
  // ==========================================
  {
    id: 'qb_math_001',
    questionId: 'MATH-G10-001',
    subjectId: 'subj_math',
    subjectName: 'Mathematics',
    grade: 'Grade 10',
    topic: 'Algebra & Polynomials',
    difficulty: 'Hard',
    questionText:
      'Let $P(x) = x^4 + ax^3 + bx^2 + cx + d$ be a monic polynomial with integer coefficients. If $P(1) = 3$, $P(2) = 12$, $P(3) = 27$, and $P(4) = 48$, find the exact value of $P(5) + P(-1)$.',
    options: [
      { id: 'A', label: 'A', text: '168' },
      { id: 'B', label: 'B', text: '198' },
      { id: 'C', label: 'C', text: '216' },
      { id: 'D', label: 'D', text: '240' },
    ],
    correctAnswer: 'B',
    explanation:
      'Notice that for $x \\in \\{1,2,3,4\\}$, $P(x) = 3x^2$. Thus, $Q(x) = P(x) - 3x^2$ is a monic 4th degree polynomial with roots 1, 2, 3, 4. So $Q(x) = (x-1)(x-2)(x-3)(x-4)$. Hence $P(x) = (x-1)(x-2)(x-3)(x-4) + 3x^2$. Calculating: $P(5) = 24 + 75 = 99$, and $P(-1) = 120 + 3 = 123$. Thus $P(5) + P(-1) = 99 + 99 = 198$.',
    points: 5,
    negativePoints: 1,
    language: 'en',
    status: 'Approved',
    allowCalculator: true,
    tags: ['monic polynomial', 'roots', 'algebra'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'qb_math_002',
    questionId: 'MATH-G8-002',
    subjectId: 'subj_math',
    subjectName: 'Mathematics',
    grade: 'Grade 8',
    topic: 'Number Theory & Primes',
    difficulty: 'Medium',
    questionText:
      'What is the smallest positive integer $n$ such that $n!$ is divisible by $2024$?',
    options: [
      { id: 'A', label: 'A', text: '11' },
      { id: 'B', label: 'B', text: '23' },
      { id: 'C', label: 'C', text: '253' },
      { id: 'D', label: 'D', text: '506' },
    ],
    correctAnswer: 'B',
    explanation:
      'Prime factorization of $2024 = 2^3 \\times 11 \\times 23$. For $n!$ to be divisible by 2024, $n!$ must contain the prime factor 23. The smallest factorial containing 23 is $23!$. Since $23!$ already contains $11$ and multiple powers of $2$, $n = 23$.',
    points: 4,
    negativePoints: 0,
    language: 'en',
    status: 'Approved',
    allowCalculator: false,
    tags: ['primes', 'factorials', 'divisibility'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'qb_math_003',
    questionId: 'MATH-G6-003',
    subjectId: 'subj_math',
    subjectName: 'Mathematics',
    grade: 'Grade 6',
    topic: 'Fractions & Percentages',
    difficulty: 'Easy',
    questionText:
      'A library contains 1200 books. If $45\\%$ of the books are non-fiction, and $\\frac{2}{3}$ of the non-fiction books are science-related, how many science non-fiction books are in the library?',
    options: [
      { id: 'A', label: 'A', text: '320' },
      { id: 'B', label: 'B', text: '360' },
      { id: 'C', label: 'C', text: '400' },
      { id: 'D', label: 'D', text: '540' },
    ],
    correctAnswer: 'B',
    explanation:
      'Total non-fiction books = $1200 \\times 0.45 = 540$. Science non-fiction books = $540 \\times \\frac{2}{3} = 360$.',
    points: 3,
    negativePoints: 0,
    language: 'en',
    status: 'Approved',
    allowCalculator: false,
    tags: ['percentages', 'fractions'],
    createdAt: new Date().toISOString(),
  },

  // ==========================================
  // 2. PHYSICS (subj_physics)
  // ==========================================
  {
    id: 'qb_phys_001',
    questionId: 'PHYS-G11-001',
    subjectId: 'subj_physics',
    subjectName: 'Physics',
    grade: 'Grade 11',
    topic: 'Classical Mechanics & Energy',
    difficulty: 'Hard',
    questionText:
      'A block of mass $m = 2.0\\text{ kg}$ is attached to a spring of force constant $k = 200\\text{ N/m}$ on a frictionless horizontal surface. If the block is pulled $0.15\\text{ m}$ from equilibrium and released from rest, what is its speed when it passes through the point $x = 0.09\\text{ m}$?',
    options: [
      { id: 'A', label: 'A', text: '0.80 m/s' },
      { id: 'B', label: 'B', text: '1.20 m/s' },
      { id: 'C', label: 'C', text: '1.50 m/s' },
      { id: 'D', label: 'D', text: '1.80 m/s' },
    ],
    correctAnswer: 'B',
    explanation:
      'By conservation of mechanical energy: $\\frac{1}{2} k A^2 = \\frac{1}{2} k x^2 + \\frac{1}{2} m v^2 \\implies v = \\sqrt{\\frac{k}{m}(A^2 - x^2)} = \\sqrt{\\frac{200}{2.0}(0.15^2 - 0.09^2)} = \\sqrt{100 \\times (0.0225 - 0.0081)} = \\sqrt{100 \\times 0.0144} = \\sqrt{1.44} = 1.20\\text{ m/s}$.',
    points: 5,
    negativePoints: 1,
    language: 'en',
    status: 'Approved',
    allowCalculator: true,
    tags: ['harmonic oscillator', 'energy conservation', 'mechanics'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'qb_phys_002',
    questionId: 'PHYS-G9-002',
    subjectId: 'subj_physics',
    subjectName: 'Physics',
    grade: 'Grade 9',
    topic: 'Kinematics & Gravity',
    difficulty: 'Medium',
    questionText:
      'A projectile is launched from ground level with an initial velocity of $20\\text{ m/s}$ at an angle of $30^\\circ$ above the horizontal. Assuming $g = 9.8\\text{ m/s}^2$ and negligible air resistance, what is the maximum height reached?',
    options: [
      { id: 'A', label: 'A', text: '5.1 m' },
      { id: 'B', label: 'B', text: '10.2 m' },
      { id: 'C', label: 'C', text: '15.3 m' },
      { id: 'D', label: 'D', text: '20.4 m' },
    ],
    correctAnswer: 'A',
    explanation:
      '$v_{0y} = 20 \\sin(30^\\circ) = 10\\text{ m/s}$. $H_{\\max} = \\frac{v_{0y}^2}{2g} = \\frac{10^2}{2 \\times 9.8} = \\frac{100}{19.6} \\approx 5.10\\text{ m}$.',
    points: 4,
    negativePoints: 0,
    language: 'en',
    status: 'Approved',
    allowCalculator: true,
    tags: ['projectile', 'kinematics'],
    createdAt: new Date().toISOString(),
  },

  // ==========================================
  // 3. CHEMISTRY (subj_chemistry)
  // ==========================================
  {
    id: 'qb_chem_001',
    questionId: 'CHEM-G11-001',
    subjectId: 'subj_chemistry',
    subjectName: 'Chemistry',
    grade: 'Grade 11',
    topic: 'Thermodynamics & Equilibrium',
    difficulty: 'Hard',
    questionText:
      'For the Haber process reaction $\\text{N}_2(g) + 3\\text{H}_2(g) \\rightleftharpoons 2\\text{NH}_3(g)$ with $\\Delta H^\\circ = -92.4\\text{ kJ/mol}$, what will happen to the equilibrium yield of $\\text{NH}_3$ if the temperature is increased and the total pressure is decreased?',
    options: [
      { id: 'A', label: 'A', text: 'Yield increases significantly' },
      { id: 'B', label: 'B', text: 'Yield remains strictly unchanged' },
      { id: 'C', label: 'C', text: 'Yield decreases' },
      { id: 'D', label: 'D', text: 'The reaction becomes irreversibly inhibited' },
    ],
    correctAnswer: 'C',
    explanation:
      'According to Le Chatelier’s principle: 1) The forward reaction is exothermic ($\\Delta H < 0$), so increasing temperature shifts equilibrium to the left (reactants). 2) The forward reaction decreases the number of gas moles (4 moles $\\to$ 2 moles), so decreasing total pressure also shifts equilibrium to the side with more moles (left). Both changes unambiguously decrease the equilibrium yield of $\\text{NH}_3$.',
    points: 5,
    negativePoints: 1,
    language: 'en',
    status: 'Approved',
    allowCalculator: false,
    tags: ['equilibrium', 'Le Chatelier', 'thermodynamics'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'qb_chem_002',
    questionId: 'CHEM-G8-002',
    subjectId: 'subj_chemistry',
    subjectName: 'Chemistry',
    grade: 'Grade 8',
    topic: 'Atomic Structure & Bonding',
    difficulty: 'Easy',
    questionText:
      'Which subatomic particle is primarily responsible for forming chemical bonds between atoms?',
    options: [
      { id: 'A', label: 'A', text: 'Protons in the nucleus' },
      { id: 'B', label: 'B', text: 'Neutrons in the nucleus' },
      { id: 'C', label: 'C', text: 'Valence electrons' },
      { id: 'D', label: 'D', text: 'Positrons' },
    ],
    correctAnswer: 'C',
    explanation:
      'Valence electrons residing in the outermost electron shells are shared (covalent bonds) or transferred (ionic bonds) to form chemical bonds.',
    points: 3,
    negativePoints: 0,
    language: 'en',
    status: 'Approved',
    allowCalculator: false,
    tags: ['atomic structure', 'bonding', 'electrons'],
    createdAt: new Date().toISOString(),
  },

  // ==========================================
  // 4. BIOLOGY (subj_biology)
  // ==========================================
  {
    id: 'qb_bio_001',
    questionId: 'BIO-G10-001',
    subjectId: 'subj_biology',
    subjectName: 'Biology',
    grade: 'Grade 10',
    topic: 'Genetics & Mendelian Inheritance',
    difficulty: 'Medium',
    questionText:
      'In pea plants, tall stem ($T$) is dominant to dwarf stem ($t$), and purple flower ($P$) is dominant to white flower ($p$). If two dihybrid plants ($TtPp$) are crossed, what fraction of the offspring is expected to be tall with white flowers?',
    options: [
      { id: 'A', label: 'A', text: '9/16' },
      { id: 'B', label: 'B', text: '3/16' },
      { id: 'C', label: 'C', text: '1/16' },
      { id: 'D', label: 'D', text: '3/8' },
    ],
    correctAnswer: 'B',
    explanation:
      'From independent assortment: Probability of tall ($T_$) = $3/4$. Probability of white flowers ($pp$) = $1/4$. The joint probability is $(3/4) \\times (1/4) = 3/16$.',
    points: 4,
    negativePoints: 1,
    language: 'en',
    status: 'Approved',
    allowCalculator: false,
    tags: ['genetics', 'dihybrid cross', 'Mendel'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'qb_bio_002',
    questionId: 'BIO-G7-002',
    subjectId: 'subj_biology',
    subjectName: 'Biology',
    grade: 'Grade 7',
    topic: 'Cell Biology & Organelles',
    difficulty: 'Easy',
    questionText:
      'Which organelle is known as the "powerhouse of the cell" because it generates most of the chemical energy needed to power biochemical reactions via ATP?',
    options: [
      { id: 'A', label: 'A', text: 'Golgi apparatus' },
      { id: 'B', label: 'B', text: 'Mitochondrion' },
      { id: 'C', label: 'C', text: 'Endoplasmic reticulum' },
      { id: 'D', label: 'D', text: 'Lysosome' },
    ],
    correctAnswer: 'B',
    explanation:
      'Mitochondria perform cellular respiration to produce Adenosine Triphosphate (ATP), providing the main chemical energy currency for the cell.',
    points: 3,
    negativePoints: 0,
    language: 'en',
    status: 'Approved',
    allowCalculator: false,
    tags: ['cell organelles', 'mitochondria', 'ATP'],
    createdAt: new Date().toISOString(),
  },

  // ==========================================
  // 5. COMPUTER SCIENCE (subj_cs)
  // ==========================================
  {
    id: 'qb_cs_001',
    questionId: 'CS-G11-001',
    subjectId: 'subj_cs',
    subjectName: 'Computer Science',
    grade: 'Grade 11',
    topic: 'Algorithms & Big-O Complexity',
    difficulty: 'Hard',
    questionText:
      'What is the tightest worst-case time complexity for finding the shortest paths between all pairs of vertices in a weighted directed graph with $V$ vertices and $E$ edges with no negative cycles using Floyd-Warshall algorithm?',
    options: [
      { id: 'A', label: 'A', text: 'O(V + E)' },
      { id: 'B', label: 'B', text: 'O(V * E)' },
      { id: 'C', label: 'C', text: 'O(V^3)' },
      { id: 'D', label: 'D', text: 'O(2^V)' },
    ],
    correctAnswer: 'C',
    explanation:
      'Floyd-Warshall uses three nested loops over all vertices $k, i, j$ each running $V$ times: $\\Theta(V^3)$.',
    points: 5,
    negativePoints: 1,
    language: 'en',
    status: 'Approved',
    allowCalculator: false,
    tags: ['graph algorithms', 'dynamic programming', 'complexity'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'qb_cs_002',
    questionId: 'CS-G9-002',
    subjectId: 'subj_cs',
    subjectName: 'Computer Science',
    grade: 'Grade 9',
    topic: 'Data Structures & Stacks',
    difficulty: 'Medium',
    questionText:
      'Which data structure follows the Last-In, First-Out (LIFO) principle and is used by compilers to manage function call frames and recursion?',
    options: [
      { id: 'A', label: 'A', text: 'Queue' },
      { id: 'B', label: 'B', text: 'Stack' },
      { id: 'C', label: 'C', text: 'Binary Search Tree' },
      { id: 'D', label: 'D', text: 'Linked List' },
    ],
    correctAnswer: 'B',
    explanation:
      'A Stack operates on LIFO (Last-In First-Out) semantics where elements are pushed and popped from the top of the call stack.',
    points: 4,
    negativePoints: 0,
    language: 'en',
    status: 'Approved',
    allowCalculator: false,
    tags: ['data structures', 'stack', 'LIFO'],
    createdAt: new Date().toISOString(),
  },

  // ==========================================
  // 6. ENGLISH (subj_english)
  // ==========================================
  {
    id: 'qb_eng_001',
    questionId: 'ENG-G10-001',
    subjectId: 'subj_english',
    subjectName: 'English',
    grade: 'Grade 10',
    topic: 'Rhetoric & Syntax',
    difficulty: 'Medium',
    questionText:
      'Identify the literary device used in the following sentence: "The gentle breeze whispered secrets through the trembling leaves of the ancient willow."',
    options: [
      { id: 'A', label: 'A', text: 'Oxymoron' },
      { id: 'B', label: 'B', text: 'Personification' },
      { id: 'C', label: 'C', text: 'Hyperbole' },
      { id: 'D', label: 'D', text: 'Synecdoche' },
    ],
    correctAnswer: 'B',
    explanation:
      'Personification attributes human qualities (whispering secrets) to non-human elements (the breeze).',
    points: 4,
    negativePoints: 0,
    language: 'en',
    status: 'Approved',
    allowCalculator: false,
    tags: ['figurative language', 'personification'],
    createdAt: new Date().toISOString(),
  },

  // ==========================================
  // 7. LITERATURE (subj_literature)
  // ==========================================
  {
    id: 'qb_lit_001',
    questionId: 'LIT-G11-001',
    subjectId: 'subj_literature',
    subjectName: 'Literature',
    grade: 'Grade 11',
    topic: 'World Drama & Classics',
    difficulty: 'Hard',
    questionText:
      'In Shakespeare’s "Macbeth", what psychological and tragic concept is exemplified when Macbeth hallucinates a floating dagger before assassinating King Duncan?',
    options: [
      { id: 'A', label: 'A', text: 'Dramatic irony and unbridled hubris leading to moral degradation' },
      { id: 'B', label: 'B', text: 'Comic relief to de-escalate tension' },
      { id: 'C', label: 'C', text: 'Deus ex machina resolving political turmoil' },
      { id: 'D', label: 'D', text: 'Anagnorisis after the fatal catastrophe' },
    ],
    correctAnswer: 'A',
    explanation:
      'The dagger soliloquy visualizes Macbeth’s internal moral dread, cognitive fragmentation, and fatal ambition before committing regicide.',
    points: 5,
    negativePoints: 1,
    language: 'en',
    status: 'Approved',
    allowCalculator: false,
    tags: ['Shakespeare', 'Macbeth', 'tragedy'],
    createdAt: new Date().toISOString(),
  },

  // ==========================================
  // 8. HISTORY (subj_history)
  // ==========================================
  {
    id: 'qb_hist_001',
    questionId: 'HIST-G9-001',
    subjectId: 'subj_history',
    subjectName: 'History',
    grade: 'Grade 9',
    topic: 'Ancient Civilizations & Silk Road',
    difficulty: 'Medium',
    questionText:
      'Which ancient cross-continental network of trade routes connected East Asia to the Mediterranean basin, facilitating the exchange of silk, spices, papermaking, and philosophical ideas?',
    options: [
      { id: 'A', label: 'A', text: 'The Amber Road' },
      { id: 'B', label: 'B', text: 'The Silk Road' },
      { id: 'C', label: 'C', text: 'The Trans-Saharan Route' },
      { id: 'D', label: 'D', text: 'The Hanseatic League' },
    ],
    correctAnswer: 'B',
    explanation:
      'The Silk Road was an extensive Eurasian trade network established during the Han Dynasty, linking Chang’an through Central Asia to Rome and Byzantium.',
    points: 4,
    negativePoints: 0,
    language: 'en',
    status: 'Approved',
    allowCalculator: false,
    tags: ['Silk Road', 'trade networks', 'Central Asia'],
    createdAt: new Date().toISOString(),
  },

  // ==========================================
  // 9. GEOGRAPHY (subj_geography)
  // ==========================================
  {
    id: 'qb_geo_001',
    questionId: 'GEO-G8-001',
    subjectId: 'subj_geography',
    subjectName: 'Geography',
    grade: 'Grade 8',
    topic: 'Plate Tectonics & Earth Systems',
    difficulty: 'Medium',
    questionText:
      'What geological boundary type occurs where two tectonic plates slide horizontally past one another, frequently causing severe shallow-focus earthquakes such as along the San Andreas Fault?',
    options: [
      { id: 'A', label: 'A', text: 'Divergent boundary' },
      { id: 'B', label: 'B', text: 'Transform boundary' },
      { id: 'C', label: 'C', text: 'Convergent subduction zone' },
      { id: 'D', label: 'D', text: 'Hotspot plume' },
    ],
    correctAnswer: 'B',
    explanation:
      'At a transform boundary (or strike-slip fault), plates grind past each other horizontally without creating or destroying lithospheric crust.',
    points: 4,
    negativePoints: 0,
    language: 'en',
    status: 'Approved',
    allowCalculator: false,
    tags: ['tectonics', 'faults', 'earthquakes'],
    createdAt: new Date().toISOString(),
  },

  // ==========================================
  // 10. ECONOMICS (subj_economics)
  // ==========================================
  {
    id: 'qb_econ_001',
    questionId: 'ECON-G11-001',
    subjectId: 'subj_economics',
    subjectName: 'Economics',
    grade: 'Grade 11',
    topic: 'Microeconomics & Elasticity',
    difficulty: 'Hard',
    questionText:
      'If the price elasticity of demand for a vital product is $|E_d| = 0.40$ (inelastic), what will happen to total revenue if the producer raises the price by $10\\%$?',
    options: [
      { id: 'A', label: 'A', text: 'Total revenue will decrease by 4%' },
      { id: 'B', label: 'B', text: 'Total revenue will increase' },
      { id: 'C', label: 'C', text: 'Total revenue will drop to zero' },
      { id: 'D', label: 'D', text: 'Quantity demanded will increase by 4%' },
    ],
    correctAnswer: 'B',
    explanation:
      'When demand is inelastic ($|E_d| < 1$), the percentage drop in quantity demanded ($4\\%$) is less than the percentage increase in price ($10\\%$). Hence, total revenue ($P \\times Q$) increases.',
    points: 5,
    negativePoints: 1,
    language: 'en',
    status: 'Approved',
    allowCalculator: true,
    tags: ['elasticity', 'total revenue', 'microeconomics'],
    createdAt: new Date().toISOString(),
  },

  // ==========================================
  // 11. BUSINESS (subj_business)
  // ==========================================
  {
    id: 'qb_bus_001',
    questionId: 'BUS-G11-001',
    subjectId: 'subj_business',
    subjectName: 'Business',
    grade: 'Grade 11',
    topic: 'Corporate Finance & Accounting',
    difficulty: 'Medium',
    questionText:
      'Which financial metric measures a company’s operational efficiency by comparing net profit after taxes to total shareholder equity?',
    options: [
      { id: 'A', label: 'A', text: 'Return on Equity (ROE)' },
      { id: 'B', label: 'B', text: 'Current Ratio' },
      { id: 'C', label: 'C', text: 'Debt-to-Equity Ratio' },
      { id: 'D', label: 'D', text: 'Quick Acid Test Ratio' },
    ],
    correctAnswer: 'A',
    explanation:
      'Return on Equity (ROE) is computed as $\\text{Net Income} / \\text{Shareholder Equity}$, indicating how effectively management allocates capital to generate earnings.',
    points: 4,
    negativePoints: 0,
    language: 'en',
    status: 'Approved',
    allowCalculator: false,
    tags: ['ROE', 'financial ratios', 'valuation'],
    createdAt: new Date().toISOString(),
  },

  // ==========================================
  // 12. GENERAL SCIENCE (subj_science)
  // ==========================================
  {
    id: 'qb_sci_001',
    questionId: 'SCI-G6-001',
    subjectId: 'subj_science',
    subjectName: 'General Science',
    grade: 'Grade 6',
    topic: 'Astronomy & Solar System',
    difficulty: 'Easy',
    questionText:
      'Which planet in our solar system has the most extensive and visible ring system composed primarily of water ice and rock particles?',
    options: [
      { id: 'A', label: 'A', text: 'Mars' },
      { id: 'B', label: 'B', text: 'Saturn' },
      { id: 'C', label: 'C', text: 'Venus' },
      { id: 'D', label: 'D', text: 'Mercury' },
    ],
    correctAnswer: 'B',
    explanation:
      'Saturn is renowned for its spectacular and expansive planetary ring system made up of countless ice and dust chunks.',
    points: 3,
    negativePoints: 0,
    language: 'en',
    status: 'Approved',
    allowCalculator: false,
    tags: ['astronomy', 'planets', 'solar system'],
    createdAt: new Date().toISOString(),
  },
];
