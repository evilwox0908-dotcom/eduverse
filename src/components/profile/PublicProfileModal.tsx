import React, { useState, useEffect } from 'react';
import {
  X,
  Share2,
  Globe,
  Building,
  GraduationCap,
  ShieldCheck,
  Zap,
  Flame,
  Award,
  Trophy,
  Copy,
  Check,
  Lock,
} from 'lucide-react';
import { PublicStudentProfile, UserProfile } from '../../types';
import { fetchPublicStudentProfile } from '../../services/profileService';

interface PublicProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  identifier: string; // EV ID or UID
  currentProfile?: UserProfile | null;
}

export const PublicProfileModal: React.FC<PublicProfileModalProps> = ({
  isOpen,
  onClose,
  identifier,
  currentProfile,
}) => {
  const [data, setData] = useState<PublicStudentProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen || !identifier) return;

    let isMounted = true;
    async function load() {
      setLoading(true);
      setIsPrivate(false);
      try {
        const res = await fetchPublicStudentProfile(identifier);
        if (isMounted) {
          if (res) {
            setData(res);
          } else {
            setIsPrivate(true);
          }
        }
      } catch {
        if (isMounted) setIsPrivate(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [isOpen, identifier]);

  if (!isOpen) return null;

  const publicUrl = `${window.location.origin}/#profile?id=${encodeURIComponent(
    data?.eduVerseId || identifier
  )}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Verified Public Academic Profile
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="py-16 text-center space-y-2">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-500">Resolving public credentials...</p>
            </div>
          ) : isPrivate ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-800">Private Profile</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                This student has configured their EduVerse profile privacy to private.
              </p>
            </div>
          ) : data ? (
            <div className="space-y-6">
              {/* Profile Card Header */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-[2px]">
                  <div className="w-full h-full rounded-2xl bg-white overflow-hidden flex items-center justify-center">
                    {data.photoURL ? (
                      <img
                        src={data.photoURL}
                        alt={data.displayName}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-blue-600 font-bold text-lg">
                        {data.displayName.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-slate-900">{data.displayName}</h4>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span className="font-mono font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                      {data.eduVerseId}
                    </span>
                    {data.country && <span>• {data.country}</span>}
                    {data.schoolName && <span>• {data.schoolName}</span>}
                  </div>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 text-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Level
                  </span>
                  <span className="text-sm font-extrabold text-indigo-600">
                    Level {data.level}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Total XP
                  </span>
                  <span className="text-sm font-extrabold text-amber-600">
                    {data.totalXp} XP
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Streak
                  </span>
                  <span className="text-sm font-extrabold text-orange-600">
                    {data.currentStreak} Days
                  </span>
                </div>
              </div>

              {/* Achievements Showcase */}
              {data.achievements && data.achievements.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-blue-600" />
                    <span>Verified Achievements ({data.achievements.length})</span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {data.achievements.map((ach) => (
                      <div
                        key={ach.id}
                        className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-700 flex items-center gap-1.5 shadow-2xs"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{ach.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Competition Record */}
              {data.competitionRecord && data.competitionRecord.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-amber-600" />
                    <span>Official Competition Record</span>
                  </span>
                  <div className="space-y-1.5 text-xs">
                    {data.competitionRecord.map((rec, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                      >
                        <span className="font-semibold text-slate-800">
                          {rec.competitionTitle}
                        </span>
                        <span className="font-bold text-blue-600">
                          {rec.score} / {rec.totalPoints} ({rec.percentage}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Share link tool */}
              <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-center justify-between gap-3">
                <input
                  type="text"
                  readOnly
                  value={publicUrl}
                  className="bg-transparent text-xs text-slate-600 font-mono flex-1 truncate focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shrink-0 flex items-center gap-1 cursor-pointer"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
