import React from 'react';
import { Flag, CheckCircle2, Circle, AlertCircle, Send } from 'lucide-react';
import { ExamQuestion, StudentAnswersMap } from '../../types';

interface QuestionNavigatorProps {
  questions: ExamQuestion[];
  currentIndex: number;
  answers: StudentAnswersMap;
  onSelectQuestion: (index: number) => void;
  onSubmitClick: () => void;
}

export const QuestionNavigator: React.FC<QuestionNavigatorProps> = ({
  questions,
  currentIndex,
  answers,
  onSelectQuestion,
  onSubmitClick,
}) => {
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
      id="exam-question-navigator"
      className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-5 text-slate-900"
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-sm font-bold text-slate-900 tracking-wide uppercase">
          Question Palette
        </h3>
        <span className="text-xs text-slate-500 font-mono">
          {answeredCount}/{questions.length} Answered
        </span>
      </div>

      {/* Grid of question buttons */}
      <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-4 lg:grid-cols-5 gap-2 select-none">
        {questions.map((q, idx) => {
          const ans = answers[q.id];
          const isAnswered =
            ans?.studentAnswer !== undefined &&
            ans?.studentAnswer !== null &&
            ans?.studentAnswer !== '' &&
            (!Array.isArray(ans.studentAnswer) || ans.studentAnswer.length > 0);
          const isFlagged = Boolean(ans?.isFlagged);
          const isCurrent = idx === currentIndex;

          let btnClass = 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100';
          if (isAnswered) {
            btnClass = 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs';
          }

          if (isCurrent) {
            btnClass += ' ring-2 ring-blue-600 ring-offset-2';
          }

          return (
            <button
              key={q.id}
              id={`nav-q-btn-${idx + 1}`}
              onClick={() => onSelectQuestion(idx)}
              className={`relative h-10 rounded-xl flex items-center justify-center text-xs font-semibold border transition-all duration-150 ${btnClass}`}
            >
              <span>{idx + 1}</span>

              {/* Flag marker */}
              {isFlagged && (
                <span
                  id={`nav-flag-indicator-${idx + 1}`}
                  className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-500 text-white rounded-full flex items-center justify-center shadow-xs"
                >
                  <Flag className="w-2 h-2 fill-current" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend & Stats */}
      <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
        <div className="flex items-center justify-between text-slate-600">
          <div className="flex items-center space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-emerald-600" />
            <span>Answered</span>
          </div>
          <span className="font-semibold text-slate-900">{answeredCount}</span>
        </div>

        <div className="flex items-center justify-between text-slate-600">
          <div className="flex items-center space-x-1.5">
            <div className="w-3 h-3 rounded-full border border-slate-300 bg-white" />
            <span>Unanswered</span>
          </div>
          <span className="font-semibold text-slate-900">{unansweredCount}</span>
        </div>

        <div className="flex items-center justify-between text-slate-600">
          <div className="flex items-center space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span>Flagged for Review</span>
          </div>
          <span className="font-semibold text-slate-900">{flaggedCount}</span>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          id="nav-submit-competition-btn"
          onClick={onSubmitClick}
          className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-sm transition-all active:scale-98"
        >
          <Send className="w-4 h-4" />
          <span>Submit Competition</span>
        </button>
      </div>
    </div>
  );
};
