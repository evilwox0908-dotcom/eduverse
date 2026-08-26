import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import { Competition, CompetitionRegistration, UserProfile } from '../types';

/**
 * Unique registration ID format: `${competitionId}_${studentId}`
 */
export function getRegistrationDocId(competitionId: string, studentId: string): string {
  return `${competitionId}_${studentId}`;
}

/**
 * Fetch a student's registration for a specific competition
 */
export async function getStudentRegistration(
  competitionId: string,
  studentId: string
): Promise<CompetitionRegistration | null> {
  try {
    const regId = getRegistrationDocId(competitionId, studentId);
    const regDocRef = doc(db, 'competitionRegistrations', regId);
    const snap = await getDoc(regDocRef);

    if (snap.exists()) {
      return {
        id: snap.id,
        ...snap.data(),
      } as CompetitionRegistration;
    }
    return null;
  } catch (error) {
    console.error('Error fetching student registration:', error);
    return null;
  }
}

/**
 * Subscribe to a single student's registration for a specific competition
 */
export function subscribeToStudentRegistration(
  competitionId: string,
  studentId: string,
  onUpdate: (registration: CompetitionRegistration | null) => void
): Unsubscribe {
  const regId = getRegistrationDocId(competitionId, studentId);
  const regDocRef = doc(db, 'competitionRegistrations', regId);

  return onSnapshot(
    regDocRef,
    (snap) => {
      if (snap.exists()) {
        onUpdate({
          id: snap.id,
          ...snap.data(),
        } as CompetitionRegistration);
      } else {
        onUpdate(null);
      }
    },
    (error) => {
      console.error('Error subscribing to student registration:', error);
      onUpdate(null);
    }
  );
}

/**
 * Subscribe to all registrations for a student
 */
export function subscribeToAllStudentRegistrations(
  studentId: string,
  onUpdate: (registrations: CompetitionRegistration[]) => void
): Unsubscribe {
  const regRef = collection(db, 'competitionRegistrations');
  const q = query(regRef, where('studentId', '==', studentId));

  return onSnapshot(
    q,
    (snapshot) => {
      const registrations: CompetitionRegistration[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as CompetitionRegistration[];
      onUpdate(registrations);
    },
    (error) => {
      console.error('Error subscribing to all student registrations:', error);
      onUpdate([]);
    }
  );
}

/**
 * Register a student for a competition.
 * Strictly prevents duplicate registrations by using `${competitionId}_${studentId}`.
 */
export async function registerStudentForCompetition(
  competition: Competition,
  userProfile: UserProfile
): Promise<CompetitionRegistration> {
  const regId = getRegistrationDocId(competition.id, userProfile.uid);
  const regDocRef = doc(db, 'competitionRegistrations', regId);

  // Check if already registered
  const existingSnap = await getDoc(regDocRef);
  if (existingSnap.exists()) {
    const existingData = existingSnap.data() as CompetitionRegistration;
    if (existingData.status === 'REGISTERED' || existingData.status === 'PAYMENT_CONFIRMED') {
      throw new Error('You are already registered for this competition.');
    }
  }

  // Determine initial status based on fee requirements
  const isPaid = (competition.entryFee && competition.entryFee > 0) || competition.paymentRequired;
  const initialStatus = isPaid ? 'PAYMENT_PENDING' : 'REGISTERED';
  const paymentStatus = isPaid ? 'PAYMENT_PENDING' : 'FREE';

  const registrationData: Omit<CompetitionRegistration, 'createdAt' | 'updatedAt' | 'registeredAt'> & {
    registeredAt: any;
    createdAt: any;
    updatedAt: any;
  } = {
    id: regId,
    competitionId: competition.id,
    competitionTitle: competition.title,
    studentId: userProfile.uid,
    studentName: `${userProfile.firstName} ${userProfile.lastName || ''}`.trim(),
    studentEmail: userProfile.email,
    countryCode: userProfile.countryCode || 'GLOBAL',
    country: userProfile.country || 'Global',
    schoolId: userProfile.schoolId || '',
    schoolName: userProfile.schoolName || '',
    grade: userProfile.grade || '',
    status: initialStatus,
    paymentStatus,
    registeredAt: serverTimestamp(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(regDocRef, registrationData);

  return {
    ...registrationData,
    registeredAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Cancel a student's registration
 */
export async function cancelStudentRegistration(
  competitionId: string,
  studentId: string
): Promise<void> {
  const regId = getRegistrationDocId(competitionId, studentId);
  const regDocRef = doc(db, 'competitionRegistrations', regId);

  await updateDoc(regDocRef, {
    status: 'CANCELLED',
    updatedAt: serverTimestamp(),
  });
}

/**
 * Check a student's registration
 */
export const checkStudentRegistration = getStudentRegistration;
