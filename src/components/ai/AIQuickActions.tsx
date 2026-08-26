import React from 'react';
import {
  HelpCircle,
  CheckCircle2,
  BookOpen,
  AlertCircle,
  Calendar,
} from 'lucide-react';

interface AIQuickActionsProps {
  onSelectAction: (prompt: string, actionType: string) => void;
  grade?: string;
  disabled?: boolean;
}

export const AIQuickActions: React.FC<AIQuickActionsProps> = ({
  onSelectAction,
  grade = 'Grade 10',
  disabled = false,
}) => {
  const actions = [
    {
      id: 'quiz',
      label: 'Give me a quiz',
      description: 'Generate 3 diagnostic questions with solutions',
      prompt: `Please give me a diagnostic 3-question quiz for ${grade} covering key competitive topics.`,
      icon: CheckCircle2,
    },
    {
      id: 'explain',
      label: 'Explain this topic',
      description: 'Break down complex concepts step-by-step',
      prompt: `Can you explain the foundational principles, formulas, and real-world intuition for: `,
      icon: HelpCircle,
    },
    {
      id: 'study_plan',
      label: 'Create a study plan',
      description: '7-day structured revision schedule',
      prompt: `Create a comprehensive 7-day revision and practice plan for ${grade} to master upcoming Olympiads.`,
      icon: Calendar,
    },
    {
      id: 'mistake',
      label: 'Explain my mistake',
      description: 'Deconstruct error patterns and pitfalls',
      prompt: `Here is a problem I am struggling with or got incorrect. Please analyze where I went wrong: `,
      icon: AlertCircle,
    },
    {
      id: 'study',
      label: 'Help me study',
      description: 'Active recall and conceptual mastery',
      prompt: `Guide me through an active recall study session for ${grade}. Ask me questions one by one.`,
      icon: BookOpen,
    },
  ];

  return (
    <div className="w-full">
      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
        Pedagogical Quick Actions
      </p>
      <div className="flex flex-wrap gap-2">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              disabled={disabled}
              onClick={() => onSelectAction(act.prompt, act.id)}
              className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-white/80 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-300 text-xs font-semibold text-slate-700 hover:text-blue-700 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed text-left group"
              title={act.description}
            >
              <Icon className="w-3.5 h-3.5 text-blue-600 shrink-0 group-hover:scale-110 transition-transform" />
              <span>{act.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
