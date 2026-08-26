import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Lock, CheckCircle2, AlertCircle, Eye, EyeOff, KeyRound, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';

interface ResetPasswordPageProps {
  onNavigateToLogin: () => void;
}

export const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ onNavigateToLogin }) => {
  const { verifyResetCode, confirmPasswordResetWithCode } = useAuth();

  const [oobCode, setOobCode] = useState<string>('');
  const [accountEmail, setAccountEmail] = useState<string>('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isVerifyingCode, setIsVerifyingCode] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Extract oobCode from URL query parameters or hash query parameters
  useEffect(() => {
    const parseCode = () => {
      let code = '';
      // Search in window.location.search
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.has('oobCode')) {
        code = searchParams.get('oobCode') || '';
      }

      // Search in hash if not found
      if (!code && window.location.hash.includes('?')) {
        const hashQuery = window.location.hash.split('?')[1];
        const hashParams = new URLSearchParams(hashQuery);
        if (hashParams.has('oobCode')) {
          code = hashParams.get('oobCode') || '';
        }
      }

      return code;
    };

    const code = parseCode();
    setOobCode(code);

    if (!code) {
      setIsVerifyingCode(false);
      setErrorMessage('Invalid or missing password reset link. Please request a new link.');
      return;
    }

    // Verify reset code
    verifyResetCode(code)
      .then((email) => {
        setAccountEmail(email);
        setIsVerifyingCode(false);
      })
      .catch((err) => {
        console.error('Verify error:', err);
        setIsVerifyingCode(false);
        if (err.code === 'auth/expired-action-code') {
          setErrorMessage('This password reset link has expired. Please request a new one.');
        } else if (err.code === 'auth/invalid-action-code') {
          setErrorMessage('This password reset link is invalid or has already been used.');
        } else {
          setErrorMessage('Failed to verify reset code. Please try again.');
        }
      });
  }, [verifyResetCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setIsSubmitting(true);
    try {
      await confirmPasswordResetWithCode(oobCode, newPassword);
      setIsSuccess(true);
    } catch (err: any) {
      console.error('Reset password error:', err);
      if (err.code === 'auth/expired-action-code') {
        setErrorMessage('This reset code has expired. Please request a new link.');
      } else if (err.code === 'auth/weak-password') {
        setErrorMessage('Password is too weak. Include letters and numbers.');
      } else {
        setErrorMessage(err.message || 'Failed to update password. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10"
      >
        {/* Brand header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">EduVerse Security</h3>
            <p className="text-xs text-slate-400">Account Recovery & Credential Reset</p>
          </div>
        </div>

        {isVerifyingCode ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-slate-400">Verifying your security token...</p>
          </div>
        ) : isSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-4 space-y-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Password Reset Complete</h4>
              <p className="text-xs text-slate-400 mt-1">
                Your password has been successfully updated for <strong className="text-slate-200">{accountEmail}</strong>. You can now sign in with your new password.
              </p>
            </div>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={onNavigateToLogin}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="mt-4"
            >
              Sign In to EduVerse
            </Button>
          </motion.div>
        ) : (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white">Set new password</h2>
              {accountEmail ? (
                <p className="text-xs text-slate-400 mt-1">
                  Resetting credentials for: <span className="text-blue-400 font-medium">{accountEmail}</span>
                </p>
              ) : (
                <p className="text-xs text-slate-400 mt-1">
                  Enter and confirm your new secure account password.
                </p>
              )}
            </div>

            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 p-3.5 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </motion.div>
            )}

            {!oobCode ? (
              <div className="text-center mt-4">
                <Button variant="secondary" size="md" onClick={onNavigateToLogin}>
                  Back to Sign In
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5" htmlFor="new-pass">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="new-pass"
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      required
                      minLength={6}
                      className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-700 bg-slate-800/80 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5" htmlFor="confirm-pass">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="confirm-pass"
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      required
                      minLength={6}
                      className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-700 bg-slate-800/80 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isSubmitting}
                  className="mt-2"
                >
                  Update Password
                </Button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={onNavigateToLogin}
                    className="text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    Cancel and return to sign in
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};
