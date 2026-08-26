import React from 'react';
import {
  Flag,
  RotateCcw,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Calculator as CalcIcon,
  HelpCircle,
} from 'lucide-react';
import { ExamQuestion } from '../../types';

interface QuestionPanelProps {
  question: ExamQuestion;
  currentAnswer: string | string[] | undefined;
  isFlagged: boolean;
  onAnswerChange: (newAnswer: string | string[]) => void;
  onToggleFlag: () => void;
  onClearAnswer: () => void;
  onPrevQuestion: () => void;
  onNextQuestion: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  totalQuestions: number;
  onOpenCalculator?: () => void;
}

export const QuestionPanel: React.FC<QuestionPanelProps> = ({
  question,
  currentAnswer,
  isFlagged,
  onAnswerChange,
  onToggleFlag,
  onClearAnswer,
  onPrevQuestion,
  onNextQuestion,
  hasPrev,
  hasNext,
  totalQuestions,
  onOpenCalculator,
}) => {
  const isMultiple = question.type === 'MULTIPLE_CHOICE';
  const selectedArray = Array.isArray(currentAnswer)
    ? currentAnswer
    : currentAnswer
    ? [String(currentAnswer)]
    : [];

  const handleOptionClick = (optionId: string) => {
    if (isMultiple) {
      if (selectedArray.includes(optionId)) {
        onAnswerChange(selectedArray.filter((id) => id !== optionId));
      } else {
        onAnswerChange([...selectedArray, optionId]);
      }
    } else {
      onAnswerChange(optionId);
    }
  };

  return (
    <div
      id={`question-panel-${question.id}`}
      className="w-full max-w-4xl mx-auto flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-slate-900"
    >
      {/* Question Header Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center px-3 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold font-mono">
            QUESTION {question.questionNumber} OF {totalQuestions}
          </span>

          {question.subject && (
            <span className="text-xs font-medium text-slate-600 px-2.5 py-0.5 rounded-full bg-slate-200/80">
              {question.subject}
            </span>
          )}

          {question.topic && (
            <span className="hidden sm:inline-block text-xs text-slate-500 font-medium">
              • {question.topic}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {question.allowCalculator && onOpenCalculator && (
            <button
              id="q-open-calc-btn"
              onClick={onOpenCalculator}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200"
              title="Calculator Allowed for this problem"
            >
              <CalcIcon className="w-3.5 h-3.5" />
              <span>Calc Permitted</span>
            </button>
          )}

          <div className="text-right">
            <span className="text-xs font-semibold text-slate-700">
              +{question.points} {question.points === 1 ? 'pt' : 'pts'}
            </span>
            {question.negativePoints && question.negativePoints > 0 ? (
              <span className="text-[11px] text-rose-500 ml-1">
                (-{question.negativePoints})
              </span>
            ) : null}
          </div>

          <button
            id={`flag-question-btn-${question.questionNumber}`}
            onClick={onToggleFlag}
            className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              isFlagged
                ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50 hover:text-amber-600'
            }`}
          >
            <Flag className={`w-3.5 h-3.5 ${isFlagged ? 'fill-current' : ''}`} />
            <span>{isFlagged ? 'Flagged' : 'Flag for Review'}</span>
          </button>
        </div>
      </div>

      {/* Question Body */}
      <div className="p-6 sm:p-8 space-y-6">
        {/* Question Statement */}
        <div className="prose max-w-none text-slate-900 text-base sm:text-lg leading-relaxed font-sans select-text">
          <p className="whitespace-pre-line font-medium text-slate-800">
            {question.questionText}
          </p>
        </div>

        {/* Media if present */}
        {question.media && (
          <div className="my-4 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 p-2 max-w-lg mx-auto">
            {question.media.type === 'image' && (
              <img
                src={question.media.url}
                alt={question.media.caption || 'Question diagram'}
                className="w-full h-auto rounded-lg object-contain"
                referrerPolicy="no-referrer"
              />
            )}
            {question.media.caption && (
              <p className="text-xs text-center text-slate-500 mt-2 italic">
                {question.media.caption}
              </p>
            )}
          </div>
        )}

        {/* Interaction based on Type */}
        <div className="pt-2">
          {/* SINGLE_CHOICE / MULTIPLE_CHOICE / TRUE_FALSE */}
          {(question.type === 'SINGLE_CHOICE' ||
            question.type === 'MULTIPLE_CHOICE' ||
            question.type === 'TRUE_FALSE') &&
            question.options && (
              <div className="space-y-3">
                {isMultiple && (
                  <p className="text-xs font-medium text-blue-600 flex items-center space-x-1 mb-2">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Multiple choices allowed. Select all correct assertions.</span>
                  </p>
                )}

                {question.options.map((option) => {
                  const isSelected = selectedArray.includes(option.id);

                  return (
                    <div
                      key={option.id}
                      id={`option-${question.id}-${option.id}`}
                      onClick={() => handleOptionClick(option.id)}
                      role={isMultiple ? 'checkbox' : 'radio'}
                      aria-checked={isSelected}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                          e.preventDefault();
                          handleOptionClick(option.id);
                        }
                      }}
                      className={`group relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-150 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                      }`}
                    >
                      {/* Selection Box / Radio Indicator */}
                      <div
                        className={`w-6 h-6 rounded-${
                          isMultiple ? 'md' : 'full'
                        } flex items-center justify-center mr-4 border text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'border-slate-300 bg-slate-100 text-slate-600 group-hover:border-slate-400'
                        }`}
                      >
                        {isSelected ? (
                          isMultiple ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )
                        ) : (
                          option.label
                        )}
                      </div>

                      {/* Option Text */}
                      <span
                        className={`text-sm sm:text-base leading-snug flex-1 ${
                          isSelected ? 'font-semibold text-blue-950' : 'text-slate-700'
                        }`}
                      >
                        {option.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

          {/* SHORT_ANSWER */}
          {question.type === 'SHORT_ANSWER' && (
            <div className="space-y-3">
              <label
                htmlFor={`short-ans-input-${question.id}`}
                className="block text-xs font-medium text-slate-600"
              >
                Type your answer below (case-insensitive):
              </label>
              <input
                id={`short-ans-input-${question.id}`}
                type="text"
                value={typeof currentAnswer === 'string' ? currentAnswer : ''}
                onChange={(e) => onAnswerChange(e.target.value)}
                placeholder="Enter exact short answer / term..."
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-600 focus:bg-blue-50/20 text-slate-900 font-medium text-base outline-none transition-all"
              />
            </div>
          )}

          {/* NUMERIC */}
          {question.type === 'NUMERIC' && (
            <div className="space-y-3">
              <label
                htmlFor={`numeric-ans-input-${question.id}`}
                className="block text-xs font-medium text-slate-600"
              >
                Enter your computed numeric value:
              </label>
              <input
                id={`numeric-ans-input-${question.id}`}
                type="number"
                step="any"
                value={typeof currentAnswer === 'string' ? currentAnswer : ''}
                onChange={(e) => onAnswerChange(e.target.value)}
                placeholder="e.g. 42 or 3.14"
                className="w-full sm:w-72 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-600 focus:bg-blue-50/20 text-slate-900 font-mono font-medium text-base outline-none transition-all"
              />
            </div>
          )}
        </div>
      </div>

      {/* Footer Navigation Bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-200">
        <div>
          {Boolean(currentAnswer && (typeof currentAnswer === 'string' ? currentAnswer.length > 0 : currentAnswer.length > 0)) && (
            <button
              id={`clear-answer-btn-${question.questionNumber}`}
              onClick={onClearAnswer}
              className="inline-flex items-center space-x-1 text-xs text-slate-500 hover:text-rose-600 font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Choice</span>
            </button>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <button
            id="prev-question-btn"
            onClick={onPrevQuestion}
            disabled={!hasPrev}
            className={`inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
              hasPrev
                ? 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            id="next-question-btn"
            onClick={onNextQuestion}
            className="inline-flex items-center space-x-1.5 px-5 py-2 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all active:scale-98"
          >
            <span>{hasNext ? 'Save & Next' : 'Review & Finish'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
