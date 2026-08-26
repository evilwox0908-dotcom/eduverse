import React, { useEffect, useState } from 'react';
import { Trophy, Calendar, Clock, Globe, ArrowRight, ShieldAlert, Sparkles, BookmarkCheck } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { Competition, DashboardView, CompetitionRegistration } from '../../types';
import { subscribeToPublishedCompetitions } from '../../services/competitionService';
import { subscribeToAllStudentRegistrations } from '../../services/registrationService';
import { useAuth } from '../../context/AuthContext';

interface UpcomingCompetitionsSectionProps {
  onSelectView: (view: DashboardView) => void;
}

export const UpcomingCompetitionsSection: React.FC<UpcomingCompetitionsSectionProps> = ({
  onSelectView,
}) => {
  const { user } = useAuth();
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [userRegistrations, setUserRegistrations] = useState<CompetitionRegistration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToPublishedCompetitions((comps) => {
      setCompetitions(comps.slice(0, 3)); // show top 3 on dashboard
      setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user?.uid) return;
    const unsub = subscribeToAllStudentRegistrations(user.uid, (regs) => {
      setUserRegistrations(regs);
    });
    return () => unsub();
  }, [user?.uid]);

  const registeredIds = new Set(
    userRegistrations
      .filter((r) => r.status === 'REGISTERED' || r.status === 'PAYMENT_CONFIRMED')
      .map((r) => r.competitionId)
  );

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Upcoming Competitions
            </h2>
            <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
              70% Focus
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified academic Olympiads and global contests.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            window.location.hash = '#/competitions';
          }}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
        >
          View All <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {loading ? (
        <div className="p-8 rounded-3xl glass-card text-center text-xs text-slate-400">
          Loading competition registry...
        </div>
      ) : competitions.length === 0 ? (
        /* Real Empty State: strictly genuine Firestore data */
        <GlassCard className="p-8 sm:p-10 rounded-3xl text-center border border-white/80">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-3 border border-blue-200/60 shadow-sm">
            <Trophy className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            No competitions available yet.
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1.5 leading-relaxed">
            International Olympiad schedules will be posted here as official registration opens. In the meantime, hone your mastery with the EduVerse AI Teacher.
          </p>
          <div className="mt-5">
            <button
              type="button"
              onClick={() => onSelectView('ai')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Practice with AI Teacher</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {competitions.map((comp) => {
            const isReg = registeredIds.has(comp.id);
            return (
              <GlassCard
                key={comp.id}
                className="p-5 rounded-3xl border border-white/80 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                      {comp.subject}
                    </span>
                    {isReg ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                        <BookmarkCheck className="w-3 h-3" />
                        Registered
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                        {comp.status}
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-slate-900 mb-2">
                    {comp.title}
                  </h4>

                  <div className="space-y-1.5 text-xs text-slate-500 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        Starts: {comp.startAt ? new Date(comp.startAt).toLocaleDateString() : comp.startDate || 'TBA'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Duration: {comp.durationMinutes ? `${comp.durationMinutes} mins` : comp.duration || '60 mins'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-slate-400" />
                      <span>Division: {comp.countryScope || comp.countryEligibility || 'Global'}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600">
                    Grade: {comp.level || comp.grade || 'All'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      window.location.hash = `#/competitions/${comp.id}`;
                    }}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
};
