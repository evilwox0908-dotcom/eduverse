import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  verifyPasswordResetCode,
  confirmPasswordReset,
  sendPasswordResetEmail,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  serverTimestamp,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { UserProfile, AIChatSession, AIChatMessage, Competition } from '../types';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Configure Firestore instance
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Helper to verify a Firebase password reset action code
export async function verifyResetActionCode(oobCode: string): Promise<string> {
  return await verifyPasswordResetCode(auth, oobCode);
}

// Helper to confirm password reset with new password
export async function confirmNewPassword(oobCode: string, newPass: string): Promise<void> {
  return await confirmPasswordReset(auth, oobCode, newPass);
}

// Helper to request password reset email
export async function requestPasswordReset(email: string): Promise<void> {
  return await sendPasswordResetEmail(auth, email.trim());
}


// Helper to fetch user profile
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userDocRef = doc(db, 'users', uid);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

// Subscribe to live user profile changes
export function subscribeToUserProfile(
  uid: string,
  onUpdate: (profile: UserProfile | null) => void
): Unsubscribe {
  const userDocRef = doc(db, 'users', uid);
  return onSnapshot(
    userDocRef,
    (snap) => {
      if (snap.exists()) {
        onUpdate(snap.data() as UserProfile);
      } else {
        onUpdate(null);
      }
    },
    (error) => {
      console.error('User profile subscription error:', error);
    }
  );
}

// Helper to create or update user profile
export async function saveUserProfile(
  uid: string,
  data: Partial<UserProfile>
): Promise<void> {
  const userDocRef = doc(db, 'users', uid);
  const snap = await getDoc(userDocRef);

  if (snap.exists()) {
    await updateDoc(userDocRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } else {
    await setDoc(userDocRef, {
      uid,
      profileCompleted: false,
      eduverseScore: 0,
      xp: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      ...data,
    });
  }
}

// ==========================================
// AI CHAT FIRESTORE OPERATIONS
// ==========================================

export async function createAIChatSession(
  uid: string,
  title: string = 'New Academic Session'
): Promise<string> {
  try {
    const chatsRef = collection(db, 'users', uid, 'aiChats');
    const docRef = await addDoc(chatsRef, {
      userId: uid,
      title,
      lastMessage: '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating AI chat session:', error);
    throw error;
  }
}

export function subscribeToAIChatSessions(
  uid: string,
  onUpdate: (sessions: AIChatSession[]) => void
): Unsubscribe {
  const chatsRef = collection(db, 'users', uid, 'aiChats');
  const q = query(chatsRef, orderBy('updatedAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const sessions: AIChatSession[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as AIChatSession[];
      onUpdate(sessions);
    },
    (error) => {
      console.error('Error subscribing to AI chat sessions:', error);
    }
  );
}

export function subscribeToChatMessages(
  uid: string,
  chatId: string,
  onUpdate: (messages: AIChatMessage[]) => void
): Unsubscribe {
  const messagesRef = collection(db, 'users', uid, 'aiChats', chatId, 'messages');
  const q = query(messagesRef, orderBy('createdAt', 'asc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const messages: AIChatMessage[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as AIChatMessage[];
      onUpdate(messages);
    },
    (error) => {
      console.error('Error subscribing to chat messages:', error);
    }
  );
}

export async function saveAIChatMessage(
  uid: string,
  chatId: string,
  message: { role: 'user' | 'assistant' | 'model'; content: string; quickAction?: string }
): Promise<string> {
  try {
    const messagesRef = collection(db, 'users', uid, 'aiChats', chatId, 'messages');
    const msgDoc = await addDoc(messagesRef, {
      ...message,
      createdAt: serverTimestamp(),
    });

    // Update parent chat's lastMessage and updatedAt
    const chatDocRef = doc(db, 'users', uid, 'aiChats', chatId);
    await updateDoc(chatDocRef, {
      lastMessage: message.content.slice(0, 100),
      updatedAt: serverTimestamp(),
    });

    return msgDoc.id;
  } catch (error) {
    console.error('Error saving AI chat message:', error);
    throw error;
  }
}

// ==========================================
// COMPETITIONS FIRESTORE OPERATIONS
// ==========================================

export async function getPublishedCompetitions(): Promise<Competition[]> {
  try {
    const compsRef = collection(db, 'competitions');
    const q = query(compsRef, where('published', '==', true));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as Competition[];
  } catch (error) {
    console.error('Error fetching competitions:', error);
    return [];
  }
}

export function subscribeToCompetitions(
  onUpdate: (competitions: Competition[]) => void
): Unsubscribe {
  const compsRef = collection(db, 'competitions');
  const q = query(compsRef, where('published', '==', true));

  return onSnapshot(
    q,
    (snapshot) => {
      const comps: Competition[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as Competition[];
      onUpdate(comps);
    },
    (error) => {
      console.error('Error subscribing to competitions:', error);
      onUpdate([]);
    }
  );
}
