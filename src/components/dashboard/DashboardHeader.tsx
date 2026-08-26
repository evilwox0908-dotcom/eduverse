import React, { useState } from 'react';
import {
  Bell,
  Search,
  Globe,
  Sparkles,
  CheckCircle2,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DashboardView } from '../../types';

interface DashboardHeaderProps {
  onSelectView: (view: DashboardView) => void;
  onOpenSearch?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onSelectView,
}) => {
  const { user, userProfile } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const displayName = userProfile?.firstName
    ? `${userProfile.firstName} ${userProfile.lastName || ''}`
    : user?.displayName || 'Student';

  return (
    <header className="w-full glass-card border border-white/80 rounded-2xl sm:rounded-3xl p-3 sm:p-4 mb-6 shadow-sm bg-white/75 backdrop-blur-xl flex items-center justify-between gap-3 relative z-30">
      {/* Mobile Brand / Breadcrumb */}
      <div className="flex items-center gap-3">
        <div className="lg:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-700 to-sky-400 flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-600/20">
            E
          </div>
          <span className="font-black text-base tracking-tight text-slate-900">
            EduVerse
          </span>
        </div>

        {/* Global Student Country Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100/80 border border-slate-200/60 text-xs font-semibold text-slate-700">
          <Globe className="w-3.5 h-3.5 text-blue-600" />
          <span>{userProfile?.country || 'International'}</span>
          {userProfile?.countryCode && (
            <span className="text-[10px] uppercase font-bold text-slate-400 bg-white px-1.5 py-0.2 rounded border border-slate-200">
              {userProfile.countryCode}
            </span>
          )}
        </div>
      </div>

      {/* Search Input (Interactive with AI quick trigger) */}
      <div className="hidden md:flex flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="dashboard-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchQuery.trim()) {
                onSelectView('ai');
              }
            }}
            placeholder="Search topics, Olympiads, or ask AI Teacher..."
            className="w-full bg-slate-50/90 border border-slate-200/80 rounded-full pl-9 pr-24 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-500 transition-all"
          />
          <button
            onClick={() => onSelectView('ai')}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center gap-1 hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Sparkles className="w-2.5 h-2.5" />
            <span>Ask AI</span>
          </button>
        </div>
      </div>

      {/* Right Action Icons & Avatar */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notification Bell */}
        <div className="relative">
          <button
            id="dashboard-notifications-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
            className="p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-blue-50/80 transition-all border border-slate-200/60 relative"
          >
            <Bell className="w-4 h-4" />
          </button>

          {/* Notifications Popover */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-slate-200/90 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800">
                  Notifications
                </span>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="py-6 text-center">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-2">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-700">
                  No new notifications
                </p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-[200px] mx-auto">
                  Updates on registered competitions and AI tutor insights will appear here.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Student Avatar / Profile Access */}
        <button
          id="dashboard-avatar-btn"
          onClick={() => onSelectView('profile')}
          className="flex items-center gap-2.5 p-1 pr-2.5 rounded-full hover:bg-slate-100/80 transition-all border border-transparent hover:border-slate-200/60 text-left"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-sky-400 text-white font-bold text-xs flex items-center justify-center overflow-hidden border border-white shadow-sm shrink-0">
            {userProfile?.photoURL || user?.photoURL ? (
              <img
                src={userProfile?.photoURL || user?.photoURL || ''}
                alt={displayName}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              userProfile?.firstName?.[0] || 'S'
            )}
          </div>
          <div className="hidden sm:block text-left min-w-0">
            <p className="text-xs font-bold text-slate-800 leading-none truncate">
              {userProfile?.firstName || 'Student'}
            </p>
            <p className="text-[10px] text-blue-600 font-semibold mt-0.5">
              {userProfile?.grade || 'Grade 10'}
            </p>
          </div>
        </button>
      </div>
    </header>
  );
};
