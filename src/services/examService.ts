import {
  ExamQuestion,
  ExamSession,
  CompetitionResult,
  StudentAnswersMap,
  IntegrityEventType,
  DeviceMetadata,
} from '../types';

/**
 * Collect non-invasive device and environment metadata for integrity logging
 */
export function collectDeviceMetadata(): DeviceMetadata {
  const ua = navigator.userAgent;
  let browser = 'Unknown Browser';
  if (ua.includes('Firefox')) browser = 'Mozilla Firefox';
  else if (ua.includes('Edg')) browser = 'Microsoft Edge';
  else if (ua.includes('Chrome')) browser = 'Google Chrome';
  else if (ua.includes('Safari')) browser = 'Apple Safari';

  let os = 'Unknown OS';
  if (ua.includes('Win')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

  return {
    userAgent: ua.substring(0, 200),
    browser,
    os,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    language: navigator.language || 'en-US',
  };
}

/**
 * Check if candidate has an active session
 */
export async function checkExamReadiness(
  competitionId: string,
  studentId: string
): Promise<{ competitionId: string; studentId: string; hasActiveSession: boolean; activeSession: ExamSession | null }> {
  try {
    const res = await fetch(
      `/api/competitions/${competitionId}/exam-check?studentId=${encodeURIComponent(studentId)}`
    );
    if (!res.ok) {
      throw new Error(`Failed to check exam readiness: ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error('Error checking exam readiness:', error);
    return {
      competitionId,
      studentId,
      hasActiveSession: false,
      activeSession: null,
    };
  }
}

/**
 * Start or resume authoritative exam session
 */
export async function startExamSession(
  competitionId: string,
  payload: {
    studentId: string;
    studentName: string;
    competitionTitle: string;
    durationMinutes: number;
    allowCalculator: boolean;
    deviceMetadata?: DeviceMetadata;
  }
): Promise<{
  session: ExamSession;
  questions: ExamQuestion[];
  savedAnswers: StudentAnswersMap;
  isResumed: boolean;
}> {
  const res = await fetch(`/api/competitions/${competitionId}/exam-session/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...payload,
      deviceMetadata: payload.deviceMetadata || collectDeviceMetadata(),
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to start competition exam session');
  }

  return data;
}

/**
 * Auto-save single question answer
 */
export async function saveExamAnswer(
  competitionId: string,
  payload: {
    sessionId: string;
    studentId: string;
    questionId: string;
    studentAnswer: string | string[];
    isFlagged?: boolean;
  }
): Promise<{ success: boolean; lastSavedAt: string }> {
  const res = await fetch(`/api/competitions/${competitionId}/exam-session/save-answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to save candidate answer');
  }

  return data;
}

/**
 * Log integrity event (fullscreen exit, tab hidden, blur, etc.)
 */
export async function logIntegrityEvent(
  competitionId: string,
  payload: {
    sessionId: string;
    studentId: string;
    type: IntegrityEventType;
    metadata?: string;
  }
): Promise<void> {
  try {
    await fetch(`/api/competitions/${competitionId}/exam-session/log-integrity`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.warn('Failed to send integrity event to server:', error);
  }
}

/**
 * Authoritative Exam Submission
 */
export async function submitExam(
  competitionId: string,
  payload: {
    sessionId: string;
    studentId: string;
    answers: StudentAnswersMap;
  }
): Promise<{ success: boolean; resultId: string; result: CompetitionResult }> {
  const res = await fetch(`/api/competitions/${competitionId}/exam-session/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to submit exam');
  }

  return data;
}

/**
 * Fetch official result
 */
export async function getOfficialResult(
  competitionId: string,
  resultId: string,
  studentId: string
): Promise<CompetitionResult> {
  const res = await fetch(
    `/api/competitions/${competitionId}/results/${resultId}?studentId=${encodeURIComponent(studentId)}`
  );

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch official result');
  }

  return data;
}

// ==========================================
// SAFE EXPRESSION CALCULATOR ENGINE (NO EVAL)
// ==========================================

export function evaluateMathExpression(expr: string): { success: boolean; value?: number; error?: string } {
  try {
    // Clean string: allow only digits, operators, parens, decimal, spaces
    const sanitized = expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/,/g, '');
    if (!/^[0-9+\-*/().%\s^]+$/.test(sanitized)) {
      return { success: false, error: 'Invalid characters in expression' };
    }

    const tokens = tokenize(sanitized);
    const rpn = shuntingYard(tokens);
    const result = evaluateRPN(rpn);

    if (isNaN(result) || !isFinite(result)) {
      return { success: false, error: 'Mathematical undefined / division by zero' };
    }

    // Round for floating point inaccuracies
    const cleanResult = Math.round(result * 1e10) / 1e10;
    return { success: true, value: cleanResult };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Calculation error' };
  }
}

function tokenize(expr: string): string[] {
  const tokens: string[] = [];
  let i = 0;
  while (i < expr.length) {
    const ch = expr[i];
    if (/\s/.test(ch)) {
      i++;
      continue;
    }

    if (/[0-9.]/.test(ch)) {
      let num = '';
      while (i < expr.length && /[0-9.]/.test(expr[i])) {
        num += expr[i];
        i++;
      }
      tokens.push(num);
      continue;
    }

    if ('+-*/%^()'.includes(ch)) {
      // Handle negative numbers: e.g. -5 at start or after operator/paren
      if (ch === '-' && (tokens.length === 0 || '+-*/%^('.includes(tokens[tokens.length - 1]))) {
        let num = '-';
        i++;
        while (i < expr.length && /[0-9.]/.test(expr[i])) {
          num += expr[i];
          i++;
        }
        if (num.length > 1) {
          tokens.push(num);
          continue;
        }
      }
      tokens.push(ch);
      i++;
      continue;
    }

    i++;
  }
  return tokens;
}

function shuntingYard(tokens: string[]): string[] {
  const output: string[] = [];
  const ops: string[] = [];
  const precedence: Record<string, number> = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
    '%': 2,
    '^': 3,
  };

  for (const token of tokens) {
    if (!isNaN(parseFloat(token))) {
      output.push(token);
    } else if (token in precedence) {
      while (
        ops.length > 0 &&
        ops[ops.length - 1] in precedence &&
        (precedence[ops[ops.length - 1]] > precedence[token] ||
          (precedence[ops[ops.length - 1]] === precedence[token] && token !== '^'))
      ) {
        output.push(ops.pop()!);
      }
      ops.push(token);
    } else if (token === '(') {
      ops.push(token);
    } else if (token === ')') {
      while (ops.length > 0 && ops[ops.length - 1] !== '(') {
        output.push(ops.pop()!);
      }
      if (ops.length > 0 && ops[ops.length - 1] === '(') {
        ops.pop();
      }
    }
  }

  while (ops.length > 0) {
    output.push(ops.pop()!);
  }

  return output;
}

function evaluateRPN(rpn: string[]): number {
  const stack: number[] = [];

  for (const token of rpn) {
    if (!isNaN(parseFloat(token))) {
      stack.push(parseFloat(token));
    } else {
      const b = stack.pop();
      const a = stack.pop();
      if (a === undefined || b === undefined) {
        throw new Error('Malformed expression syntax');
      }

      switch (token) {
        case '+':
          stack.push(a + b);
          break;
        case '-':
          stack.push(a - b);
          break;
        case '*':
          stack.push(a * b);
          break;
        case '/':
          if (b === 0) throw new Error('Division by zero');
          stack.push(a / b);
          break;
        case '%':
          stack.push(a % b);
          break;
        case '^':
          stack.push(Math.pow(a, b));
          break;
        default:
          throw new Error(`Unsupported operator: ${token}`);
      }
    }
  }

  if (stack.length !== 1) {
    throw new Error('Invalid expression evaluation');
  }

  return stack[0];
}
