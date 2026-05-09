import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Phone, Eye, EyeOff, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || !password.trim()) {
      setError('ফোন নম্বর এবং পাসওয়ার্ড দিন।');
      return;
    }
    setIsLoading(true);
    setError('');
    const success = await login(phone.trim(), password);
    setIsLoading(false);
    if (success) {
      navigate('/admin/dashboard');
    } else {
      setError('ফোন নম্বর বা পাসওয়ার্ড ভুল। আবার চেষ্টা করুন।');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo / Brand */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-600/20 rounded-2xl border border-pink-600/30 mb-4">
            <Sparkles className="w-8 h-8 text-pink-500" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-white uppercase">
            Korean Skin Food
          </h1>
          <p className="text-gray-500 text-xs font-black uppercase tracking-widest mt-1">
            Admin Control Panel
          </p>
        </div>

        {/* Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-xl font-black text-white mb-1">স্বাগতম 👋</h2>
          <p className="text-gray-500 text-sm mb-8">আপনার অ্যাকাউন্টে লগইন করুন।</p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl p-4 mb-6 text-sm"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Phone */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                ফোন নম্বর
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  id="admin-phone"
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-2xl text-white placeholder-gray-600 text-sm font-mono outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                পাসওয়ার্ড
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-4 bg-gray-800 border border-gray-700 rounded-2xl text-white placeholder-gray-600 text-sm font-mono outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="admin-login-btn"
              type="submit"
              disabled={isLoading}
              className="w-full bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white font-black uppercase tracking-widest text-sm py-4 rounded-2xl transition-all shadow-lg shadow-pink-600/20 flex items-center justify-center gap-2 mt-2"
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
        </div>

        <p className="text-center text-gray-700 text-xs mt-6 font-mono">
          Korean Skin Food Admin v2.0 — Secured
        </p>
      </motion.div>
    </div>
  );
}
