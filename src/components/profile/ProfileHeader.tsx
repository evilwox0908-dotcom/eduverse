import React, { useState } from 'react';
import {
  UserCheck,
  Building,
  GraduationCap,
  Copy,
  Check,
  Edit3,
  Globe,
  Share2,
  AlertCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { UserProfile, ProfileCompletionInfo } from '../../types';
import { Profile3DScene } from './Profile3DScene';

interface ProfileHeaderProps {
  profile: UserProfile | null;
  completion: ProfileCompletionInfo;
  onEditClick: () => void;
  onPublicPreviewClick: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  completion,
  onEditClick,
  onPublicPreviewClick,
}) => {
  const [copied, setCopied] = useState(false);
  const [showMissingDetails, setShowMissingDetails] = useState(false);

  const eduVerseId = profile?.eduVerseId || 'EV-SCHOLAR';
  const fullName =
    `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim() ||
    profile?.displayName ||
    'EduVerse Student';

  const initials = (
    (profile?.firstName?.[0] || '') + (profile?.lastName?.[0] || 'S')
  ).toUpperCase() || 'EV';

  const handleCopyId = () => {
    navigator.clipboard.writeText(eduVerseId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Ambient background decoration */}
      <div className="absolute top-0 right-0 w-80 h-80 opacity-20 pointer-events-none">
        <Profile3DScene />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
        {/* Left: Avatar & Identity Details */}
        <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
          {/* Avatar Container */}
          <div className="relative group">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-[3px] shadow-lg shadow-blue-500/10">
              <div className="w-full h-full rounded-2xl bg-slate-100 overflow-hidden flex items-center justify-center">
                {profile?.photoURL ? (
                  <img
                    src={profile.photoURL}
                    alt={fullName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center text-blue-700 font-bold text-2xl tracking-wider">
                    {initials}
                  </div>
                )}
              </div>
            </div>
            {/* Status Dot */}
            <div
              title="Verified Student Identity"
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-[10px]"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </div>

          {/* Name & Academic Meta */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {fullName}
              </h1>

              {/* EduVerse ID Badge */}
              <button
                type="button"
                onClick={handleCopyId}
                title="Click to copy official EduVerse ID"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200/80 text-blue-700 font-mono text-xs font-semibold hover:bg-blue-100/70 transition-colors"
              >
                <span>{eduVerseId}</span>
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-blue-500" />
                )}
              </button>
            </div>

            {/* Sub-meta (School, Country, Grade) */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-slate-600">
              {profile?.schoolName && (
                <span className="inline-flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-slate-400" />
                  <span className="font-medium">{profile.schoolName}</span>
                  {profile.schoolVerificationStatus === 'verified' && (
                    <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                      Verified
                    </span>
                  )}
                </span>
              )}

              {profile?.country && (
                <span className="inline-flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-slate-400" />
                  <span>
                    {profile.country}
                    {profile.region ? ` (${profile.region})` : ''}
                  </span>
                </span>
              )}

              {profile?.grade && (
                <span className="inline-flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-slate-400" />
                  <span>
                    {profile.grade}
                    {profile.educationSystem ? ` • ${profile.educationSystem}` : ''}
                  </span>
                </span>
              )}
            </div>

            {/* Bio & Goals */}
            {profile?.bio && (
              <p className="text-sm text-slate-600 max-w-xl line-clamp-2 leading-relaxed pt-1">
                {profile.bio}
              </p>
            )}

            {profile?.targetGoals && profile.targetGoals.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {profile.targetGoals.map((goal, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200/60"
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    {goal}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-wrap sm:flex-nowrap lg:flex-col gap-2.5 w-full lg:w-auto">
          <button
            type="button"
            onClick={onEditClick}
            className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>

          <button
            type="button"
            onClick={onPublicPreviewClick}
            className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm transition-all cursor-pointer border border-slate-200/80"
          >
            <Share2 className="w-4 h-4 text-slate-500" />
            <span>Public View</span>
          </button>
        </div>
      </div>

      {/* Profile Completion Bar */}
      <div className="mt-6 pt-5 border-t border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <UserCheck
              className={`w-4 h-4 ${
                completion.isComplete ? 'text-emerald-600' : 'text-blue-600'
              }`}
            />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Profile Verification & Completion
            </span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                completion.isComplete
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}
            >
              {completion.percentage}%
            </span>
          </div>

          {!completion.isComplete && (
            <button
              type="button"
              onClick={() => setShowMissingDetails(!showMissingDetails)}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1 cursor-pointer"
            >
              <span>
                {showMissingDetails ? 'Hide Missing Details' : 'View Missing Fields'}
              </span>
              {showMissingDetails ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>

        {/* Progress Track */}
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              completion.isComplete
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                : 'bg-gradient-to-r from-blue-500 to-indigo-500'
            }`}
            style={{ width: `${completion.percentage}%` }}
          />
        </div>

        {/* Missing Fields Dropdown Card */}
        {showMissingDetails && !completion.isComplete && (
          <div className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-2">
            <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
              <span>Complete the following to reach 100% and earn the First Step badge (+50 XP):</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {completion.missingFields.map((field, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-600 font-medium"
                >
                  • {field}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
