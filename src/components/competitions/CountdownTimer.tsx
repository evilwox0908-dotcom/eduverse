import React from 'react';
import { Clock } from 'lucide-react';
import { useCountdown } from '../../hooks/useCountdown';

interface CountdownTimerProps {
  targetDate: string | number | undefined | null;
  label?: string;
  className?: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  label = 'Starts In',
  className = '',
}) => {
  const { days, hours, minutes, seconds, isExpired, formatted } = useCountdown(targetDate);

  if (isExpired) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100/90 border border-slate-200/80 text-slate-600 text-xs font-semibold ${className}`}>
        <Clock className="w-3.5 h-3.5 text-slate-400" />
        <span>{formatted}</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-blue-50/90 border border-blue-200/80 text-blue-900 shadow-xs ${className}`}>
      <Clock className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
      {label && <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">{label}:</span>}
      <div className="flex items-center gap-1 font-mono text-xs font-black tracking-tight">
        {days > 0 && (
          <span className="px-1.5 py-0.5 rounded-md bg-white text-blue-900 border border-blue-200/60 shadow-2xs">
            {days}d
          </span>
        )}
        <span className="px-1.5 py-0.5 rounded-md bg-white text-blue-900 border border-blue-200/60 shadow-2xs">
          {String(hours).padStart(2, '0')}h
        </span>
        <span>:</span>
        <span className="px-1.5 py-0.5 rounded-md bg-white text-blue-900 border border-blue-200/60 shadow-2xs">
          {String(minutes).padStart(2, '0')}m
        </span>
        <span>:</span>
        <span className="px-1.5 py-0.5 rounded-md bg-white text-blue-900 border border-blue-200/60 shadow-2xs">
          {String(seconds).padStart(2, '0')}s
        </span>
      </div>
    </div>
  );
};
