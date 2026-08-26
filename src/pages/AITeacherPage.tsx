import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  Mic,
  Paperclip,
  ArrowLeft,
  RefreshCw,
  Info,
  ChevronRight,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AIChatMessage, AIChatSession, DashboardView } from '../types';
import {
  createAIChatSession,
  subscribeToAIChatSessions,
  subscribeToChatMessages,
  saveAIChatMessage,
} from '../services/firebase';
import { askAITeacher } from '../services/gemini';
import { AIMessageItem } from '../components/ai/AIMessageItem';
import { AILoadingIndicator } from '../components/ai/AILoadingIndicator';
import { AIQuickActions } from '../components/ai/AIQuickActions';
import { AIStudentContextPanel } from '../components/ai/AIStudentContextPanel';
import { AITeacherOrb } from '../components/3d/AITeacherOrb';

interface AITeacherPageProps {
  onBackToDashboard: () => void;
  initialPrompt?: string;
  initialActionType?: string;
}

export const AITeacherPage: React.FC<AITeacherPageProps> = ({
  onBackToDashboard,
  initialPrompt = '',
  initialActionType,
}) => {
  const { user, userProfile } = useAuth();
  const [sessions, setSessions] = useState<AIChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [inputText, setInputText] = useState(initialPrompt);
  const [isThinking, setIsThinking] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toastNotice, setToastNotice] = useState<string | null>(null);
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  // Subscribe to all chat sessions for the current user
  useEffect(() => {
    if (!user?.uid) return;

    const unsub = subscribeToAIChatSessions(user.uid, (loadedSessions) => {
      setSessions(loadedSessions);
      // If we don't have an active session yet, select the most recent one or create one
      if (loadedSessions.length > 0 && !activeSessionId) {
        setActiveSessionId(loadedSessions[0].id);
      }
    });

    return () => unsub();
  }, [user?.uid]);

  // Subscribe to messages of the active session
  useEffect(() => {
    if (!user?.uid || !activeSessionId) {
      setMessages([]);
      return;
    }

    const unsub = subscribeToChatMessages(user.uid, activeSessionId, (msgs) => {
      setMessages(msgs);
    });

    return () => unsub();
  }, [user?.uid, activeSessionId]);

  // Handle creating a new chat session
  const handleCreateNewSession = async () => {
    if (!user?.uid) return;
    try {
      setErrorMsg(null);
      const newSessionId = await createAIChatSession(
        user.uid,
        `Session - ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      );
      setActiveSessionId(newSessionId);
      setShowMobileDrawer(false);
    } catch (err: any) {
      setErrorMsg('Failed to initialize new conversation.');
    }
  };

  // Trigger quick prompt
  const handleQuickAction = (prompt: string, actionType: string) => {
    setInputText(prompt);
    inputRef.current?.focus();
  };

  // Send message to Gemini and store in Firestore
  const handleSendMessage = async (e?: React.FormEvent, customPrompt?: string, actionType?: string) => {
    if (e) e.preventDefault();
    const textToSend = customPrompt || inputText;
    if (!textToSend.trim() || isThinking || !user?.uid) return;

    setErrorMsg(null);
    setInputText('');

    let currentSession = activeSessionId;

    try {
      // Ensure we have an active session
      if (!currentSession) {
        const titleSnippet = textToSend.slice(0, 32);
        currentSession = await createAIChatSession(
          user.uid,
          titleSnippet || 'Academic Query'
        );
        setActiveSessionId(currentSession);
      }

      // Save user message to Firestore
      await saveAIChatMessage(user.uid, currentSession, {
        role: 'user',
        content: textToSend,
        quickAction: actionType,
      });

      setIsThinking(true);

      // Build history payload for Gemini
      const historyPayload = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      // Call server-side Gemini API
      const geminiResponse = await askAITeacher({
        message: textToSend,
        history: historyPayload,
        studentContext: userProfile || {
          firstName: user.displayName?.split(' ')[0] || 'Student',
          grade: 'Grade 10',
          country: 'Global',
          educationSystem: 'International',
        },
        quickAction: (actionType as any) || undefined,
      });

      // Save AI response to Firestore
      await saveAIChatMessage(user.uid, currentSession, {
        role: 'assistant',
        content: geminiResponse.text,
      });

      // Award qualifying activity XP and streak progression authoritatively
      try {
        const { recordQualifyingActivity } = await import('../services/profileService');
        await recordQualifyingActivity(user.uid, {
          type: 'AI_SESSION',
          sourceId: currentSession,
          description: `AI Teacher session on ${actionType || 'Academic Query'}`,
        });
      } catch (actErr) {
        console.warn('Notice updating student activity:', actErr);
      }
    } catch (err: any) {
      console.error('Error during AI chat:', err);
      setErrorMsg(
        err?.message ||
          'EduVerse AI Teacher could not process your query. Please check your internet connection or try again.'
      );
    } finally {
      setIsThinking(false);
    }
  };

  const showToast = (message: string) => {
    setToastNotice(message);
    setTimeout(() => setToastNotice(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-sky-50/30 flex flex-col p-3 sm:p-6 lg:p-8">
      {/* Toast Notification */}
      {toastNotice && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-2xl shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-top-2 flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-400" />
          <span>{toastNotice}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="glass-card border border-white/80 rounded-3xl p-4 sm:p-5 mb-4 shadow-md shadow-blue-900/5 bg-white/80 backdrop-blur-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="p-2 rounded-2xl bg-white hover:bg-slate-100 border border-slate-200/80 text-slate-700 transition-colors flex items-center gap-1.5 text-xs font-bold shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-400 text-white flex items-center justify-center shadow-md shadow-blue-600/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-none">
                  EduVerse AI Teacher
                </h1>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-full">
                  Gemini 3.7
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Your personal AI learning companion.
              </p>
            </div>
          </div>
        </div>

        {/* Right Action: Mobile drawer toggle & New Chat */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMobileDrawer(!showMobileDrawer)}
            className="lg:hidden p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Toggle Sessions & Calibration"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        {/* Left Column: Chat Conversation Stream */}
        <div className="lg:col-span-8 flex flex-col glass-card border border-white/80 rounded-3xl bg-white/75 backdrop-blur-xl shadow-xl shadow-blue-900/5 overflow-hidden min-h-[560px]">
          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2">
            {messages.length === 0 && !isThinking ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 my-auto">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-2xl animate-pulse" />
                  <AITeacherOrb className="w-32 h-32" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-800">
                    Welcome to your AI Learning Space
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-md mt-1">
                    Ask questions across Mathematics, Physics, Chemistry, Biology, Informatics, or Olympiad training.
                  </p>
                </div>

                <div className="w-full max-w-lg pt-4">
                  <AIQuickActions
                    onSelectAction={handleQuickAction}
                    grade={userProfile?.grade}
                  />
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <AIMessageItem
                    key={msg.id}
                    message={msg}
                    studentName={userProfile?.firstName || 'Student'}
                    studentPhoto={userProfile?.photoURL || user?.photoURL || ''}
                  />
                ))}

                {isThinking && <AILoadingIndicator />}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="mx-4 sm:mx-6 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center justify-between">
              <span>{errorMsg}</span>
              <button
                onClick={() => setErrorMsg(null)}
                className="text-red-400 hover:text-red-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Quick Action Suggestion Strip (if active messages exist) */}
          {messages.length > 0 && (
            <div className="px-4 sm:px-6 py-2 border-t border-slate-100/80 bg-slate-50/40">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0">
                  Quick:
                </span>
                <button
                  onClick={() =>
                    handleQuickAction(
                      'Give me a 3-question diagnostic quiz on this topic',
                      'quiz'
                    )
                  }
                  className="px-2.5 py-1 rounded-xl bg-white hover:bg-blue-50 border border-slate-200 text-[11px] font-semibold text-slate-700 shrink-0"
                >
                  Diagnostic Quiz
                </button>
                <button
                  onClick={() =>
                    handleQuickAction(
                      'Can you break down the mathematical derivation step by step?',
                      'explain'
                    )
                  }
                  className="px-2.5 py-1 rounded-xl bg-white hover:bg-blue-50 border border-slate-200 text-[11px] font-semibold text-slate-700 shrink-0"
                >
                  Step-by-Step Breakdown
                </button>
                <button
                  onClick={() =>
                    handleQuickAction(
                      'Generate a 5-day mastery study plan for this concept',
                      'study_plan'
                    )
                  }
                  className="px-2.5 py-1 rounded-xl bg-white hover:bg-blue-50 border border-slate-200 text-[11px] font-semibold text-slate-700 shrink-0"
                >
                  5-Day Study Plan
                </button>
              </div>
            </div>
          )}

          {/* Bottom Chat Input Bar */}
          <form
            onSubmit={(e) => handleSendMessage(e)}
            className="p-3 sm:p-4 border-t border-slate-100 bg-white/95 flex flex-col gap-2"
          >
            <div className="relative flex items-end gap-2">
              {/* Attachment Icon Placeholder */}
              <button
                type="button"
                onClick={() => showToast('Attachment upload: Coming soon in Phase 4')}
                className="p-2.5 rounded-2xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors shrink-0"
                title="Attach problem screenshot or document"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              {/* Text Area */}
              <textarea
                ref={inputRef}
                id="ai-teacher-message-input"
                rows={1}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ask EduVerse AI Teacher anything (e.g. solve calculus, physics laws, Olympiad tactics)..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-500 resize-none max-h-32 min-h-[44px]"
              />

              {/* Voice Input Placeholder */}
              <button
                type="button"
                onClick={() => showToast('Voice AI interaction: Coming soon in Phase 4')}
                className="p-2.5 rounded-2xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors shrink-0"
                title="Voice input mode"
              >
                <Mic className="w-4 h-4" />
              </button>

              {/* Send Button */}
              <button
                type="submit"
                id="ai-teacher-send-btn"
                disabled={!inputText.trim() || isThinking}
                className="p-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-md shadow-blue-600/25 transition-all shrink-0"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 px-2">
              <span>Press Enter to send, Shift+Enter for new line</span>
              <span>EduVerse AI calibrated for academic excellence</span>
            </div>
          </form>
        </div>

        {/* Right Column: Desktop Context & History Panel */}
        <div className="hidden lg:block lg:col-span-4 glass-card border border-white/80 rounded-3xl p-5 bg-white/75 backdrop-blur-xl shadow-xl shadow-blue-900/5">
          <AIStudentContextPanel
            userProfile={userProfile}
            sessions={sessions}
            activeSessionId={activeSessionId}
            onSelectSession={(id) => setActiveSessionId(id)}
            onNewSession={handleCreateNewSession}
          />
        </div>
      </div>

      {/* Mobile Drawer for Context & Sessions */}
      {showMobileDrawer && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex justify-end">
          <div className="w-4/5 max-w-sm h-full bg-white p-5 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <span className="text-sm font-bold text-slate-800">
                AI Teacher Controls
              </span>
              <button
                onClick={() => setShowMobileDrawer(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <AIStudentContextPanel
              userProfile={userProfile}
              sessions={sessions}
              activeSessionId={activeSessionId}
              onSelectSession={(id) => {
                setActiveSessionId(id);
                setShowMobileDrawer(false);
              }}
              onNewSession={handleCreateNewSession}
            />
          </div>
        </div>
      )}
    </div>
  );
};
