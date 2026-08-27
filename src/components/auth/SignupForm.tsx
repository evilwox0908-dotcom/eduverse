import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Globe,
  Calendar,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { COUNTRIES, FEATURED_COUNTRY_CODES } from '../../data/countries';

interface SignupFormProps {
  onNavigate: (view: 'login' | 'signup' | 'forgot-password' | 'onboarding' | 'dashboard') => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onNavigate }) => {
  const { loginWithGoogle, signupWithEmail } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [country, setCountry] = useState('United States');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showRedirectOption, setShowRedirectOption] = useState(false);

  const formatFirebaseError = (error: any) => {
    const code = error?.code || '';
    const msg = error?.message || '';

    switch (code) {
      case 'auth/email-already-in-use':
        return 'An account is already registered with this email. Please sign in instead.';
      case 'auth/invalid-email':
        return 'Please provide a valid email format (e.g. name@school.edu).';
      case 'auth/weak-password':
        return 'Password is too weak. Please use at least 6 characters including numbers or symbols.';
      case 'auth/popup-closed-by-user':
        return 'Google account selection was closed before completion.';
      case 'auth/popup-blocked':
        setShowRedirectOption(true);
        return 'Browser blocked the Google popup. Click "Continue with Redirect" below.';
      case 'auth/unauthorized-domain':
        return `Domain not authorized. Please add ${window.location.hostname} to Authorized Domains in Firebase Console.`;
      case 'auth/network-request-failed':
        return 'Network connection issue. Please check your internet connection.';
      default:
        if (msg && !msg.includes('Firebase:')) {
          return msg;
        }
        return 'Account creation failed. Please verify your details and try again.';
    }
  };

  // Password strength check
  const hasMinLength = password.length >= 6;
  const hasNumberOrSymbol = /[0-9!@#$%^&*]/.test(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setShowRedirectOption(false);

    if (!firstName.trim() || !lastName.trim()) {
      setErrorMessage('Please provide both your first and last name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter your password.');
      return;
    }

    if (!country) {
      setErrorMessage('Please select your country.');
      return;
    }

    if (!agreedToTerms) {
      setErrorMessage('You must agree to the EduVerse terms to create an account.');
      return;
    }

    setIsLoading(true);
    try {
      await signupWithEmail(firstName, lastName, email, password, {
        country,
        dateOfBirth: dateOfBirth || undefined,
      });
      // Route straight to onboarding to finish grade/school profile
      onNavigate('onboarding');
    } catch (err: any) {
      console.error('Signup error:', err);
      setErrorMessage(formatFirebaseError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (useRedirect: boolean = false) => {
    setErrorMessage(null);
    setIsGoogleLoading(true);
    try {
      const { isNewUser, profile } = await loginWithGoogle(useRedirect);
      if (isNewUser || !profile?.profileCompleted) {
        onNavigate('onboarding');
      } else {
        onNavigate('dashboard');
      }
    } catch (err: any) {
      console.error('Google signup error:', err);
      setErrorMessage(formatFirebaseError(err));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Create an account
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Join the global community of students, mentors, and academic competitors.
        </p>
      </div>

      {/* Error notification banner */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3.5 rounded-2xl bg-red-50/90 border border-red-200 text-red-700 text-xs sm:text-sm flex flex-col gap-2"
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span className="leading-snug">{errorMessage}</span>
          </div>

          {showRedirectOption && (
            <button
              type="button"
              onClick={() => handleGoogleLogin(true)}
              className="mt-1 self-start text-xs font-bold text-red-800 underline hover:text-red-900 cursor-pointer"
            >
              Continue with Redirect Fallback →
            </button>
          )}
        </motion.div>
      )}

      {/* Google Quick Sign-up */}
      <button
        type="button"
        id="google-signup-btn"
        onClick={() => handleGoogleLogin(false)}
        disabled={isGoogleLoading || isLoading}
        className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm active:bg-slate-100 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 cursor-pointer"
      >
        {isGoogleLoading ? (
          <div className="flex items-center gap-2 text-slate-600">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span>Connecting to Google...</span>
          </div>
        ) : (
          <>
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </>
        )}
      </button>

      {/* Divider */}
      <div className="relative my-4 flex items-center justify-center">
        <div className="border-t border-slate-200/80 w-full" />
        <span className="bg-white/80 backdrop-blur-md px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 absolute">
          OR REGISTER WITH EMAIL
        </span>
      </div>

      {/* Sign-up Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="signup-firstname">
              First name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-3.5 h-3.5" />
              </div>
              <input
                id="signup-firstname"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Alex"
                required
                autoComplete="given-name"
                className="w-full pl-8 pr-2.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white/80 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors shadow-2xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="signup-lastname">
              Last name *
            </label>
            <input
              id="signup-lastname"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Chen"
              required
              autoComplete="family-name"
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white/80 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors shadow-2xs"
            />
          </div>
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="signup-email">
            Email address *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-3.5 h-3.5" />
            </div>
            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex.chen@eduverse.org"
              required
              autoComplete="email"
              className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white/80 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors shadow-2xs"
            />
          </div>
        </div>

        {/* Country & Date of Birth */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="signup-country">
              Country *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Globe className="w-3.5 h-3.5" />
              </div>
              <select
                id="signup-country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
                className="w-full pl-8 pr-2.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white/80 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors shadow-2xs"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.name}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="signup-dob">
              Date of birth (optional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <input
                id="signup-dob"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full pl-8 pr-2.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white/80 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors shadow-2xs"
              />
            </div>
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="signup-password">
            Password (min 6 characters) *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-3.5 h-3.5" />
            </div>
            <input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              autoComplete="new-password"
              className="w-full pl-8 pr-8 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white/80 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors shadow-2xs"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Password requirement micro-indicators */}
          {password && (
            <div className="flex items-center gap-3 mt-1.5 text-[11px]">
              <span className={`flex items-center gap-1 ${hasMinLength ? 'text-emerald-600' : 'text-slate-400'}`}>
                <CheckCircle2 className="w-3 h-3" /> 6+ chars
              </span>
              <span className={`flex items-center gap-1 ${hasNumberOrSymbol ? 'text-emerald-600' : 'text-slate-400'}`}>
                <CheckCircle2 className="w-3 h-3" /> numbers/symbols
              </span>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="signup-confirm-password">
            Confirm password *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-3.5 h-3.5" />
            </div>
            <input
              id="signup-confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="new-password"
              className={`w-full pl-8 pr-8 py-2 text-xs sm:text-sm rounded-xl border bg-white/80 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors shadow-2xs ${
                confirmPassword && confirmPassword !== password
                  ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500'
                  : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Terms Agreement Checkbox */}
        <div className="flex items-start pt-1">
          <input
            id="signup-terms"
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="w-4 h-4 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
          />
          <label htmlFor="signup-terms" className="ml-2 text-[11px] text-slate-600 leading-snug cursor-pointer">
            I agree to the EduVerse <span className="font-semibold text-slate-800">Terms of Service</span> and{' '}
            <span className="font-semibold text-slate-800">Privacy Policy</span>.
          </label>
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="mt-2"
        >
          Create EduVerse Account
        </Button>
      </form>

      {/* Switch to Login */}
      <div className="mt-5 text-center text-xs sm:text-sm text-slate-600">
        Already have an account?{' '}
        <button
          type="button"
          onClick={() => onNavigate('login')}
          className="font-bold text-blue-600 hover:text-blue-700 focus:outline-none hover:underline cursor-pointer"
        >
          Log in
        </button>
      </div>
    </div>
  );
};
