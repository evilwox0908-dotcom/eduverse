import { UserProfile } from '../types';

export interface SendMessageOptions {
  message: string;
  history?: Array<{ role: 'user' | 'assistant' | 'model'; content: string }>;
  studentContext?: Partial<UserProfile>;
  quickAction?: 'quiz' | 'explain' | 'study_plan' | 'mistake' | 'custom';
}

export interface SendMessageResponse {
  text: string;
  studentName?: string;
  timestamp?: string;
}

export async function askAITeacher(options: SendMessageOptions): Promise<SendMessageResponse> {
  const response = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(options),
  });

  if (!response.ok) {
    let errMsg = 'Failed to communicate with EduVerse AI Teacher';
    try {
      const errData = await response.json();
      if (errData?.error) {
        errMsg = errData.error;
      }
    } catch {
      errMsg = `Server returned HTTP ${response.status}`;
    }
    throw new Error(errMsg);
  }

  return response.json();
}

export async function executeQuickAction(
  actionType: 'quiz' | 'explain' | 'study_plan' | 'mistake' | 'custom',
  topic: string,
  studentContext: Partial<UserProfile>
): Promise<{ text: string; actionType: string; topic: string }> {
  const response = await fetch('/api/ai/quick-action', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      actionType,
      topic,
      studentContext,
    }),
  });

  if (!response.ok) {
    let errMsg = 'Failed to execute quick action';
    try {
      const errData = await response.json();
      if (errData?.error) errMsg = errData.error;
    } catch {
      errMsg = `Server error ${response.status}`;
    }
    throw new Error(errMsg);
  }

  return response.json();
}
