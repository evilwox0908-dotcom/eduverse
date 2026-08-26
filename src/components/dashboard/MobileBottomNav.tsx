import React from 'react';
import {
  Home,
  BookOpen,
  Trophy,
  BarChart3,
  Sparkles,
  User,
} from 'lucide-react';
import { DashboardView } from '../../types';

interface MobileBottomNavProps {
  currentView: DashboardView;
  onSelectView: (view: DashboardView) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  onSelectView,
}) => {
  const navItems: Array<{
    id: DashboardView;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }> = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'learn', label: 'Learn', icon: BookOpen },
    { id: 'compete', label: 'Compete', icon: Trophy, badge: '70%' },
    { id: 'leaderboard', label: 'Ranks', icon: BarChart3 },
    { id: 'ai', label: 'AI Tutor', icon: Sparkles },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-2xl border-t border-slate-200/80 px-2 py-1.5 shadow-2xl">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              onClick={() => onSelectView(item.id)}
              className={`flex flex-col items-center justify-center min-w-[50px] min-h-[44px] py-1 px-2 rounded-xl transition-all ${
                isActive
                  ? 'text-blue-600 font-bold bg-blue-50/80'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {item.badge && !isActive && (
                  <span className="absolute -top-1 -right-2 text-[8px] font-black bg-blue-600 text-white px-1 py-0.2 rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 whitespace-nowrap leading-none">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
