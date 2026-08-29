import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Mail,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Send,
  Lock,
  Eye,
  EyeOff,
  RefreshCw,
  KeyRound,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

interface ForgotPasswordFormProps {
  onNavigate: (view: 'login' | 'signup' | 'forgot-password' | 'onboarding' | 'dashboard') => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onNavigate }) => {
  const { resetPassword, confirmPasswordResetWithCode } = useAuth();

  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPasswordResetComplete, setIsPasswordResetComplete] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Auto-detect code from URL query parameters (if user opened link that returned to app)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(
      window.location.hash.includes('?') ? window.location.hash.split('?')[1] : ''
    );
    const code =
      urlParams.get('oobCode') ||
      hashParams.get('oobCode') ||
      urlParams.get('code') ||
      hashParams.get('code');

    if (code) {
      setResetCode(code);
    }
  }, []);

  // Cooldown countdown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage('Please enter your registered email address.');
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(trimmedEmail);
      setIsSuccess(true);
      setResendCooldown(60);
    } catch (err: any) {
      console.error('Password reset error:', err);
      const code = err?.code || '';
      if (code === 'auth/invalid-email') {
        setErrorMessage('Please enter a valid email address (e.g. student@school.edu).');
      } else if (code === 'auth/too-many-requests') {
        setErrorMessage('Too many requests. Please wait a few moments before trying again.');
      } else if (code === 'auth/network-request-failed') {
        setErrorMessage('Network connection error. Please check your internet connection.');
      } else {
        // Fallback to success to prevent enumeration and confirm dispatch
        setIsSuccess(true);
        setResendCooldown(60);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || !email.trim()) return;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await resetPassword(email.trim());
      setResendCooldown(60);
    } catch (err: any) {
      console.warn('Resend notice:', err);
      setResendCooldown(60);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!resetCode) {
      setErrorMessage('Missing security reset code. Please click the link sent to your email.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      await confirmPasswordResetWithCode(resetCode, newPassword);
      setIsPasswordResetComplete(true);
    } catch (err: any) {
      console.error('Password update error:', err);
      const code = err?.code || '';
      if (code === 'auth/invalid-action-code' || code === 'auth/expired-action-code') {
        setErrorMessage('This password reset link has expired or has already been used. Please request a new one.');
      } else if (code === 'auth/weak-password') {
        setErrorMessage('Password is too weak. Please use a stronger combination of letters and numbers.');
      } else {
        setErrorMessage('Unable to reset password. Please request a new password reset link.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const hasMinLength = newPassword.length >= 6;
  const hasNumberOrSymbol = /[0-9!@#$%^&*]/.test(newPassword);

  // 1. STATE: Password successfully reset
  if (isPasswordResetComplete) {
    return (
      <div className="w-full max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 sm:p-8 rounded-3xl bg-emerald-50/90 border border-emerald-200 text-center space-y-4 shadow-sm"
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/30">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-slate-900">Password Updated Successfully</h4>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Your EduVerse account password has been updated. You can now log in using your new password.
            </p>
          </div>
          <div className="pt-2">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => onNavigate('login')}
            >
              Sign In to EduVerse
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // 2. STATE: In-app direct reset code detected
  if (resetCode) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Set New Password
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
            Create a secure new password for your EduVerse account.
          </p>
        </div>

        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3.5 rounded-xl bg-red-50/90 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5"
          >
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </motion.div>
        )}

        <form onSubmit={handleConfirmPasswordReset} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="new-password">
              New Password (min. 6 characters)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="new-password"
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                autoComplete="new-password"
                className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-200 bg-white/90 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors shadow-2xs"
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

            {newPassword && (
              <div className="flex items-center gap-3 mt-1.5 text-[11px]">
                <span className={`flex items-center gap-1 ${hasMinLength ? 'text-emerald-600' : 'text-slate-400'}`}>
                  <Check className="w-3 h-3 stroke-[3]" /> 6+ characters
                </span>
                <span className={`flex items-center gap-1 ${hasNumberOrSymbol ? 'text-emerald-600' : 'text-slate-400'}`}>
                  <Check className="w-3 h-3 stroke-[3]" /> numbers/symbols
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="confirm-new-password">
              Confirm New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="confirm-new-password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="new-password"
                className={`w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border bg-white/90 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors shadow-2xs ${
                  confirmPassword && confirmPassword !== newPassword
                    ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500'
                    : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
            className="mt-2"
          >
            Save New Password & Continue
          </Button>
        </form>

        <div className="pt-4 text-center">
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </button>
        </div>
      </div>
    );
  }

  // 3. STATE: Request sent confirmation
  if (isSuccess) {
    return (
      <div className="w-full max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 sm:p-8 rounded-3xl bg-blue-50/90 border border-blue-200 text-center space-y-5 shadow-sm"
        >
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-600/30">
            <Mail className="w-7 h-7" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Password Reset Link Sent!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              We have dispatched an official password reset link directly to your email inbox:
            </p>
            <div className="mt-2.5 inline-block px-3.5 py-1.5 rounded-full bg-white border border-blue-200 text-xs font-bold text-blue-700 shadow-2xs">
              {email}
            </div>
          </div>

          {/* Step-by-step instructions */}
          <div className="p-4 rounded-2xl bg-white/90 border border-blue-100 text-left space-y-2 text-xs text-slate-700">
            <p className="font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>What to do next:</span>
            </p>
            <ol className="space-y-1.5 pl-4 list-decimal text-slate-600 leading-normal">
              <li>Open your email inbox (and check your <strong>Spam/Junk</strong> folder).</li>
              <li>Click the secure link inside the email to set your new password.</li>
              <li>After saving your new password, return here and sign in.</li>
            </ol>
          </div>

          <div className="pt-2 space-y-2.5">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => onNavigate('login')}
            >
              Back to Login / Sign In
            </Button>

            <Button
              variant="secondary"
              size="md"
              fullWidth
              disabled={resendCooldown > 0 || isLoading}
              onClick={handleResend}
              leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
            >
              {resendCooldown > 0 ? `Resend Email in ${resendCooldown}s` : 'Resend Email Link'}
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // 4. DEFAULT STATE: Request Reset Form
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Reset your password
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
          Enter your registered email address and we&apos;ll send you a secure link to reset your password.
        </p>
      </div>

      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3.5 rounded-xl bg-red-50/90 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5"
        >
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </motion.div>
      )}

      <form onSubmit={handleRequestReset} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="reset-email">
            Registered Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="reset-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex.chen@eduverse.org"
              required
              autoComplete="email"
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white/90 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors shadow-2xs"
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
          rightIcon={<Send className="w-4 h-4" />}
        >
          Send Reset Link to Email
        </Button>
      </form>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={() => onNavigate('login')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Login</span>
        </button>
      </div>
    </div>
  );
};
