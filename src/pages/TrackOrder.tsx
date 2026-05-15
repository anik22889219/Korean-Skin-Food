import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Package, Truck, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { Order } from '../types';

const STATUS_STEPS = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered'];

const StatusIcon = ({ status }: { status: string }) => {
  const icons: Record<string, React.ReactNode> = {
    Pending: <Clock className="w-5 h-5 text-orange-400" />,
    Confirmed: <CheckCircle2 className="w-5 h-5 text-blue-400" />,
    Packed: <Package className="w-5 h-5 text-purple-400" />,
    Shipped: <Truck className="w-5 h-5 text-indigo-400" />,
    Delivered: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
  };
  return <>{icons[status] || <Clock className="w-5 h-5 text-gray-400" />}</>;
};

export const TrackOrder: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setLoading(true);
    setError('');
    try {
      const result = await api.getUserOrders(phone.trim());
      setOrders(result);
      setSearched(true);
    } catch {
      setError('অর্ডার খুঁজে পাওয়া যায়নি। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  const statusIndex = (status: string) =>
    STATUS_STEPS.findIndex(s => s.toLowerCase() === status.toLowerCase());

  return (
    <div className="bg-[#FDF9F6] min-h-screen pb-20">
      <div className="max-w-[800px] mx-auto px-4 py-16 md:py-24 space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-[0_4px_30px_rgba(0,0,0,0.02)] mb-2">
            <Package className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900 italic">Track Your <span className="text-primary">Ritual</span></h1>
          <p className="text-gray-500 text-sm font-medium">আপনার ফোন নম্বর দিয়ে অর্ডারের স্ট্যাটাস দেখুন।</p>
        </motion.div>

        {/* Search */}
        <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
              <input
                id="track-phone"
                type="tel"
                placeholder="আপনার ফোন নম্বর লিখুন..."
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full pl-14 pr-6 py-5 bg-[#FDF9F6] border border-orange-50 rounded-full text-sm font-black focus:border-primary/30 focus:ring-4 focus:ring-primary/10 transition-all outline-none"
              />
            </div>
            <button
              id="track-search-btn"
              type="submit"
              disabled={loading}
              className="bg-gray-900 text-white px-10 py-5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl shadow-gray-900/20 hover:bg-gray-800 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale md:w-auto w-full"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
              ) : (
                'Track Now'
              )}
            </button>
          </form>

          {/* Error */}
          {error && (
            <div className="mt-6 flex items-center gap-3 bg-red-50 border border-red-100 text-red-600 rounded-2xl p-4 text-xs font-bold uppercase tracking-widest">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* No Orders */}
        {searched && orders.length === 0 && !error && (
          <div className="bg-white rounded-[3rem] p-16 text-center shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
            <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-bold text-sm">এই নম্বরে কোনো অর্ডার পাওয়া যায়নি।</p>
          </div>
        )}

        {/* Orders List */}
        <div className="space-y-8">
          {orders.map((order, i) => {
            const currentStep = statusIndex(order.status);
            return (
              <motion.div
                key={order.order_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-[3rem] p-8 md:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.03)] space-y-8 relative overflow-hidden"
              >
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                
                {/* Order Header */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 relative z-10">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Order Number</p>
                    <p className="font-black text-xl md:text-2xl text-gray-900 tracking-tighter">#{order.order_id}</p>
                  </div>
                  <div className="flex items-center gap-3 bg-[#FDF9F6] border border-orange-50 px-5 py-3 rounded-full self-start">
                    <StatusIcon status={order.status} />
                    <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-6 pt-4 relative z-10">
                  <div className="flex justify-between relative">
                     {/* Background Track */}
                    <div className="absolute top-[18px] left-0 w-full h-1.5 bg-[#FDF9F6] rounded-full -z-10" />
                    {/* Active Track */}
                    <div 
                      className="absolute top-[18px] left-0 h-1.5 bg-primary rounded-full -z-10 transition-all duration-700 ease-out" 
                      style={{ width: `${Math.max(0, (currentStep / (STATUS_STEPS.length - 1)) * 100)}%` }}
                    />
                    
                    {STATUS_STEPS.map((step, si) => (
                      <div key={step} className="flex flex-col items-center gap-3 flex-1 relative">
                        <div
                          className={`w-10 h-10 rounded-full border-[3px] flex items-center justify-center text-[10px] font-black transition-all duration-500 shadow-sm
                            ${si <= currentStep
                              ? 'bg-primary border-primary text-white shadow-primary/20 scale-110'
                              : 'bg-white border-[#FDF9F6] text-gray-300'
                          }`}
                        >
                          {si < currentStep ? <CheckCircle2 className="w-4 h-4" /> : si + 1}
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-widest text-center ${si <= currentStep ? 'text-gray-900' : 'text-gray-300'}`}>
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Details */}
                <div className="grid grid-cols-2 gap-8 pt-8 border-t border-orange-50 relative z-10">
                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Total Amount</p>
                    <p className="font-black text-2xl text-gray-900 tracking-tighter italic">৳{order.total.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Payment Method</p>
                    <p className="font-bold text-sm text-gray-900 flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-green-400" />
                       {order.payment_method === 'COD' ? 'Cash on Delivery' : order.payment_method}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
