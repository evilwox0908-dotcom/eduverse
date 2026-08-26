import React from 'react';
import {
  Trophy,
  Calendar,
  Clock,
  Globe,
  FileQuestion,
  Sparkles,
  ArrowRight,
  BookmarkCheck,
  CreditCard,
  Users,
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { Competition } from '../../types';
import { CountdownTimer } from './CountdownTimer';

interface CompetitionCardProps {
  competition: Competition;
  onViewDetails: (competitionId: string) => void;
  onRegister?: (competition: Competition) => void;
  onAIPrep?: (subject: string) => void;
  isRegistered?: boolean;
}

export const CompetitionCard: React.FC<CompetitionCardProps> = ({
  competition,
  onViewDetails,
  onRegister,
  onAIPrep,
  isRegistered = false,
}) => {
  const getStatusBadge = () => {
    const status = (competition.status || 'PUBLISHED').toUpperCase();
    if (status === 'LIVE') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
          Live Arena
        </span>
      );
    }
    if (status === 'REGISTRATION_OPEN' || status === 'PUBLISHED' || status === 'UPCOMING') {
      return (
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
          Registration Open
        </span>
      );
    }
    if (status === 'REGISTRATION_CLOSED') {
      return (
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
          Registration Closed
        </span>
      );
    }
    if (status === 'FINISHED' || status === 'COMPLETED') {
      return (
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
          Concluded
        </span>
      );
    }
    return (
      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
        {status}
      </span>
    );
  };

  const isFree = !competition.entryFee || competition.entryFee === 0;

  return (
    <GlassCard className="p-6 rounded-3xl border border-white/80 flex flex-col justify-between hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all duration-300 group">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200/80 shadow-2xs">
              {competition.subject || competition.category || 'Olympiad'}
            </span>
            {competition.educationLevel && (
              <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                {competition.educationLevel}
              </span>
            )}
          </div>
          {getStatusBadge()}
        </div>

        {/* Title */}
        <h3
          onClick={() => onViewDetails(competition.id)}
          className="text-lg font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 cursor-pointer"
        >
          {competition.title}
        </h3>

        {/* Description snippet */}
        <p className="text-xs text-slate-600 mb-4 line-clamp-2 leading-relaxed font-normal">
          {competition.description || 'Verified international academic contest.'}
        </p>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 mb-4 p-3 rounded-2xl bg-slate-50/70 border border-slate-100">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span className="truncate">
              {competition.startAt
                ? new Date(competition.startAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })
                : competition.startDate || 'Date TBA'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-sky-500 shrink-0" />
            <span>
              {competition.durationMinutes
                ? `${competition.durationMinutes} mins`
                : competition.duration || '60 mins'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="truncate">
              {competition.countryScope ||
                competition.countryEligibility ||
                (competition.eligibleCountries && competition.eligibleCountries.length > 0
                  ? competition.eligibleCountries.join(', ')
                  : 'Global')}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <FileQuestion className="w-3.5 h-3.5 text-purple-500 shrink-0" />
            <span>
              {competition.questionCount ? `${competition.questionCount} Questions` : 'Timed Exam'}
            </span>
          </div>
        </div>

        {/* Target Grade and Fee Badges */}
        <div className="flex items-center justify-between gap-2 mb-4 text-xs font-semibold">
          <span className="text-slate-600 bg-white px-2.5 py-1 rounded-xl border border-slate-200 shadow-2xs">
            {competition.level || competition.grade || 'All Grades'}
          </span>

          <span
            className={`px-2.5 py-1 rounded-xl border font-bold ${
              isFree
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-blue-50 text-blue-700 border-blue-200'
            }`}
          >
            {isFree ? 'FREE ENTRY' : `$${competition.entryFee} ${competition.currency || 'USD'}`}
          </span>
        </div>

        {/* Real Participant Count if available */}
        {typeof competition.registeredCount === 'number' && (
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-4">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {competition.registeredCount} scholar{competition.registeredCount !== 1 ? 's' : ''} enrolled
            </span>
          </div>
        )}
      </div>

      {/* Card Footer Actions */}
      <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
        {isRegistered ? (
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            <BookmarkCheck className="w-4 h-4" />
            <span>Registered</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              if (onRegister) onRegister(competition);
              else onViewDetails(competition.id);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs shadow-blue-600/20 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>Register</span>
          </button>
        )}

        <div className="flex items-center gap-2">
          {onAIPrep && (
            <button
              type="button"
              onClick={() => onAIPrep(competition.subject || 'Olympiad')}
              className="p-1.5 rounded-xl text-blue-600 hover:bg-blue-50 border border-blue-200 transition-colors cursor-pointer"
              title="Practice with AI Teacher"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={() => onViewDetails(competition.id)}
            className="text-xs font-bold text-slate-700 hover:text-blue-600 flex items-center gap-1 py-1.5 px-2 rounded-lg hover:bg-slate-50 cursor-pointer"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </GlassCard>
  );
};
