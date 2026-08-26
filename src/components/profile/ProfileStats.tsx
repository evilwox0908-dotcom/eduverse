import React from 'react';
import { Zap, ShieldCheck, Flame, Trophy, Award } from 'lucide-react';
import { LevelInfo } from '../../types';

interface ProfileStatsProps {
  totalXp: number;
  levelInfo: LevelInfo;
  currentStreak: number;
  longestStreak: number;
  completedCompetitionsCount: number;
  unlockedAchievementsCount: number;
  totalAchievementsCount: number;
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({
  totalXp,
  levelInfo,
  currentStreak,
  longestStreak,
  completedCompetitionsCount,
  unlockedAchievementsCount,
  totalAchievementsCount,
}) => {
  const stats = [
    {
      id: 'stat-xp',
      label: 'Total XP',
      value: totalXp.toLocaleString(),
      subtext: `${levelInfo.xpToNextLevel} XP to Level ${levelInfo.level + 1}`,
      icon: Zap,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200/70',
    },
    {
      id: 'stat-level',
      label: 'EduVerse Level',
      value: `Level ${levelInfo.level}`,
      subtext: levelInfo.title,
      icon: ShieldCheck,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      border: 'border-indigo-200/70',
    },
    {
      id: 'stat-streak',
      label: 'Learning Streak',
      value: `${currentStreak} ${currentStreak === 1 ? 'Day' : 'Days'}`,
      subtext: `Best record: ${longestStreak} ${longestStreak === 1 ? 'day' : 'days'}`,
      icon: Flame,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      border: 'border-orange-200/70',
    },
    {
      id: 'stat-competitions',
      label: 'Verified Olympiads',
      value: completedCompetitionsCount.toString(),
      subtext: completedCompetitionsCount > 0 ? 'Official submissions' : 'No submissions yet',
      icon: Trophy,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200/70',
    },
    {
      id: 'stat-achievements',
      label: 'Achievements',
      value: `${unlockedAchievementsCount} / ${totalAchievementsCount}`,
      subtext: `${Math.round((unlockedAchievementsCount / (totalAchievementsCount || 1)) * 100)}% unlocked`,
      icon: Award,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200/70',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.id}
            id={stat.id}
            className={`bg-white/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 border ${stat.border} shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {stat.label}
              </span>
              <div className={`w-8 h-8 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {stat.value}
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate mt-0.5">
                {stat.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
