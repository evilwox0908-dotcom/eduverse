import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Globe,
  Building,
  GraduationCap,
  CheckCircle2,
  Search,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Check,
  AlertCircle,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { GlassCard } from '../ui/GlassCard';
import { useAuth } from '../../context/AuthContext';
import { COUNTRIES, FEATURED_COUNTRY_CODES } from '../../data/countries';
import { OnboardingState, UserRole, SchoolVerificationStatus } from '../../types';

interface OnboardingFlowProps {
  onComplete: () => void;
  onStepChange?: (step: number) => void;
}

const STEPS = [
  { number: '01', title: 'About You', subtitle: 'Personal profile' },
  { number: '02', title: 'Country', subtitle: 'Global region' },
  { number: '03', title: 'School', subtitle: 'Academic institution' },
  { number: '04', title: 'Grade', subtitle: 'Curriculum level' },
  { number: '05', title: 'Complete', subtitle: 'Ready for EduVerse' },
];

const EDUCATION_SYSTEMS = [
  { id: 'us_k12', name: 'US / International (K-12)', grades: ['Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'] },
  { id: 'uk_curriculum', name: 'UK / Commonwealth', grades: ['Year 6', 'Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11', 'Year 12 (Sixth Form)', 'Year 13'] },
  { id: 'ib_program', name: 'International Baccalaureate (IB)', grades: ['MYP 1', 'MYP 2', 'MYP 3', 'MYP 4', 'MYP 5', 'DP 1', 'DP 2'] },
  { id: 'national', name: 'National / Standard Curriculum', grades: ['Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'] },
];

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete, onStepChange }) => {
  const { user, userProfile, saveOnboardingProfile } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<OnboardingState>({
    firstName: userProfile?.firstName || (user?.displayName?.split(' ')[0] || ''),
    lastName: userProfile?.lastName || (user?.displayName?.split(' ').slice(1).join(' ') || ''),
    photoURL: userProfile?.photoURL || user?.photoURL || '',
    role: (userProfile?.role as UserRole) || 'student',
    country: userProfile?.country || 'United States',
    countryCode: userProfile?.countryCode || 'US',
    region: userProfile?.region || 'Americas',
    schoolName: userProfile?.schoolName || '',
    schoolVerificationStatus: userProfile?.schoolVerificationStatus || 'pending',
    educationSystem: userProfile?.educationSystem || 'US / International (K-12)',
    grade: userProfile?.grade || 'Grade 10',
  });

  const [isUnlistedSchool, setIsUnlistedSchool] = useState(true);
  const [countrySearch, setCountrySearch] = useState('');

  const changeStep = (step: number) => {
    setCurrentStep(step);
    setErrorMessage(null);
    if (onStepChange) {
      onStepChange(step);
    }
  };

  // Filtered Countries
  const filteredCountries = useMemo(() => {
    if (!countrySearch.trim()) {
      const featured = COUNTRIES.filter((c) => FEATURED_COUNTRY_CODES.includes(c.code));
      const rest = COUNTRIES.filter((c) => !FEATURED_COUNTRY_CODES.includes(c.code));
      return { featured, rest };
    }
    const q = countrySearch.toLowerCase();
    const matched = COUNTRIES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
    );
    return { featured: [], rest: matched };
  }, [countrySearch]);

  // Selected system's grade options
  const selectedSystemGrades = useMemo(() => {
    const sys = EDUCATION_SYSTEMS.find((s) => s.name === formData.educationSystem);
    return sys ? sys.grades : EDUCATION_SYSTEMS[0].grades;
  }, [formData.educationSystem]);

  // Step 1 Validation & Next
  const handleStep1Next = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setErrorMessage('Please provide both first and last name.');
      return;
    }
    changeStep(2);
  };

  // Step 2 Validation & Next
  const handleStep2Next = () => {
    if (!formData.country) {
      setErrorMessage('Please select your country.');
      return;
    }
    changeStep(3);
  };

  // Step 3 Validation & Next
  const handleStep3Next = () => {
    if (!formData.schoolName.trim()) {
      setErrorMessage('Please enter your school or educational institution name.');
      return;
    }
    changeStep(4);
  };

  // Step 4 Validation & Complete
  const handleStep4Next = async () => {
    if (!formData.grade) {
      setErrorMessage('Please select your current grade level.');
      return;
    }

    setIsSubmitting(true);
    try {
      await saveOnboardingProfile(formData);
      changeStep(5);
    } catch (err: any) {
      console.error('Error saving onboarding data:', err);
      setErrorMessage('Failed to save your profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* 5-Step Visual Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          {/* Background Connecting Track */}
          <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-[2px] bg-slate-200 -z-0" />
          {/* Active fill track */}
          <div
            className="absolute top-1/2 left-4 -translate-y-1/2 h-[2px] bg-blue-600 transition-all duration-500 -z-0"
            style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 92}%` }}
          />

          {STEPS.map((step, idx) => {
            const stepNum = idx + 1;
            const isCompleted = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;

            return (
              <div key={step.number} className="flex flex-col items-center relative z-10">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    isCompleted
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : isCurrent
                      ? 'bg-white text-blue-600 border-2 border-blue-600 shadow-md ring-4 ring-blue-500/20'
                      : 'bg-white text-slate-400 border border-slate-300'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : step.number}
                </div>
                <span
                  className={`hidden sm:block text-[11px] font-semibold tracking-tight mt-1.5 whitespace-nowrap ${
                    isCurrent ? 'text-blue-600' : isCompleted ? 'text-slate-700' : 'text-slate-400'
                  }`}
                >
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Error notification */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 p-3.5 rounded-xl bg-red-50/90 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5"
        >
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </motion.div>
      )}

      {/* Smooth Step Transition Container */}
      <AnimatePresence mode="wait">
        {/* ================= STEP 1: ABOUT YOU ================= */}
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="glass-card p-6 sm:p-8 rounded-3xl"
          >
            <div className="mb-6">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                Step 01 / 05
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                Tell us about yourself
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Configure your verified identity on the EduVerse network.
              </p>
            </div>

            {/* Profile Avatar & Preview */}
            <div className="flex items-center gap-4 mb-6 p-3 rounded-2xl bg-blue-50/60 border border-blue-100">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-500 flex items-center justify-center text-white text-lg font-bold shadow-md shadow-blue-600/20 overflow-hidden shrink-0">
                {formData.photoURL ? (
                  <img
                    src={formData.photoURL}
                    alt={formData.firstName}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <User className="w-7 h-7" />
                )}
              </div>
              <div className="text-xs text-slate-600">
                <p className="font-semibold text-slate-900">
                  {formData.firstName || formData.lastName
                    ? `${formData.firstName} ${formData.lastName}`.trim()
                    : 'Your Name'}
                </p>
                <p className="text-slate-500">{user?.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* First & Last Name */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="onboard-fname">
                    First Name
                  </label>
                  <input
                    id="onboard-fname"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="Alex"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white/90 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors shadow-2xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="onboard-lname">
                    Last Name
                  </label>
                  <input
                    id="onboard-lname"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Chen"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white/90 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors shadow-2xs"
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  I am participating as a
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {(['student', 'teacher', 'parent'] as UserRole[]).map((r) => {
                    const isSelected = formData.role === r;
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setFormData({ ...formData, role: r })}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold capitalize transition-all duration-200 border cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-600/25'
                            : 'bg-white/80 text-slate-700 border-slate-200 hover:bg-blue-50/50 hover:border-blue-200'
                        }`}
                      >
                        {r}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleStep1Next}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Continue to Country
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================= STEP 2: COUNTRY ================= */}
        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="glass-card p-6 sm:p-8 rounded-3xl"
          >
            <div className="mb-5">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                Step 02 / 05
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                Where are you located?
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Select your nation to connect with regional and worldwide Olympiads.
              </p>
            </div>

            {/* Country Search Bar */}
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={countrySearch}
                onChange={(e) => setCountrySearch(e.target.value)}
                placeholder="Search countries worldwide..."
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white/90 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors shadow-2xs"
              />
            </div>

            {/* Country List Container */}
            <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1 mb-6 border border-slate-100 rounded-2xl p-2 bg-slate-50/50">
              {filteredCountries.featured.length > 0 && (
                <div className="mb-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                    Featured
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {filteredCountries.featured.map((c) => {
                      const isSelected = formData.countryCode === c.code;
                      return (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              country: c.name,
                              countryCode: c.code,
                              region: c.region,
                            })
                          }
                          className={`flex items-center gap-2 p-2 rounded-xl text-left text-xs font-semibold transition-all border cursor-pointer ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50/60'
                          }`}
                        >
                          <span className="text-base">{c.flag}</span>
                          <span className="truncate">{c.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                {filteredCountries.featured.length > 0 && (
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                    All Countries
                  </div>
                )}
                <div className="space-y-1">
                  {filteredCountries.rest.map((c) => {
                    const isSelected = formData.countryCode === c.code;
                    return (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            country: c.name,
                            countryCode: c.code,
                            region: c.region,
                          })
                        }
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-semibold transition-all border cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50/60'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <span className="text-base">{c.flag}</span>
                          <span className="truncate">{c.name}</span>
                        </div>
                        <span
                          className={`text-[10px] uppercase tracking-wider font-mono ${
                            isSelected ? 'text-blue-100' : 'text-slate-400'
                          }`}
                        >
                          {c.region}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2">
              <Button
                variant="ghost"
                size="md"
                onClick={() => changeStep(1)}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Back
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleStep2Next}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Continue to School
              </Button>
            </div>
          </motion.div>
        )}

        {/* ================= STEP 3: SCHOOL ================= */}
        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="glass-card p-6 sm:p-8 rounded-3xl"
          >
            <div className="mb-6">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                Step 03 / 05
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                Your school or academy
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Link your school to represent your institution on national leaderboards.
              </p>
            </div>

            <div className="space-y-4">
              {/* Selected Country Indicator */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                <span className="text-slate-500 font-medium">Selected Country:</span>
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-blue-600" />
                  {formData.country}
                </span>
              </div>

              {/* State / Province */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="school-region">
                  State / Province / Region
                </label>
                <input
                  id="school-region"
                  type="text"
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  placeholder="e.g. California, Ontario, Tashkent, London..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white/90 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors shadow-2xs"
                />
              </div>

              {/* School Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="school-name">
                  School / Institution Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Building className="w-4 h-4" />
                  </div>
                  <input
                    id="school-name"
                    type="text"
                    value={formData.schoolName}
                    onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                    placeholder="e.g. Lincoln High School, Westminster Academy..."
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white/90 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors shadow-2xs"
                  />
                </div>
              </div>

              {/* Verification Status Notice */}
              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-900">Institutional Verification</p>
                  <p className="text-amber-700/90 mt-0.5 leading-relaxed">
                    Unlisted schools are initially logged with <strong className="font-semibold">verificationStatus: pending</strong> and verified for official competition brackets in Phase 3.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4">
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => changeStep(2)}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleStep3Next}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Continue to Grade
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================= STEP 4: GRADE ================= */}
        {currentStep === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="glass-card p-6 sm:p-8 rounded-3xl"
          >
            <div className="mb-6">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                Step 04 / 05
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                Select your grade level
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Calibrates competition difficulty and adaptive AI learning curricula.
              </p>
            </div>

            <div className="space-y-5">
              {/* Education System Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Education System
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {EDUCATION_SYSTEMS.map((sys) => {
                    const isSelected = formData.educationSystem === sys.name;
                    return (
                      <button
                        key={sys.id}
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            educationSystem: sys.name,
                            grade: sys.grades[sys.grades.length - 3] || sys.grades[0],
                          })
                        }
                        className={`p-2.5 rounded-xl text-left text-xs font-semibold transition-all border cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
                        }`}
                      >
                        {sys.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Grade Chips */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Current Grade / Level
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {selectedSystemGrades.map((g) => {
                    const isSelected = formData.grade === g;
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setFormData({ ...formData, grade: g })}
                        className={`p-2.5 rounded-xl text-center text-xs font-bold transition-all border cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/25'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50/50'
                        }`}
                      >
                        {g}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4">
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => changeStep(3)}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  isLoading={isSubmitting}
                  onClick={handleStep4Next}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Complete Profile
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================= STEP 5: COMPLETION ================= */}
        {currentStep === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="glass-card p-6 sm:p-10 rounded-3xl text-center space-y-6"
          >
            {/* Victory Badge */}
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-600 via-blue-700 to-sky-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-blue-600/30 border border-white/40">
              <Sparkles className="w-8 h-8 stroke-[2]" />
            </div>

            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200/70 mb-3">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Profile Registered & Verified
              </span>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                You&apos;re ready.
              </h3>
              <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
                Welcome to EduVerse. Your verified academic portfolio has been created and your journey starts now.
              </p>
            </div>

            {/* Profile Summary Card */}
            <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/80 text-left space-y-2 max-w-md mx-auto shadow-2xs">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Student:</span>
                <span className="font-bold text-slate-900">
                  {formData.firstName} {formData.lastName}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Country:</span>
                <span className="font-semibold text-slate-800">{formData.country}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">School:</span>
                <span className="font-semibold text-slate-800">{formData.schoolName}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Grade:</span>
                <span className="font-semibold text-blue-600">{formData.grade}</span>
              </div>
            </div>

            {/* Enter EduVerse Button */}
            <div className="pt-2">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={onComplete}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="glow-blue-subtle text-base py-3.5"
              >
                Enter EduVerse
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
