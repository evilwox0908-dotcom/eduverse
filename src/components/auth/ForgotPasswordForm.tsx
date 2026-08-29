import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mail,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Send,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  KeyRound,
  Inbox,
  Check,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

interface ForgotPasswordFormProps {
  onNavigate: (view: 'login' | 'signup' | 'forgot-password' | 'onboarding' | 'dashboard') => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onNavigate }) => {
  const { resetPassword, verifyResetCode, confirmPasswordResetWithCode } = useAuth();

  const [activeTab, setActiveTab] = useState<'request' | 'enter-code'>('request');
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPasswordResetComplete, setIsPasswordResetComplete] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Auto-detect code from URL query parameters (e.g. ?oobCode=... or #/?mode=resetPassword&oobCode=...)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(
      window.location.hash.includes('?') ? window.location.hash.split('?')[1] : ''
    );
    const code = urlParams.get('oobCode') || hashParams.get('oobCode') || urlParams.get('code') || hashParams.get('code');
    if (code) {
      setResetCode(code);
      setActiveTab('enter-code');
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
      console.error('Password reset request notice:', err);
      const code = err?.code || '';
      if (code === 'auth/invalid-email') {
        setErrorMessage('Please provide a valid email format (e.g. user@school.edu).');
      } else if (code === 'auth/too-many-requests') {
        setErrorMessage('Too many requests. Please wait a few moments before trying again.');
      } else if (code === 'auth/network-request-failed') {
        setErrorMessage('Network connection error. Please check your internet connection.');
      } else {
        // Safe UX fallback
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

    const trimmedCode = resetCode.trim();
    if (!trimmedCode) {
      setErrorMessage('Please provide the security recovery code from your email.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('New password must contain at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      await confirmPasswordResetWithCode(trimmedCode, newPassword);
      setIsPasswordResetComplete(true);
    } catch (err: any) {
      console.error('Password update error:', err);
      const code = err?.code || '';
      if (code === 'auth/invalid-action-code' || code === 'auth/expired-action-code') {
        setErrorMessage('This recovery code is invalid or has expired. Please request a new link.');
      } else if (code === 'auth/weak-password') {
        setErrorMessage('Password is too weak. Please use a stronger combination of letters, numbers, and symbols.');
      } else {
        setErrorMessage('Unable to reset password. Please verify your code or request a new reset link.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const hasMinLength = newPassword.length >= 6;
  const hasNumberOrSymbol = /[0-9!@#$%^&*]/.test(newPassword);

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Top Tab Bar */}
      <div className="flex p-1 mb-6 rounded-2xl bg-slate-100/80 border border-slate-200/60">
        <button
          type="button"
          onClick={() => {
            setActiveTab('request');
            setErrorMessage(null);
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'request'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          1. Request Reset Link
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('enter-code');
            setErrorMessage(null);
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'enter-code'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          2. Set New Password
        </button>
      </div>

      {/* Password Reset Complete State */}
      {isPasswordResetComplete ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 sm:p-8 rounded-3xl bg-emerald-50/90 border border-emerald-200 text-center space-y-4 shadow-sm"
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/30">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-slate-900">Password Successfully Updated</h4>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed max-w-sm mx-auto">
              Your EduVerse account password has been updated. You can now sign in using your new credentials.
            </p>
          </div>
          <div className="pt-3">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => onNavigate('login')}
            >
              Sign In Now
            </Button>
          </div>
        </motion.div>
      ) : activeTab === 'enter-code' ? (
        /* ================= TAB 2: ENTER CODE & SET NEW PASSWORD ================= */
        <motion.div
          key="tab-enter-code"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-5"
        >
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Create a new password
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Enter the verification code from your email and select a strong password.
            </p>
          </div>

          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-xl bg-red-50/90 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          <form onSubmit={handleConfirmPasswordReset} className="space-y-3.5">
            {/* Code Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="reset-code">
                Security Recovery Code (from email or link)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  id="reset-code"
                  type="text"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  placeholder="Paste your reset action code or oobCode..."
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white/90 text-slate-900 font-mono placeholder:font-sans placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors shadow-2xs"
                />
              </div>
            </div>

            {/* New Password */}
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
                  className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white/90 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors shadow-2xs"
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
                <div className="flex items-center gap-3 mt-1 text-[11px]">
                  <span className={`flex items-center gap-1 ${hasMinLength ? 'text-emerald-600' : 'text-slate-400'}`}>
                    <Check className="w-3 h-3 stroke-[3]" /> 6+ characters
                  </span>
                  <span className={`flex items-center gap-1 ${hasNumberOrSymbol ? 'text-emerald-600' : 'text-slate-400'}`}>
                    <Check className="w-3 h-3 stroke-[3]" /> numbers/symbols
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
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
                  className={`w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border bg-white/90 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors shadow-2xs ${
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
              Update Password
            </Button>
          </form>

          <div className="pt-2 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('request')}
              className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
            >
              ← Back to request email
            </button>
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="text-slate-500 hover:text-slate-700 cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </motion.div>
      ) : isSuccess ? (
        /* ================= REQUEST SENT SUCCESS WITH ENGLISH EMAIL TRANSCRIPT ================= */
        <motion.div
          key="request-sent"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-4"
        >
          {/* Header Banner */}
          <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-100 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-600/20">
              <Inbox className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Password Reset Instructions Dispatched
              </h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                An official security email has been sent to <span className="font-semibold text-slate-900">{email}</span>.
              </p>
            </div>
          </div>

          {/* Structured Official Email Layout in English */}
          <div className="rounded-2xl border border-slate-200 bg-white/95 overflow-hidden shadow-sm">
            {/* Mock Email Client Header */}
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="font-semibold text-slate-700 ml-1">EduVerse Security Notification</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">noreply@eduverse.org</span>
            </div>

            {/* Email Body */}
            <div className="p-4 sm:p-5 text-left space-y-3.5 text-xs sm:text-sm text-slate-700">
              <div className="pb-3 border-b border-slate-100 space-y-1 text-xs">
                <p><strong className="text-slate-900">Subject:</strong> [Action Required] Reset Your EduVerse Account Password</p>
                <p><strong className="text-slate-900">To:</strong> {email}</p>
                <p><strong className="text-slate-900">Security Protocol:</strong> TLS 1.3 Verified • Single-Use Token</p>
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-slate-900">Hello Academic Challenger,</p>
                <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">
                  We received a verified request to reset the password associated with your EduVerse academic account. 
                  To choose a new secure password, please use the button below:
                </p>
              </div>

              {/* Reset Button Mockup in Email */}
              <div className="py-2 text-center">
                <button
                  type="button"
                  onClick={() => setActiveTab('enter-code')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/20 transition-all cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Reset Password Securely</span>
                </button>
              </div>

              {/* Expiry Notice */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 space-y-1">
                <p className="font-medium text-slate-700">Important Security Notice:</p>
                <p>• This password reset link is single-use and will automatically expire in 60 minutes.</p>
                <p>• If you did not initiate this request, no further action is required. Your account remains protected.</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
            <Button
              variant="secondary"
              size="md"
              fullWidth
              disabled={resendCooldown > 0 || isLoading}
              onClick={handleResend}
              leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
            >
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Email'}
            </Button>

            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={() => setActiveTab('enter-code')}
              rightIcon={<KeyRound className="w-3.5 h-3.5" />}
            >
              I Have a Code / Set Password
            </Button>
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </button>
          </div>
        </motion.div>
      ) : (
        /* ================= TAB 1: REQUEST EMAIL FORM ================= */
        <motion.div
          key="tab-request"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Reset your password
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
              Enter your registered email address and we&apos;ll send you an official security link to create a new password.
            </p>
          </div>

          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-xl bg-red-50/90 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5"
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
              Send Password Reset Link
            </Button>
          </form>

          {/* Alternative direct code enter */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs flex items-center justify-between">
            <span className="text-slate-600">Already have a reset link or recovery code?</span>
            <button
              type="button"
              onClick={() => setActiveTab('enter-code')}
              className="font-bold text-blue-600 hover:text-blue-700 cursor-pointer underline"
            >
              Enter Code →
            </button>
          </div>

          {/* Back to Login */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-blue-600 focus:outline-none cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login</span>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

