import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock, Mail, Eye, EyeOff, Sparkles, AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Firebase error code → human readable Bengali/English message
function getFirebaseErrorMessage(code: string): string {
  switch (code) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'ইমেইল বা পাসওয়ার্ড ভুল। আবার চেষ্টা করুন।';
    case 'auth/too-many-requests':
      return 'অনেকবার ভুল চেষ্টা হয়েছে। কিছুক্ষণ পরে আবার চেষ্টা করুন।';
    case 'auth/user-disabled':
      return 'এই অ্যাকাউন্ট নিষ্ক্রিয় করা হয়েছে।';
    case 'auth/popup-closed-by-user':
      return 'Google লগইন বাতিল করা হয়েছে।';
    case 'auth/network-request-failed':
      return 'নেটওয়ার্ক সমস্যা। ইন্টারনেট সংযোগ চেক করুন।';
    default:
      return 'লগইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।';
  }
}

export default function AdminLogin() {
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading]       = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError]               = useState('');

  const { loginWithEmail, loginWithGoogle, user, isAdminTeam, isLoading: authLoading } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  // Where to redirect after login (supports ?from= deep-link)
  const from = (location.state as any)?.from?.pathname || '/admin/dashboard';

  // Already logged in → redirect immediately
  useEffect(() => {
    if (!authLoading && user) {
      if (isAdminTeam) {
        navigate(from, { replace: true });
      } else if (user.role === 'customer') {
        navigate('/customer/dashboard', { replace: true });
      } else if (user.role === 'viewer') {
        navigate('/viewer/dashboard', { replace: true });
      }
    }
  }, [user, isAdminTeam, authLoading, navigate, from]);

  // ── Email / Password Submit ──────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('ইমেইল এবং পাসওয়ার্ড দিন।');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const loggedIn = await loginWithEmail(email.trim(), password);
      if (loggedIn) {
        if (loggedIn.role === 'customer') {
          navigate('/customer/dashboard', { replace: true });
        } else if (loggedIn.role === 'viewer') {
          navigate('/viewer/dashboard', { replace: true });
        } else if (['super_admin', 'admin', 'inventory_manager', 'customer_support'].includes(loggedIn.role)) {
          navigate('/admin/dashboard', { replace: true });
        } else {
          setError('এই অ্যাকাউন্টে অ্যাডমিন অ্যাক্সেস নেই।');
        }
      }
    } catch (err: any) {
      setError(getFirebaseErrorMessage(err.code || ''));
    } finally {
      setIsLoading(false);
    }
  };

  // ── Google Sign-In ────────────────────────────────────────────────────────
  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setError('');
    try {
      const loggedIn = await loginWithGoogle();
      if (loggedIn) {
        if (['super_admin','admin','inventory_manager','customer_support'].includes(loggedIn.role)) {
          navigate('/admin/dashboard', { replace: true });
        } else if (loggedIn.role === 'viewer') {
          navigate('/viewer/dashboard', { replace: true });
        } else {
          navigate('/customer/dashboard', { replace: true });
        }
      }
    } catch (err: any) {
      setError(getFirebaseErrorMessage(err.code || ''));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Show full-page spinner while Firebase auth is resolving
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FDF9F6] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF9F6] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-pink-100 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-100 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Brand */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-[2rem] border border-orange-50 shadow-[0_10px_40px_rgba(0,0,0,0.06)] mb-6">
            <Sparkles className="w-10 h-10 text-pink-500" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-gray-900 uppercase italic">
            Korean Skin Food
          </h1>
          <p className="text-gray-400 text-xs font-black uppercase tracking-widest mt-2">
            Admin Control Panel
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-white rounded-[3rem] p-10 shadow-[0_10px_60px_rgba(0,0,0,0.06)]">
          <h2 className="text-2xl font-black text-gray-900 mb-1 italic uppercase tracking-tighter">
            স্বাগতম 👋
          </h2>
          <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-8">
            আপনার অ্যাকাউন্টে লগইন করুন।
          </p>

          {/* Error Banner */}
          <AnimatePresence>
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-500 rounded-2xl p-4 mb-6 text-sm font-bold"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">
                ইমেইল
              </label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="admin-email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-[#FDF9F6] border border-orange-50 rounded-full text-gray-900 placeholder-gray-400 text-sm font-bold outline-none focus:border-pink-500/40 focus:ring-4 focus:ring-pink-500/10 transition-all"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">
                পাসওয়ার্ড
              </label>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-14 pr-14 py-4 bg-[#FDF9F6] border border-orange-50 rounded-full text-gray-900 placeholder-gray-400 text-sm font-bold outline-none focus:border-pink-500/40 focus:ring-4 focus:ring-pink-500/10 transition-all"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Email Login Button */}
            <button
              id="admin-login-btn"
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full bg-gray-900 hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest text-[10px] py-5 rounded-full transition-all shadow-[0_10px_40px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_rgba(219,39,119,0.3)] hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 mt-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  লগইন হচ্ছে...
                </>
              ) : (
                'লগইন করুন'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
              অথবা
            </span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Google Login Button */}
          <button
            id="admin-google-login-btn"
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading || isGoogleLoading}
            className="w-full bg-white border-2 border-gray-100 hover:border-pink-200 hover:bg-pink-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-black uppercase tracking-widest text-[10px] py-4 rounded-full transition-all flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95"
          >
            {isGoogleLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
                সংযুক্ত হচ্ছে...
              </>
            ) : (
              <>
                {/* Google SVG Icon */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google দিয়ে লগইন করুন
              </>
            )}
          </button>
        </div>

        <p className="text-center text-gray-400 text-[10px] uppercase font-black tracking-widest mt-8">
          Korean Skin Food Admin v3.0 — Firebase Secured
        </p>
      </motion.div>
    </div>
  );
}
