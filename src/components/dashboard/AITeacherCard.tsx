import React from 'react';
import { Sparkles, HelpCircle, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { AITeacherOrb } from '../3d/AITeacherOrb';
import { DashboardView } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface AITeacherCardProps {
  onSelectView: (view: DashboardView) => void;
  onTriggerQuickPrompt?: (prompt: string, actionType?: string) => void;
}

export const AITeacherCard: React.FC<AITeacherCardProps> = ({
  onSelectView,
  onTriggerQuickPrompt,
}) => {
  const { userProfile } = useAuth();
  const grade = userProfile?.grade || 'Grade 10';

  const quickPrompts = [
    {
      label: 'Give me a quiz',
      prompt: `Generate an interactive diagnostic quiz for ${grade}`,
      action: 'quiz',
      icon: CheckCircle2,
    },
    {
      label: 'Explain this topic',
      prompt: `Explain the fundamental concepts and applications of our current syllabus for ${grade}`,
      action: 'explain',
      icon: HelpCircle,
    },
    {
      label: 'Create a study plan',
      prompt: `Create a high-impact 7-day competition prep study plan for ${grade}`,
      action: 'study_plan',
      icon: FileText,
    },
  ];

  return (
    <GlassCard className="p-6 sm:p-8 rounded-3xl mb-8 border border-blue-200/80 bg-gradient-to-br from-white via-blue-50/30 to-sky-50/40 relative overflow-hidden shadow-xl shadow-blue-900/5">
      <div className="pointer-events-none absolute -right-10 -bottom-10 w-72 h-72 bg-blue-400/15 rounded-full blur-3xl" />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
        {/* Left Visual AI Orb */}
        <div className="md:col-span-4 flex flex-col items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
            <AITeacherOrb className="w-36 h-36 sm:w-44 sm:h-44" />
          </div>
          <span className="text-[11px] font-bold text-blue-700 bg-blue-100/80 px-3 py-1 rounded-full border border-blue-200 mt-2">
            Calibrated for {grade}
          </span>
        </div>

        {/* Right Info & Quick Actions */}
        <div className="md:col-span-8 space-y-4">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-blue-600 text-white">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-blue-700">
              Gemini 3.7 Intelligence
            </span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              EduVerse AI Teacher
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Your personal AI learning companion. Ask any question, master difficult concepts, or prepare for Olympiad challenges.
            </p>
          </div>

          {/* Quick Action Prompt Chips */}
          <div className="space-y-2 pt-1">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Quick Actions
            </p>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (onTriggerQuickPrompt) {
                        onTriggerQuickPrompt(item.prompt, item.action);
                      }
                      onSelectView('ai');
                    }}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/90 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-xs font-semibold text-slate-700 hover:text-blue-700 shadow-sm transition-all text-left"
                  >
                    <Icon className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="pt-2">
            <Button
              id="dashboard-open-ai-teacher-btn"
              variant="primary"
              size="md"
              onClick={() => onSelectView('ai')}
              leftIcon={<Sparkles className="w-4 h-4" />}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="shadow-lg shadow-blue-600/25"
            >
              Ask AI Teacher
            </Button>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
