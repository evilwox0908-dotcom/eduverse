import React from 'react';
import { Globe, Shield, Sparkles } from 'lucide-react';
import { ActiveModal } from '../../types';

interface FooterProps {
  onOpenModal: (modal: ActiveModal) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenModal }) => {
  return (
    <footer className="relative mt-16 border-t border-slate-200/80 bg-white/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-slate-900">
                Edu<span className="text-blue-600">Verse</span>
              </span>
              <span className="text-xs text-slate-500 block">
                Next-Gen Global Education Technology
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-600">
            <button
              onClick={() => onOpenModal('learn')}
              className="hover:text-blue-600 transition-colors"
            >
              Learn
            </button>
            <button
              onClick={() => onOpenModal('competitions')}
              className="hover:text-blue-600 transition-colors"
            >
              Compete
            </button>
            <button
              onClick={() => onOpenModal('leaderboard')}
              className="hover:text-blue-600 transition-colors"
            >
              Leaderboard
            </button>
            <button
              onClick={() => onOpenModal('universities')}
              className="hover:text-blue-600 transition-colors"
            >
              Universities
            </button>
          </div>

          {/* System Status / Phase indicator */}
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-100/80 px-3 py-1.5 rounded-full border border-slate-200/60">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Phase 1 — Foundation Live</span>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} EduVerse Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-blue-500" />
              Verified Architecture
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
