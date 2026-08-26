import React from 'react';
import { BookOpen, Sparkles, ArrowRight } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { DashboardView } from '../../types';

interface ContinueLearningSectionProps {
  onSelectView: (view: DashboardView) => void;
}

export const ContinueLearningSection: React.FC<ContinueLearningSectionProps> = ({
  onSelectView,
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Continue Learning
            </h2>
            <span className="text-[10px] font-black uppercase text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full">
              30% Focus
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Personalized mastery modules and concept exploration.
          </p>
        </div>

        <button
          onClick={() => onSelectView('learn')}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          Explore <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <GlassCard className="p-6 sm:p-8 rounded-3xl border border-white/80 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-200/80 shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">
              Your learning journey starts here.
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 max-w-lg">
              Interact with the EduVerse AI Teacher to generate custom diagnostic quizzes, practice problem sets, and personalized study schedules.
            </p>
          </div>
        </div>

        <button
          onClick={() => onSelectView('ai')}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all shrink-0 flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Explore Learning</span>
        </button>
      </GlassCard>
    </div>
  );
};
