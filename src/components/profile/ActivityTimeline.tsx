import React from 'react';
import {
  Trophy,
  Award,
  ShieldCheck,
  Zap,
  Sparkles,
  UserCheck,
  Flag,
  Calendar,
  Clock,
} from 'lucide-react';
import { StudentActivity } from '../../types';
import { ACTIVITY_TYPE_CONFIG, formatActivityTimestamp } from '../../services/activityService';

interface ActivityTimelineProps {
  activities: StudentActivity[];
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Trophy,
  Award,
  ShieldCheck,
  Zap,
  Sparkles,
  UserCheck,
  Flag,
};

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities }) => {
  if (activities.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
          <Calendar className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-slate-800">No Activity History Yet</h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          Your official academic activity history will automatically record here as you complete lessons, practice sessions, and Olympiad exams.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Real Academic Activity Timeline
          </h3>
          <p className="text-xs text-slate-500">
            Auditable log of your verified learning, achievements, and competition events
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
          {activities.length} {activities.length === 1 ? 'Event' : 'Events'}
        </span>
      </div>

      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {activities.map((act) => {
          const config = ACTIVITY_TYPE_CONFIG[act.type] || {
            label: 'Activity',
            icon: 'Zap',
            color: 'text-blue-600',
            bg: 'bg-blue-50',
          };
          const IconComp = ICON_MAP[config.icon] || Zap;
          const relativeTime = formatActivityTimestamp(act.timestamp);

          return (
            <div key={act.id} className="relative group">
              {/* Timeline marker */}
              <div
                className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full ${config.bg} ${config.color} border-2 border-white flex items-center justify-center shadow-xs`}
              >
                <IconComp className="w-3 h-3" />
              </div>

              {/* Event Content Card */}
              <div className="bg-slate-50/70 group-hover:bg-slate-50 border border-slate-200/70 rounded-2xl p-4 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${config.bg} ${config.color} border border-current/20`}
                    >
                      {config.label}
                    </span>
                    <h5 className="text-xs sm:text-sm font-bold text-slate-900">
                      {act.title}
                    </h5>
                  </div>

                  <div className="inline-flex items-center gap-1 text-[11px] text-slate-400 font-medium shrink-0">
                    <Clock className="w-3 h-3" />
                    <span>{relativeTime}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {act.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
