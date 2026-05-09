import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Package, Truck, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { Order } from '../types';

const STATUS_STEPS = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered'];

const StatusIcon = ({ status }: { status: string }) => {
  const icons: Record<string, React.ReactNode> = {
    Pending: <Clock className="w-5 h-5 text-orange-500" />,
    Confirmed: <CheckCircle2 className="w-5 h-5 text-blue-500" />,
    Packed: <Package className="w-5 h-5 text-purple-500" />,
    Shipped: <Truck className="w-5 h-5 text-indigo-500" />,
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
    <div className="max-w-2xl mx-auto px-4 py-16 space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-50 rounded-3xl border border-pink-100 mx-auto">
          <Package className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl font-black tracking-tighter text-gray-900">অর্ডার ট্র্যাক করুন</h1>
        <p className="text-gray-500">আপনার ফোন নম্বর দিয়ে অর্ডারের স্ট্যাটাস দেখুন।</p>
      </motion.div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            id="track-phone"
            type="tel"
            placeholder="আপনার ফোন নম্বর লিখুন..."
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="w-full pl-11 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-sm font-mono outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <button
          id="track-search-btn"
          type="submit"
          disabled={loading}
          className="bg-primary text-white px-6 py-4 rounded-2xl font-black text-sm shadow-lg shadow-primary/20 hover:bg-pink-700 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            'খুঁজুন'
          )}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-600 rounded-2xl p-4 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* No Orders */}
      {searched && orders.length === 0 && !error && (
        <div className="text-center py-16 space-y-3">
          <Package className="w-16 h-16 text-gray-200 mx-auto" />
          <p className="text-gray-400 font-bold">এই নম্বরে কোনো অর্ডার পাওয়া যায়নি।</p>
        </div>
      )}

      {/* Orders List */}
      <div className="space-y-6">
        {orders.map((order, i) => {
          const currentStep = statusIndex(order.status);
          return (
            <motion.div
              key={order.order_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6"
            >
              {/* Order Header */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">অর্ডার নম্বর</p>
                  <p className="font-black text-lg text-gray-900 font-mono">{order.order_id}</p>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl">
                  <StatusIcon status={order.status} />
                  <span className="text-xs font-black text-gray-700 uppercase tracking-wider">
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  {STATUS_STEPS.map((step, si) => (
                    <div key={step} className="flex flex-col items-center gap-1 flex-1">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-black transition-all ${
                          si <= currentStep
                            ? 'bg-primary border-primary text-white'
                            : 'bg-white border-gray-200 text-gray-300'
                        }`}
                      >
                        {si < currentStep ? '✓' : si + 1}
                      </div>
                      <span className={`text-[9px] font-black uppercase tracking-wider text-center leading-tight ${si <= currentStep ? 'text-primary' : 'text-gray-300'}`}>
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="relative h-1 bg-gray-100 rounded-full">
                  <div
                    className="absolute left-0 top-0 h-full bg-primary rounded-full transition-all"
                    style={{ width: `${Math.max(0, (currentStep / (STATUS_STEPS.length - 1)) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Order Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-gray-400 font-black uppercase tracking-widest">মোট</p>
                  <p className="font-black text-gray-900">৳{order.total.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-black uppercase tracking-widest">পেমেন্ট</p>
                  <p className="font-black text-gray-900">{order.payment_method}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
