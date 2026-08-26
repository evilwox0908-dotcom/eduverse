import React from 'react';
import { Sparkles } from 'lucide-react';
import { AITeacherOrb } from '../3d/AITeacherOrb';

export const AILoadingIndicator: React.FC = () => {
  return (
    <div className="flex gap-3 sm:gap-4 my-4 animate-in fade-in duration-200">
      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-400 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-600/20 border border-white">
        <Sparkles className="w-4 h-4 animate-spin" />
      </div>

      <div className="bg-white/90 glass-card text-slate-800 rounded-3xl rounded-tl-sm p-4 sm:p-5 border border-white/90 shadow-lg shadow-blue-900/5 max-w-[80%] flex items-center gap-4">
        <AITeacherOrb className="w-12 h-12 shrink-0" isThinking={true} />

        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-blue-700">EduVerse AI Teacher</span>
            <span className="text-[10px] text-slate-400 font-medium">calibrating response...</span>
          </div>

          {/* 3 Glowing Pulsing Dots */}
          <div className="flex items-center gap-1.5 pt-1">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.3s]" />
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-bounce [animation-delay:-0.15s]" />
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
};
