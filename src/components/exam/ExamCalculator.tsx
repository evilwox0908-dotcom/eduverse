import React, { useState } from 'react';
import { Calculator as CalcIcon, X, Delete, RotateCcw } from 'lucide-react';
import { evaluateMathExpression } from '../../services/examService';

interface ExamCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExamCalculator: React.FC<ExamCalculatorProps> = ({ isOpen, onClose }) => {
  const [expression, setExpression] = useState<string>('');
  const [displayResult, setDisplayResult] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAppend = (val: string) => {
    setError(null);
    setExpression((prev) => prev + val);
  };

  const handleClear = () => {
    setExpression('');
    setDisplayResult('');
    setError(null);
  };

  const handleBackspace = () => {
    setError(null);
    setExpression((prev) => prev.slice(0, -1));
  };

  const handleCalculate = () => {
    if (!expression.trim()) return;
    const res = evaluateMathExpression(expression);
    if (res.success && res.value !== undefined) {
      setDisplayResult(String(res.value));
      setError(null);
    } else {
      setError(res.error || 'Syntax error');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCalculate();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const buttons = [
    ['(', ')', '%', 'AC'],
    ['7', '8', '9', '÷'],
    ['4', '5', '6', '×'],
    ['1', '2', '3', '-'],
    ['0', '.', '^', '+'],
  ];

  return (
    <div
      id="exam-calculator-modal"
      className="fixed bottom-6 right-6 z-50 w-80 sm:w-88 rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden text-slate-900 transition-all duration-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 text-white select-none">
        <div className="flex items-center space-x-2">
          <CalcIcon className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-semibold tracking-wide">Exam Calculator</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
            SECURE
          </span>
        </div>
        <button
          id="close-calculator-btn"
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Close Calculator"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Screen */}
      <div className="p-4 bg-slate-50 border-b border-slate-200">
        <input
          id="calculator-expression-input"
          type="text"
          value={expression}
          onChange={(e) => {
            setError(null);
            setExpression(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          placeholder="0"
          className="w-full bg-transparent text-right text-base font-mono text-slate-700 outline-none placeholder:text-slate-400"
          autoFocus
        />
        <div className="h-8 flex items-end justify-end mt-1">
          {error ? (
            <span className="text-xs text-rose-500 font-mono">{error}</span>
          ) : (
            <span className="text-2xl font-bold font-mono text-slate-900">
              {displayResult ? `= ${displayResult}` : ''}
            </span>
          )}
        </div>
      </div>

      {/* Keypad */}
      <div className="p-3 bg-white grid grid-cols-4 gap-1.5 select-none">
        {buttons.map((row, rIdx) =>
          row.map((btn, cIdx) => {
            let color = 'bg-slate-100 hover:bg-slate-200 text-slate-800 active:scale-95';
            if (['÷', '×', '-', '+', '%', '^'].includes(btn)) {
              color = 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold active:scale-95';
            } else if (btn === 'AC') {
              color = 'bg-rose-50 text-rose-600 hover:bg-rose-100 font-semibold active:scale-95';
            }

            return (
              <button
                key={`${rIdx}-${cIdx}`}
                id={`calc-btn-${btn}`}
                onClick={() => {
                  if (btn === 'AC') handleClear();
                  else if (btn === '÷') handleAppend('/');
                  else if (btn === '×') handleAppend('*');
                  else handleAppend(btn);
                }}
                className={`h-11 rounded-xl text-sm font-mono flex items-center justify-center transition-all ${color}`}
              >
                {btn}
              </button>
            );
          })
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="p-3 pt-0 bg-white grid grid-cols-2 gap-2">
        <button
          id="calc-backspace-btn"
          onClick={handleBackspace}
          className="h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center space-x-1.5 text-xs font-medium transition-colors"
        >
          <Delete className="w-4 h-4" />
          <span>Backspace</span>
        </button>
        <button
          id="calc-equals-btn"
          onClick={handleCalculate}
          className="h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center text-sm font-bold shadow-sm transition-colors active:scale-98"
        >
          = Calculate
        </button>
      </div>
    </div>
  );
};
