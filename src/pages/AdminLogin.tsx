import React, { useState, useEffect } from 'react';
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
  const { login, user, isAdminTeam } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user && isAdminTeam) {
      navigate('/admin/dashboard');
    } else if (user && user.role === 'customer') {
      navigate('/customer/dashboard');
    } else if (user && user.role === 'viewer') {
      navigate('/viewer/dashboard');
    }
  }, [user, isAdminTeam, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || !password.trim()) {
      setError('ফোন নম্বর এবং পাসওয়ার্ড দিন।');
      return;
    }
    setIsLoading(true);
    setError('');
    const loginUser = await login(phone.trim(), password);
    setIsLoading(false);
    if (loginUser) {
      // Redirect based on role
      if (loginUser.role === 'customer') {
        navigate('/customer/dashboard');
      } else if (loginUser.role === 'viewer') {
        navigate('/viewer/dashboard');
      } else {
        // Admin team roles
        navigate('/admin/dashboard');
      }
    } else {
      setError('ফোন নম্বর বা পাসওয়ার্ড ভুল। আবার চেষ্টা করুন।');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF9F6] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-pink-100 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-100 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo / Brand */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-[2rem] border border-orange-50 shadow-[0_10px_40px_rgba(0,0,0,0.03)] mb-6">
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
        <div className="bg-white border border-white rounded-[3rem] p-10 shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
          <h2 className="text-2xl font-black text-gray-900 mb-1 italic uppercase tracking-tighter">স্বাগতম 👋</h2>
          <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-8">আপনার অ্যাকাউন্টে লগইন করুন।</p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-500 rounded-2xl p-4 mb-6 text-sm font-bold"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Phone */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">
                ফোন নম্বর
              </label>
              <div className="relative">
                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="admin-phone"
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-[#FDF9F6] border border-orange-50 rounded-full text-gray-900 placeholder-gray-400 text-sm font-bold outline-none focus:border-pink-500/30 focus:ring-4 focus:ring-pink-500/10 transition-all"
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-3">
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
                  className="w-full pl-14 pr-14 py-4 bg-[#FDF9F6] border border-orange-50 rounded-full text-gray-900 placeholder-gray-400 text-sm font-bold outline-none focus:border-pink-500/30 focus:ring-4 focus:ring-pink-500/10 transition-all"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors"
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
              className="w-full bg-gray-900 hover:bg-pink-600 disabled:opacity-50 text-white font-black uppercase tracking-widest text-[10px] py-5 rounded-full transition-all shadow-[0_10px_40px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_rgba(219,39,119,0.3)] hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 mt-4"
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

        <p className="text-center text-gray-400 text-[10px] uppercase font-black tracking-widest mt-8">
          Korean Skin Food Admin v2.0 — Secured
        </p>
      </motion.div>
    </div>
  );
}
