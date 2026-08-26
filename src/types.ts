export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'glass' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface NavItem {
  id: string;
  label: string;
  href: string;
  badge?: string;
}

export type ActiveModal =
  | 'signup'
  | 'login'
  | 'competitions'
  | 'compete'
  | 'learn'
  | 'leaderboard'
  | 'universities'
  | 'events'
  | 'ai'
  | null;

export interface InfoCardData {
  id: string;
  title: string;
  description: string;
  iconName: 'Sparkles' | 'Globe' | 'Award';
  tag: string;
}

export type UserRole = 'student' | 'teacher' | 'parent';

export type SchoolVerificationStatus = 'verified' | 'pending' | 'none';

export interface ProfilePrivacySettings {
  isPublicProfile: boolean;
  showSchool: boolean;
  showCountry: boolean;
  showAchievements: boolean;
  showCompetitionResults: boolean;
}

export interface UserProfile {
  uid: string;
  id?: string;
  eduVerseId?: string; // Unique public ID format: EV-XXXXXX
  firstName: string;
  lastName: string;
  displayName?: string;
  email: string;
  photoURL?: string;
  role: UserRole;
  country: string;
  countryCode: string;
  region: string;
  schoolId?: string;
  schoolName: string;
  schoolVerificationStatus: SchoolVerificationStatus;
  grade: string;
  educationSystem: string;
  profileCompleted: boolean;
  eduverseScore?: number;
  xp?: number;
  level?: number;
  currentStreak?: number;
  longestStreak?: number;
  lastActivityDate?: string;
  streakFreezeCount?: number;
  bio?: string;
  targetGoals?: string[];
  privacySettings?: ProfilePrivacySettings;
  createdAt?: any;
  updatedAt?: any;
}

// XP & Transaction Types
export type XPTransactionType =
  | 'PROFILE_COMPLETED'
  | 'LESSON_COMPLETED'
  | 'PRACTICE_COMPLETED'
  | 'COMPETITION_REGISTERED'
  | 'COMPETITION_COMPLETED'
  | 'VERIFIED_RESULT'
  | 'ACHIEVEMENT_UNLOCKED'
  | 'AI_SESSION'
  | 'STREAK_BONUS';

export interface XPTransaction {
  id: string;
  studentId: string;
  type: XPTransactionType;
  amount: number;
  sourceId?: string;
  description: string;
  createdAt: any;
}

// Level Progression Types
export interface LevelInfo {
  level: number;
  title: string;
  currentLevelBaseXP: number;
  nextLevelXP: number;
  xpInCurrentLevel: number;
  xpRequiredForNextLevel: number;
  progressPercent: number;
  xpToNextLevel: number;
}

// Achievement Types
export type AchievementCategory =
  | 'LEARNING'
  | 'COMPETITION'
  | 'CONSISTENCY'
  | 'ACADEMIC'
  | 'GLOBAL'
  | 'SPECIAL';

export type AchievementRarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';

export interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  rewardXp: number;
  secret?: boolean;
  active: boolean;
}

export interface StudentAchievement {
  id: string;
  studentId: string;
  achievementId: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  rewardXp: number;
  unlockedAt: string;
  sourceId?: string;
}

// Activity History Types
export type StudentActivityType =
  | 'EXAM_COMPLETED'
  | 'ACHIEVEMENT_UNLOCKED'
  | 'LEVEL_UP'
  | 'XP_EARNED'
  | 'AI_SESSION'
  | 'PROFILE_UPDATED'
  | 'COMPETITION_REGISTERED';

export interface StudentActivity {
  id: string;
  studentId: string;
  type: StudentActivityType;
  title: string;
  description: string;
  timestamp: string;
  metadata?: any;
}

export interface ProfileCompletionInfo {
  percentage: number;
  isComplete: boolean;
  completedFields: string[];
  missingFields: string[];
}

export interface PublicStudentProfile {
  eduVerseId: string;
  displayName: string;
  photoURL?: string;
  country?: string;
  countryCode?: string;
  schoolName?: string;
  grade?: string;
  level: number;
  totalXp: number;
  currentStreak: number;
  achievements?: StudentAchievement[];
  competitionRecord?: {
    competitionTitle: string;
    score: number;
    totalPoints: number;
    percentage: number;
    submittedAt: string;
    status: string;
  }[];
}

export interface Country {
  code: string;
  name: string;
  flag: string;
  region: string;
}

export interface OnboardingState {
  firstName: string;
  lastName: string;
  photoURL?: string;
  role: UserRole;
  country: string;
  countryCode: string;
  region: string;
  schoolName: string;
  schoolVerificationStatus: SchoolVerificationStatus;
  educationSystem: string;
  grade: string;
}

// AI Teacher Types
export interface AIChatSession {
  id: string;
  title: string;
  lastMessage?: string;
  createdAt: any;
  updatedAt: any;
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'model';
  content: string;
  quickAction?: string;
  createdAt: any;
  isStreaming?: boolean;
}

// Competition Domain Types
export type CompetitionStatus =
  | 'DRAFT'
  | 'PUBLISHED'
  | 'REGISTRATION_OPEN'
  | 'REGISTRATION_CLOSED'
  | 'LIVE'
  | 'FINISHED'
  | 'RESULTS_PROCESSING'
  | 'RESULTS_PUBLISHED'
  | 'CANCELLED';

export type CompetitionScope = 'GLOBAL' | 'COUNTRY' | 'REGION' | 'SCHOOL' | 'UNIVERSITY';

export type EducationLevel = 'SCHOOL' | 'UNIVERSITY';

export type RegistrationStatus =
  | 'REGISTERED'
  | 'CANCELLED'
  | 'WAITLISTED'
  | 'ELIGIBILITY_FAILED'
  | 'PAYMENT_PENDING'
  | 'PAYMENT_CONFIRMED';

export type PaymentStatus = 'FREE' | 'PAYMENT_PENDING' | 'PAYMENT_CONFIRMED';

export type CompetitionCategory =
  | 'All'
  | 'Academic'
  | 'Mathematics'
  | 'Science'
  | 'English'
  | 'Programming'
  | 'General Knowledge'
  | 'School'
  | 'University';

export interface CompetitionFAQ {
  question: string;
  answer: string;
}

export interface Competition {
  id: string;
  title: string;
  slug?: string;
  description: string;
  category: string;
  subject: string;
  level?: string;
  grade?: string;
  educationLevel?: EducationLevel;
  competitionType?: string;
  competitionScope?: CompetitionScope;
  status: CompetitionStatus;
  visibility?: 'PUBLIC' | 'UNLISTED' | 'PRIVATE';
  countryScope?: string;
  eligibleCountries?: string[];
  eligibleGrades?: string[];
  countryEligibility?: string;
  participantLimit?: number;
  registeredCount?: number;
  registrationStart?: string;
  registrationEnd?: string;
  startAt?: string;
  endAt?: string;
  startDate?: string;
  duration?: string;
  durationMinutes?: number;
  questionCount?: number;
  totalQuestions?: number;
  allowCalculator?: boolean;
  scoringMode?: 'STANDARD' | 'NEGATIVE_MARKING' | 'SPEED_BONUS' | string;
  entryFee?: number;
  currency?: string;
  paymentRequired?: boolean;
  prizeInfo?: string;
  rules?: string[];
  faq?: CompetitionFAQ[];
  organizerId?: string;
  published?: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export interface CompetitionRegistration {
  id: string;
  competitionId: string;
  competitionTitle?: string;
  studentId: string;
  studentName?: string;
  studentEmail?: string;
  countryCode?: string;
  country?: string;
  schoolId?: string;
  schoolName?: string;
  grade?: string;
  status: RegistrationStatus;
  paymentStatus: PaymentStatus;
  registeredAt?: any;
  createdAt?: any;
  updatedAt?: any;
}

export interface EligibilityCheckItem {
  id: string;
  title: string;
  passed: boolean;
  details: string;
}

export interface EligibilityResult {
  isEligible: boolean;
  reason?: string;
  checks: EligibilityCheckItem[];
}

export type DashboardView =
  | 'home'
  | 'learn'
  | 'compete'
  | 'competitions'
  | 'my-competitions'
  | 'leaderboard'
  | 'universities'
  | 'events'
  | 'ai'
  | 'profile'
  | 'settings';

// ==========================================
// PHASE 5: EXAM ENGINE DOMAIN TYPES
// ==========================================

export type QuestionType =
  | 'SINGLE_CHOICE'
  | 'MULTIPLE_CHOICE'
  | 'TRUE_FALSE'
  | 'SHORT_ANSWER'
  | 'NUMERIC';

export interface QuestionOption {
  id: string;
  label?: string;
  text: string;
}

export interface QuestionMedia {
  type: 'image' | 'audio' | 'video';
  url: string;
  caption?: string;
  alt?: string;
}

/**
 * Sanitized client-safe question structure.
 * NEVER exposes correctAnswer, secret solutions, or grading algorithms to the client!
 */
export interface ExamQuestion {
  id: string;
  competitionId: string;
  questionNumber: number;
  type: QuestionType;
  questionText: string;
  options?: QuestionOption[];
  points: number;
  negativePoints?: number;
  difficulty?: 'FOUNDATIONAL' | 'INTERMEDIATE' | 'OLYMPIAD' | 'ADVANCED';
  subject?: string;
  topic?: string;
  media?: QuestionMedia;
  order: number;
  allowCalculator?: boolean;
}

export type ExamSessionStatus = 'IN_PROGRESS' | 'SUBMITTING' | 'SUBMITTED' | 'EXPIRED';

export interface DeviceMetadata {
  userAgent: string;
  browser: string;
  os: string;
  screenResolution: string;
  viewport: string;
  timezone: string;
  language: string;
}

export interface ExamSession {
  id: string;
  sessionId: string;
  competitionId: string;
  competitionTitle?: string;
  studentId: string;
  studentName?: string;
  status: ExamSessionStatus;
  startedAt: string;
  serverStartTime: number;
  expiresAt: number;
  durationMinutes: number;
  totalQuestions: number;
  allowCalculator?: boolean;
  lastActivityAt?: string;
  submittedAt?: string;
  deviceMetadata?: DeviceMetadata;
  createdAt?: any;
  updatedAt?: any;
}

export interface ExamAnswerState {
  studentAnswer: string | string[];
  isFlagged?: boolean;
  lastSavedAt?: string;
}

export type StudentAnswersMap = Record<string, ExamAnswerState>;

export type IntegrityEventType =
  | 'FULLSCREEN_ENTER'
  | 'FULLSCREEN_EXIT'
  | 'TAB_HIDDEN'
  | 'TAB_VISIBLE'
  | 'WINDOW_BLUR'
  | 'WINDOW_FOCUS'
  | 'COPY_ATTEMPT'
  | 'PASTE_ATTEMPT'
  | 'CONTEXT_MENU'
  | 'SHORTCUT_ATTEMPT'
  | 'DEVTOOLS_SUSPECTED';

export interface IntegrityEventRecord {
  id?: string;
  sessionId: string;
  type: IntegrityEventType;
  timestamp: string;
  metadata?: string;
}

export interface QuestionResultBreakdown {
  questionId: string;
  questionNumber: number;
  points: number;
  earnedPoints: number;
  isCorrect: boolean;
  studentAnswer: string | string[];
  isUnanswered: boolean;
  questionText: string;
  type: QuestionType;
  options?: QuestionOption[];
}

export interface CompetitionResult {
  id: string;
  competitionId: string;
  competitionTitle?: string;
  sessionId: string;
  studentId: string;
  studentName?: string;
  score: number;
  totalPoints: number;
  percentage: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  negativeMarkingApplied?: number;
  status: 'VERIFIED' | 'FINALIZED' | 'FLAGGED_REVIEW';
  submittedAt: string;
  timeTakenSeconds?: number;
  createdAt?: any;
  breakdown?: QuestionResultBreakdown[];
}

// ==========================================
// PHASE 8: LEADERBOARD & RANKING DOMAIN TYPES
// ==========================================

export type LeaderboardTab = 'global' | 'country' | 'school' | 'competition';

export interface StudentRankingEntry {
  rank: number;
  resultId: string;
  studentId: string;
  eduVerseId: string;
  displayName: string;
  photoURL?: string;
  country: string;
  countryCode: string;
  schoolName: string;
  score: number;
  totalPoints: number;
  percentage: number;
  timeTakenSeconds: number;
  submittedAt: string;
  competitionId: string;
  competitionTitle: string;
  status: 'VERIFIED' | 'FINALIZED' | 'VALID';
  isCurrentUser?: boolean;
}

export interface CountryRankingEntry {
  rank: number;
  country: string;
  countryCode: string;
  participantCount: number;
  averageScore: number;
  topScore: number;
  totalPoints: number;
  isCurrentStudentCountry?: boolean;
}

export interface SchoolRankingEntry {
  rank: number;
  schoolName: string;
  country: string;
  countryCode: string;
  participantCount: number;
  averageScore: number;
  topScore: number;
  totalPoints: number;
  isCurrentStudentSchool?: boolean;
}

export interface CompetitionRankingEntry {
  rank: number;
  resultId: string;
  studentId: string;
  eduVerseId: string;
  displayName: string;
  photoURL?: string;
  country: string;
  countryCode: string;
  schoolName: string;
  score: number;
  totalPoints: number;
  percentage: number;
  timeTakenSeconds: number;
  submittedAt: string;
  isCurrentUser?: boolean;
}

export interface StudentStanding {
  hasRanking: boolean;
  globalRank: number | null;
  totalGlobalParticipants: number;
  countryRank: number | null;
  totalCountryParticipants: number;
  schoolRank: number | null;
  totalSchoolParticipants: number;
  verifiedCompetitionsCount: number;
  bestScore: number | null;
  bestPercentage: number | null;
  latestCompetitionTitle?: string;
}

export interface LeaderboardFilterState {
  country: string;
  school: string;
  searchQuery: string;
  metric: 'average' | 'top' | 'total';
  sortBy: 'score' | 'percentage' | 'time';
}


export type SubjectCategory =
  | 'Mathematics'
  | 'Physics'
  | 'Chemistry'
  | 'Biology'
  | 'Computer Science'
  | 'Programming'
  | 'English'
  | 'Languages'
  | 'History'
  | 'Geography'
  | 'Economics'
  | 'General Knowledge';

export interface Subject {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  category: SubjectCategory;
  active: boolean;
  displayOrder: number;
  gradient: string;
  accentColor: string;
  coursesCount?: number;
  courseCount?: number;
  topicsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export enum CourseDifficulty {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  OLYMPIAD = 'OLYMPIAD',
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  subjectId: string;
  subjectName: string;
  category: SubjectCategory;
  educationLevel: 'PRIMARY' | 'MIDDLE' | 'HIGH_SCHOOL' | 'UNIVERSITY' | 'ALL' | 'OLYMPIAD';
  grade: string; // e.g. 'Grade 9-10', 'Grade 11-12', 'Olympiad Division'
  countryScope: string; // e.g. 'GLOBAL', 'USA', 'UK', 'SG', 'IN'
  curriculum?: string; // e.g. 'International Olympiad', 'AP / IB', 'Cambridge IGCSE'
  language: string;
  thumbnail: string;
  difficulty: CourseDifficulty;
  lessonCount: number;
  totalLessons?: number;
  estimatedMinutes: number;
  estimatedDurationHours?: number;
  xpTotal?: number;
  active: boolean;
  creatorName?: string;
  organizationName?: string;
  license?: string;
  source?: string;
  prerequisites?: string[];
  learningOutcomes?: string[];
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type ContentBlockType =
  | 'TEXT'
  | 'THEORY'
  | 'FORMULA'
  | 'CODE'
  | 'EXAMPLE'
  | 'WORKED_EXAMPLE'
  | 'QUESTION'
  | 'CHECKPOINT'
  | 'CALLOUT'
  | 'NOTE'
  | 'IMAGE'
  | 'VIDEO';

export interface ContentBlock {
  id: string;
  type: ContentBlockType;
  order: number;
  title?: string;
  content?: string; // Markdown / prose / text
  formula?: string; // LaTeX formula string
  formulaExplanation?: string;
  codeLanguage?: string;
  code?: string;
  solution?: string;
  exampleProblem?: string;
  exampleSolution?: string;
  exampleExplanation?: string;
  // Interactive comprehension check question
  checkpointOptions?: string[];
  correctOption?: string;
  questionType?: QuestionType;
  questionText?: string;
  questionOptions?: QuestionOption[];
  correctAnswer?: string | string[];
  explanation?: string;
  points?: number;
  // Visual callout
  calloutVariant?: 'TIP' | 'WARNING' | 'NOTE' | 'KEY_TAKEAWAY';
  calloutTitle?: string;
  // Media
  mediaUrl?: string;
  mediaCaption?: string;
}

export type LessonType = 'STANDARD' | 'PRACTICE' | 'CASE_STUDY' | 'PROJECT';

export interface Lesson {
  id: string;
  courseId: string;
  courseTitle?: string;
  title: string;
  slug: string;
  description: string;
  contentBlocks: ContentBlock[];
  lessonType: LessonType;
  durationMinutes: number;
  order: number;
  active: boolean;
  xpReward: number;
  keyTakeaways?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface StudentCourseProgress {
  id: string;
  studentId: string;
  courseId: string;
  courseTitle?: string;
  subjectName?: string;
  completedLessonIds: string[];
  currentLessonId?: string;
  progressPercent: number;
  startedAt: string;
  lastActivityAt: string;
  completedAt?: string;
  totalLessons: number;
}

export interface PracticeQuestion {
  id: string;
  subjectId: string;
  subjectName: string;
  topic: string;
  difficulty: CourseDifficulty;
  grade: string;
  type: QuestionType;
  questionText: string;
  options?: QuestionOption[];
  correctAnswer: string | string[];
  explanation: string;
  points: number;
  hint?: string;
  source?: string;
}

export interface PracticeAttemptBreakdown {
  questionId: string;
  questionText: string;
  studentAnswer: string | string[];
  correctAnswer: string | string[];
  isCorrect: boolean;
  explanation: string;
}

export interface PracticeAttempt {
  id: string;
  studentId: string;
  subjectId?: string;
  subjectName?: string;
  topic?: string;
  difficulty: CourseDifficulty;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  score: number;
  percentage: number;
  timeSpentSeconds: number;
  xpEarned: number;
  completedAt: string;
  breakdown: PracticeAttemptBreakdown[];
  isAiGenerated?: boolean;
}

export interface DailyGoal {
  studentId: string;
  targetMinutes: number; // 15 | 30 | 60 | 120
  todayLearnedMinutes: number;
  todayActivitiesCount: number;
  completedActivitiesToday: number;
  lastActiveDate: string;
}

export type ResourceType = 'PDF' | 'DOCUMENT' | 'VIDEO' | 'AUDIO' | 'BOOK';

export interface LearningResource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  format?: string;
  gradeLevel?: string;
  subjectId: string;
  subjectName: string;
  language: string;
  educationLevel: string;
  access: 'PUBLIC' | 'STUDENT_ONLY';
  source: string;
  author?: string;
  pagesOrDuration?: string;
  downloadUrl?: string;
  license: string;
  active: boolean;
  tags?: string[];
  createdAt?: string;
}


