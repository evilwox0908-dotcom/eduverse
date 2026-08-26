import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Globe, Sparkles, Search, BookmarkCheck, ArrowRight, ShieldCheck } from 'lucide-react';
import { Competition3DCanvas } from './Competition3DCanvas';
import { useAuth } from '../../context/AuthContext';

interface CompetitionHeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNavigateMyCompetitions?: () => void;
}

export const CompetitionHero: React.FC<CompetitionHeroProps> = ({
  searchQuery,
  onSearchChange,
  onNavigateMyCompetitions,
}) => {
  const { user } = useAuth();

  return (
    <div className="relative rounded-3xl overflow-hidden glass-card p-6 sm:p-10 border border-white/80 bg-gradient-to-br from-white/90 via-blue-50/40 to-sky-50/60 shadow-lg shadow-blue-900/5 mb-8">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 bg-blue-200/25 rounded-full blur-3xl -z-10" />
      <div className="pointer-events-none absolute bottom-0 left-10 w-80 h-80 bg-amber-100/30 rounded-full blur-3xl -z-10" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Typography & Search */}
        <div className="lg:col-span-7 flex flex-col items-start z-10">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-[11px] font-black uppercase tracking-wider shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>70% Competition Focus</span>
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100/80 border border-slate-200/60 text-slate-700 text-[11px] font-bold">
              <Globe className="w-3 h-3 text-slate-500" />
              <span>Global Arena</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
            Compete With the{' '}
            <span className="bg-gradient-to-r from-blue-700 via-blue-600 to-sky-600 bg-clip-text text-transparent">
              World.
            </span>
          </h1>

          <p className="mt-3.5 text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
            Test your knowledge, challenge your limits, and build your academic reputation against verified scholars worldwide.
          </p>

          {/* Search Input and Navigation CTA */}
          <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search Olympiads by title, subject, or grade..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/90 border border-slate-200/90 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 shadow-xs transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>

            {user && onNavigateMyCompetitions && (
              <button
                type="button"
                onClick={onNavigateMyCompetitions}
                className="px-4 py-3 rounded-2xl bg-white hover:bg-slate-50 border border-blue-200/90 text-blue-700 text-xs font-bold shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <BookmarkCheck className="w-4 h-4 text-blue-600" />
                <span>My Registered Arenas</span>
              </button>
            )}
          </div>

          {/* Security & Verification trust mark */}
          <div className="mt-6 flex items-center gap-2 text-xs text-slate-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Anti-cheat verified algorithms & international curriculum calibration</span>
          </div>
        </div>

        {/* Right Column: 3D Scene */}
        <div className="lg:col-span-5 w-full flex items-center justify-center relative">
          <Competition3DCanvas compact={false} />
        </div>
      </div>
    </div>
  );
};
