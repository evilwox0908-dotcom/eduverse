import React from 'react';
import {
  Home,
  BookOpen,
  Trophy,
  BarChart3,
  GraduationCap,
  Calendar,
  Sparkles,
  User,
  Settings,
  LogOut,
  Shield,
} from 'lucide-react';
import { DashboardView } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { EduVerseLogo } from '../ui/EduVerseLogo';

interface SidebarProps {
  currentView: DashboardView;
  onSelectView: (view: DashboardView) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  onLogout,
}) => {
  const { userProfile, user, isAdmin } = useAuth();

  const navItems: Array<{
    id: DashboardView;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    highlight?: boolean;
    adminOnly?: boolean;
  }> = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'learn', label: 'Learn', icon: BookOpen },
    { id: 'compete', label: 'Compete', icon: Trophy, badge: '70%' },
    { id: 'leaderboard', label: 'Leaderboard', icon: BarChart3 },
    { id: 'universities', label: 'Universities', icon: GraduationCap },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'ai', label: 'AI Teacher', icon: Sparkles, highlight: true },
    ...(isAdmin
      ? [
          {
            id: 'admin' as DashboardView,
            label: 'Admin Center',
            icon: Shield,
            badge: 'FOUNDER',
            highlight: false,
          },
        ]
      : []),
  ];

  const bottomItems: Array<{
    id: DashboardView;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col justify-between w-64 h-[calc(100vh-2rem)] sticky top-4 rounded-3xl glass-card border border-white/80 p-4 shadow-xl shadow-blue-900/5 bg-white/70 backdrop-blur-xl z-20">
      {/* Brand Header */}
      <div>
        <div className="flex items-center gap-3 px-2 py-3 mb-6 border-b border-slate-100/80">
          <EduVerseLogo size="md" />
          <div>
            <span className="text-base font-black tracking-tight text-slate-900 flex items-center gap-1.5">
              EduVerse
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            </span>
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Global Platform
            </p>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            const isAdminItem = item.id === 'admin';

            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => onSelectView(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? isAdminItem
                      ? 'bg-slate-900 text-white shadow-md shadow-slate-900/30'
                      : 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                    : isAdminItem
                    ? 'text-amber-700 bg-amber-50 hover:bg-amber-100/80 border border-amber-200/80'
                    : item.highlight
                    ? 'text-blue-700 bg-blue-50/80 hover:bg-blue-100/80 border border-blue-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive
                        ? 'text-white'
                        : isAdminItem
                        ? 'text-amber-600'
                        : item.highlight
                        ? 'text-blue-600'
                        : 'text-slate-500'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : isAdminItem
                        ? 'bg-amber-200 text-amber-900'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile & Actions */}
      <div className="pt-4 border-t border-slate-100 space-y-1.5">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              id={`sidebar-bottom-${item.id}`}
              onClick={() => onSelectView(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <Icon
                className={`w-4 h-4 ${
                  isActive ? 'text-white' : 'text-slate-500'
                }`}
              />
              <span>{item.label}</span>
            </button>
          );
        })}

        {/* Logout */}
        <button
          id="sidebar-logout-button"
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50/80 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>

        {/* Compact User Identity Pill */}
        <div className="pt-2">
          <div className="p-2.5 rounded-2xl bg-slate-50/80 border border-slate-200/60 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 text-white font-bold text-xs flex items-center justify-center overflow-hidden shrink-0">
              {userProfile?.photoURL || user?.photoURL ? (
                <img
                  src={userProfile?.photoURL || user?.photoURL || ''}
                  alt={userProfile?.firstName || 'Student'}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                userProfile?.firstName?.[0] || 'S'
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <p className="text-xs font-bold text-slate-800 truncate">
                  {userProfile?.firstName
                    ? `${userProfile.firstName} ${userProfile.lastName || ''}`
                    : user?.displayName || 'Student'}
                </p>
                {isAdmin && (
                  <Shield className="w-3 h-3 text-amber-500 shrink-0" />
                )}
              </div>
              <p className="text-[10px] text-slate-400 truncate">
                {isAdmin ? 'System Administrator' : (userProfile?.schoolName || userProfile?.country || 'EduVerse Scholar')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
