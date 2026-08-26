import React from 'react';
import { Trophy, Sparkles, Filter, Inbox } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { Competition, CompetitionCategory, CompetitionRegistration } from '../../types';
import { CompetitionCard } from './CompetitionCard';
import { Competition3DCanvas } from './Competition3DCanvas';

interface CompetitionGridProps {
  competitions: Competition[];
  loading: boolean;
  selectedCategory: CompetitionCategory;
  onSelectCategory: (category: CompetitionCategory) => void;
  onViewDetails: (competitionId: string) => void;
  onRegister: (competition: Competition) => void;
  onAIPrep: (subject: string) => void;
  userRegistrations?: CompetitionRegistration[];
}

const CATEGORIES: CompetitionCategory[] = [
  'All',
  'Academic',
  'Mathematics',
  'Science',
  'English',
  'Programming',
  'General Knowledge',
  'School',
  'University',
];

export const CompetitionGrid: React.FC<CompetitionGridProps> = ({
  competitions,
  loading,
  selectedCategory,
  onSelectCategory,
  onViewDetails,
  onRegister,
  onAIPrep,
  userRegistrations = [],
}) => {
  const registeredIds = new Set(
    userRegistrations
      .filter((r) => r.status === 'REGISTERED' || r.status === 'PAYMENT_CONFIRMED')
      .map((r) => r.competitionId)
  );

  return (
    <div className="space-y-6">
      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 ring-2 ring-blue-600/20'
                  : 'bg-white/85 hover:bg-slate-100/80 text-slate-600 border border-slate-200/80'
              }`}
            >
              {cat === 'All' ? 'All Arenas' : cat}
            </button>
          );
        })}
      </div>

      {/* Grid Content or Empty State */}
      {loading ? (
        <div className="p-16 rounded-3xl glass-card text-center text-xs text-slate-400 border border-white/80">
          <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin mx-auto mb-3" />
          <span>Synchronizing official competition registry with Firestore...</span>
        </div>
      ) : competitions.length === 0 ? (
        /* Empty State */
        <GlassCard className="p-8 sm:p-12 rounded-3xl text-center border border-white/80 overflow-hidden relative">
          <div className="max-w-md mx-auto relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-4 border border-blue-200/60 shadow-sm">
              <Trophy className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-slate-900">
              No competitions are available yet.
            </h3>

            <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed font-normal">
              {selectedCategory === 'All'
                ? 'Official international and regional qualifier schedules will be posted here as registration opens.'
                : `No active events currently found in category '${selectedCategory}'.`}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => onAIPrep('General Olympiad')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Prepare with AI Teacher</span>
              </button>

              {selectedCategory !== 'All' && (
                <button
                  type="button"
                  onClick={() => onSelectCategory('All')}
                  className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200 shadow-2xs transition-colors cursor-pointer"
                >
                  View All Arenas
                </button>
              )}
            </div>
          </div>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {competitions.map((comp) => (
            <CompetitionCard
              key={comp.id}
              competition={comp}
              onViewDetails={onViewDetails}
              onRegister={onRegister}
              onAIPrep={onAIPrep}
              isRegistered={registeredIds.has(comp.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
