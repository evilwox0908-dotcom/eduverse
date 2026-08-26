import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import {
  getSanitizedQuestions,
  evaluateStudentSubmission,
} from './src/server/competitionQuestionsData';
import {
  INITIAL_SUBJECTS,
  INITIAL_COURSES,
  INITIAL_LESSONS,
  INITIAL_PRACTICE_QUESTIONS,
  INITIAL_RESOURCES,
  evaluatePracticeAttempt,
} from './src/server/learningData';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-Memory Server-authoritative Exam Session & Results Store (Synchronized during process runtime)
interface ServerExamSession {
  id: string;
  sessionId: string;
  competitionId: string;
  competitionTitle?: string;
  studentId: string;
  studentName?: string;
  status: 'IN_PROGRESS' | 'SUBMITTING' | 'SUBMITTED' | 'EXPIRED';
  startedAt: string;
  serverStartTime: number;
  expiresAt: number;
  durationMinutes: number;
  totalQuestions: number;
  allowCalculator?: boolean;
  deviceMetadata?: any;
  lastActivityAt?: string;
  submittedAt?: string;
  resultId?: string;
}

// Phase 5: In-memory exam session stores
const activeExamSessions = new Map<string, ServerExamSession>();
const studentActiveSessionMap = new Map<string, string>(); // `${competitionId}_${studentId}` -> sessionId
const examAnswersStore = new Map<string, any>(); // `${sessionId}_${questionId}` -> answer object
const integrityEventsStore = new Map<string, any[]>(); // sessionId -> event logs
const competitionResultsStore = new Map<string, any>(); // resultId -> evaluated result

const studentProfilesStore = new Map<string, any>();
const xpTransactionsStore = new Map<string, any[]>();
const studentAchievementsStore = new Map<string, any[]>();
const studentActivitiesStore = new Map<string, any[]>();

// Phase 7: Real Learning Ecosystem stores
const studentCourseProgressStore = new Map<string, any>(); // `${studentId}_${courseId}` -> StudentCourseProgress
const practiceAttemptsStore = new Map<string, any[]>(); // studentId -> PracticeAttempt[]
const dailyGoalsStore = new Map<string, any>(); // studentId -> DailyGoal
const dailyPracticeXpStore = new Map<string, { date: string; xp: number }>(); // studentId -> { date, xp }

// Configurable level tiers in backend
const SERVER_LEVEL_TIERS = [
  { level: 1, baseXP: 0, title: 'Novice Scholar' },
  { level: 2, baseXP: 100, title: 'Junior Competitor' },
  { level: 3, baseXP: 250, title: 'Academic Explorer' },
  { level: 4, baseXP: 450, title: 'Skilled Inquisitor' },
  { level: 5, baseXP: 700, title: 'Olympiad Contender' },
  { level: 6, baseXP: 1000, title: 'Master Problem Solver' },
  { level: 7, baseXP: 1350, title: 'Elite Challenger' },
  { level: 8, baseXP: 1750, title: 'Academic Vanguard' },
  { level: 9, baseXP: 2200, title: 'Global Polymath' },
  { level: 10, baseXP: 2700, title: 'Grandmaster Laureate' },
];

function calculateLevelFromXP(totalXP: number): number {
  const safeXP = Math.max(0, Math.floor(totalXP || 0));
  let lvl = 1;
  for (const tier of SERVER_LEVEL_TIERS) {
    if (safeXP >= tier.baseXP) {
      lvl = tier.level;
    } else {
      break;
    }
  }
  return lvl;
}

function generateSecureEVId(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `EV-${code}`;
}

function calculateProfilePercentage(profile: any): number {
  if (!profile) return 0;
  let score = 0;
  if (profile.firstName?.trim() && profile.lastName?.trim()) score += 20;
  if (profile.photoURL?.trim()) score += 15;
  if (profile.country?.trim()) score += 15;
  if (profile.schoolName?.trim() && profile.schoolName !== 'Not specified') score += 15;
  if (profile.grade?.trim()) score += 15;
  if (profile.educationSystem?.trim()) score += 10;
  if (profile.bio?.trim() || (profile.targetGoals && profile.targetGoals.length > 0)) score += 10;
  return Math.min(100, Math.max(0, score));
}

// Award XP, track transactions, update streak, check level advancement and achievements
function processStudentXPAndEvent(
  studentId: string,
  type: string,
  amount: number,
  sourceId: string,
  description: string,
  activityTitle?: string,
  metadata?: any
) {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const nowIso = now.toISOString();

  // 1. Check idempotency for specific transactions
  const transactions = xpTransactionsStore.get(studentId) || [];
  const isDuplicate = transactions.some((t) => t.type === type && t.sourceId === sourceId);
  if (isDuplicate) {
    const prof = studentProfilesStore.get(studentId) || { uid: studentId, xp: 0, level: 1 };
    return {
      success: true,
      isDuplicate: true,
      xpEarned: 0,
      totalXp: prof.xp || 0,
      level: prof.level || 1,
      previousLevel: prof.level || 1,
      leveledUp: false,
      newAchievements: [],
    };
  }

  // 2. Fetch or initialize student profile
  const profile = studentProfilesStore.get(studentId) || {
    uid: studentId,
    eduVerseId: generateSecureEVId(),
    xp: 0,
    level: 1,
    currentStreak: 0,
    longestStreak: 0,
    lastActivityDate: null,
    streakFreezeCount: 0,
    privacySettings: {
      isPublicProfile: false,
      showSchool: true,
      showCountry: true,
      showAchievements: true,
      showCompetitionResults: true,
    },
  };

  const previousLevel = profile.level || calculateLevelFromXP(profile.xp || 0);

  // 3. Record XP Transaction
  const txId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  transactions.push({
    id: txId,
    studentId,
    type,
    amount,
    sourceId,
    description,
    createdAt: nowIso,
  });
  xpTransactionsStore.set(studentId, transactions);

  // 4. Update total XP and Level
  const newTotalXp = (profile.xp || 0) + amount;
  const currentLevel = calculateLevelFromXP(newTotalXp);
  const leveledUp = currentLevel > previousLevel;

  // 5. Update Streak for qualifying activities
  let currentStreak = profile.currentStreak || 0;
  let longestStreak = profile.longestStreak || 0;
  const lastDate = profile.lastActivityDate;

  if (lastDate !== todayStr) {
    if (lastDate) {
      const last = new Date(lastDate);
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (lastDate === yesterdayStr) {
        currentStreak += 1;
      } else {
        currentStreak = 1;
      }
    } else {
      currentStreak = 1;
    }
    longestStreak = Math.max(longestStreak, currentStreak);
  }

  // 6. Check and award automated achievements
  const studentAchievements = studentAchievementsStore.get(studentId) || [];
  const newAchievements: any[] = [];

  function unlockAchievement(id: string, name: string, desc: string, icon: string, cat: string, rar: string, rXp: number) {
    if (!studentAchievements.some((a) => a.achievementId === id)) {
      const ach = {
        id: `ach_${id}_${studentId}`,
        studentId,
        achievementId: id,
        name,
        description: desc,
        icon,
        category: cat,
        rarity: rar,
        rewardXp: rXp,
        unlockedAt: nowIso,
        sourceId,
      };
      studentAchievements.push(ach);
      newAchievements.push(ach);

      // Log achievement activity
      const acts = studentActivitiesStore.get(studentId) || [];
      acts.unshift({
        id: `act_ach_${Date.now()}_${id}`,
        studentId,
        type: 'ACHIEVEMENT_UNLOCKED',
        title: `Achievement Unlocked: ${name}`,
        description: desc,
        timestamp: nowIso,
      });
      studentActivitiesStore.set(studentId, acts);
    }
  }

  // Streak Diligence Achievement
  if (currentStreak >= 3) {
    unlockAchievement(
      'ACADEMIC_DILIGENCE',
      'Consistent Scholar',
      'Maintain an active 3-day learning streak across platform activities.',
      'Flame',
      'CONSISTENCY',
      'RARE',
      50
    );
  }

  // Level 5 Vanguard Achievement
  if (currentLevel >= 5) {
    unlockAchievement(
      'LEVEL_5_VANGUARD',
      'Olympiad Vanguard',
      'Reach EduVerse Level 5 through continuous academic excellence.',
      'ShieldCheck',
      'ACADEMIC',
      'EPIC',
      75
    );
  }

  studentAchievementsStore.set(studentId, studentAchievements);

  // 7. Update profile in store
  profile.xp = newTotalXp;
  profile.level = currentLevel;
  profile.currentStreak = currentStreak;
  profile.longestStreak = longestStreak;
  profile.lastActivityDate = todayStr;
  studentProfilesStore.set(studentId, profile);

  // 8. Log Main Activity Event
  const activities = studentActivitiesStore.get(studentId) || [];
  activities.unshift({
    id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    studentId,
    type: type === 'COMPETITION_COMPLETED' ? 'EXAM_COMPLETED' : type === 'AI_SESSION' ? 'AI_SESSION' : 'XP_EARNED',
    title: activityTitle || description,
    description: `Earned +${amount} XP (${description})`,
    timestamp: nowIso,
    metadata: metadata ? JSON.stringify(metadata) : undefined,
  });

  if (leveledUp) {
    activities.unshift({
      id: `act_lvl_${Date.now()}`,
      studentId,
      type: 'LEVEL_UP',
      title: `Advanced to Level ${currentLevel}`,
      description: `Reached Level ${currentLevel} with ${newTotalXp} Total XP!`,
      timestamp: nowIso,
    });
  }

  studentActivitiesStore.set(studentId, activities);

  return {
    success: true,
    isDuplicate: false,
    xpEarned: amount,
    totalXp: newTotalXp,
    level: currentLevel,
    previousLevel,
    leveledUp,
    currentStreak,
    newAchievements,
  };
}

// Lazy Gemini client helper
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not set in environment. Gemini features will return informative errors.');
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'EduVerse Backend Engine',
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // AI Teacher Chat API
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const { message, history = [], studentContext = {}, quickAction } = req.body;

      if (!message || typeof message !== 'string') {
        res.status(400).json({ error: 'Valid message string is required' });
        return;
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        res.status(500).json({
          error: 'Gemini API key is not configured on the server. Please check the Secrets panel in AI Studio.',
        });
        return;
      }

      const ai = getGeminiClient();

      const studentName = studentContext.firstName || 'Student';
      const grade = studentContext.grade || 'High School';
      const educationSystem = studentContext.educationSystem || 'International';
      const country = studentContext.country || 'Global';

      const systemInstruction = `You are the EduVerse AI Teacher — an elite, inspiring, rigorous, and supportive academic coach for EduVerse (a premier global education and academic competition platform).

STUDENT CONTEXT:
- Name: ${studentName}
- Academic Level: ${grade}
- Curriculum/System: ${educationSystem}
- Nation: ${country}

PEDAGOGICAL GUIDELINES:
1. Calibrate all explanations, depth of rigor, and vocabulary precisely to ${grade} in the ${educationSystem} framework.
2. If the student is in earlier grades (e.g. Grade 6-8), use intuitive analogies, clear step-by-step logic, and foundational terminology.
3. If the student is in senior grades (e.g. Grade 9-12 / IB / A-Levels / AP), use formal scientific and mathematical rigor, standard notations, theorem references, and exam-level depth.
4. Format math equations, scientific notation, and formulas using clean Markdown and LaTeX notation (e.g., $E=mc^2$ or block $$\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$).
5. Always maintain an encouraging, focused, academic tone. Encourage critical thinking, problem-solving, and competition readiness.
6. When answering questions, structure your response with:
   - Clear conceptual insight
   - Step-by-step breakdown or derivation
   - A brief check-for-understanding or follow-up challenge question when suitable.
7. If the student requests a quiz or study plan, generate a real, high-quality, formatted response without placeholder text.`;

      // Build conversation contents
      const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

      // Format previous history (limit to last 10 messages for context efficiency)
      if (Array.isArray(history) && history.length > 0) {
        const recentHistory = history.slice(-10);
        for (const item of recentHistory) {
          if (item && item.role && item.content) {
            contents.push({
              role: item.role === 'assistant' || item.role === 'model' ? 'model' : 'user',
              parts: [{ text: String(item.content) }],
            });
          }
        }
      }

      // Append current message
      let promptText = message;
      if (quickAction === 'quiz') {
        promptText = `[STUDENT REQUEST FOR QUIZ]: Based on ${message || 'our current topic'}, generate an interactive 3-question diagnostic quiz appropriate for ${grade}. Include multiple-choice options with letters (A, B, C, D) and specify the correct answers with explanations at the bottom under an expandable or clearly marked Answers section.`;
      } else if (quickAction === 'explain') {
        promptText = `[STUDENT REQUEST FOR DEEP EXPLANATION]: Please explain the topic "${message}" from fundamentals to advanced concepts, calibrated for ${grade} (${educationSystem}). Include real-world applications and key formulas.`;
      } else if (quickAction === 'study_plan') {
        promptText = `[STUDENT REQUEST FOR STUDY PLAN]: Create a personalized, structured 7-day study and practice plan for "${message}" for a ${grade} student aiming for top marks and academic competition mastery. If any key parameters (e.g. daily hours) are needed, ask a quick follow-up.`;
      } else if (quickAction === 'mistake') {
        promptText = `[STUDENT REQUEST FOR ERROR ANALYSIS]: Here is a problem or mistake I want to understand: "${message}". Please break down the common pitfalls, correct logic step-by-step, and provide a similar practice problem.`;
      }

      contents.push({
        role: 'user',
        parts: [{ text: promptText }],
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const generatedText = response.text || 'I apologize, but I could not generate a response at this moment. Please try asking again.';

      res.json({
        text: generatedText,
        studentName,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error('Gemini API Error in /api/ai/chat:', error);
      res.status(500).json({
        error: error?.message || 'Failed to communicate with EduVerse AI Teacher',
      });
    }
  });

  // AI Quick Action endpoint
  app.post('/api/ai/quick-action', async (req, res) => {
    try {
      const { actionType, topic, studentContext = {} } = req.body;

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        res.status(500).json({
          error: 'Gemini API key is not configured on the server. Please check the Secrets panel in AI Studio.',
        });
        return;
      }

      const ai = getGeminiClient();

      const grade = studentContext.grade || 'Grade 10';
      const educationSystem = studentContext.educationSystem || 'International';
      const studentName = studentContext.firstName || 'Student';

      let prompt = '';
      if (actionType === 'quiz') {
        prompt = `Generate a rigorous, engaging 3-question academic quiz on the topic "${topic || 'General Science & Mathematics'}" calibrated for a ${grade} student (${educationSystem}). Provide 4 choices per question (A, B, C, D) and explain the correct rationale at the end.`;
      } else if (actionType === 'study_plan') {
        prompt = `Design a high-yield, structured 5-day mastery study schedule for "${topic || 'Upcoming Olympiad & Exams'}" for a ${grade} student (${educationSystem}). Include daily topics, active recall techniques, and practice question targets.`;
      } else if (actionType === 'explain') {
        prompt = `Provide a masterclass explanation of "${topic || 'Calculus Fundamentals'}" for a ${grade} student. Start with intuitive intuition, followed by mathematical/scientific formulation and a worked example.`;
      } else {
        prompt = `Provide academic coaching guidance on "${topic || 'Academic Excellence'}" for ${studentName} (${grade}).`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          systemInstruction: `You are EduVerse AI Teacher. Answer with structured Markdown, formulas, and precise pedagogy for ${grade} (${educationSystem}).`,
          temperature: 0.7,
        },
      });

      res.json({
        text: response.text || '',
        actionType,
        topic,
      });
    } catch (error: any) {
      console.error('Gemini API Error in /api/ai/quick-action:', error);
      res.status(500).json({
        error: error?.message || 'Failed to generate academic content',
      });
    }
  });

  // =========================================================================
  // PHASE 5: REAL COMPETITION EXAM ENGINE API
  // =========================================================================

  // 1. Check Exam Readiness & Active Session Lookup
  app.get('/api/competitions/:competitionId/exam-check', (req, res) => {
    try {
      const { competitionId } = req.params;
      const studentId = String(req.query.studentId || '');

      if (!studentId) {
        res.status(400).json({ error: 'Student ID is required' });
        return;
      }

      const lookupKey = `${competitionId}_${studentId}`;
      const existingSessionId = studentActiveSessionMap.get(lookupKey);
      let activeSession: ServerExamSession | null = null;

      if (existingSessionId) {
        const session = activeExamSessions.get(existingSessionId);
        if (session) {
          // Check expiration
          const now = Date.now();
          if (session.status === 'IN_PROGRESS' && now > session.expiresAt) {
            session.status = 'EXPIRED';
          }
          activeSession = session;
        }
      }

      res.json({
        competitionId,
        studentId,
        hasActiveSession: Boolean(activeSession && activeSession.status === 'IN_PROGRESS'),
        activeSession,
      });
    } catch (error: any) {
      console.error('Error in /api/competitions/:id/exam-check:', error);
      res.status(500).json({ error: 'Internal server error checking exam readiness' });
    }
  });

  // 2. Start or Resume Authoritative Exam Session
  app.post('/api/competitions/:competitionId/exam-session/start', (req, res) => {
    try {
      const { competitionId } = req.params;
      const {
        studentId,
        studentName = 'Student Candidate',
        competitionTitle = 'EduVerse Competition',
        durationMinutes = 60,
        allowCalculator = true,
        deviceMetadata = {},
      } = req.body;

      if (!studentId) {
        res.status(400).json({ error: 'Valid student ID is required to start exam session' });
        return;
      }

      const lookupKey = `${competitionId}_${studentId}`;
      const existingSessionId = studentActiveSessionMap.get(lookupKey);

      // Check if candidate already has an active session
      if (existingSessionId) {
        const existingSession = activeExamSessions.get(existingSessionId);
        if (existingSession) {
          const now = Date.now();
          // If already submitted, return the submitted status
          if (existingSession.status === 'SUBMITTED') {
            res.status(400).json({
              error: 'This exam has already been submitted.',
              code: 'ALREADY_SUBMITTED',
              resultId: existingSession.resultId,
            });
            return;
          }

          // If in progress and not expired, return session for safe recovery (WITHOUT resetting timer!)
          if (existingSession.status === 'IN_PROGRESS' && now <= existingSession.expiresAt) {
            const sanitizedQuestions = getSanitizedQuestions(competitionId);
            const savedAnswers = examAnswersStore.get(existingSessionId) || {};
            res.json({
              session: existingSession,
              questions: sanitizedQuestions,
              savedAnswers,
              isResumed: true,
            });
            return;
          }
        }
      }

      // Create new authoritative server session
      const now = Date.now();
      const serverStartTime = now;
      const durationMs = Math.max(5, durationMinutes) * 60 * 1000;
      const expiresAt = serverStartTime + durationMs;
      const sessionId = `sess_${competitionId}_${studentId}_${now}`;

      const sanitizedQuestions = getSanitizedQuestions(competitionId);

      const newSession: ServerExamSession = {
        id: sessionId,
        sessionId,
        competitionId,
        competitionTitle,
        studentId,
        studentName,
        status: 'IN_PROGRESS',
        startedAt: new Date(serverStartTime).toISOString(),
        serverStartTime,
        expiresAt,
        durationMinutes,
        totalQuestions: sanitizedQuestions.length,
        allowCalculator,
        deviceMetadata,
        lastActivityAt: new Date(now).toISOString(),
      };

      activeExamSessions.set(sessionId, newSession);
      studentActiveSessionMap.set(lookupKey, sessionId);
      examAnswersStore.set(sessionId, {});
      integrityEventsStore.set(sessionId, [
        {
          id: `evt_init_${now}`,
          type: 'SESSION_INITIALIZED',
          timestamp: new Date(now).toISOString(),
          metadata: JSON.stringify({ device: deviceMetadata }),
        },
      ]);

      res.json({
        session: newSession,
        questions: sanitizedQuestions,
        savedAnswers: {},
        isResumed: false,
      });
    } catch (error: any) {
      console.error('Error starting exam session:', error);
      res.status(500).json({ error: 'Failed to start authoritative exam session' });
    }
  });

  // 3. Auto-save answer
  app.post('/api/competitions/:competitionId/exam-session/save-answer', (req, res) => {
    try {
      const { sessionId, studentId, questionId, studentAnswer, isFlagged } = req.body;

      if (!sessionId || !studentId || !questionId) {
        res.status(400).json({ error: 'Missing required parameters (sessionId, studentId, questionId)' });
        return;
      }

      const session = activeExamSessions.get(sessionId);
      if (!session) {
        res.status(404).json({ error: 'Exam session not found' });
        return;
      }

      if (session.studentId !== studentId) {
        res.status(403).json({ error: 'Unauthorized access to exam session' });
        return;
      }

      const now = Date.now();
      if (session.status !== 'IN_PROGRESS') {
        res.status(400).json({ error: `Cannot save answer. Session status is ${session.status}` });
        return;
      }

      if (now > session.expiresAt) {
        session.status = 'EXPIRED';
        res.status(400).json({ error: 'Exam time has expired.', code: 'EXPIRED' });
        return;
      }

      // Update session answers
      const currentAnswers = examAnswersStore.get(sessionId) || {};
      currentAnswers[questionId] = {
        studentAnswer,
        isFlagged: Boolean(isFlagged),
        lastSavedAt: new Date(now).toISOString(),
      };
      examAnswersStore.set(sessionId, currentAnswers);
      session.lastActivityAt = new Date(now).toISOString();

      res.json({
        success: true,
        questionId,
        lastSavedAt: currentAnswers[questionId].lastSavedAt,
      });
    } catch (error: any) {
      console.error('Error saving answer:', error);
      res.status(500).json({ error: 'Failed to save answer' });
    }
  });

  // 4. Log Integrity Event
  app.post('/api/competitions/:competitionId/exam-session/log-integrity', (req, res) => {
    try {
      const { sessionId, studentId, type, metadata = '' } = req.body;

      if (!sessionId || !type) {
        res.status(400).json({ error: 'sessionId and type are required' });
        return;
      }

      const session = activeExamSessions.get(sessionId);
      if (session && session.studentId === studentId) {
        const events = integrityEventsStore.get(sessionId) || [];
        const eventId = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        events.push({
          id: eventId,
          type,
          timestamp: new Date().toISOString(),
          metadata: typeof metadata === 'string' ? metadata : JSON.stringify(metadata),
        });
        integrityEventsStore.set(sessionId, events);
      }

      res.json({ success: true });
    } catch (error: any) {
      console.error('Error logging integrity event:', error);
      res.status(500).json({ error: 'Failed to log integrity event' });
    }
  });

  // 5. Submit Exam & Authoritative Server Scoring
  app.post('/api/competitions/:competitionId/exam-session/submit', (req, res) => {
    try {
      const { competitionId } = req.params;
      const { sessionId, studentId, answers: clientAnswersPayload } = req.body;

      if (!sessionId || !studentId) {
        res.status(400).json({ error: 'sessionId and studentId are required' });
        return;
      }

      const session = activeExamSessions.get(sessionId);
      if (!session) {
        res.status(404).json({ error: 'Exam session not found' });
        return;
      }

      if (session.studentId !== studentId) {
        res.status(403).json({ error: 'Unauthorized submission attempt' });
        return;
      }

      // Idempotent Check: If already submitted, return the cached official result
      if (session.status === 'SUBMITTED' && session.resultId) {
        const existingResult = competitionResultsStore.get(session.resultId);
        if (existingResult) {
          res.json({
            success: true,
            isDuplicate: true,
            resultId: session.resultId,
            result: existingResult,
          });
          return;
        }
      }

      // Set state to SUBMITTING to lock out simultaneous double-clicks
      session.status = 'SUBMITTING';

      // Merge server answers store with any final client payload
      const storedAnswers = examAnswersStore.get(sessionId) || {};
      const finalAnswers = { ...storedAnswers, ...(clientAnswersPayload || {}) };

      // Calculate authoritative score
      const evaluation = evaluateStudentSubmission(competitionId, finalAnswers);
      const now = Date.now();
      const submittedAt = new Date(now).toISOString();
      const resultId = `res_${competitionId}_${studentId}_${now}`;
      const timeTakenSeconds = Math.round((now - session.serverStartTime) / 1000);

      const officialResult = {
        id: resultId,
        competitionId,
        competitionTitle: session.competitionTitle || 'EduVerse Olympiad',
        sessionId,
        studentId,
        studentName: session.studentName || 'Student Candidate',
        score: evaluation.score,
        totalPoints: evaluation.totalPoints,
        percentage: evaluation.percentage,
        correctCount: evaluation.correctCount,
        incorrectCount: evaluation.incorrectCount,
        unansweredCount: evaluation.unansweredCount,
        negativeMarkingApplied: evaluation.negativeMarkingApplied,
        status: 'VERIFIED',
        submittedAt,
        timeTakenSeconds,
        breakdown: evaluation.breakdown,
        createdAt: submittedAt,
      };

      // Store official result and update session
      competitionResultsStore.set(resultId, officialResult);
      session.status = 'SUBMITTED';
      session.submittedAt = submittedAt;
      session.resultId = resultId;

      // Log submission integrity event
      const events = integrityEventsStore.get(sessionId) || [];
      events.push({
        id: `evt_sub_${now}`,
        type: 'EXAM_SUBMITTED',
        timestamp: submittedAt,
        metadata: JSON.stringify({ score: evaluation.score, percentage: evaluation.percentage }),
      });
      integrityEventsStore.set(sessionId, events);

      // Authoritative XP & Achievements Processing for Exam Completion
      const xpResult = processStudentXPAndEvent(
        studentId,
        'COMPETITION_COMPLETED',
        30,
        competitionId,
        `Completed ${session.competitionTitle}`,
        `Exam Submitted: ${session.competitionTitle}`,
        { score: evaluation.score, total: evaluation.totalPoints, percentage: evaluation.percentage }
      );

      // Check Special Competition Achievements
      const studentAchievements = studentAchievementsStore.get(studentId) || [];

      // 1. Pioneer achievement (first exam completed)
      if (!studentAchievements.some((a) => a.achievementId === 'COMPETITION_PIONEER')) {
        const pioneerAch = {
          id: `ach_COMPETITION_PIONEER_${studentId}`,
          studentId,
          achievementId: 'COMPETITION_PIONEER',
          name: 'Olympiad Finisher',
          description: 'Successfully submitted your first verified competition exam.',
          icon: 'Trophy',
          category: 'COMPETITION',
          rarity: 'RARE',
          rewardXp: 50,
          unlockedAt: submittedAt,
          sourceId: competitionId,
        };
        studentAchievements.push(pioneerAch);
        xpResult.newAchievements.push(pioneerAch);

        // Award Pioneer bonus XP
        const pTx = processStudentXPAndEvent(
          studentId,
          'ACHIEVEMENT_UNLOCKED',
          50,
          'COMPETITION_PIONEER',
          'Unlocked Olympiad Finisher Achievement'
        );
        xpResult.totalXp = pTx.totalXp;
        xpResult.level = pTx.level;
      }

      // 2. Perfect Precision (100% score)
      if (evaluation.percentage === 100 && !studentAchievements.some((a) => a.achievementId === 'PERFECT_PRECISION')) {
        const perfAch = {
          id: `ach_PERFECT_PRECISION_${studentId}`,
          studentId,
          achievementId: 'PERFECT_PRECISION',
          name: 'Flawless Execution',
          description: 'Achieved a 100% perfect score in an official competition exam.',
          icon: 'Crown',
          category: 'ACADEMIC',
          rarity: 'LEGENDARY',
          rewardXp: 100,
          unlockedAt: submittedAt,
          sourceId: competitionId,
        };
        studentAchievements.push(perfAch);
        xpResult.newAchievements.push(perfAch);

        const perfTx = processStudentXPAndEvent(
          studentId,
          'ACHIEVEMENT_UNLOCKED',
          100,
          'PERFECT_PRECISION',
          'Unlocked Flawless Execution Achievement'
        );
        xpResult.totalXp = perfTx.totalXp;
        xpResult.level = perfTx.level;
      }

      // 3. Speed Solver (time <= 50% max duration with >= 80% score)
      const maxSeconds = (session.durationMinutes || 60) * 60;
      if (timeTakenSeconds <= maxSeconds / 2 && evaluation.percentage >= 80 && !studentAchievements.some((a) => a.achievementId === 'SPEED_SOLVER')) {
        const speedAch = {
          id: `ach_SPEED_SOLVER_${studentId}`,
          studentId,
          achievementId: 'SPEED_SOLVER',
          name: 'Swift Intellect',
          description: 'Submitted verified exam in under 50% allotted time with >80% accuracy.',
          icon: 'Zap',
          category: 'SPECIAL',
          rarity: 'EPIC',
          rewardXp: 75,
          unlockedAt: submittedAt,
          sourceId: competitionId,
        };
        studentAchievements.push(speedAch);
        xpResult.newAchievements.push(speedAch);

        const speedTx = processStudentXPAndEvent(
          studentId,
          'ACHIEVEMENT_UNLOCKED',
          75,
          'SPEED_SOLVER',
          'Unlocked Swift Intellect Achievement'
        );
        xpResult.totalXp = speedTx.totalXp;
        xpResult.level = speedTx.level;
      }

      studentAchievementsStore.set(studentId, studentAchievements);

      res.json({
        success: true,
        resultId,
        result: officialResult,
        progression: {
          xpEarned: xpResult.xpEarned,
          totalXp: xpResult.totalXp,
          level: xpResult.level,
          leveledUp: xpResult.leveledUp,
          currentStreak: xpResult.currentStreak,
          newAchievements: xpResult.newAchievements,
        },
      });
    } catch (error: any) {
      console.error('Error submitting exam:', error);
      res.status(500).json({ error: 'Server-side exam evaluation and submission failed' });
    }
  });

  // 6. Get Official Result
  app.get('/api/competitions/:competitionId/results/:resultId', (req, res) => {
    try {
      const { resultId } = req.params;
      const studentId = String(req.query.studentId || '');

      const result = competitionResultsStore.get(resultId);
      if (!result) {
        res.status(404).json({ error: 'Competition result not found' });
        return;
      }

      // Ensure privacy: student can only view their own result unless explicitly permitted
      if (studentId && result.studentId !== studentId) {
        res.status(403).json({ error: 'Access denied: You can only view your own result.' });
        return;
      }

      res.json(result);
    } catch (error: any) {
      console.error('Error fetching result:', error);
      res.status(500).json({ error: 'Failed to fetch official result' });
    }
  });

  // ==========================================
  // PHASE 6: STUDENT PROFILE & PROGRESSION APIS
  // ==========================================

  // 7. Student Profile Sync & Verification
  app.post('/api/students/:studentId/profile-sync', (req, res) => {
    try {
      const { studentId } = req.params;
      const incoming = req.body || {};

      let profile = studentProfilesStore.get(studentId);
      if (!profile) {
        profile = {
          uid: studentId,
          eduVerseId: incoming.eduVerseId || generateSecureEVId(),
          firstName: incoming.firstName || '',
          lastName: incoming.lastName || '',
          email: incoming.email || '',
          photoURL: incoming.photoURL || '',
          role: incoming.role || 'student',
          country: incoming.country || '',
          countryCode: incoming.countryCode || '',
          region: incoming.region || '',
          schoolName: incoming.schoolName || '',
          schoolVerificationStatus: incoming.schoolVerificationStatus || 'pending',
          grade: incoming.grade || '',
          educationSystem: incoming.educationSystem || '',
          bio: incoming.bio || '',
          targetGoals: incoming.targetGoals || [],
          xp: 0,
          level: 1,
          currentStreak: 0,
          longestStreak: 0,
          lastActivityDate: null,
          streakFreezeCount: 0,
          privacySettings: incoming.privacySettings || {
            isPublicProfile: false,
            showSchool: true,
            showCountry: true,
            showAchievements: true,
            showCompetitionResults: true,
          },
        };
      } else {
        // Merge updates
        profile = {
          ...profile,
          ...incoming,
          uid: studentId,
          eduVerseId: profile.eduVerseId || incoming.eduVerseId || generateSecureEVId(),
        };
      }

      const completionPct = calculateProfilePercentage(profile);
      profile.profileCompleted = completionPct === 100;

      let xpAwarded = 0;
      const newAchievements: any[] = [];

      // If profile is 100% complete, award First Step achievement and 50 XP
      if (profile.profileCompleted) {
        const studentAchievements = studentAchievementsStore.get(studentId) || [];
        if (!studentAchievements.some((a) => a.achievementId === 'FIRST_STEP')) {
          const firstStepAch = {
            id: `ach_FIRST_STEP_${studentId}`,
            studentId,
            achievementId: 'FIRST_STEP',
            name: 'First Step',
            description: 'Completed 100% of student profile with verified academic details.',
            icon: 'UserCheck',
            category: 'LEARNING',
            rarity: 'COMMON',
            rewardXp: 50,
            unlockedAt: new Date().toISOString(),
            sourceId: 'profile_completion',
          };
          studentAchievements.push(firstStepAch);
          studentAchievementsStore.set(studentId, studentAchievements);
          newAchievements.push(firstStepAch);

          const xpRes = processStudentXPAndEvent(
            studentId,
            'PROFILE_COMPLETED',
            50,
            'profile_completion',
            'Completed 100% of EduVerse student profile',
            'Profile 100% Verified & Completed'
          );
          xpAwarded = 50;
          profile.xp = xpRes.totalXp;
          profile.level = xpRes.level;
        }
      }

      studentProfilesStore.set(studentId, profile);

      res.json({
        success: true,
        profile,
        completion: {
          percentage: completionPct,
          isComplete: completionPct === 100,
        },
        xpAwarded,
        newAchievements,
      });
    } catch (err: any) {
      console.error('Error syncing student profile:', err);
      res.status(500).json({ error: 'Failed to sync student profile' });
    }
  });

  // 8. Record Qualifying Learning Activity
  app.post('/api/students/:studentId/activity/qualifying', (req, res) => {
    try {
      const { studentId } = req.params;
      const { type, sourceId, description, metadata } = req.body || {};

      let amount = 15;
      let defaultDesc = 'Engaged with EduVerse AI Teacher';
      if (type === 'LESSON_COMPLETED') {
        amount = 20;
        defaultDesc = 'Completed interactive study lesson';
      } else if (type === 'PRACTICE_COMPLETED') {
        amount = 10;
        defaultDesc = 'Completed academic practice quiz';
      } else if (type === 'AI_SESSION') {
        amount = 15;
        defaultDesc = 'Completed AI Teacher dialogue session';
      }

      const sid = sourceId || `src_${Date.now()}`;
      const xpRes = processStudentXPAndEvent(
        studentId,
        type || 'AI_SESSION',
        amount,
        sid,
        description || defaultDesc,
        description || defaultDesc,
        metadata
      );

      // Check FIRST_AI_DIALOGUE achievement
      if (type === 'AI_SESSION') {
        const studentAchievements = studentAchievementsStore.get(studentId) || [];
        if (!studentAchievements.some((a) => a.achievementId === 'FIRST_AI_DIALOGUE')) {
          const aiAch = {
            id: `ach_FIRST_AI_DIALOGUE_${studentId}`,
            studentId,
            achievementId: 'FIRST_AI_DIALOGUE',
            name: 'AI Inquisitor',
            description: 'Engaged with EduVerse Gemini AI Teacher for deep conceptual mastery.',
            icon: 'Sparkles',
            category: 'LEARNING',
            rarity: 'COMMON',
            rewardXp: 25,
            unlockedAt: new Date().toISOString(),
            sourceId: sid,
          };
          studentAchievements.push(aiAch);
          studentAchievementsStore.set(studentId, studentAchievements);
          xpRes.newAchievements.push(aiAch);

          processStudentXPAndEvent(
            studentId,
            'ACHIEVEMENT_UNLOCKED',
            25,
            'FIRST_AI_DIALOGUE',
            'Unlocked AI Inquisitor Achievement'
          );
        }
      }

      res.json(xpRes);
    } catch (err: any) {
      console.error('Error recording qualifying activity:', err);
      res.status(500).json({ error: 'Failed to record activity' });
    }
  });

  // 9. Get Comprehensive Student Academic Summary
  app.get('/api/students/:studentId/summary', (req, res) => {
    try {
      const { studentId } = req.params;
      const profile = studentProfilesStore.get(studentId) || null;
      const xpTransactions = xpTransactionsStore.get(studentId) || [];
      const achievements = studentAchievementsStore.get(studentId) || [];
      const activities = studentActivitiesStore.get(studentId) || [];

      // Collect official competition results for this student
      const userResults: any[] = [];
      for (const result of competitionResultsStore.values()) {
        if (result.studentId === studentId) {
          userResults.push(result);
        }
      }

      res.json({
        profile,
        xpTransactions,
        achievements,
        activities,
        competitionResults: userResults,
      });
    } catch (err: any) {
      console.error('Error fetching student summary:', err);
      res.status(500).json({ error: 'Failed to fetch student summary' });
    }
  });

  // 10. Public Profile Resolver (Respects Privacy Settings)
  app.get('/api/students/public/:identifier', (req, res) => {
    try {
      const { identifier } = req.params;

      // Find profile by EV ID or UID
      let foundProfile: any = null;
      for (const prof of studentProfilesStore.values()) {
        if (prof.eduVerseId === identifier || prof.uid === identifier) {
          foundProfile = prof;
          break;
        }
      }

      if (!foundProfile) {
        res.status(404).json({ error: 'Student profile not found' });
        return;
      }

      const privacy = foundProfile.privacySettings || {
        isPublicProfile: false,
        showSchool: true,
        showCountry: true,
        showAchievements: true,
        showCompetitionResults: true,
      };

      if (!privacy.isPublicProfile) {
        res.status(403).json({
          error: 'This student has chosen to keep their profile private.',
          isPrivate: true,
        });
        return;
      }

      const studentId = foundProfile.uid;
      const achievements = privacy.showAchievements ? studentAchievementsStore.get(studentId) || [] : [];
      const compResults = privacy.showCompetitionResults
        ? Array.from(competitionResultsStore.values())
            .filter((r: any) => r.studentId === studentId)
            .map((r: any) => ({
              competitionTitle: r.competitionTitle,
              score: r.score,
              totalPoints: r.totalPoints,
              percentage: r.percentage,
              submittedAt: r.submittedAt,
              status: r.status,
            }))
        : [];

      const publicData = {
        eduVerseId: foundProfile.eduVerseId,
        displayName: `${foundProfile.firstName || ''} ${foundProfile.lastName ? foundProfile.lastName.charAt(0) + '.' : ''}`.trim() || 'EduVerse Scholar',
        photoURL: foundProfile.photoURL,
        country: privacy.showCountry ? foundProfile.country : undefined,
        countryCode: privacy.showCountry ? foundProfile.countryCode : undefined,
        schoolName: privacy.showSchool ? foundProfile.schoolName : undefined,
        grade: foundProfile.grade,
        level: foundProfile.level || 1,
        totalXp: foundProfile.xp || 0,
        currentStreak: foundProfile.currentStreak || 0,
        achievements,
        competitionRecord: compResults,
      };

      res.json(publicData);
    } catch (err: any) {
      console.error('Error fetching public student profile:', err);
      res.status(500).json({ error: 'Failed to fetch public profile' });
    }
  });

  // ==========================================
  // PHASE 7: REAL LEARNING ECOSYSTEM APIS
  // ==========================================

  // 11. Get Active Subjects
  app.get('/api/learning/subjects', (req, res) => {
    try {
      const activeSubjects = INITIAL_SUBJECTS.filter((s) => s.active).sort(
        (a, b) => a.displayOrder - b.displayOrder
      );
      res.json(activeSubjects);
    } catch (err: any) {
      console.error('Error fetching learning subjects:', err);
      res.status(500).json({ error: 'Failed to fetch learning subjects' });
    }
  });

  // 12. Get Courses with Query Filters
  app.get('/api/learning/courses', (req, res) => {
    try {
      const {
        subjectId,
        difficulty,
        grade,
        search,
        country,
      } = req.query;

      let courses = INITIAL_COURSES.filter((c) => c.active);

      if (subjectId && subjectId !== 'all') {
        courses = courses.filter((c) => c.subjectId === subjectId);
      }

      if (difficulty && difficulty !== 'all') {
        courses = courses.filter((c) => c.difficulty === difficulty);
      }

      if (grade && grade !== 'all') {
        courses = courses.filter((c) => c.grade.toLowerCase().includes(String(grade).toLowerCase()) || c.educationLevel === 'ALL');
      }

      if (country && country !== 'GLOBAL' && country !== 'all') {
        courses = courses.filter((c) => c.countryScope === 'GLOBAL' || c.countryScope === country);
      }

      if (search && typeof search === 'string' && search.trim()) {
        const q = search.trim().toLowerCase();
        courses = courses.filter(
          (c) =>
            c.title.toLowerCase().includes(q) ||
            c.description.toLowerCase().includes(q) ||
            c.subjectName.toLowerCase().includes(q) ||
            (c.curriculum && c.curriculum.toLowerCase().includes(q))
        );
      }

      res.json(courses);
    } catch (err: any) {
      console.error('Error querying courses:', err);
      res.status(500).json({ error: 'Failed to fetch courses' });
    }
  });

  // 13. Get Single Course & Lesson Outline
  app.get('/api/learning/courses/:courseId', (req, res) => {
    try {
      const { courseId } = req.params;
      const studentId = String(req.query.studentId || '');

      const course = INITIAL_COURSES.find((c) => c.id === courseId);
      if (!course) {
        res.status(404).json({ error: 'Course not found' });
        return;
      }

      const lessons = INITIAL_LESSONS.filter((l) => l.courseId === courseId && l.active)
        .sort((a, b) => a.order - b.order)
        .map((l) => ({
          id: l.id,
          courseId: l.courseId,
          title: l.title,
          slug: l.slug,
          description: l.description,
          lessonType: l.lessonType,
          durationMinutes: l.durationMinutes,
          order: l.order,
          xpReward: l.xpReward,
          contentBlocksCount: l.contentBlocks?.length || 0,
        }));

      let progress = null;
      if (studentId) {
        progress = studentCourseProgressStore.get(`${studentId}_${courseId}`) || null;
      }

      res.json({
        course,
        lessons,
        progress,
      });
    } catch (err: any) {
      console.error('Error fetching course detail:', err);
      res.status(500).json({ error: 'Failed to fetch course details' });
    }
  });

  // 14. Get Full Lesson Content
  app.get('/api/learning/courses/:courseId/lessons/:lessonId', (req, res) => {
    try {
      const { courseId, lessonId } = req.params;
      const studentId = String(req.query.studentId || '');

      const lesson = INITIAL_LESSONS.find(
        (l) => l.id === lessonId && l.courseId === courseId && l.active
      );

      if (!lesson) {
        res.status(404).json({ error: 'Lesson not found' });
        return;
      }

      const course = INITIAL_COURSES.find((c) => c.id === courseId);
      const allCourseLessons = INITIAL_LESSONS.filter((l) => l.courseId === courseId && l.active).sort(
        (a, b) => a.order - b.order
      );

      const currentIndex = allCourseLessons.findIndex((l) => l.id === lessonId);
      const previousLesson = currentIndex > 0 ? allCourseLessons[currentIndex - 1] : null;
      const nextLesson =
        currentIndex < allCourseLessons.length - 1 ? allCourseLessons[currentIndex + 1] : null;

      let isCompleted = false;
      if (studentId) {
        const progress = studentCourseProgressStore.get(`${studentId}_${courseId}`);
        if (progress && progress.completedLessonIds) {
          isCompleted = progress.completedLessonIds.includes(lessonId);
        }
      }

      res.json({
        lesson,
        course,
        navigation: {
          currentIndex: currentIndex + 1,
          totalLessons: allCourseLessons.length,
          previousLessonId: previousLesson?.id || null,
          nextLessonId: nextLesson?.id || null,
        },
        isCompleted,
      });
    } catch (err: any) {
      console.error('Error fetching lesson:', err);
      res.status(500).json({ error: 'Failed to fetch lesson' });
    }
  });

  // 15. Complete Lesson Authoritatively (Updates Progress, Awards XP, Unlocks Achievements)
  app.post('/api/learning/courses/:courseId/lessons/:lessonId/complete', (req, res) => {
    try {
      const { courseId, lessonId } = req.params;
      const { studentId, timeSpentMinutes = 15 } = req.body;

      if (!studentId) {
        res.status(400).json({ error: 'studentId is required to complete lesson' });
        return;
      }

      const lesson = INITIAL_LESSONS.find((l) => l.id === lessonId && l.courseId === courseId);
      if (!lesson) {
        res.status(404).json({ error: 'Lesson not found' });
        return;
      }

      const course = INITIAL_COURSES.find((c) => c.id === courseId);
      const courseLessons = INITIAL_LESSONS.filter((l) => l.courseId === courseId && l.active);
      const totalLessons = courseLessons.length || 1;

      const progressKey = `${studentId}_${courseId}`;
      const existingProgress = studentCourseProgressStore.get(progressKey) || {
        id: `prog_${progressKey}`,
        studentId,
        courseId,
        courseTitle: course?.title || 'Academic Course',
        subjectName: course?.subjectName || 'Mathematics',
        completedLessonIds: [],
        currentLessonId: lessonId,
        progressPercent: 0,
        startedAt: new Date().toISOString(),
        lastActivityAt: new Date().toISOString(),
        totalLessons,
      };

      const nowIso = new Date().toISOString();
      const alreadyCompleted = existingProgress.completedLessonIds.includes(lessonId);

      if (!alreadyCompleted) {
        existingProgress.completedLessonIds.push(lessonId);
      }

      existingProgress.lastActivityAt = nowIso;
      existingProgress.currentLessonId = lessonId;
      existingProgress.progressPercent = Math.min(
        100,
        Math.round((existingProgress.completedLessonIds.length / totalLessons) * 100)
      );

      const isCourseCompleted = existingProgress.progressPercent === 100;
      if (isCourseCompleted && !existingProgress.completedAt) {
        existingProgress.completedAt = nowIso;
      }

      studentCourseProgressStore.set(progressKey, existingProgress);

      // Award Lesson XP (idempotent via processStudentXPAndEvent)
      const xpEarned = alreadyCompleted ? 0 : (lesson.xpReward || 50);
      let xpResult = {
        xpEarned: 0,
        totalXp: 0,
        level: 1,
        leveledUp: false,
        currentStreak: 0,
        newAchievements: [] as any[],
      };

      if (!alreadyCompleted) {
        const tx = processStudentXPAndEvent(
          studentId,
          'LESSON_COMPLETED',
          xpEarned,
          lessonId,
          `Completed Lesson: ${lesson.title} (${course?.title || ''})`,
          `Lesson Completed: ${lesson.title}`,
          { courseId, lessonId, durationMinutes: timeSpentMinutes }
        );
        xpResult = {
          xpEarned: tx.xpEarned,
          totalXp: tx.totalXp,
          level: tx.level,
          leveledUp: tx.leveledUp,
          currentStreak: tx.currentStreak || 0,
          newAchievements: tx.newAchievements || [],
        };

        // Check Phase 7 Achievements
        const studentAchievements = studentAchievementsStore.get(studentId) || [];

        // 1. FIRST_LESSON_MASTERED Achievement
        if (!studentAchievements.some((a) => a.achievementId === 'FIRST_LESSON_MASTERED')) {
          const firstLessonAch = {
            id: `ach_FIRST_LESSON_MASTERED_${studentId}`,
            studentId,
            achievementId: 'FIRST_LESSON_MASTERED',
            name: 'Foundational Mastery',
            description: 'Mastered your first structured lesson in the EduVerse Learning Hub.',
            icon: 'BookOpen',
            category: 'LEARNING',
            rarity: 'COMMON',
            rewardXp: 30,
            unlockedAt: nowIso,
            sourceId: lessonId,
          };
          studentAchievements.push(firstLessonAch);
          studentAchievementsStore.set(studentId, studentAchievements);
          xpResult.newAchievements.push(firstLessonAch);

          processStudentXPAndEvent(
            studentId,
            'ACHIEVEMENT_UNLOCKED',
            30,
            'FIRST_LESSON_MASTERED',
            'Unlocked Foundational Mastery Achievement'
          );
        }

        // 2. COURSE_CONQUEROR Achievement
        if (isCourseCompleted && !studentAchievements.some((a) => a.achievementId === 'COURSE_CONQUEROR')) {
          const courseAch = {
            id: `ach_COURSE_CONQUEROR_${studentId}`,
            studentId,
            achievementId: 'COURSE_CONQUEROR',
            name: 'Curriculum Conqueror',
            description: `Graduated 100% of a comprehensive academic course: ${course?.title}`,
            icon: 'GraduationCap',
            category: 'ACADEMIC',
            rarity: 'RARE',
            rewardXp: 100,
            unlockedAt: nowIso,
            sourceId: courseId,
          };
          studentAchievements.push(courseAch);
          studentAchievementsStore.set(studentId, studentAchievements);
          xpResult.newAchievements.push(courseAch);

          processStudentXPAndEvent(
            studentId,
            'ACHIEVEMENT_UNLOCKED',
            100,
            'COURSE_CONQUEROR',
            `Completed course: ${course?.title}`
          );
        }
      }

      // Update Daily Goal record
      const todayStr = nowIso.split('T')[0];
      const goal = dailyGoalsStore.get(studentId) || {
        studentId,
        targetMinutes: 30,
        todayLearnedMinutes: 0,
        todayActivitiesCount: 0,
        completedActivitiesToday: 0,
        lastActiveDate: todayStr,
      };

      if (goal.lastActiveDate !== todayStr) {
        goal.todayLearnedMinutes = 0;
        goal.todayActivitiesCount = 0;
        goal.completedActivitiesToday = 0;
        goal.lastActiveDate = todayStr;
      }

      goal.todayLearnedMinutes += Math.max(5, Number(timeSpentMinutes));
      goal.todayActivitiesCount += 1;
      goal.completedActivitiesToday += 1;
      dailyGoalsStore.set(studentId, goal);

      res.json({
        success: true,
        alreadyCompleted,
        progress: existingProgress,
        progression: xpResult,
        dailyGoal: goal,
      });
    } catch (err: any) {
      console.error('Error completing lesson:', err);
      res.status(500).json({ error: 'Failed to complete lesson' });
    }
  });

  // 16. Get Student's Overall Learning Progress
  app.get('/api/learning/progress/:studentId', (req, res) => {
    try {
      const { studentId } = req.params;
      const progressList: any[] = [];

      for (const [key, prog] of studentCourseProgressStore.entries()) {
        if (key.startsWith(`${studentId}_`)) {
          progressList.push(prog);
        }
      }

      res.json({
        coursesProgress: progressList,
        totalCompletedCourses: progressList.filter((p) => p.progressPercent === 100).length,
        totalInProgressCourses: progressList.filter((p) => p.progressPercent > 0 && p.progressPercent < 100).length,
      });
    } catch (err: any) {
      console.error('Error fetching progress:', err);
      res.status(500).json({ error: 'Failed to fetch learning progress' });
    }
  });

  // 17. Get Practice Questions (by Subject, Topic, Difficulty)
  app.get('/api/learning/practice/questions', (req, res) => {
    try {
      const { subjectId, topic, difficulty, count = 5 } = req.query;

      let list = [...INITIAL_PRACTICE_QUESTIONS];

      if (subjectId && subjectId !== 'all') {
        list = list.filter((q) => q.subjectId === subjectId);
      }

      if (topic && typeof topic === 'string' && topic.trim() && topic !== 'all') {
        list = list.filter((q) => q.topic.toLowerCase().includes(topic.toLowerCase()));
      }

      if (difficulty && difficulty !== 'all') {
        list = list.filter((q) => q.difficulty === difficulty);
      }

      // Shuffle and pick requested count
      const shuffled = list.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, Number(count) || 5);

      // Return sanitized questions (without exposing correctAnswer)
      const sanitized = selected.map((q) => ({
        id: q.id,
        subjectId: q.subjectId,
        subjectName: q.subjectName,
        topic: q.topic,
        difficulty: q.difficulty,
        grade: q.grade,
        type: q.type,
        questionText: q.questionText,
        options: q.options,
        points: q.points,
        hint: q.hint,
      }));

      res.json({
        questions: sanitized,
        totalAvailable: list.length,
      });
    } catch (err: any) {
      console.error('Error getting practice questions:', err);
      res.status(500).json({ error: 'Failed to fetch practice questions' });
    }
  });

  // 18. Submit Practice Quiz & Evaluate
  app.post('/api/learning/practice/submit', (req, res) => {
    try {
      const {
        studentId,
        questionIds = [],
        answers = {},
        timeSpentSeconds = 60,
        subjectId,
        topic,
      } = req.body;

      if (!studentId || !Array.isArray(questionIds) || questionIds.length === 0) {
        res.status(400).json({ error: 'studentId and questionIds are required' });
        return;
      }

      const attempt = evaluatePracticeAttempt(
        studentId,
        questionIds,
        answers,
        timeSpentSeconds,
        topic,
        subjectId
      );

      // Check daily practice XP cap (Max 150 XP per day)
      const todayStr = new Date().toISOString().split('T')[0];
      const dailyRecord = dailyPracticeXpStore.get(studentId) || { date: todayStr, xp: 0 };
      if (dailyRecord.date !== todayStr) {
        dailyRecord.date = todayStr;
        dailyRecord.xp = 0;
      }

      const maxRemainingXp = Math.max(0, 150 - dailyRecord.xp);
      const actualXpAwarded = Math.min(attempt.xpEarned, maxRemainingXp);
      dailyRecord.xp += actualXpAwarded;
      dailyPracticeXpStore.set(studentId, dailyRecord);

      attempt.xpEarned = actualXpAwarded;

      // Save to practice history store
      const history = practiceAttemptsStore.get(studentId) || [];
      history.unshift(attempt);
      practiceAttemptsStore.set(studentId, history);

      // Award XP authoritative transaction
      let xpResult = {
        xpEarned: actualXpAwarded,
        totalXp: 0,
        level: 1,
        leveledUp: false,
        currentStreak: 0,
        newAchievements: [] as any[],
      };

      if (actualXpAwarded > 0) {
        const tx = processStudentXPAndEvent(
          studentId,
          'PRACTICE_COMPLETED',
          actualXpAwarded,
          attempt.id,
          `Completed Practice Session (${attempt.percentage}% score, ${attempt.correctCount}/${attempt.totalQuestions})`,
          `Practice Set Completed: ${topic || 'Academic Arena'}`,
          {
            score: attempt.score,
            percentage: attempt.percentage,
            correctCount: attempt.correctCount,
            timeSpentSeconds,
          }
        );
        xpResult = {
          xpEarned: tx.xpEarned,
          totalXp: tx.totalXp,
          level: tx.level,
          leveledUp: tx.leveledUp,
          currentStreak: tx.currentStreak || 0,
          newAchievements: tx.newAchievements || [],
        };
      }

      // Update Daily Goal
      const goal = dailyGoalsStore.get(studentId) || {
        studentId,
        targetMinutes: 30,
        todayLearnedMinutes: 0,
        todayActivitiesCount: 0,
        completedActivitiesToday: 0,
        lastActiveDate: todayStr,
      };

      if (goal.lastActiveDate !== todayStr) {
        goal.todayLearnedMinutes = 0;
        goal.todayActivitiesCount = 0;
        goal.completedActivitiesToday = 0;
        goal.lastActiveDate = todayStr;
      }

      goal.todayLearnedMinutes += Math.max(1, Math.round(timeSpentSeconds / 60));
      goal.todayActivitiesCount += 1;
      dailyGoalsStore.set(studentId, goal);

      res.json({
        success: true,
        attempt,
        progression: xpResult,
        dailyCap: {
          earnedToday: dailyRecord.xp,
          dailyLimit: 150,
        },
      });
    } catch (err: any) {
      console.error('Error evaluating practice submission:', err);
      res.status(500).json({ error: 'Failed to submit practice set' });
    }
  });

  // 19. Get Practice History
  app.get('/api/learning/practice/history/:studentId', (req, res) => {
    try {
      const { studentId } = req.params;
      const history = practiceAttemptsStore.get(studentId) || [];
      res.json(history);
    } catch (err: any) {
      console.error('Error fetching practice history:', err);
      res.status(500).json({ error: 'Failed to fetch practice history' });
    }
  });

  // 20. Get Daily Learning Goal
  app.get('/api/learning/daily-goal/:studentId', (req, res) => {
    try {
      const { studentId } = req.params;
      const todayStr = new Date().toISOString().split('T')[0];

      let goal = dailyGoalsStore.get(studentId);
      if (!goal || goal.lastActiveDate !== todayStr) {
        goal = {
          studentId,
          targetMinutes: goal?.targetMinutes || 30,
          todayLearnedMinutes: 0,
          todayActivitiesCount: 0,
          completedActivitiesToday: 0,
          lastActiveDate: todayStr,
        };
        dailyGoalsStore.set(studentId, goal);
      }

      res.json(goal);
    } catch (err: any) {
      console.error('Error getting daily goal:', err);
      res.status(500).json({ error: 'Failed to fetch daily goal' });
    }
  });

  // 21. Set Daily Learning Target
  app.post('/api/learning/daily-goal/:studentId', (req, res) => {
    try {
      const { studentId } = req.params;
      const { targetMinutes } = req.body;

      const validTargets = [15, 30, 60, 120];
      const target = validTargets.includes(Number(targetMinutes)) ? Number(targetMinutes) : 30;
      const todayStr = new Date().toISOString().split('T')[0];

      let goal = dailyGoalsStore.get(studentId) || {
        studentId,
        targetMinutes: target,
        todayLearnedMinutes: 0,
        todayActivitiesCount: 0,
        completedActivitiesToday: 0,
        lastActiveDate: todayStr,
      };

      goal.targetMinutes = target;
      dailyGoalsStore.set(studentId, goal);

      res.json({ success: true, goal });
    } catch (err: any) {
      console.error('Error setting daily goal:', err);
      res.status(500).json({ error: 'Failed to set daily goal' });
    }
  });

  // 22. Get Curated Academic Resources & Library
  app.get('/api/learning/resources', (req, res) => {
    try {
      const { subjectId, type } = req.query;

      let resources = INITIAL_RESOURCES.filter((r) => r.active);

      if (subjectId && subjectId !== 'all') {
        resources = resources.filter((r) => r.subjectId === subjectId);
      }

      if (type && type !== 'all') {
        resources = resources.filter((r) => r.type === type);
      }

      res.json(resources);
    } catch (err: any) {
      console.error('Error fetching resources:', err);
      res.status(500).json({ error: 'Failed to fetch resources' });
    }
  });

  // 23. On-Demand AI Custom Practice Generator (Strictly user-triggered)
  app.post('/api/ai/generate-practice', async (req, res) => {
    try {
      const { topic, subjectName = 'Mathematics', grade = 'Grade 10', count = 3 } = req.body;

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        res.status(500).json({
          error: 'Gemini API key is not configured on the server. Please check the Secrets panel in AI Studio.',
        });
        return;
      }

      const ai = getGeminiClient();

      const prompt = `You are the EduVerse AI Teacher. The student requests a custom 3-question diagnostic practice set for:
Subject: ${subjectName}
Topic: "${topic || 'Calculus and Problem Solving'}"
Grade Level: ${grade}

Generate exactly 3 high-quality multiple choice questions in strictly valid JSON format.
Each question object MUST have:
- "id": string (e.g. "ai_q1", "ai_q2", "ai_q3")
- "questionText": string
- "type": "SINGLE_CHOICE"
- "options": array of 4 objects [{"id": "A", "text": "..."}, {"id": "B", "text": "..."}, {"id": "C", "text": "..."}, {"id": "D", "text": "..."}]
- "correctAnswer": string ("A", "B", "C", or "D")
- "explanation": string (clear mathematical or scientific step-by-step rationale)
- "hint": string (helpful conceptual hint)

Respond ONLY with a valid JSON array of objects. Do not include markdown code block backticks if possible, or wrap strictly in \`\`\`json.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          temperature: 0.6,
        },
      });

      const rawText = response.text || '[]';
      // Clean JSON
      let jsonStr = rawText.trim();
      if (jsonStr.startsWith('```json')) {
        jsonStr = jsonStr.substring(7);
      } else if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.substring(3);
      }
      if (jsonStr.endsWith('```')) {
        jsonStr = jsonStr.substring(0, jsonStr.length - 3);
      }
      jsonStr = jsonStr.trim();

      const questions = JSON.parse(jsonStr);

      res.json({
        success: true,
        topic,
        subjectName,
        isAiGenerated: true,
        questions,
      });
    } catch (err: any) {
      console.error('Error generating AI practice:', err);
      res.status(500).json({
        error: err?.message || 'Failed to generate custom AI practice set',
      });
    }
  });

  // Vite middleware in dev or static files in prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EduVerse Full-Stack Server running on port ${PORT}`);
  });
}

startServer();
