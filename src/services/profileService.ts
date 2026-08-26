import { doc, getDoc, updateDoc, setDoc, serverTimestamp, collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import {
  UserProfile,
  ProfileCompletionInfo,
  ProfilePrivacySettings,
  PublicStudentProfile,
  StudentAchievement,
  StudentActivity,
  XPTransaction,
} from '../types';

/**
 * Generate a unique, non-sensitive EduVerse Student ID in format EV-XXXXXX
 */
export function generateEduVerseId(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // base32 avoiding ambiguous 0/O, 1/I
  let code = '';
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars[randomIndex];
  }
  return `EV-${code}`;
}

/**
 * Accurately calculate student profile completion percentage from REAL fields
 */
export function calculateProfileCompletion(profile: Partial<UserProfile> | null): ProfileCompletionInfo {
  if (!profile) {
    return {
      percentage: 0,
      isComplete: false,
      completedFields: [],
      missingFields: [
        'First & Last Name',
        'Profile Photo',
        'Country & Region',
        'School / Institution',
        'Academic Grade',
        'Education System',
        'Academic Bio / Goals',
      ],
    };
  }

  const items = [
    {
      name: 'First & Last Name',
      weight: 20,
      isComplete: Boolean(profile.firstName?.trim() && profile.lastName?.trim()),
    },
    {
      name: 'Profile Photo',
      weight: 15,
      isComplete: Boolean(profile.photoURL?.trim()),
    },
    {
      name: 'Country & Region',
      weight: 15,
      isComplete: Boolean(profile.country?.trim()),
    },
    {
      name: 'School / Institution',
      weight: 15,
      isComplete: Boolean(profile.schoolName?.trim() && profile.schoolName !== 'Not specified'),
    },
    {
      name: 'Academic Grade',
      weight: 15,
      isComplete: Boolean(profile.grade?.trim()),
    },
    {
      name: 'Education System',
      weight: 10,
      isComplete: Boolean(profile.educationSystem?.trim()),
    },
    {
      name: 'Academic Bio / Goals',
      weight: 10,
      isComplete: Boolean(profile.bio?.trim() || (profile.targetGoals && profile.targetGoals.length > 0)),
    },
  ];

  let totalEarned = 0;
  const completedFields: string[] = [];
  const missingFields: string[] = [];

  for (const item of items) {
    if (item.isComplete) {
      totalEarned += item.weight;
      completedFields.push(item.name);
    } else {
      missingFields.push(item.name);
    }
  }

  const percentage = Math.min(100, Math.max(0, totalEarned));
  return {
    percentage,
    isComplete: percentage === 100,
    completedFields,
    missingFields,
  };
}

/**
 * Synchronize profile with backend to ensure EV ID, XP eligibility, and achievements
 */
export async function syncStudentProfileBackend(
  studentId: string,
  profileData: Partial<UserProfile>
): Promise<{
  profile: UserProfile;
  completion: ProfileCompletionInfo;
  newAchievements?: string[];
  xpAwarded?: number;
}> {
  try {
    const res = await fetch(`/api/students/${encodeURIComponent(studentId)}/profile-sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData),
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.warn('Backend profile sync request notice:', err);
  }

  // Fallback direct Firestore sync
  const userRef = doc(db, 'users', studentId);
  const snap = await getDoc(userRef);
  const existing = snap.exists() ? (snap.data() as UserProfile) : ({} as UserProfile);

  const eduVerseId = existing.eduVerseId || profileData.eduVerseId || generateEduVerseId();
  const updatedProfile: UserProfile = {
    ...existing,
    ...profileData,
    uid: studentId,
    eduVerseId,
    xp: existing.xp ?? 0,
    level: existing.level ?? 1,
    currentStreak: existing.currentStreak ?? 0,
    longestStreak: existing.longestStreak ?? 0,
    streakFreezeCount: existing.streakFreezeCount ?? 0,
    privacySettings: existing.privacySettings || {
      isPublicProfile: false,
      showSchool: true,
      showCountry: true,
      showAchievements: true,
      showCompetitionResults: true,
    },
    updatedAt: serverTimestamp(),
  };

  await setDoc(userRef, updatedProfile, { merge: true });
  const completion = calculateProfileCompletion(updatedProfile);

  return {
    profile: updatedProfile,
    completion,
  };
}

/**
 * Record a verified qualifying learning or practice activity
 */
export async function recordQualifyingActivity(
  studentId: string,
  activity: {
    type: 'AI_SESSION' | 'LESSON_COMPLETED' | 'PRACTICE_COMPLETED' | 'PROFILE_COMPLETED';
    sourceId?: string;
    description?: string;
    metadata?: any;
  }
): Promise<{
  success: boolean;
  xpEarned: number;
  totalXp: number;
  level: number;
  previousLevel: number;
  leveledUp: boolean;
  currentStreak: number;
  newAchievements: StudentAchievement[];
}> {
  try {
    const res = await fetch(`/api/students/${encodeURIComponent(studentId)}/activity/qualifying`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(activity),
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('Error recording qualifying activity via backend:', err);
  }

  return {
    success: false,
    xpEarned: 0,
    totalXp: 0,
    level: 1,
    previousLevel: 1,
    leveledUp: false,
    currentStreak: 0,
    newAchievements: [],
  };
}

/**
 * Fetch full academic summary: profile, XP transactions, achievements, activities, and competition records
 */
export async function fetchStudentAcademicSummary(studentId: string): Promise<{
  profile: UserProfile | null;
  xpTransactions: XPTransaction[];
  achievements: StudentAchievement[];
  activities: StudentActivity[];
  competitionResults: any[];
}> {
  try {
    const res = await fetch(`/api/students/${encodeURIComponent(studentId)}/summary`);
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.warn('Backend summary request fallback to Firestore:', err);
  }

  // Fallback direct Firestore reads
  try {
    const userDoc = await getDoc(doc(db, 'users', studentId));
    const profile = userDoc.exists() ? (userDoc.data() as UserProfile) : null;

    return {
      profile,
      xpTransactions: [],
      achievements: [],
      activities: [],
      competitionResults: [],
    };
  } catch {
    return {
      profile: null,
      xpTransactions: [],
      achievements: [],
      activities: [],
      competitionResults: [],
    };
  }
}

/**
 * Update student privacy preferences
 */
export async function updateStudentPrivacySettings(
  studentId: string,
  settings: ProfilePrivacySettings
): Promise<void> {
  const userRef = doc(db, 'users', studentId);
  await updateDoc(userRef, {
    privacySettings: settings,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Fetch public profile by EV-ID or UID
 */
export async function fetchPublicStudentProfile(
  identifier: string
): Promise<PublicStudentProfile | null> {
  try {
    const res = await fetch(`/api/students/public/${encodeURIComponent(identifier)}`);
    if (res.ok) {
      return await res.json();
    }
    return null;
  } catch (error) {
    console.error('Error fetching public student profile:', error);
    return null;
  }
}
