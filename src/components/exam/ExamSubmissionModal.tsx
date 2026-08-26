import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Flag,
  Send,
  X,
  Lock,
} from 'lucide-react';
import { ExamQuestion, StudentAnswersMap } from '../../types';

interface ExamSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSubmit: () => void;
  isSubmitting: boolean;
  questions: ExamQuestion[];
  answers: StudentAnswersMap;
  isAutoSubmit?: boolean;
}

export const ExamSubmissionModal: React.FC<ExamSubmissionModalProps> = ({
  isOpen,
  onClose,
  onConfirmSubmit,
  isSubmitting,
  questions,
  answers,
  isAutoSubmit = false,
}) => {
  if (!isOpen) return null;

  let answeredCount = 0;
  let flaggedCount = 0;

  questions.forEach((q) => {
    const ans = answers[q.id];
    const hasValue =
      ans?.studentAnswer !== undefined &&
      ans?.studentAnswer !== null &&
      ans?.studentAnswer !== '' &&
      (!Array.isArray(ans.studentAnswer) || ans.studentAnswer.length > 0);

    if (hasValue) answeredCount++;
    if (ans?.isFlagged) flaggedCount++;
  });

  const unansweredCount = questions.length - answeredCount;

  return (
    <div
      id="exam-submission-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-slate-900 text-white">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-xs">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold">
                {isAutoSubmit ? 'Time Expired — Auto Submitting' : 'Confirm Official Submission'}
              </h2>
              <p className="text-xs text-slate-400">
                EduVerse Authoritative Scoring Engine
              </p>
            </div>
          </div>

          {!isAutoSubmit && !isSubmitting && (
            <button
              id="close-submit-modal-btn"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80">
              <span className="block text-2xl font-bold text-emerald-700">
                {answeredCount}
              </span>
              <span className="text-xs font-semibold text-emerald-800">
                Answered
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="block text-2xl font-bold text-slate-700">
                {unansweredCount}
              </span>
              <span className="text-xs font-semibold text-slate-600">
                Unanswered
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80">
              <span className="block text-2xl font-bold text-amber-700">
                {flaggedCount}
              </span>
              <span className="text-xs font-semibold text-amber-800">
                Flagged
              </span>
            </div>
          </div>

          {/* Unanswered warning */}
          {unansweredCount > 0 && !isAutoSubmit && (
            <div className="flex items-start space-x-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold mb-0.5">
                  You have {unansweredCount} unanswered question{unansweredCount > 1 ? 's' : ''}.
                </p>
                <p className="text-amber-800/90">
                  Unanswered questions receive 0 points. You may return to the exam palette to answer them before final submission.
                </p>
              </div>
            </div>
          )}

          {/* Finality Notice */}
          <div className="flex items-center space-x-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <Lock className="w-4 h-4 text-slate-400 shrink-0" />
            <span>
              Once submitted, your session will be finalized and official server scores will be calculated immediately.
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-2">
            {!isAutoSubmit && (
              <button
                id="cancel-submit-modal-btn"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors"
              >
                Return to Exam
              </button>
            )}

            <button
              id="confirm-submit-competition-btn"
              onClick={onConfirmSubmit}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all active:scale-98 flex items-center space-x-2"
            >
              {isSubmitting ? (
                <span>Scoring & Finalizing...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Confirm Official Submission</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
