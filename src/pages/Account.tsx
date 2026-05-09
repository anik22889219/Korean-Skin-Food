import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';
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
  ArrowRight
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export const Account: React.FC = () => {
  const { user, login, register, logout, isAdmin, loginWithGoogle } = useAuth();
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
    phone: '',
    password: '',
    address: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      if (isAdmin) {
        navigate('/admin/dashboard');
        return;
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
        const success = await register(formData.name, formData.email, formData.phone, formData.password);
        if (success) {
          setIsRegistering(false);
          alert(language === 'bn' ? 'রেজিস্ট্রেশন সফল! লগইন করুন।' : 'Registration successful! Please login.');
        } else {
          setError(language === 'bn' ? 'রেজিস্ট্রেশন ব্যর্থ হয়েছে' : 'Registration failed');
        }
      } else {
        const success = await login(formData.phone, formData.password);
        if (!success) {
          setError(language === 'bn' ? 'ফোন বা পাসওয়ার্ড ভুল' : 'Invalid phone or password');
        }
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const { user } = result;
      
      const success = await loginWithGoogle(
        user.email || '', 
        user.displayName || 'Google User', 
        user.photoURL || undefined
      );
      
      if (!success) {
        setError(language === 'bn' ? 'গুগল লগইন ব্যর্থ হয়েছে' : 'Google login failed');
      }
    } catch (err: any) {
      console.error(err);
      setError('Something went wrong with Google Login: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-emerald-100 text-emerald-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'shipped': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
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
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-black tracking-tighter text-gray-900 uppercase italic">
              {isRegistering ? 'Join Us' : 'Welcome Back'}
            </h1>
            <p className="text-gray-400 font-bold tracking-widest uppercase text-[10px]">
              {isRegistering ? 'Create your skincare journey account' : 'Authentication required to access your dashboard'}
            </p>
          </div>

          <div className="flex justify-center mb-6">
            <button
              onClick={handleGoogleSuccess}
              type="button"
              className="w-full py-4 bg-white border border-gray-200 text-gray-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm flex items-center justify-center gap-3 transition-all hover:bg-gray-50 active:scale-95 disabled:opacity-50"
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
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-gray-400 font-bold uppercase tracking-widest">Or continue with phone</span>
            </div>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {isRegistering && (
              <div className="space-y-2">
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Full Name"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="email" 
                    placeholder="Email Address"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
            )}
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="tel" 
                placeholder="Phone Number"
                required
                className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="password" 
                placeholder="Password"
                required
                className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            {error && <p className="text-red-500 text-xs font-black uppercase text-center">{error}</p>}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Processing...' : (isRegistering ? 'Register' : 'Login')}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center">
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
    <div className="min-h-screen bg-gray-50/50 py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <aside className="w-full md:w-80 space-y-4">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
              <div className="flex flex-col items-center text-center">
                <div className="relative group">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-105">
                    <UserIcon className="w-10 h-10 text-primary" />
                  </div>
                  {isAdmin && (
                    <span className="absolute bottom-4 right-0 bg-gray-900 text-white text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-widest">
                      Admin
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-black text-gray-900 tracking-tighter uppercase italic">{user.name}</h2>
                <p className="text-gray-400 text-xs font-bold tracking-widest uppercase">{user.email}</p>
              </div>

              <div className="mt-8 space-y-2">
                <button 
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all font-black text-xs uppercase tracking-widest ${activeTab === 'orders' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:bg-gray-50'}`}
                >
                  <span className="flex items-center gap-3">
                    <Package className="w-4 h-4" />
                    Orders
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all font-black text-xs uppercase tracking-widest ${activeTab === 'profile' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:bg-gray-50'}`}
                >
                  <span className="flex items-center gap-3">
                    <UserIcon className="w-4 h-4" />
                    Profile
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                
                {isAdmin && (
                  <Link 
                    to="/admin/dashboard"
                    className="w-full flex items-center justify-between px-6 py-4 rounded-2xl text-amber-600 hover:bg-amber-50 transition-all font-black text-xs uppercase tracking-widest"
                  >
                    <span className="flex items-center gap-3">
                      <Lock className="w-4 h-4" />
                      Admin Dashboard
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                )}

                <button 
                  onClick={() => { logout(); navigate('/'); }}
                  className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-black text-xs uppercase tracking-widest mt-4"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
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
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black tracking-tighter text-gray-900 uppercase italic">My Orders</h3>
                    <div className="px-4 py-2 bg-white rounded-full border border-gray-100 shadow-sm">
                      <span className="text-xs font-black text-primary uppercase tracking-widest">{orders.length} Total</span>
                    </div>
                  </div>

                  {loading ? (
                    <div className="grid gap-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-40 bg-white rounded-[2.5rem] animate-pulse" />
                      ))}
                    </div>
                  ) : orders.length > 0 ? (
                    <div className="grid gap-6">
                      {orders.map((order) => (
                        <div 
                          key={order.order_id}
                          className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 transition-all hover:shadow-xl hover:shadow-gray-200/50 group"
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-50">
                            <div>
                              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Order ID</p>
                              <h4 className="text-sm font-black text-gray-900">#{order.order_id}</h4>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-tighter ${getStatusColor(order.status)}`}>
                                {getStatusIcon(order.status)}
                                {order.status}
                              </div>
                              <div className="px-4 py-2 bg-gray-50 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                {new Date(order.timestamp).toLocaleDateString()}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center p-2">
                                  <img 
                                    src={item.images?.[0] || 'https://via.placeholder.com/100'} 
                                    className="w-full h-full object-cover rounded-lg" 
                                    alt={item.name}
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                                <div className="flex-1">
                                  <h5 className="text-sm font-black text-gray-900 line-clamp-1">{item.name}</h5>
                                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Qty: {item.quantity} × ৳{item.price.toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-black text-gray-900">৳{(item.price * item.quantity).toLocaleString()}</p>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
                            <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Total Amount</p>
                            <p className="text-xl font-black text-primary">৳{order.total.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-[2.5rem] p-12 text-center border-2 border-dashed border-gray-100">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="w-8 h-8 text-gray-200" />
                      </div>
                      <h4 className="text-lg font-black text-gray-900 uppercase italic">No orders yet</h4>
                      <button 
                        onClick={() => navigate('/shop')}
                        className="mt-6 px-8 py-3 bg-primary text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                      >
                        Start Shopping
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
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-black tracking-tighter text-gray-900 uppercase italic">Profile Settings</h3>
                  
                  <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <UserIcon className="w-3 h-3" />
                            Full Name
                          </label>
                          <p className="px-6 py-4 bg-gray-50 rounded-2xl font-black text-sm text-gray-900 border border-transparent">{user.name}</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Mail className="w-3 h-3" />
                            Email Address
                          </label>
                          <p className="px-6 py-4 bg-gray-50 rounded-2xl font-black text-sm text-gray-900 border border-transparent">{user.email}</p>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Phone className="w-3 h-3" />
                            Phone Number
                          </label>
                          <p className="px-6 py-4 bg-gray-50 rounded-2xl font-black text-sm text-gray-900 border border-transparent">{user.phone}</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <MapPin className="w-3 h-3" />
                            Saved Address
                          </label>
                          <p className="px-6 py-4 bg-gray-50 rounded-2xl font-black text-sm text-gray-900 border border-transparent min-h-[54px]">{user.address || 'No address saved yet'}</p>
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

