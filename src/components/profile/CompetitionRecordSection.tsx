import React from 'react';
import { Trophy, CheckCircle2, Clock, Award, ChevronRight, FileText } from 'lucide-react';

interface CompetitionRecordProps {
  results: any[];
  onViewResultClick?: (result: any) => void;
}

export const CompetitionRecordSection: React.FC<CompetitionRecordProps> = ({
  results,
  onViewResultClick,
}) => {
  if (results.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <Trophy className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-slate-800">No Competition Submissions Yet</h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          Official competition results will appear here as you participate in and complete verified EduVerse Olympiads.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Verified Competition Record
          </h3>
          <p className="text-xs text-slate-500">
            Official server-evaluated results with cryptographic verification
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
          {results.length} {results.length === 1 ? 'Exam' : 'Exams'} Verified
        </span>
      </div>

      <div className="space-y-3">
        {results.map((res) => {
          const formattedDate = res.submittedAt
            ? new Date(res.submittedAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            : 'Submitted';

          const mins = Math.floor((res.timeTakenSeconds || 0) / 60);
          const secs = (res.timeTakenSeconds || 0) % 60;
          const timeFormatted = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

          return (
            <div
              key={res.id}
              className="bg-slate-50/80 hover:bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-bold text-slate-900">
                      {res.competitionTitle || 'Academic Olympiad'}
                    </h4>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{res.status || 'VERIFIED'}</span>
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Duration: {timeFormatted}</span>
                    </span>
                    <span>•</span>
                    <span>Date: {formattedDate}</span>
                  </div>
                </div>
              </div>

              {/* Score breakdown & CTA */}
              <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                <div className="text-right">
                  <div className="text-lg font-extrabold text-slate-900">
                    {res.score} / {res.totalPoints}{' '}
                    <span className="text-xs text-blue-600 font-semibold">
                      ({res.percentage}%)
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500">Official Exam Score</span>
                </div>

                {onViewResultClick && (
                  <button
                    type="button"
                    onClick={() => onViewResultClick(res)}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    <span>Certificate</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
