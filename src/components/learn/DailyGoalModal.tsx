import React, { useState } from 'react';
import { Target, X, Check, Flame, Clock } from 'lucide-react';
import { DailyGoal } from '../../types';

interface DailyGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGoal: DailyGoal | null;
  onSaveTarget: (targetMinutes: number) => Promise<void>;
}

export const DailyGoalModal: React.FC<DailyGoalModalProps> = ({
  isOpen,
  onClose,
  currentGoal,
  onSaveTarget,
}) => {
  const [selectedMinutes, setSelectedMinutes] = useState<number>(
    currentGoal?.targetMinutes || 30
  );
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const goalOptions = [
    {
      minutes: 15,
      label: 'Casual Scholar',
      description: '15 mins/day — 1 lesson or quick diagnostic set.',
      intensity: 'Light',
      color: 'border-emerald-200 hover:border-emerald-400 bg-emerald-50/50',
    },
    {
      minutes: 30,
      label: 'Dedicated Inquisitor',
      description: '30 mins/day — Regular mastery & problem sets.',
      intensity: 'Recommended',
      color: 'border-blue-200 hover:border-blue-400 bg-blue-50/50',
    },
    {
      minutes: 60,
      label: 'Olympiad Contender',
      description: '60 mins/day — Deep theory derivations and competition speed solving.',
      intensity: 'Intensive',
      color: 'border-indigo-200 hover:border-indigo-400 bg-indigo-50/50',
    },
    {
      minutes: 120,
      label: 'Grandmaster Vanguard',
      description: '120 mins/day — Elite rigorous prep for national & international Olympiads.',
      intensity: 'Hardcore',
      color: 'border-purple-200 hover:border-purple-400 bg-purple-50/50',
    },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveTarget(selectedMinutes);
      onClose();
    } catch (err) {
      console.error('Failed to save goal:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-white/80 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-2xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/80 shadow-sm shrink-0">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Set Daily Learning Target</h3>
            <p className="text-xs text-slate-500">
              Establish a consistent study habit to accelerate your academic level and maintain streaks.
            </p>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {goalOptions.map((opt) => {
            const isSelected = selectedMinutes === opt.minutes;
            return (
              <button
                key={opt.minutes}
                type="button"
                onClick={() => setSelectedMinutes(opt.minutes)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/80 shadow-sm'
                    : 'border-slate-200/80 hover:border-slate-300 bg-white/70'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{opt.label}</span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {opt.intensity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{opt.description}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-black text-blue-600">{opt.minutes}m</span>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-slate-300 bg-transparent'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Current status */}
        {currentGoal && (
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>
                Today&apos;s Progress:{' '}
                <strong className="text-slate-800">{currentGoal.todayLearnedMinutes} mins</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-600 font-bold">
              <Flame className="w-4 h-4 fill-amber-500" />
              <span>{currentGoal.completedActivitiesToday} sessions</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-2xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 disabled:opacity-50 transition-all"
          >
            {isSaving ? 'Saving Target...' : 'Save Goal'}
          </button>
        </div>
      </div>
    </div>
  );
};
