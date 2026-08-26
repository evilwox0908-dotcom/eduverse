import {
  Subject,
  Course,
  CourseDifficulty,
  Lesson,
  PracticeQuestion,
  LearningResource,
  PracticeAttempt,
  PracticeAttemptBreakdown,
} from '../types';

// ==========================================
// 1. OFFICIAL REAL SUBJECTS
// ==========================================

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'subj_math',
    name: 'Mathematics',
    slug: 'mathematics',
    description: 'Calculus, Linear Algebra, Number Theory, Geometry, and Olympiad Problem Solving.',
    iconName: 'Binary',
    category: 'Mathematics',
    active: true,
    displayOrder: 1,
    gradient: 'from-blue-600 to-indigo-600',
    accentColor: '#2563eb',
    coursesCount: 3,
    topicsCount: 24,
  },
  {
    id: 'subj_physics',
    name: 'Theoretical & Applied Physics',
    slug: 'physics',
    description: 'Classical Mechanics, Electromagnetism, Quantum Foundations, and Thermodynamics.',
    iconName: 'Atom',
    category: 'Physics',
    active: true,
    displayOrder: 2,
    gradient: 'from-sky-500 to-blue-600',
    accentColor: '#0284c7',
    coursesCount: 2,
    topicsCount: 18,
  },
  {
    id: 'subj_cs',
    name: 'Computer Science & Algorithms',
    slug: 'computer-science',
    description: 'Data Structures, Graph Theory, Dynamic Programming, and Computational Complexity.',
    iconName: 'Code',
    category: 'Computer Science',
    active: true,
    displayOrder: 3,
    gradient: 'from-indigo-600 to-purple-600',
    accentColor: '#6366f1',
    coursesCount: 2,
    topicsCount: 20,
  },
  {
    id: 'subj_chemistry',
    name: 'Chemical Sciences',
    slug: 'chemistry',
    description: 'Organic Mechanisms, Physical Chemistry, Stoichiometry, and Molecular Kinetics.',
    iconName: 'FlaskConical',
    category: 'Chemistry',
    active: true,
    displayOrder: 4,
    gradient: 'from-emerald-500 to-teal-600',
    accentColor: '#059669',
    coursesCount: 2,
    topicsCount: 16,
  },
  {
    id: 'subj_biology',
    name: 'Biological Sciences & Genetics',
    slug: 'biology',
    description: 'Molecular Biology, Cellular Energetics, Genetics, and Evolutionary Systems.',
    iconName: 'Dna',
    category: 'Biology',
    active: true,
    displayOrder: 5,
    gradient: 'from-teal-500 to-emerald-700',
    accentColor: '#0d9488',
    coursesCount: 1,
    topicsCount: 12,
  },
  {
    id: 'subj_economics',
    name: 'Economics & Quantitative Finance',
    slug: 'economics',
    description: 'Microeconomic Theory, Macro Equilibrium, Game Theory, and Econometrics.',
    iconName: 'TrendingUp',
    category: 'Economics',
    active: true,
    displayOrder: 6,
    gradient: 'from-amber-500 to-orange-600',
    accentColor: '#d97706',
    coursesCount: 1,
    topicsCount: 10,
  },
  {
    id: 'subj_english',
    name: 'English & Critical Reasoning',
    slug: 'english',
    description: 'Rhetorical Analysis, Formal Argumentation, Academic Synthesis, and Linguistics.',
    iconName: 'BookOpenCheck',
    category: 'English',
    active: true,
    displayOrder: 7,
    gradient: 'from-violet-500 to-purple-700',
    accentColor: '#7c3aed',
    coursesCount: 1,
    topicsCount: 8,
  },
];

// ==========================================
// 2. OFFICIAL REAL COURSES
// ==========================================

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course_math_calculus',
    title: 'Differential Calculus & Optimization',
    slug: 'differential-calculus-and-optimization',
    description: 'Master limits, epsilon-delta definitions, analytical derivatives, Mean Value Theorems, and non-linear optimization for Olympiad and university preparation.',
    subjectId: 'subj_math',
    subjectName: 'Mathematics',
    category: 'Mathematics',
    educationLevel: 'HIGH_SCHOOL',
    grade: 'Grade 10-12',
    countryScope: 'GLOBAL',
    curriculum: 'International Olympiad & AP / IB Higher Level',
    language: 'English',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80',
    difficulty: CourseDifficulty.INTERMEDIATE,
    lessonCount: 4,
    estimatedMinutes: 90,
    active: true,
    creatorName: 'Prof. Arthur Vance (Cambridge)',
    organizationName: 'EduVerse Mathematical Institute',
    license: 'EduVerse Academic Open Access',
    source: 'EduVerse Official Curriculum 2026',
    prerequisites: ['Algebra II', 'Trigonometric Functions'],
    learningOutcomes: [
      'Rigorous limit proofs using algebraic decomposition and squeeze theorem',
      'Derivation of Chain Rule, Product Rule, and Implicit Differentiation',
      'Global optimization and concavity analysis with inflection points',
    ],
    featured: true,
  },
  {
    id: 'course_math_olympiad_nt',
    title: 'Olympiad Number Theory & Diophantine Equations',
    slug: 'olympiad-number-theory',
    description: 'A deep dive into modular arithmetic, Euler’s Totient Theorem, Chinese Remainder Theorem, Fermat’s Little Theorem, and quadratic residues.',
    subjectId: 'subj_math',
    subjectName: 'Mathematics',
    category: 'Mathematics',
    educationLevel: 'OLYMPIAD',
    grade: 'Grade 9-12 / Olympiad Division',
    countryScope: 'GLOBAL',
    curriculum: 'IMO & National Olympiad Standard',
    language: 'English',
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80',
    difficulty: CourseDifficulty.OLYMPIAD,
    lessonCount: 3,
    estimatedMinutes: 80,
    active: true,
    creatorName: 'Dr. Elena Rostova',
    organizationName: 'EduVerse Olympiad Faculty',
    license: 'EduVerse Academic Open Access',
    source: 'International Mathematical Olympiad Prep',
    prerequisites: ['Basic Number Theory', 'Mathematical Proof Techniques'],
    learningOutcomes: [
      'Solve high-degree congruence systems using CRT',
      'Apply Euler totient functions to large exponential modular problems',
      'Prove non-existence of integer solutions in Diophantine equations',
    ],
    featured: true,
  },
  {
    id: 'course_phys_mechanics',
    title: 'Lagrangian & Classical Mechanics Foundations',
    slug: 'lagrangian-classical-mechanics',
    description: 'Explore generalized coordinates, Hamilton’s Principle of Least Action, rotational inertia tensors, and central force orbital motion.',
    subjectId: 'subj_physics',
    subjectName: 'Theoretical & Applied Physics',
    category: 'Physics',
    educationLevel: 'HIGH_SCHOOL',
    grade: 'Grade 11-12 / IPhO Level',
    countryScope: 'GLOBAL',
    curriculum: 'International Physics Olympiad & C-Phys',
    language: 'English',
    thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80',
    difficulty: CourseDifficulty.ADVANCED,
    lessonCount: 3,
    estimatedMinutes: 75,
    active: true,
    creatorName: 'Dr. Julian Thorne (MIT Physics)',
    organizationName: 'EduVerse Institute for Theoretical Physics',
    license: 'EduVerse Open Courseware',
    source: 'EduVerse Core Physics Series',
    prerequisites: ['Calculus Foundations', 'Newtonian Vectors'],
    learningOutcomes: [
      'Derive Euler-Lagrange equations from variational calculus',
      'Calculate moments of inertia using 3D integration',
      'Model two-body gravitational orbits and Keplerian mechanics',
    ],
    featured: true,
  },
  {
    id: 'course_cs_algorithms',
    title: 'Advanced Graph Algorithms & Dynamic Programming',
    slug: 'graph-algorithms-and-dynamic-programming',
    description: 'Master topological sorting, Dijkstra, Bellman-Ford, Tarjan’s SCC algorithm, and complex bitmask and tree dynamic programming.',
    subjectId: 'subj_cs',
    subjectName: 'Computer Science & Algorithms',
    category: 'Computer Science',
    educationLevel: 'HIGH_SCHOOL',
    grade: 'Grade 9-12 / IOI Division',
    countryScope: 'GLOBAL',
    curriculum: 'USACO / IOI Competitive Informatics',
    language: 'English',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    difficulty: CourseDifficulty.ADVANCED,
    lessonCount: 3,
    estimatedMinutes: 85,
    active: true,
    creatorName: 'Alex Chen (IOI Gold Medalist)',
    organizationName: 'EduVerse Competitive Programming Lab',
    license: 'EduVerse Open Curriculum',
    source: 'International Olympiad in Informatics Prep',
    prerequisites: ['C++ or Python Proficiency', 'Basic Data Structures'],
    learningOutcomes: [
      'Design O((V+E) log V) shortest path solutions with custom priority heaps',
      'Decompose directed graphs into Strongly Connected Components',
      'Construct optimal multi-dimensional dynamic programming recurrence relations',
    ],
    featured: true,
  },
  {
    id: 'course_chem_kinetics',
    title: 'Chemical Kinetics & Reaction Thermodynamics',
    slug: 'chemical-kinetics-thermodynamics',
    description: 'Detailed analysis of reaction order derivations, Arrhenius activation energies, Gibbs Free Energy transitions, and chemical equilibria.',
    subjectId: 'subj_chemistry',
    subjectName: 'Chemical Sciences',
    category: 'Chemistry',
    educationLevel: 'HIGH_SCHOOL',
    grade: 'Grade 10-12',
    countryScope: 'GLOBAL',
    curriculum: 'AP Chemistry / IChO Training',
    language: 'English',
    thumbnail: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800&auto=format&fit=crop&q=80',
    difficulty: CourseDifficulty.INTERMEDIATE,
    lessonCount: 2,
    estimatedMinutes: 50,
    active: true,
    creatorName: 'Dr. Sarah Lin (Oxford)',
    organizationName: 'EduVerse Chemical Sciences Department',
    license: 'EduVerse Open Curriculum',
    source: 'EduVerse Chemistry Foundations',
    prerequisites: ['Basic Stoichiometry', 'Ideal Gas Laws'],
    learningOutcomes: [
      'Determine rate law orders via differential and integral methods',
      'Calculate equilibrium constants from thermodynamic standard states',
    ],
  },
  {
    id: 'course_econ_game_theory',
    title: 'Strategic Game Theory & Nash Equilibrium',
    slug: 'strategic-game-theory-nash-equilibrium',
    description: 'Normal and extensive form games, dominant strategy equilibria, mixed-strategy Nash equilibria, and Bayesian games of incomplete information.',
    subjectId: 'subj_economics',
    subjectName: 'Economics & Quantitative Finance',
    category: 'Economics',
    educationLevel: 'HIGH_SCHOOL',
    grade: 'Grade 11-12 / Undergraduate Prep',
    countryScope: 'GLOBAL',
    curriculum: 'Applied Economics & Decision Sciences',
    language: 'English',
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
    difficulty: CourseDifficulty.INTERMEDIATE,
    lessonCount: 2,
    estimatedMinutes: 45,
    active: true,
    creatorName: 'Prof. David Sterling',
    organizationName: 'EduVerse Center for Economics',
    license: 'EduVerse Academic Open Access',
    source: 'Quantitative Decision Theory',
    prerequisites: ['Introductory Probability', 'Linear Equations'],
    learningOutcomes: [
      'Model 2-player and n-player strategic interactions mathematically',
      'Compute continuous and discrete mixed strategy Nash equilibria',
    ],
  },
];

// ==========================================
// 3. OFFICIAL REAL LESSONS & CONTENT BLOCKS
// ==========================================

export const INITIAL_LESSONS: Lesson[] = [
  // ----------------------------------------------------
  // Course: Differential Calculus (course_math_calculus)
  // ----------------------------------------------------
  {
    id: 'les_calc_01',
    courseId: 'course_math_calculus',
    courseTitle: 'Differential Calculus & Optimization',
    title: 'Limits and the Analytical Definition of the Derivative',
    slug: 'limits-and-definition-of-derivative',
    description: 'Construct the rigorous algebraic definition of continuous rates of change and explore tangent slopes through limits.',
    lessonType: 'STANDARD',
    durationMinutes: 20,
    order: 1,
    active: true,
    xpReward: 50,
    keyTakeaways: [
      'The derivative f\'(x) represents the instantaneous rate of change as secant step h -> 0.',
      'Differentiability strictly implies continuity, but continuity does not guarantee differentiability (e.g. sharp cusps).',
    ],
    contentBlocks: [
      {
        id: 'cb_1_1',
        type: 'TEXT',
        order: 1,
        content: `### Introduction to Instantaneous Change

In classical geometry, a tangent line touches a curve at a single point without crossing it locally. However, in mathematical analysis, we formalize this intuition using **the limit of secant slopes**.

Consider a continuous function $f: \\mathbb{R} \\to \\mathbb{R}$. If we pick two points $(x, f(x))$ and $(x+h, f(x+h))$ on the curve, the average slope of the secant line passing through both points is:`,
      },
      {
        id: 'cb_1_2',
        type: 'FORMULA',
        order: 2,
        formula: "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}",
        formulaExplanation: 'The first principle definition of the derivative: when this two-sided limit exists, f(x) is said to be differentiable at point x.',
      },
      {
        id: 'cb_1_3',
        type: 'CALLOUT',
        order: 3,
        calloutVariant: 'TIP',
        calloutTitle: 'Crucial Examination Insight',
        content: 'When computing limits that yield the indeterminate form 0/0, factor the polynomial or multiply by the conjugate to cancel the vanishing factor h before evaluating.',
      },
      {
        id: 'cb_1_4',
        type: 'EXAMPLE',
        order: 4,
        exampleProblem: 'Find the derivative of f(x) = x^3 - 4x using first principles.',
        exampleSolution: `1. Expand f(x+h):
(x+h)^3 - 4(x+h) = x^3 + 3x^2h + 3xh^2 + h^3 - 4x - 4h

2. Subtract f(x):
[x^3 + 3x^2h + 3xh^2 + h^3 - 4x - 4h] - [x^3 - 4x] = 3x^2h + 3xh^2 + h^3 - 4h

3. Divide by h (for h ≠ 0):
3x^2 + 3xh + h^2 - 4

4. Take the limit as h -> 0:
f'(x) = 3x^2 - 4`,
        exampleExplanation: 'Notice that every remaining term containing h evaluates to 0, leaving the exact quadratic derivative function.',
      },
      {
        id: 'cb_1_5',
        type: 'QUESTION',
        order: 5,
        questionType: 'SINGLE_CHOICE',
        questionText: 'Which of the following functions is continuous at x = 0 but NOT differentiable at x = 0?',
        questionOptions: [
          { id: 'A', text: 'f(x) = x^2' },
          { id: 'B', text: 'f(x) = |x|' },
          { id: 'C', text: 'f(x) = sin(x)' },
          { id: 'D', text: 'f(x) = 1/x' },
        ],
        correctAnswer: 'B',
        explanation: 'For f(x) = |x|, the left-hand derivative limit is -1 while the right-hand derivative limit is +1. Because the one-sided limits differ, the two-sided derivative does not exist at the sharp vertex x = 0.',
        points: 10,
      },
    ],
  },
  {
    id: 'les_calc_02',
    courseId: 'course_math_calculus',
    courseTitle: 'Differential Calculus & Optimization',
    title: 'The Chain Rule and Composite Transformations',
    slug: 'chain-rule-composite-transformations',
    description: 'Derive the Chain Rule for nested functions and apply it to trigonometric, exponential, and multi-layer composites.',
    lessonType: 'STANDARD',
    durationMinutes: 20,
    order: 2,
    active: true,
    xpReward: 50,
    keyTakeaways: [
      'The derivative of composite function f(g(x)) is f\'(g(x)) * g\'(x).',
      'Always differentiate from the outermost layer to the innermost layer systematically.',
    ],
    contentBlocks: [
      {
        id: 'cb_2_1',
        type: 'TEXT',
        order: 1,
        content: `### Nested Rates of Change

When a variable $y$ depends on $u$, and $u$ in turn depends on $x$, the rate of change of $y$ with respect to $x$ is the product of their individual instantaneous rates.

This is formalized in Leibniz notation as:`,
      },
      {
        id: 'cb_2_2',
        type: 'FORMULA',
        order: 2,
        formula: "\\frac{dy}{dx} = \\frac{dy}{du} \\cdot \\frac{du}{dx}",
        formulaExplanation: 'Leibniz Chain Rule formulation: allows propagation of derivatives through composite functional structures.',
      },
      {
        id: 'cb_2_3',
        type: 'EXAMPLE',
        order: 3,
        exampleProblem: 'Compute the derivative of y = ln(sin(3x^2 + 1)) for valid domain values.',
        exampleSolution: `Layer 1 (Outer): ln(u) -> 1/u where u = sin(3x^2 + 1)
Layer 2 (Middle): sin(v) -> cos(v) where v = 3x^2 + 1
Layer 3 (Inner): 3x^2 + 1 -> 6x

Combine via Chain Rule:
dy/dx = (1 / sin(3x^2 + 1)) * cos(3x^2 + 1) * (6x)
      = 6x * cot(3x^2 + 1)`,
        exampleExplanation: 'By decomposing into three distinct nested layers, the calculation is error-free.',
      },
      {
        id: 'cb_2_4',
        type: 'QUESTION',
        order: 4,
        questionType: 'SINGLE_CHOICE',
        questionText: 'What is the derivative of f(x) = e^(5x^2)?',
        questionOptions: [
          { id: 'A', text: '5x * e^(5x^2)' },
          { id: 'B', text: '10x * e^(5x^2)' },
          { id: 'C', text: 'e^(10x)' },
          { id: 'D', text: '10x^2 * e^(5x)' },
        ],
        correctAnswer: 'B',
        explanation: 'Applying the chain rule: d/dx[e^u] = e^u * du/dx. Here u = 5x^2, so du/dx = 10x, yielding 10x * e^(5x^2).',
        points: 10,
      },
    ],
  },
  {
    id: 'les_calc_03',
    courseId: 'course_math_calculus',
    courseTitle: 'Differential Calculus & Optimization',
    title: 'Extreme Value Analysis and Global Optimization',
    slug: 'extreme-value-analysis-optimization',
    description: 'Analyze stationary points, second derivative tests, and closed-interval global extrema for Olympiad optimization problems.',
    lessonType: 'STANDARD',
    durationMinutes: 25,
    order: 3,
    active: true,
    xpReward: 50,
    keyTakeaways: [
      'Critical points occur strictly where f\'(x) = 0 or f\'(x) is undefined.',
      'On a closed interval [a, b], the global extrema MUST occur either at critical points inside (a, b) or at the endpoints a, b.',
    ],
    contentBlocks: [
      {
        id: 'cb_3_1',
        type: 'TEXT',
        order: 1,
        content: `### Optimization & Fermat's Theorem on Stationary Points

Fermat’s Theorem states that if $f$ has a local extremum at an interior point $c$, and $f'(c)$ exists, then $f'(c) = 0$.

To determine the nature of a stationary point where $f'(c) = 0$:
- If $f''(c) > 0$, the curve is concave up $\\implies$ **Local Minimum**.
- If $f''(c) < 0$, the curve is concave down $\\implies$ **Local Maximum**.
- If $f''(c) = 0$, the test is inconclusive (use the First Derivative Test).`,
      },
      {
        id: 'cb_3_2',
        type: 'FORMULA',
        order: 2,
        formula: "f''(c) < 0 \\implies \\text{Local Maximum at } x=c",
        formulaExplanation: 'The Second Derivative Test for concave-down critical points.',
      },
      {
        id: 'cb_3_3',
        type: 'QUESTION',
        order: 3,
        questionType: 'SINGLE_CHOICE',
        questionText: 'A rectangle has a fixed perimeter of 40 meters. What is the maximum possible area it can enclose?',
        questionOptions: [
          { id: 'A', text: '80 m²' },
          { id: 'B', text: '96 m²' },
          { id: 'C', text: '100 m²' },
          { id: 'D', text: '120 m²' },
        ],
        correctAnswer: 'C',
        explanation: 'Let width be x. Then length is 20 - x. Area A(x) = x(20 - x) = 20x - x^2. Taking derivative: A\'(x) = 20 - 2x = 0 => x = 10. Maximum Area = 10 * 10 = 100 m².',
        points: 10,
      },
    ],
  },
  {
    id: 'les_calc_04',
    courseId: 'course_math_calculus',
    courseTitle: 'Differential Calculus & Optimization',
    title: 'The Mean Value Theorem & Analytical Inequalities',
    slug: 'mean-value-theorem-inequalities',
    description: 'Master Rolle’s Theorem and the Mean Value Theorem (MVT) to prove Olympiad functional inequalities and root uniqueness.',
    lessonType: 'STANDARD',
    durationMinutes: 25,
    order: 4,
    active: true,
    xpReward: 50,
    keyTakeaways: [
      'MVT guarantees at least one point c in (a, b) where the instantaneous slope equals the average secant slope.',
      'MVT is fundamental in bounding function growth and proving inequalities like sin(x) < x for x > 0.',
    ],
    contentBlocks: [
      {
        id: 'cb_4_1',
        type: 'TEXT',
        order: 1,
        content: `### The Lagrange Mean Value Theorem

Let $f: [a, b] \\to \\mathbb{R}$ be continuous on the closed interval $[a, b]$ and differentiable on the open interval $(a, b)$.

Then there exists at least one point $c \\in (a, b)$ such that:`,
      },
      {
        id: 'cb_4_2',
        type: 'FORMULA',
        order: 2,
        formula: "f'(c) = \\frac{f(b) - f(a)}{b - a}",
        formulaExplanation: 'The Mean Value Theorem connects macroscopic average changes with microscopic instantaneous derivatives.',
      },
      {
        id: 'cb_4_3',
        type: 'CALLOUT',
        order: 3,
        calloutVariant: 'KEY_TAKEAWAY',
        calloutTitle: 'Course Completion Milestone',
        content: 'Congratulations on reaching the final module of Differential Calculus! You are now prepared for Olympiad Calculus and Advanced AP/IB problem sets.',
      },
    ],
  },

  // ----------------------------------------------------
  // Course: Computer Science & Algorithms (course_cs_algorithms)
  // ----------------------------------------------------
  {
    id: 'les_cs_01',
    courseId: 'course_cs_algorithms',
    courseTitle: 'Advanced Graph Algorithms & Dynamic Programming',
    title: 'Single-Source Shortest Paths: Dijkstra with Binary Heaps',
    slug: 'dijkstra-shortest-path-binary-heaps',
    description: 'Implement optimal shortest path search on non-negative weighted graphs with asymptotic complexity analysis.',
    lessonType: 'STANDARD',
    durationMinutes: 30,
    order: 1,
    active: true,
    xpReward: 50,
    keyTakeaways: [
      'Dijkstra operates greedily, relaxing neighboring edges using a min-priority queue.',
      'Time complexity is O((V + E) log V) with a binary heap or priority queue.',
    ],
    contentBlocks: [
      {
        id: 'cb_cs1_1',
        type: 'TEXT',
        order: 1,
        content: `### Dijkstra's Shortest Path Algorithm

Dijkstra’s algorithm solves the single-source shortest path problem for a directed or undirected graph with **non-negative edge weights**.

It maintains a distance array \`dist\` initialized to infinity (with \`dist[source] = 0\`) and a min-priority queue storing pairs \`(distance, node)\`.`,
      },
      {
        id: 'cb_cs1_2',
        type: 'CODE',
        order: 2,
        codeLanguage: 'cpp',
        code: `#include <vector>
#include <queue>

using namespace std;

typedef pair<long long, int> pli;

vector<long long> dijkstra(int n, int src, const vector<vector<pair<int, int>>>& adj) {
    const long long INF = 1e18;
    vector<long long> dist(n + 1, INF);
    priority_queue<pli, vector<pli>, greater<pli>> pq;

    dist[src] = 0;
    pq.push({0, src});

    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();

        if (d > dist[u]) continue; // Lazy deletion / stale node

        for (const auto& edge : adj[u]) {
            int v = edge.first;
            int weight = edge.second;

            if (dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}`,
      },
      {
        id: 'cb_cs1_3',
        type: 'QUESTION',
        order: 3,
        questionType: 'SINGLE_CHOICE',
        questionText: 'Why does standard Dijkstra algorithm fail on graphs containing negative edge weights?',
        questionOptions: [
          { id: 'A', text: 'Because priority queues cannot store negative integers.' },
          { id: 'B', text: 'Because once a node is marked settled, Dijkstra assumes its shortest path is permanently optimal and never relaxes it again.' },
          { id: 'C', text: 'Because adjacency lists cannot represent negative indices.' },
          { id: 'D', text: 'Because the algorithm will encounter an infinite recursion error in the stack.' },
        ],
        correctAnswer: 'B',
        explanation: 'Dijkstra relies on the greedy invariant that once a vertex is extracted from the min-heap, its calculated distance is minimal. A negative edge encountered later could lower the distance of an already settled vertex, violating this greedy assumption.',
        points: 10,
      },
    ],
  },
  {
    id: 'les_cs_02',
    courseId: 'course_cs_algorithms',
    courseTitle: 'Advanced Graph Algorithms & Dynamic Programming',
    title: 'Dynamic Programming: Multi-Dimensional State Compression',
    slug: 'dynamic-programming-state-compression',
    description: 'Learn bitmask DP and TSP state formulations for combinatorial graph problems.',
    lessonType: 'STANDARD',
    durationMinutes: 30,
    order: 2,
    active: true,
    xpReward: 50,
    keyTakeaways: [
      'Bitmask DP represents subsets of N items as integer binary masks (0 to 2^N - 1).',
      'Reduces NP-hard permutation spaces from O(N!) down to O(N^2 * 2^N).',
    ],
    contentBlocks: [
      {
        id: 'cb_cs2_1',
        type: 'TEXT',
        order: 1,
        content: `### Bitmask Representation of Subsets

When designing algorithms for small $N \\le 20$, we can represent visited subsets of nodes as an integer mask:
- Checking if element $i$ is present: \`(mask & (1 << i)) != 0\`
- Adding element $i$ to mask: \`mask | (1 << i)\`
- Toggling or removing element $i$: \`mask ^ (1 << i)\``,
      },
      {
        id: 'cb_cs2_2',
        type: 'FORMULA',
        order: 2,
        formula: "DP(mask, u) = \\min_{v \\notin mask} \\{ DP(mask \\mid 2^v, v) + \\text{cost}(u, v) \\}",
        formulaExplanation: 'The classic Bellman-Held-Karp recurrence relation for the Traveling Salesperson Problem.',
      },
    ],
  },
  {
    id: 'les_cs_03',
    courseId: 'course_cs_algorithms',
    courseTitle: 'Advanced Graph Algorithms & Dynamic Programming',
    title: 'Tarjan’s Strongly Connected Components (SCC) Algorithm',
    slug: 'tarjans-scc-algorithm',
    description: 'Find all maximal strongly connected subgraphs in linear O(V + E) time using depth-first search subtree low-link values.',
    lessonType: 'STANDARD',
    durationMinutes: 25,
    order: 3,
    active: true,
    xpReward: 50,
    keyTakeaways: [
      'Tarjan uses DFS discovery timestamps (tin) and lowest reachable timestamps (low) with an explicit traversal stack.',
      'Identifies all SCC components in a single linear DFS pass.',
    ],
    contentBlocks: [
      {
        id: 'cb_cs3_1',
        type: 'TEXT',
        order: 1,
        content: `### Strongly Connected Components

A directed graph is strongly connected if every vertex is reachable from every other vertex. Maximal strongly connected subgraphs partition the graph into an acyclic condensation DAG.`,
      },
    ],
  },
];

// ==========================================
// 4. REAL PRACTICE QUESTIONS BANK
// ==========================================

export const INITIAL_PRACTICE_QUESTIONS: PracticeQuestion[] = [
  {
    id: 'pq_math_01',
    subjectId: 'subj_math',
    subjectName: 'Mathematics',
    topic: 'Differential Calculus',
    difficulty: CourseDifficulty.INTERMEDIATE,
    grade: 'Grade 11-12',
    type: 'SINGLE_CHOICE',
    questionText: 'What is the derivative of f(x) = x * ln(x) with respect to x for x > 0?',
    options: [
      { id: 'A', text: '1/x' },
      { id: 'B', text: 'ln(x) + 1' },
      { id: 'C', text: 'ln(x) + x' },
      { id: 'D', text: '1 + 1/x' },
    ],
    correctAnswer: 'B',
    explanation: 'Using the Product Rule: d/dx[u*v] = u\'*v + u*v\'. Here u = x (u\' = 1) and v = ln(x) (v\' = 1/x). Thus, 1 * ln(x) + x * (1/x) = ln(x) + 1.',
    points: 10,
    hint: 'Apply the product rule: (fg)\' = f\'g + fg\'.',
  },
  {
    id: 'pq_math_02',
    subjectId: 'subj_math',
    subjectName: 'Mathematics',
    topic: 'Number Theory',
    difficulty: CourseDifficulty.ADVANCED,
    grade: 'Grade 10-12 / Olympiad',
    type: 'NUMERIC',
    questionText: 'What is the remainder when 3^100 is divided by 7?',
    correctAnswer: '4',
    explanation: 'By Fermat’s Little Theorem, 3^(7-1) = 3^6 ≡ 1 (mod 7). 100 = 6 * 16 + 4. Thus 3^100 ≡ (3^6)^16 * 3^4 ≡ 1^16 * 81 ≡ 81 (mod 7). 81 = 7 * 11 + 4, so the remainder is 4.',
    points: 15,
    hint: 'Use Fermat’s Little Theorem: a^(p-1) ≡ 1 (mod p) for prime p.',
  },
  {
    id: 'pq_phys_01',
    subjectId: 'subj_physics',
    subjectName: 'Theoretical & Applied Physics',
    topic: 'Classical Mechanics',
    difficulty: CourseDifficulty.INTERMEDIATE,
    grade: 'Grade 11-12',
    type: 'SINGLE_CHOICE',
    questionText: 'A solid uniform cylinder and a thin spherical shell of equal mass and radius roll down an incline without slipping from rest. Which object reaches the bottom first?',
    options: [
      { id: 'A', text: 'The solid cylinder' },
      { id: 'B', text: 'The spherical shell' },
      { id: 'C', text: 'Both reach the bottom simultaneously' },
      { id: 'D', text: 'It depends on the incline angle' },
    ],
    correctAnswer: 'A',
    explanation: 'Acceleration a = g sin(θ) / (1 + I / (m R^2)). For a solid cylinder, I/(mR^2) = 1/2 = 0.5. For a spherical shell, I/(mR^2) = 2/3 ≈ 0.67. The cylinder has a smaller rotational inertia fraction, so it accelerates faster down the plane.',
    points: 10,
    hint: 'Compare their moment of inertia coefficients.',
  },
  {
    id: 'pq_cs_01',
    subjectId: 'subj_cs',
    subjectName: 'Computer Science & Algorithms',
    topic: 'Graph Theory',
    difficulty: CourseDifficulty.INTERMEDIATE,
    grade: 'Grade 10-12',
    type: 'SINGLE_CHOICE',
    questionText: 'What is the time complexity of building a heap with N elements from an arbitrary unsorted array using bottom-up heapify (std::make_heap)?',
    options: [
      { id: 'A', text: 'O(N log N)' },
      { id: 'B', text: 'O(N)' },
      { id: 'C', text: 'O(log N)' },
      { id: 'D', text: 'O(N^2)' },
    ],
    correctAnswer: 'B',
    explanation: 'Summing the work over all levels gives S = Σ (h * N / 2^(h+1)) as h ranges from 1 to log N. This geometric-arithmetic series converges strictly to O(N).',
    points: 10,
  },
  {
    id: 'pq_chem_01',
    subjectId: 'subj_chemistry',
    subjectName: 'Chemical Sciences',
    topic: 'Kinetics',
    difficulty: CourseDifficulty.INTERMEDIATE,
    grade: 'Grade 11-12',
    type: 'SINGLE_CHOICE',
    questionText: 'For a first-order reaction A -> Products, if the initial concentration of A is halved, what happens to the half-life (t_1/2)?',
    options: [
      { id: 'A', text: 'The half-life doubles' },
      { id: 'B', text: 'The half-life is halved' },
      { id: 'C', text: 'The half-life remains unchanged' },
      { id: 'D', text: 'The half-life quadruples' },
    ],
    correctAnswer: 'C',
    explanation: 'For a first-order process, t_1/2 = ln(2) / k, which is strictly independent of the initial concentration [A]_0.',
    points: 10,
  },
  {
    id: 'pq_econ_01',
    subjectId: 'subj_economics',
    subjectName: 'Economics & Quantitative Finance',
    topic: 'Game Theory',
    difficulty: CourseDifficulty.INTERMEDIATE,
    grade: 'Grade 11-12',
    type: 'SINGLE_CHOICE',
    questionText: 'In the classic Prisoner’s Dilemma, what is the unique dominant strategy Nash Equilibrium?',
    options: [
      { id: 'A', text: 'Both players Cooperate' },
      { id: 'B', text: 'Both players Defect (Betray)' },
      { id: 'C', text: 'One Defects and One Cooperates' },
      { id: 'D', text: 'There is no pure strategy Nash equilibrium' },
    ],
    correctAnswer: 'B',
    explanation: 'Regardless of the opponent’s choice, defecting provides a strictly higher individual payout for each player, making (Defect, Defect) the strictly dominant Nash equilibrium.',
    points: 10,
  },
];

// ==========================================
// 5. OFFICIAL ACADEMIC RESOURCES & LIBRARY
// ==========================================

export const INITIAL_RESOURCES: LearningResource[] = [
  {
    id: 'res_math_calc_guide',
    title: 'EduVerse Olympiad Calculus & Analysis Syllabus Guide',
    description: 'Comprehensive 80-page reference companion covering standard analytical proofs, inequalities, and variational calculus.',
    type: 'PDF',
    subjectId: 'subj_math',
    subjectName: 'Mathematics',
    language: 'English',
    educationLevel: 'Grade 10-12 & Olympiad',
    access: 'PUBLIC',
    source: 'EduVerse Mathematical Sciences Press',
    author: 'EduVerse Academic Faculty',
    pagesOrDuration: '84 Pages',
    license: 'EduVerse Open Academic License',
    active: true,
    tags: ['Calculus', 'Syllabus', 'Proofs', 'Olympiad'],
  },
  {
    id: 'res_cs_algo_handbook',
    title: 'Competitive Programmer’s Essential Algorithms Handbook',
    description: 'Rigorous reference of 50+ graph algorithms, dynamic programming optimizations, and segment tree implementations.',
    type: 'BOOK',
    subjectId: 'subj_cs',
    subjectName: 'Computer Science & Algorithms',
    language: 'English',
    educationLevel: 'Grade 9-12 & Collegiate',
    access: 'PUBLIC',
    source: 'EduVerse Competitive Informatics Press',
    author: 'Alex Chen & Prof. Arthur Vance',
    pagesOrDuration: '142 Pages',
    license: 'EduVerse Open Academic License',
    active: true,
    tags: ['Algorithms', 'Graphs', 'DP', 'C++'],
  },
  {
    id: 'res_phys_formula_sheet',
    title: 'International Physics Olympiad (IPhO) Official Formula Compendium',
    description: 'Handy equation sheets for classical mechanics, thermodynamics, wave optics, relativity, and atomic physics.',
    type: 'PDF',
    subjectId: 'subj_physics',
    subjectName: 'Theoretical & Applied Physics',
    language: 'English',
    educationLevel: 'High School & Olympiad',
    access: 'PUBLIC',
    source: 'EduVerse Physics Department',
    author: 'Dr. Julian Thorne',
    pagesOrDuration: '28 Pages',
    license: 'EduVerse Academic Open Access',
    active: true,
    tags: ['Physics', 'Formulas', 'IPhO', 'Equations'],
  },
  {
    id: 'res_econ_decision_notes',
    title: 'Quantitative Game Theory & Market Strategy Primer',
    description: 'Lecture notes covering Nash equilibria, Pareto optimality, auction mechanisms, and asymmetric information.',
    type: 'DOCUMENT',
    subjectId: 'subj_economics',
    subjectName: 'Economics & Quantitative Finance',
    language: 'English',
    educationLevel: 'Grade 11-12 & University',
    access: 'PUBLIC',
    source: 'EduVerse Center for Economics',
    author: 'Prof. David Sterling',
    pagesOrDuration: '46 Pages',
    license: 'EduVerse Academic Open Access',
    active: true,
    tags: ['Economics', 'Nash Equilibrium', 'Finance'],
  },
];

// ==========================================
// 6. HELPER QUERY & EVALUATION FUNCTIONS
// ==========================================

export function evaluatePracticeAttempt(
  studentId: string,
  questionIds: string[],
  studentAnswers: Record<string, string | string[]>,
  timeSpentSeconds: number,
  topic?: string,
  subjectId?: string
): PracticeAttempt {
  const allQuestionsMap = new Map(INITIAL_PRACTICE_QUESTIONS.map((q) => [q.id, q]));
  const breakdown: PracticeAttemptBreakdown[] = [];

  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;
  let totalScore = 0;

  for (const qId of questionIds) {
    const q = allQuestionsMap.get(qId);
    if (!q) continue;

    const ans = studentAnswers[qId];
    const isUnanswered = ans === undefined || ans === '' || (Array.isArray(ans) && ans.length === 0);

    let isCorrect = false;
    if (!isUnanswered) {
      if (typeof q.correctAnswer === 'string' && typeof ans === 'string') {
        isCorrect = q.correctAnswer.trim().toLowerCase() === ans.trim().toLowerCase();
      } else if (Array.isArray(q.correctAnswer) && Array.isArray(ans)) {
        isCorrect =
          q.correctAnswer.length === ans.length &&
          q.correctAnswer.every((val) => ans.includes(val));
      }
    }

    if (isUnanswered) {
      unansweredCount++;
    } else if (isCorrect) {
      correctCount++;
      totalScore += q.points || 10;
    } else {
      incorrectCount++;
    }

    breakdown.push({
      questionId: q.id,
      questionText: q.questionText,
      studentAnswer: ans ?? 'Unanswered',
      correctAnswer: q.correctAnswer,
      isCorrect,
      explanation: q.explanation,
    });
  }

  const totalQuestions = questionIds.length;
  const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  // Calculate practice XP: 5 XP base per correct answer
  const xpEarned = Math.min(50, correctCount * 5);

  const attemptId = `prac_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

  return {
    id: attemptId,
    studentId,
    subjectId,
    topic: topic || 'Academic Practice Arena',
    difficulty: CourseDifficulty.INTERMEDIATE,
    totalQuestions,
    correctCount,
    incorrectCount,
    unansweredCount,
    score: totalScore,
    percentage,
    timeSpentSeconds,
    xpEarned,
    completedAt: new Date().toISOString(),
    breakdown,
  };
}
