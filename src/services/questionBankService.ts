import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  QuestionBankItem,
  QuestionBankStatus,
  BankDifficulty,
  TestGenerationConfig,
  GeneratedTest,
} from '../types';

/**
 * Fetch questions from Question Bank with optional filtering
 */
export async function fetchQuestionBank(
  filters?: {
    subjectId?: string;
    grade?: string;
    difficulty?: BankDifficulty | string;
    status?: QuestionBankStatus | string;
    q?: string;
    searchQuery?: string;
  },
  actorUid?: string,
  actorEmail?: string
): Promise<QuestionBankItem[]> {
  try {
    // Attempt to fetch via API first
    const params = new URLSearchParams();
    if (filters?.subjectId && filters.subjectId !== 'all') params.append('subjectId', filters.subjectId);
    if (filters?.grade && filters.grade !== 'all') params.append('grade', filters.grade);
    if (filters?.difficulty && filters.difficulty !== 'all') params.append('difficulty', filters.difficulty);
    if (filters?.status && filters.status !== 'all') params.append('status', filters.status);
    if (filters?.q || filters?.searchQuery) params.append('q', filters?.q || filters?.searchQuery || '');

    const headers: Record<string, string> = {};
    if (actorUid) headers['x-user-uid'] = actorUid;
    if (actorEmail) headers['x-user-email'] = actorEmail;

    const response = await fetch(`/api/admin/question-bank?${params.toString()}`, { headers });
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data.questions)) {
        return data.questions;
      }
    }

    // Fallback: direct Firestore query
    const qbRef = collection(db, 'questionBank');
    const snapshot = await getDocs(qbRef);
    const items: QuestionBankItem[] = [];
    snapshot.forEach((snap) => {
      items.push({ id: snap.id, ...snap.data() } as QuestionBankItem);
    });

    return items;
  } catch (error) {
    console.error('Error fetching Question Bank:', error);
    return [];
  }
}

/**
 * Create or save a new Question Bank Item
 */
export async function saveQuestionBankItem(
  item: Omit<QuestionBankItem, 'id' | 'createdAt' | 'updatedAt'> & { id?: string },
  actorUid?: string,
  actorEmail?: string
): Promise<QuestionBankItem> {
  const docId = item.id || `qb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const qbDocRef = doc(db, 'questionBank', docId);

  const payload: any = {
    ...item,
    id: docId,
    updatedAt: serverTimestamp(),
  };
  if (!item.id) {
    payload.createdAt = serverTimestamp();
  }

  // Also post to server API
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (actorUid) headers['x-user-uid'] = actorUid;
    if (actorEmail) headers['x-user-email'] = actorEmail;

    await fetch('/api/admin/question-bank', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
  } catch (e) {
    console.warn('API save fallback to Firestore:', e);
  }

  await setDoc(qbDocRef, payload, { merge: true });

  return {
    ...payload,
    id: docId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Update question bank item status (Draft -> Review -> Approved -> Archived)
 */
export async function updateQuestionStatus(
  questionId: string,
  status: QuestionBankStatus,
  actorUid?: string,
  actorEmail?: string
): Promise<void> {
  const qbDocRef = doc(db, 'questionBank', questionId);
  await updateDoc(qbDocRef, {
    status,
    updatedAt: serverTimestamp(),
  });

  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (actorUid) headers['x-user-uid'] = actorUid;
    if (actorEmail) headers['x-user-email'] = actorEmail;

    await fetch(`/api/admin/question-bank/${questionId}/status`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ status }),
    });
  } catch (e) {
    console.warn('API status patch fallback:', e);
  }
}

/**
 * Delete a question bank item
 */
export async function deleteQuestionBankItem(
  questionId: string,
  actorUid?: string,
  actorEmail?: string
): Promise<void> {
  const qbDocRef = doc(db, 'questionBank', questionId);
  await deleteDoc(qbDocRef);

  try {
    const headers: Record<string, string> = {};
    if (actorUid) headers['x-user-uid'] = actorUid;
    if (actorEmail) headers['x-user-email'] = actorEmail;

    await fetch(`/api/admin/question-bank/${questionId}`, {
      method: 'DELETE',
      headers,
    });
  } catch (e) {
    console.warn('API delete fallback:', e);
  }
}

/**
 * Generate an AI Question Draft using Gemini 3.7 Flash via server API
 */
export async function generateAIQuestionDraft(
  params: {
    subjectId: string;
    subjectName: string;
    grade: string;
    topic: string;
    difficulty: string;
    promptGuidelines?: string;
  },
  actorUid?: string,
  actorEmail?: string
): Promise<QuestionBankItem> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (actorUid) headers['x-user-uid'] = actorUid;
  if (actorEmail) headers['x-user-email'] = actorEmail;

  const response = await fetch('/api/admin/ai-generate-question', {
    method: 'POST',
    headers,
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to generate AI question draft.');
  }

  const data = await response.json();
  return data.draft;
}

/**
 * Generate a multi-subject test from the Question Bank (Server-Authoritative)
 */
export async function generateTestFromBank(
  config: TestGenerationConfig,
  actorUid?: string,
  actorEmail?: string
): Promise<{ test: GeneratedTest; competition: any; sanitizedQuestionsCount: number }> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (actorUid) headers['x-user-uid'] = actorUid;
  if (actorEmail) headers['x-user-email'] = actorEmail;

  const response = await fetch('/api/admin/generate-test', {
    method: 'POST',
    headers,
    body: JSON.stringify(config),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to generate test from Question Bank.');
  }

  return await response.json();
}
