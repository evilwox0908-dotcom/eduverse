import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import { Competition } from '../types';

/**
 * Valid publicly visible statuses for competitions.
 * Draft and Cancelled are filtered out from student views.
 */
export const VISIBLE_STATUSES = [
  'PUBLISHED',
  'REGISTRATION_OPEN',
  'REGISTRATION_CLOSED',
  'LIVE',
  'FINISHED',
  'RESULTS_PROCESSING',
  'RESULTS_PUBLISHED',
  'upcoming',
  'active',
  'completed',
];

/**
 * Fetch all published/active competitions from Firestore
 */
export async function getPublishedCompetitions(): Promise<Competition[]> {
  try {
    const compsRef = collection(db, 'competitions');
    const snapshot = await getDocs(compsRef);
    
    const competitions: Competition[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as Competition;
      // Accept document if status is publicly visible or published flag is true
      if (
        data.published === true ||
        VISIBLE_STATUSES.includes(data.status?.toUpperCase?.() || data.status)
      ) {
        competitions.push({
          id: docSnap.id,
          ...data,
        });
      }
    });

    return competitions;
  } catch (error) {
    console.error('Error fetching competitions from Firestore:', error);
    return [];
  }
}

/**
 * Real-time subscription to published competitions
 */
export function subscribeToPublishedCompetitions(
  onUpdate: (competitions: Competition[]) => void
): Unsubscribe {
  const compsRef = collection(db, 'competitions');

  return onSnapshot(
    compsRef,
    (snapshot) => {
      const competitions: Competition[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Competition;
        if (
          data.published === true ||
          VISIBLE_STATUSES.includes(data.status?.toUpperCase?.() || data.status)
        ) {
          competitions.push({
            id: docSnap.id,
            ...data,
          });
        }
      });
      onUpdate(competitions);
    },
    (error) => {
      console.error('Error in competitions subscription:', error);
      onUpdate([]);
    }
  );
}

/**
 * Fetch single competition by ID
 */
export async function getCompetitionById(competitionId: string): Promise<Competition | null> {
  try {
    const compDocRef = doc(db, 'competitions', competitionId);
    const snap = await getDoc(compDocRef);
    if (snap.exists()) {
      return {
        id: snap.id,
        ...snap.data(),
      } as Competition;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching competition ${competitionId}:`, error);
    return null;
  }
}

/**
 * Real-time subscription to a single competition
 */
export function subscribeToCompetition(
  competitionId: string,
  onUpdate: (competition: Competition | null) => void
): Unsubscribe {
  const compDocRef = doc(db, 'competitions', competitionId);

  return onSnapshot(
    compDocRef,
    (snap) => {
      if (snap.exists()) {
        onUpdate({
          id: snap.id,
          ...snap.data(),
        } as Competition);
      } else {
        onUpdate(null);
      }
    },
    (error) => {
      console.error(`Error subscribing to competition ${competitionId}:`, error);
      onUpdate(null);
    }
  );
}
