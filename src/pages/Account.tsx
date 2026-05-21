import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { Order } from '../types';
import { 
  Package, 
  User as UserIcon, 
  MapPin, 
  Phone, 
  Mail, 
  LogOut, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  Truck,
  AlertCircle,
  Lock,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export const Account: React.FC = () => {
  const { user, loginWithEmail, register, logout, loginWithGoogle, isAdmin, isAdminTeam } = useAuth();
  const { language, t } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');
  const navigate = useNavigate();

  // Form states
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      if (isAdmin) {
        navigate('/admin/dashboard');
        return;
      }
      if (user.role === 'customer' && window.location.pathname === '/account') {
        // Only redirect if specifically on /account and not viewing a sub-path
        // navigate('/customer/dashboard'); 
      }
      
      setLoading(true);
      api.getUserOrders(user.phone)
        .then(data => {
          setOrders(data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
        })
        .finally(() => setLoading(false));
    }
  }, [user, isAdmin, navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegistering) {
        const success = await register(formData.name, formData.email, formData.password);
        if (success) {
          setIsRegistering(false);
        }
      } else {
        const loggedInUser = await loginWithEmail(formData.email, formData.password);
        if (loggedInUser) {
          if (['super_admin','admin','inventory_manager','customer_support'].includes(loggedInUser.role)) {
            navigate('/admin/dashboard');
          } else if (loggedInUser.role === 'customer') {
            navigate('/customer/dashboard');
          } else if (loggedInUser.role === 'viewer') {
            navigate('/viewer/dashboard');
          }
        }
      }
    } catch (err: any) {
      const code = err?.code || '';
      if (code.includes('wrong-password') || code.includes('invalid-credential') || code.includes('user-not-found')) {
        setError(language === 'bn' ? 'ইমেইল বা পাসওয়ার্ড ভুল' : 'Invalid email or password');
      } else if (code.includes('email-already-in-use')) {
        setError(language === 'bn' ? 'এই ইমেইল ইতোমধ্যে ব্যবহৃত হয়েছে' : 'Email already in use');
      } else {
        setError(language === 'bn' ? 'কিছু একটা সমস্যা হয়েছে' : 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async () => {
    try {
      setLoading(true);
      const successUser = await loginWithGoogle();
      if (successUser) {
        if (['super_admin','admin','inventory_manager','customer_support'].includes(successUser.role)) {
          navigate('/admin/dashboard');
        } else if (successUser.role === 'viewer') {
          navigate('/viewer/dashboard');
        } else {
          navigate('/customer/dashboard');
        }
      }
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user') {
        setError(language === 'bn' ? 'গুগল লগইন ব্যর্থ হয়েছে' : 'Google login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      case 'processing': return 'bg-blue-50 text-blue-600 border border-blue-100';
      case 'shipped': return 'bg-amber-50 text-amber-600 border border-amber-100';
      default: return 'bg-[#FDF9F6] text-gray-500 border border-orange-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return <CheckCircle2 className="w-4 h-4" />;
      case 'processing': return <Clock className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FDF9F6] flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white p-8 md:p-12 rounded-[3rem] border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] space-y-8 relative overflow-hidden"
        >
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          <div className="text-center space-y-2 relative z-10">
            <h1 className="text-4xl font-black tracking-tighter text-gray-900 italic">
              {isRegistering ? 'Join Us' : 'Welcome Back'}
            </h1>
            <p className="text-gray-400 font-bold tracking-widest uppercase text-[10px]">
              {isRegistering ? 'Create your skincare journey account' : 'Authentication required to access your dashboard'}
            </p>
          </div>

          <div className="flex justify-center mb-6 relative z-10">
            <button
              onClick={handleGoogleSuccess}
              type="button"
              className="w-full py-4 bg-[#FDF9F6] border border-orange-50 text-gray-900 rounded-full font-black text-xs uppercase tracking-widest shadow-sm flex items-center justify-center gap-3 transition-all hover:bg-orange-50/50 active:scale-95 disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>
          </div>
          
          <div className="relative relative z-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-orange-50"></div>
            </div>
            <div className="relative flex justify-center text-[10px]">
              <span className="px-4 bg-white text-gray-400 font-bold uppercase tracking-widest">Or continue with phone</span>
            </div>
          </div>

          <form onSubmit={handleAuth} className="space-y-4 relative z-10">
            {isRegistering && (
              <div className="relative">
                <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  className="w-full pl-14 pr-6 py-4 bg-[#FDF9F6] rounded-full border border-orange-50 outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
              <input
                type="email"
                placeholder="Email Address"
                required
                className="w-full pl-14 pr-6 py-4 bg-[#FDF9F6] rounded-full border border-orange-50 outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold transition-all"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
              <input
                type="password"
                placeholder="Password"
                required
                className="w-full pl-14 pr-6 py-4 bg-[#FDF9F6] rounded-full border border-orange-50 outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold transition-all"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            {error && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest text-center bg-red-50 py-2 rounded-lg">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-5 bg-gray-900 text-white rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl shadow-gray-900/20 flex items-center justify-center gap-2 transition-all hover:bg-gray-800 active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Processing...' : (isRegistering ? 'Register' : 'Login')}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center relative z-10 pt-2">
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-gray-400 font-bold hover:text-gray-900 text-[10px] uppercase tracking-widest transition-colors"
            >
              {isRegistering ? 'Already have an account? Login' : 'New here? Create an account'}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF9F6] py-12 md:py-20 pb-24">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Sidebar */}
          <aside className="w-full lg:w-80 space-y-6 flex-shrink-0">
            <div className="bg-white rounded-[3rem] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-white">
              <div className="flex flex-col items-center text-center">
                <div className="relative group">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 transition-transform group-hover:scale-105 border-4 border-white shadow-sm">
                    <UserIcon className="w-10 h-10 text-primary" />
                  </div>
                  {isAdmin && (
                    <span className="absolute bottom-4 -right-2 bg-gray-900 text-white text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border-2 border-white shadow-md flex items-center gap-1">
                      <Sparkles className="w-2 h-2" /> Admin
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tighter italic">{user.name}</h2>
                <p className="text-gray-400 text-[10px] font-bold tracking-widest uppercase mt-1">{user.email}</p>
              </div>

              <div className="mt-10 space-y-3">
                <button 
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest ${activeTab === 'orders' ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20' : 'text-gray-400 hover:bg-[#FDF9F6] border border-transparent hover:border-orange-50'}`}
                >
                  <span className="flex items-center gap-3">
                    <Package className="w-4 h-4" />
                    My Rituals
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest ${activeTab === 'profile' ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20' : 'text-gray-400 hover:bg-[#FDF9F6] border border-transparent hover:border-orange-50'}`}
                >
                  <span className="flex items-center gap-3">
                    <UserIcon className="w-4 h-4" />
                    Profile Details
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                
                {isAdmin && (
                  <Link 
                    to="/admin/dashboard"
                    className="w-full flex items-center justify-between px-6 py-4 rounded-2xl text-primary hover:bg-primary/5 transition-all font-black text-[10px] uppercase tracking-widest mt-2 border border-primary/10"
                  >
                    <span className="flex items-center gap-3">
                      <Lock className="w-4 h-4" />
                      Admin Dashboard
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                )}

                <div className="pt-6 mt-6 border-t border-orange-50">
                  <button 
                    onClick={async () => { await logout(); navigate('/'); }}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-black text-[10px] uppercase tracking-widest border border-transparent hover:border-red-100"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <AnimatePresence mode="wait">
              {activeTab === 'orders' ? (
                <motion.div 
                  key="orders"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between bg-white p-8 rounded-[3rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
                    <h3 className="text-3xl font-black tracking-tighter text-gray-900 italic">My <span className="text-primary">Rituals</span></h3>
                    <div className="px-5 py-2.5 bg-[#FDF9F6] rounded-full border border-orange-50 shadow-inner">
                      <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{orders.length} Total Orders</span>
                    </div>
                  </div>

                  {loading ? (
                    <div className="grid gap-6">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-48 bg-white rounded-[3rem] animate-pulse shadow-sm" />
                      ))}
                    </div>
                  ) : orders.length > 0 ? (
                    <div className="grid gap-8">
                      {orders.map((order) => (
                        <div 
                          key={order.order_id}
                          className="bg-white rounded-[3rem] p-8 md:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-white transition-all hover:shadow-[0_20px_60px_rgba(0,0,0,0.05)] group relative overflow-hidden"
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-8 border-b border-orange-50 relative z-10">
                            <div>
                              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Order ID</p>
                              <h4 className="text-lg font-black text-gray-900">#{order.order_id}</h4>
                            </div>
                            <div className="flex flex-wrap items-center gap-4">
                              <div className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${getStatusColor(order.status)}`}>
                                {getStatusIcon(order.status)}
                                {order.status}
                              </div>
                              <div className="px-5 py-2.5 bg-[#FDF9F6] border border-orange-50 rounded-full text-[10px] font-black text-gray-400 uppercase tracking-widest shadow-sm">
                                {new Date(order.timestamp).toLocaleDateString()}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-6 relative z-10">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-6 p-4 rounded-2xl hover:bg-[#FDF9F6] transition-colors border border-transparent hover:border-orange-50">
                                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-sm overflow-hidden border border-orange-50/50">
                                  <img 
                                    src={item.images?.[0] || 'https://via.placeholder.com/100'} 
                                    className="w-full h-full object-cover mix-blend-multiply" 
                                    alt={item.name_en}
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                                <div className="flex-1">
                                  <h5 className="text-sm font-bold text-gray-900 line-clamp-2">{item.name_en}</h5>
                                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Qty: {item.quantity} × ৳{item.price.toLocaleString()}</p>
                                </div>
                                <div className="text-right pl-4">
                                  <p className="text-base font-black text-gray-900">৳{(item.price * item.quantity).toLocaleString()}</p>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="mt-8 pt-8 border-t border-orange-50 flex items-center justify-between relative z-10">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Amount</p>
                            <p className="text-2xl font-black text-gray-900 italic">৳{order.total.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-[3rem] p-16 text-center border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
                      <div className="w-20 h-20 bg-[#FDF9F6] rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <Package className="w-10 h-10 text-primary" />
                      </div>
                      <h4 className="text-2xl font-black text-gray-900 italic mb-2">No rituals yet</h4>
                      <p className="text-sm text-gray-500 font-medium mb-8">Your sanctuary is waiting for your first selection.</p>
                      <button 
                        onClick={() => navigate('/shop')}
                        className="px-10 py-4 bg-gray-900 text-white rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl shadow-gray-900/20 hover:scale-105 transition-all"
                      >
                        Start Exploring
                      </button>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div 
                  key="profile"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-white">
                    <h3 className="text-3xl font-black tracking-tighter text-gray-900 italic mb-10 border-b border-orange-50 pb-6">Profile <span className="text-primary">Details</span></h3>
                    
                    <div className="grid md:grid-cols-2 gap-10">
                      <div className="space-y-8">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <UserIcon className="w-3.5 h-3.5" />
                            Full Name
                          </label>
                          <div className="px-6 py-5 bg-[#FDF9F6] rounded-2xl font-black text-sm text-gray-900 border border-orange-50 shadow-inner">
                            {user.name}
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5" />
                            Email Address
                          </label>
                          <div className="px-6 py-5 bg-[#FDF9F6] rounded-2xl font-black text-sm text-gray-900 border border-orange-50 shadow-inner">
                            {user.email}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-8">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5" />
                            Phone Number
                          </label>
                          <div className="px-6 py-5 bg-[#FDF9F6] rounded-2xl font-black text-sm text-gray-900 border border-orange-50 shadow-inner">
                            {user.phone}
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5" />
                            Saved Address
                          </label>
                          <div className="px-6 py-5 bg-[#FDF9F6] rounded-2xl font-black text-sm text-gray-900 border border-orange-50 shadow-inner min-h-[64px] flex items-center">
                            {user.address || <span className="text-gray-400">No address saved yet</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};

