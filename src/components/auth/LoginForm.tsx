import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

interface LoginFormProps {
  onNavigate: (view: 'login' | 'signup' | 'forgot-password' | 'onboarding' | 'dashboard') => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onNavigate }) => {
  const { loginWithGoogle, loginWithEmail } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showRedirectOption, setShowRedirectOption] = useState(false);

  const formatFirebaseError = (error: any) => {
    const code = error?.code || '';
    const msg = error?.message || '';

    switch (code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'Invalid email or password. Please verify your credentials or register a new account.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/user-disabled':
        return 'This account has been disabled. Please contact EduVerse support.';
      case 'auth/too-many-requests':
        return 'Access temporarily restricted due to multiple failed attempts. Please reset your password or try again later.';
      case 'auth/popup-closed-by-user':
        return 'The Google authentication window was closed before finishing.';
      case 'auth/popup-blocked':
        setShowRedirectOption(true);
        return 'Your browser blocked the Google popup window. Click "Continue with Redirect" below.';
      case 'auth/unauthorized-domain':
        return `Domain not authorized for Firebase Auth. Please add ${window.location.hostname} to Authorized Domains in Firebase Console.`;
      case 'auth/account-exists-with-different-credential':
        return 'An account already exists with this email address under a different sign-in method.';
      case 'auth/cancelled-popup-request':
        return 'Google sign-in was interrupted. Please try again.';
      case 'auth/network-request-failed':
        return 'Network connection issue. Please check your internet connection.';
      default:
        if (msg && !msg.includes('Firebase:')) {
          return msg;
        }
        return 'Authentication failed. Please verify your credentials and try again.';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setShowRedirectOption(false);

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      const profile = await loginWithEmail(email, password);
      if (!profile || !profile.profileCompleted) {
        onNavigate('onboarding');
      } else {
        onNavigate('dashboard');
      }
    } catch (err: any) {
      console.error('Email login error:', err);
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
      console.error('Google login error:', err);
      setErrorMessage(formatFirebaseError(err));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Welcome back
        </h2>
        <p className="text-sm sm:text-base text-slate-500 mt-1.5">
          Sign in to access your EduVerse dashboard, courses, and competitions.
        </p>
      </div>

      {/* Error notification banner */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 p-3.5 rounded-2xl bg-red-50/90 border border-red-200 text-red-700 text-xs sm:text-sm flex flex-col gap-2"
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

      {/* Google Sign-in */}
      <button
        type="button"
        id="google-login-btn"
        onClick={() => handleGoogleLogin(false)}
        disabled={isGoogleLoading || isLoading}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm active:bg-slate-100 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 cursor-pointer"
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
      <div className="relative my-5 flex items-center justify-center">
        <div className="border-t border-slate-200/80 w-full" />
        <span className="bg-white/80 backdrop-blur-md px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 absolute">
          OR
        </span>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="login-email">
            Email address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex.chen@eduverse.org"
              required
              autoComplete="email"
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white/80 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors shadow-2xs"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-700" htmlFor="login-password">
              Password
            </label>
            <button
              type="button"
              onClick={() => onNavigate('forgot-password')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 focus:outline-none cursor-pointer"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-200 bg-white/80 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors shadow-2xs"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Remember me checkbox */}
        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
          />
          <label htmlFor="remember-me" className="ml-2 text-xs text-slate-600 cursor-pointer">
            Remember me on this device
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
          Sign in to EduVerse
        </Button>
      </form>

      {/* Switch to Sign up */}
      <div className="mt-6 text-center text-xs sm:text-sm text-slate-600">
        Don&apos;t have an account yet?{' '}
        <button
          type="button"
          onClick={() => onNavigate('signup')}
          className="font-bold text-blue-600 hover:text-blue-700 focus:outline-none hover:underline cursor-pointer"
        >
          Create an account
        </button>
      </div>
    </div>
  );
};
