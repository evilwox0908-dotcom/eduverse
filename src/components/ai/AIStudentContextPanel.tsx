import React from 'react';
import {
  Globe,
  GraduationCap,
  Building,
  Plus,
  MessageSquare,
  Sparkles,
  Zap,
} from 'lucide-react';
import { UserProfile, AIChatSession } from '../../types';
import { Button } from '../ui/Button';

interface AIStudentContextPanelProps {
  userProfile: UserProfile | null;
  sessions: AIChatSession[];
  activeSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onNewSession: () => void;
  isCreatingSession?: boolean;
}

export const AIStudentContextPanel: React.FC<AIStudentContextPanelProps> = ({
  userProfile,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  isCreatingSession = false,
}) => {
  return (
    <div className="space-y-5">
      {/* Session Header / New Chat */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
            Conversations
          </h3>
        </div>
        <Button
          id="ai-new-chat-btn"
          variant="primary"
          size="sm"
          onClick={onNewSession}
          disabled={isCreatingSession}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
          className="text-xs py-1.5 px-3 rounded-xl shadow-sm"
        >
          New Chat
        </Button>
      </div>

      {/* Chat Session History List */}
      <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
        {sessions.length === 0 ? (
          <div className="p-3 text-center rounded-2xl bg-slate-50 border border-slate-200/60 text-xs text-slate-400">
            No previous chats yet. Start asking questions!
          </div>
        ) : (
          sessions.map((session) => {
            const isActive = session.id === activeSessionId;
            return (
              <button
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-2xl text-xs font-semibold text-left transition-all truncate ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-white/80 hover:bg-slate-100 text-slate-700 border border-slate-200/60'
                }`}
              >
                <MessageSquare
                  className={`w-3.5 h-3.5 shrink-0 ${
                    isActive ? 'text-white' : 'text-blue-600'
                  }`}
                />
                <span className="truncate flex-1">
                  {session.title || 'Academic Session'}
                </span>
              </button>
            );
          })
        )}
      </div>

      {/* Real Student Profile Calibration Box */}
      <div className="p-4 rounded-3xl bg-slate-50/90 border border-slate-200/80 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-blue-600" />
            AI Calibration
          </span>
          <span className="text-[10px] font-bold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-md">
            Active
          </span>
        </div>

        <div className="space-y-2 text-xs text-slate-600">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Student:</span>
            <span className="font-bold text-slate-800">
              {userProfile?.firstName
                ? `${userProfile.firstName} ${userProfile.lastName || ''}`
                : 'Scholar'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1">
              <GraduationCap className="w-3 h-3 text-blue-500" /> Level:
            </span>
            <span className="font-bold text-blue-700">
              {userProfile?.grade || 'Grade 10'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Curriculum:</span>
            <span className="font-semibold text-slate-700">
              {userProfile?.educationSystem || 'International'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1">
              <Globe className="w-3 h-3 text-blue-500" /> Nation:
            </span>
            <span className="font-semibold text-slate-700">
              {userProfile?.country || 'Global'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1">
              <Building className="w-3 h-3 text-blue-500" /> Institution:
            </span>
            <span className="font-semibold text-slate-700 truncate max-w-[120px]">
              {userProfile?.schoolName || 'EduVerse'}
            </span>
          </div>
        </div>

        {/* Engine status */}
        <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Model Engine</span>
          <span className="font-bold text-slate-700 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-blue-600" />
            Gemini 3.7 Flash
          </span>
        </div>
      </div>
    </div>
  );
};
