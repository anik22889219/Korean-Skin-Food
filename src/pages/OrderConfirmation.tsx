import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Package, MessageCircle, ArrowRight, Home } from 'lucide-react';

export const OrderConfirmation: React.FC = () => {
  const [params] = useSearchParams();
  const orderId = params.get('order_id') || 'ORD-XXXXXXX';
  const whatsapp = import.meta.env.VITE_WHATSAPP_NUMBER || '8801755837545';
  const waLink = `https://wa.me/${whatsapp}?text=${encodeURIComponent(`আমার অর্ডার নম্বর: ${orderId} — স্ট্যাটাস জানতে চাই।`)}`;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center space-y-8"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="mx-auto w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center border-4 border-emerald-100"
        >
          <CheckCircle2 className="w-12 h-12 text-emerald-500" />
        </motion.div>

        {/* Heading */}
        <div className="space-y-3">
          <h1 className="text-4xl font-black tracking-tighter text-gray-900">
            অর্ডার সফল! 🎉
          </h1>
          <p className="text-gray-500 text-lg">
            আপনার অর্ডার সফলভাবে গ্রহণ করা হয়েছে।
          </p>
        </div>

        {/* Order ID */}
        <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">অর্ডার নম্বর</p>
          <p className="text-2xl font-black text-primary font-mono">{orderId}</p>
          <p className="text-sm text-gray-500 mt-2">
            এই নম্বরটি সেভ করুন — অর্ডার ট্র্যাক করতে লাগবে।
          </p>
        </div>

        {/* Steps */}
        <div className="text-left space-y-4">
          {[
            { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50', label: 'অর্ডার গৃহীত হয়েছে', done: true },
            { icon: Package, color: 'text-blue-500', bg: 'bg-blue-50', label: 'প্যাকিং হচ্ছে...', done: false },
            { icon: MessageCircle, color: 'text-primary', bg: 'bg-pink-50', label: 'WhatsApp-এ কনফার্মেশন পাবেন', done: false },
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className={`w-10 h-10 ${step.bg} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                <step.icon className={`w-5 h-5 ${step.color}`} />
              </div>
              <span className={`text-sm font-bold ${step.done ? 'text-gray-900' : 'text-gray-400'}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            id="wa-order-support"
            className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            WhatsApp-এ যোগাযোগ করুন
          </a>
          <Link
            to="/track-order"
            className="w-full bg-gray-100 text-gray-700 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
          >
            <Package className="w-5 h-5" />
            অর্ডার ট্র্যাক করুন
          </Link>
          <Link
            to="/"
            className="flex items-center justify-center gap-2 text-primary font-black text-sm"
          >
            <Home className="w-4 h-4" /> হোমে ফিরুন <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
