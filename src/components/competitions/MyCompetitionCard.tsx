import React from 'react';
import {
  Trophy,
  Calendar,
  Clock,
  Globe,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Play,
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { Competition, CompetitionRegistration } from '../../types';
import { CountdownTimer } from './CountdownTimer';

interface MyCompetitionCardProps {
  registration: CompetitionRegistration;
  competition?: Competition | null;
  onViewDetails: (competitionId: string) => void;
  onAIPrep?: (subject: string) => void;
  onCancel?: (competitionId: string) => void;
}

export const MyCompetitionCard: React.FC<MyCompetitionCardProps> = ({
  registration,
  competition,
  onViewDetails,
  onAIPrep,
  onCancel,
}) => {
  const isLive = competition?.status === 'LIVE';
  const isFinished = competition?.status === 'FINISHED' || competition?.status === 'RESULTS_PUBLISHED';

  return (
    <GlassCard className="p-6 rounded-3xl border border-white/80 flex flex-col justify-between hover:shadow-xl hover:shadow-blue-900/5 transition-all">
      <div>
        {/* Top Status & Live indicators */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
            {competition?.subject || competition?.category || 'Academic Arena'}
          </span>

          <div className="flex items-center gap-1.5">
            {isLive ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                Live Now
              </span>
            ) : (
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {registration.status}
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3
          onClick={() => onViewDetails(registration.competitionId)}
          className="text-lg font-black text-slate-900 mb-2 hover:text-blue-600 transition-colors cursor-pointer"
        >
          {registration.competitionTitle || competition?.title || 'Academic Competition'}
        </h3>

        {/* Countdown to Start */}
        {competition?.startAt && !isFinished && (
          <div className="mb-4">
            <CountdownTimer targetDate={competition.startAt} label="Starts In" />
          </div>
        )}

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 mb-4 p-3 rounded-2xl bg-slate-50/70 border border-slate-100">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span className="truncate">
              {competition?.startAt
                ? new Date(competition.startAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })
                : competition?.startDate || 'Date TBA'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-sky-500 shrink-0" />
            <span>
              {competition?.durationMinutes
                ? `${competition.durationMinutes} mins`
                : competition?.duration || '60 mins'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="truncate">{registration.country || 'Global Division'}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-500 shrink-0" />
            <span>Grade {registration.grade || 'Candidate'}</span>
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              window.location.hash = `#/competitions/${registration.competitionId}/exam`;
            }}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Enter Exam</span>
          </button>

          <button
            type="button"
            onClick={() => onViewDetails(registration.competitionId)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            Details
          </button>
        </div>

        <div className="flex items-center gap-2">
          {onAIPrep && (
            <button
              type="button"
              onClick={() => onAIPrep(competition?.subject || 'Olympiad')}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Prep</span>
            </button>
          )}

          {onCancel && !isLive && !isFinished && (
            <button
              type="button"
              onClick={() => onCancel(registration.competitionId)}
              className="text-xs text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
              title="Cancel Registration"
            >
              Withdraw
            </button>
          )}
        </div>
      </div>
    </GlassCard>
  );
};
