import { LevelInfo, XPTransactionType } from '../types';

/**
 * Configurable XP Rules for EduVerse activities
 * Values are managed authoritatively and can be tuned centrally.
 */
export const XP_RULES = {
  PROFILE_COMPLETED: 50,
  LESSON_COMPLETED: 20,
  PRACTICE_COMPLETED: 10,
  COMPETITION_REGISTERED: 5,
  COMPETITION_COMPLETED: 30,
  AI_SESSION: 15,
  STREAK_3_DAYS: 30,
  STREAK_7_DAYS: 75,
  ACHIEVEMENT_REWARDS: {
    COMMON: 25,
    RARE: 50,
    EPIC: 75,
    LEGENDARY: 100,
  },
} as const;

/**
 * Configurable Level Tier Progression Structure
 * Uses a progressive curve where higher levels require incrementally more XP.
 */
interface LevelTier {
  level: number;
  baseXP: number;
  title: string;
}

export const LEVEL_TIERS: LevelTier[] = [
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
  { level: 11, baseXP: 3300, title: 'EduVerse Luminary' },
  { level: 12, baseXP: 4000, title: 'Supreme Scholar' },
];

/**
 * Calculate full level progression details from real total XP
 */
export function getLevelInfo(totalXP: number): LevelInfo {
  const safeXP = Math.max(0, Math.floor(totalXP || 0));

  let currentTierIndex = 0;
  for (let i = 0; i < LEVEL_TIERS.length; i++) {
    if (safeXP >= LEVEL_TIERS[i].baseXP) {
      currentTierIndex = i;
    } else {
      break;
    }
  }

  const currentTier = LEVEL_TIERS[currentTierIndex];
  const nextTier = LEVEL_TIERS[currentTierIndex + 1] || {
    level: currentTier.level + 1,
    baseXP: currentTier.baseXP + 1000,
    title: 'EduVerse Luminary',
  };

  const xpInCurrentLevel = safeXP - currentTier.baseXP;
  const xpRequiredForNextLevel = nextTier.baseXP - currentTier.baseXP;
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round((xpInCurrentLevel / xpRequiredForNextLevel) * 100))
  );
  const xpToNextLevel = Math.max(0, nextTier.baseXP - safeXP);

  return {
    level: currentTier.level,
    title: currentTier.title,
    currentLevelBaseXP: currentTier.baseXP,
    nextLevelXP: nextTier.baseXP,
    xpInCurrentLevel,
    xpRequiredForNextLevel,
    progressPercent,
    xpToNextLevel,
  };
}

/**
 * Local storage key helper to track shown level up celebrations
 * Ensures animation only displays ONCE when a new level is achieved.
 */
export function hasSeenLevelCelebration(studentId: string, level: number): boolean {
  try {
    const key = `ev_lvl_seen_${studentId}_${level}`;
    return localStorage.getItem(key) === 'true';
  } catch {
    return false;
  }
}

export function markLevelCelebrationSeen(studentId: string, level: number): void {
  try {
    const key = `ev_lvl_seen_${studentId}_${level}`;
    localStorage.setItem(key, 'true');
  } catch {
    // Ignore storage issues
  }
}
