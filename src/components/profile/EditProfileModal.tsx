import React, { useState } from 'react';
import {
  X,
  User,
  Building,
  GraduationCap,
  Globe,
  Lock,
  Eye,
  Check,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { UserProfile, ProfilePrivacySettings } from '../../types';
import { COUNTRIES } from '../../data/countries';

interface EditProfileModalProps {
  profile: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: Partial<UserProfile>) => Promise<any>;
}

const COMMON_GOALS = [
  'Math Olympiad',
  'Physics Championship',
  'Chemistry Challenge',
  'Coding & Algorithms',
  'Robotics & AI',
  'International Science Olympiad',
  'Astronomy & Space',
  'National Scholar Laureate',
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  profile,
  isOpen,
  onClose,
  onSave,
}) => {
  const [firstName, setFirstName] = useState(profile?.firstName || '');
  const [lastName, setLastName] = useState(profile?.lastName || '');
  const [photoURL, setPhotoURL] = useState(profile?.photoURL || '');
  const [country, setCountry] = useState(profile?.country || '');
  const [countryCode, setCountryCode] = useState(profile?.countryCode || '');
  const [schoolName, setSchoolName] = useState(profile?.schoolName || '');
  const [grade, setGrade] = useState(profile?.grade || '');
  const [educationSystem, setEducationSystem] = useState(profile?.educationSystem || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [targetGoals, setTargetGoals] = useState<string[]>(profile?.targetGoals || []);
  const [customGoal, setCustomGoal] = useState('');

  const [privacySettings, setPrivacySettings] = useState<ProfilePrivacySettings>({
    isPublicProfile: profile?.privacySettings?.isPublicProfile ?? false,
    showSchool: profile?.privacySettings?.showSchool ?? true,
    showCountry: profile?.privacySettings?.showCountry ?? true,
    showAchievements: profile?.privacySettings?.showAchievements ?? true,
    showCompetitionResults: profile?.privacySettings?.showCompetitionResults ?? true,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCountryChange = (cName: string) => {
    setCountry(cName);
    const found = COUNTRIES.find((c) => c.name === cName);
    if (found) {
      setCountryCode(found.code);
    }
  };

  const toggleGoal = (goal: string) => {
    if (targetGoals.includes(goal)) {
      setTargetGoals(targetGoals.filter((g) => g !== goal));
    } else {
      if (targetGoals.length < 5) {
        setTargetGoals([...targetGoals, goal]);
      }
    }
  };

  const handleAddCustomGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (customGoal.trim() && !targetGoals.includes(customGoal.trim()) && targetGoals.length < 5) {
      setTargetGoals([...targetGoals, customGoal.trim()]);
      setCustomGoal('');
    }
  };

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      setError('First name and last name are required.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await onSave({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        photoURL: photoURL.trim(),
        country,
        countryCode,
        schoolName: schoolName.trim(),
        grade,
        educationSystem,
        bio: bio.trim(),
        targetGoals,
        privacySettings,
      });
      onClose();
    } catch (err: any) {
      console.error('Error saving profile changes:', err);
      setError(err.message || 'Failed to save profile changes');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Edit Academic Profile</h3>
            <p className="text-xs text-slate-500">Update your student identity and privacy preferences</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[72vh] overflow-y-auto">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Personal Info */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>Personal Details</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  First Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Last Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Profile Photo URL
              </label>
              <input
                type="url"
                placeholder="https://example.com/photo.jpg"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Academic Info */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-blue-600" />
              <span>Academic Institution & Region</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Country
                </label>
                <select
                  value={country}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">Select country...</option>
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.name}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  School / Institution
                </label>
                <input
                  type="text"
                  placeholder="e.g. St. Jude High School"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Grade / Year
                </label>
                <input
                  type="text"
                  placeholder="e.g. Grade 10 / High School"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Education System / Curriculum
                </label>
                <input
                  type="text"
                  placeholder="e.g. IB / Cambridge / US Common Core"
                  value={educationSystem}
                  onChange={(e) => setEducationSystem(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </div>

          {/* Academic Bio & Goals */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
              <span>Bio & Academic Goals</span>
            </h4>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Academic Bio
                </label>
                <span className="text-[11px] text-slate-400">
                  {bio.length} / 300 characters
                </span>
              </div>
              <textarea
                maxLength={300}
                rows={3}
                placeholder="Share your academic interests, Olympiad ambitions, and key disciplines..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Target Academic Goals (select up to 5)
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {COMMON_GOALS.map((goal) => {
                  const isSelected = targetGoals.includes(goal);
                  return (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => toggleGoal(goal)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50 border-blue-300 text-blue-700 font-semibold'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {goal}
                    </button>
                  );
                })}
              </div>

              {/* Custom Goal adder */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add custom goal..."
                  value={customGoal}
                  onChange={(e) => setCustomGoal(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                />
                <button
                  type="button"
                  onClick={handleAddCustomGoal}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Privacy Controls */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-blue-600" />
              <span>Public Profile & Privacy Settings</span>
            </h4>

            <div className="space-y-2.5">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer hover:bg-slate-100/70 transition-colors">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Make Profile Public
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Allow other students and universities to view your verified public academic identity.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={privacySettings.isPublicProfile}
                  onChange={(e) =>
                    setPrivacySettings({
                      ...privacySettings,
                      isPublicProfile: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-blue-600 rounded-sm border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
              </label>

              {privacySettings.isPublicProfile && (
                <div className="pl-4 space-y-2 text-xs border-l-2 border-blue-200 ml-2">
                  <label className="flex items-center justify-between py-1 cursor-pointer">
                    <span className="text-slate-700">Display School Name</span>
                    <input
                      type="checkbox"
                      checked={privacySettings.showSchool}
                      onChange={(e) =>
                        setPrivacySettings({
                          ...privacySettings,
                          showSchool: e.target.checked,
                        })
                      }
                      className="w-3.5 h-3.5 text-blue-600 rounded-sm"
                    />
                  </label>

                  <label className="flex items-center justify-between py-1 cursor-pointer">
                    <span className="text-slate-700">Display Country & Region</span>
                    <input
                      type="checkbox"
                      checked={privacySettings.showCountry}
                      onChange={(e) =>
                        setPrivacySettings({
                          ...privacySettings,
                          showCountry: e.target.checked,
                        })
                      }
                      className="w-3.5 h-3.5 text-blue-600 rounded-sm"
                    />
                  </label>

                  <label className="flex items-center justify-between py-1 cursor-pointer">
                    <span className="text-slate-700">Display Unlocked Achievements</span>
                    <input
                      type="checkbox"
                      checked={privacySettings.showAchievements}
                      onChange={(e) =>
                        setPrivacySettings({
                          ...privacySettings,
                          showAchievements: e.target.checked,
                        })
                      }
                      className="w-3.5 h-3.5 text-blue-600 rounded-sm"
                    />
                  </label>

                  <label className="flex items-center justify-between py-1 cursor-pointer">
                    <span className="text-slate-700">Display Verified Competition Record</span>
                    <input
                      type="checkbox"
                      checked={privacySettings.showCompetitionResults}
                      onChange={(e) =>
                        setPrivacySettings({
                          ...privacySettings,
                          showCompetitionResults: e.target.checked,
                        })
                      }
                      className="w-3.5 h-3.5 text-blue-600 rounded-sm"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <span>Saving...</span>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
