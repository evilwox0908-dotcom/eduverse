import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, CheckCircle2, AlertCircle, ArrowLeft, Send } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

interface ForgotPasswordFormProps {
  onNavigate: (view: 'login' | 'signup' | 'forgot-password' | 'onboarding' | 'dashboard') => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onNavigate }) => {
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
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
    } catch (err: any) {
      console.error('Password reset error:', err);
      const code = err?.code || '';
      if (code === 'auth/invalid-email') {
        setErrorMessage('Please provide a valid email format (e.g. name@school.edu).');
      } else if (code === 'auth/too-many-requests') {
        setErrorMessage('Too many requests. Please wait a few moments before trying again.');
      } else if (code === 'auth/network-request-failed') {
        setErrorMessage('Network connection error. Please check your internet connection.');
      } else {
        // Secure generic message to prevent account enumeration while acknowledging request
        setIsSuccess(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Reset your password
        </h2>
        <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
          Enter your registered email address and we&apos;ll send you a secure link to create a new password.
        </p>
      </div>

      {isSuccess ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-2xl bg-blue-50/90 border border-blue-200 text-center space-y-4 shadow-sm"
        >
          <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md shadow-blue-600/30">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-900">Password reset link sent</h4>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Check your email and follow the secure link to create a new password.
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Sent to: <span className="font-semibold text-slate-700">{email}</span>
            </p>
          </div>
          <div className="pt-2">
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={() => onNavigate('login')}
              className="mt-2"
            >
              Return to Login
            </Button>
          </div>
        </motion.div>
      ) : (
        <>
          {/* Error notification banner */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3.5 rounded-xl bg-red-50/90 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span className="leading-snug">{errorMessage}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white/80 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors shadow-2xs"
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
              Send reset link
            </Button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-blue-600 focus:outline-none cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
