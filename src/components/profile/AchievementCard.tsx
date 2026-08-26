import React from 'react';
import {
  UserCheck,
  Sparkles,
  Award,
  Trophy,
  Crown,
  Flame,
  Globe,
  Zap,
  ShieldCheck,
  Lock,
  CheckCircle2,
} from 'lucide-react';
import { AchievementDefinition, StudentAchievement } from '../../types';
import { RARITY_CONFIG, CATEGORY_LABELS } from '../../services/achievementService';

interface AchievementCardProps {
  definition: AchievementDefinition;
  unlockedRecord?: StudentAchievement;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  UserCheck,
  Sparkles,
  Award,
  Trophy,
  Crown,
  Flame,
  Globe,
  Zap,
  ShieldCheck,
};

export const AchievementCard: React.FC<AchievementCardProps> = ({
  definition,
  unlockedRecord,
}) => {
  const isUnlocked = Boolean(unlockedRecord);
  const rarityStyle = RARITY_CONFIG[definition.rarity];
  const IconComponent = ICON_MAP[definition.icon] || Award;

  const formattedDate = unlockedRecord?.unlockedAt
    ? new Date(unlockedRecord.unlockedAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <div
      className={`relative rounded-2xl p-4 sm:p-5 border transition-all duration-200 flex flex-col justify-between overflow-hidden ${
        isUnlocked
          ? `bg-white/95 backdrop-blur-md ${rarityStyle.border} ${rarityStyle.glow} shadow-sm hover:shadow-md`
          : 'bg-slate-50/70 border-slate-200/80 opacity-75 grayscale-[25%]'
      }`}
    >
      <div>
        {/* Header: Category, Rarity badge & Lock/Unlock state */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${rarityStyle.bg} ${rarityStyle.text} border ${rarityStyle.border}`}
            >
              {rarityStyle.label}
            </span>
            <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
              {CATEGORY_LABELS[definition.category]}
            </span>
          </div>

          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              isUnlocked
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'bg-slate-200 text-slate-400'
            }`}
          >
            {isUnlocked ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <Lock className="w-3.5 h-3.5" />
            )}
          </div>
        </div>

        {/* Icon & Title */}
        <div className="flex items-start gap-3.5 mb-2.5">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
              isUnlocked
                ? `${rarityStyle.bg} ${rarityStyle.text} border ${rarityStyle.border}`
                : 'bg-slate-100 text-slate-400 border border-slate-200'
            }`}
          >
            <IconComponent className="w-5 h-5" />
          </div>

          <div>
            <h4
              className={`text-sm font-bold leading-snug ${
                isUnlocked ? 'text-slate-900' : 'text-slate-600'
              }`}
            >
              {definition.name}
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed mt-1 line-clamp-2">
              {definition.description}
            </p>
          </div>
        </div>
      </div>

      {/* Footer: XP Reward & Unlock Date */}
      <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-xs">
        <span
          className={`font-bold inline-flex items-center gap-1 ${
            isUnlocked ? 'text-amber-600' : 'text-slate-400'
          }`}
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          +{definition.rewardXp} XP
        </span>

        {isUnlocked ? (
          <span className="text-[11px] text-emerald-600 font-medium">
            Unlocked {formattedDate}
          </span>
        ) : (
          <span className="text-[11px] text-slate-400 font-medium">
            Locked
          </span>
        )}
      </div>
    </div>
  );
};
