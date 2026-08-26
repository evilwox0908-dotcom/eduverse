import React, { useEffect, useState } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  ShieldCheck,
  TrendingUp,
  FileText,
  AlertCircle,
  Loader2,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { CompetitionResult } from '../types';
import { getOfficialResult } from '../services/examService';

interface CompetitionResultsPageProps {
  competitionId: string;
  resultId: string;
  currentUser: any;
  onNavigate: (path: string) => void;
}

export const CompetitionResultsPage: React.FC<CompetitionResultsPageProps> = ({
  competitionId,
  resultId,
  currentUser,
  onNavigate,
}) => {
  const [result, setResult] = useState<CompetitionResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResult() {
      if (!currentUser) return;
      try {
        setIsLoading(true);
        setError(null);
        const data = await getOfficialResult(competitionId, resultId, currentUser.uid);
        setResult(data);
      } catch (err: any) {
        console.error('Error fetching competition result:', err);
        setError(err?.message || 'Failed to retrieve verified competition result');
      } finally {
        setIsLoading(false);
      }
    }

    fetchResult();
  }, [competitionId, resultId, currentUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
          <p className="text-sm font-semibold text-slate-300">
            Compiling and verifying official scores...
          </p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 rounded-3xl p-8 border border-slate-800 text-center space-y-5 text-white">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 mx-auto flex items-center justify-center">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Result Verification Notice</h2>
            <p className="text-xs text-slate-400 mt-2">{error || 'Result not found.'}</p>
          </div>
          <button
            onClick={() => onNavigate('/dashboard?tab=competitions')}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors"
          >
            Return to Competitions Hub
          </button>
        </div>
      </div>
    );
  }

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '—';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div
      id="competition-results-page"
      className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-16"
    >
      {/* Header Bar */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            id="results-back-btn"
            onClick={() => onNavigate('/dashboard?tab=competitions')}
            className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Competitions</span>
          </button>

          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Official Result Verified</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Hero Score Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 via-slate-800/90 to-blue-950/70 border border-slate-700/80 p-6 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Score & Badge */}
            <div className="md:col-span-7 space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-blue-500/20 text-blue-300 text-xs font-mono font-semibold">
                <Award className="w-3.5 h-3.5 text-blue-400" />
                <span>EXAM PERFORMANCE SUMMARY</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                {result.competitionTitle || 'Academic Competition'}
              </h1>

              <p className="text-xs sm:text-sm text-slate-300">
                Candidate: <strong className="text-white">{result.studentName}</strong> • Submitted:{' '}
                {new Date(result.submittedAt).toLocaleString()}
              </p>

              {/* Stat Chips */}
              <div className="flex flex-wrap gap-3 pt-2 text-xs">
                <div className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-900/60 border border-slate-700">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className="text-slate-300">Time Taken:</span>
                  <strong className="text-white">{formatDuration(result.timeTakenSeconds)}</strong>
                </div>

                <div className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-900/60 border border-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-300">Accuracy:</span>
                  <strong className="text-emerald-400">{result.percentage}%</strong>
                </div>
              </div>
            </div>

            {/* Score Showcase */}
            <div className="md:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-900/80 border border-slate-700/80 text-center shadow-inner">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Final Official Score
              </span>
              <div className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">
                {result.score}
              </div>
              <span className="text-xs text-slate-400 mt-1 font-mono">
                out of {result.totalPoints} total possible points
              </span>

              {result.negativeMarkingApplied && result.negativeMarkingApplied > 0 ? (
                <span className="text-[11px] text-rose-400 mt-2 font-mono">
                  (-{result.negativeMarkingApplied} pts negative marking applied)
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-center">
            <span className="block text-2xl sm:text-3xl font-bold text-emerald-400">
              {result.correctCount}
            </span>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Correct Answers
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-center">
            <span className="block text-2xl sm:text-3xl font-bold text-rose-400">
              {result.incorrectCount}
            </span>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Incorrect
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-center">
            <span className="block text-2xl sm:text-3xl font-bold text-slate-400">
              {result.unansweredCount}
            </span>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Unanswered
            </span>
          </div>
        </div>

        {/* Official Ranking Notice (Real Ranking Foundation) */}
        <div className="p-5 rounded-2xl bg-blue-950/40 border border-blue-800/50 flex items-start space-x-3 text-xs text-blue-200">
          <TrendingUp className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-white">
              Global Standings & Percentile Computation
            </p>
            <p className="text-blue-300/80 leading-relaxed">
              Official global percentile rankings and country-level leaderboards will finalize once the competition window concludes and all candidate sessions have been verified.
            </p>
          </div>
        </div>

        {/* Question by Question Review Breakdown */}
        {result.breakdown && result.breakdown.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <span>Question Breakdown & Submissions</span>
              </h2>
              <span className="text-xs text-slate-400">
                {result.breakdown.length} questions evaluated
              </span>
            </div>

            <div className="space-y-4">
              {result.breakdown.map((item, idx) => {
                let statusBadge = (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Correct (+{item.earnedPoints} pts)</span>
                  </span>
                );

                if (item.isUnanswered) {
                  statusBadge = (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-700/60 text-slate-300 border border-slate-600">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Unanswered (0 pts)</span>
                    </span>
                  );
                } else if (!item.isCorrect) {
                  statusBadge = (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Incorrect ({item.earnedPoints} pts)</span>
                    </span>
                  );
                }

                return (
                  <div
                    key={item.questionId}
                    id={`result-q-${idx + 1}`}
                    className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-400 font-mono">
                        QUESTION {item.questionNumber}
                      </span>
                      {statusBadge}
                    </div>

                    <p className="text-sm font-medium text-slate-200 leading-relaxed whitespace-pre-line">
                      {item.questionText}
                    </p>

                    <div className="pt-2 text-xs border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-2">
                      <div className="text-slate-400">
                        <span>Your Submitted Response: </span>
                        <strong className="text-white">
                          {item.isUnanswered
                            ? 'None'
                            : Array.isArray(item.studentAnswer)
                            ? item.studentAnswer.join(', ')
                            : String(item.studentAnswer)}
                        </strong>
                      </div>
                      <span className="text-slate-400 font-mono text-[11px]">
                        Weight: {item.points} pts
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 border-t border-slate-800">
          <button
            id="results-return-hub-btn"
            onClick={() => onNavigate('/dashboard?tab=competitions')}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-lg"
          >
            Return to Competitions Hub
          </button>
        </div>
      </main>
    </div>
  );
};
