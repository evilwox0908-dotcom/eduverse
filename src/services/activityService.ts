import { StudentActivityType } from '../types';

export const ACTIVITY_TYPE_CONFIG: Record<
  StudentActivityType,
  { label: string; icon: string; color: string; bg: string }
> = {
  EXAM_COMPLETED: {
    label: 'Competition Exam',
    icon: 'Trophy',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  ACHIEVEMENT_UNLOCKED: {
    label: 'Achievement Unlocked',
    icon: 'Award',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  LEVEL_UP: {
    label: 'Level Advancement',
    icon: 'ShieldCheck',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
  },
  XP_EARNED: {
    label: 'XP Gained',
    icon: 'Zap',
    color: 'text-sky-600',
    bg: 'bg-sky-50',
  },
  AI_SESSION: {
    label: 'AI Dialogue',
    icon: 'Sparkles',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  PROFILE_UPDATED: {
    label: 'Profile Update',
    icon: 'UserCheck',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  COMPETITION_REGISTERED: {
    label: 'Competition Registration',
    icon: 'Flag',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
};

export function formatActivityTimestamp(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return 'Recently';

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  } catch {
    return 'Recently';
  }
}
