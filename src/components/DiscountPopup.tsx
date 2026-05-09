import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const DiscountPopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const hasShown = sessionStorage.getItem('popup_shown');
    if (!hasShown) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        sessionStorage.setItem('popup_shown', 'true');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const copyCode = () => {
    navigator.clipboard.writeText('WELCOME10');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsVisible(false)}
          />
          
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotate: 5 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="relative bg-white w-full max-w-sm rounded-[2rem] overflow-hidden shadow-2xl p-8 text-center"
          >
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Gift className="w-10 h-10 text-primary" />
            </div>

            <h2 className="text-2xl font-black text-gray-900 leading-tight mb-2">
              আপনাকে অভিনন্দন! ✨
            </h2>
            <p className="text-gray-500 font-medium mb-8">
              আপনার প্রথম অর্ডারে ১০% ডিসকাউন্ট পেতে এই কুপনটি ব্যবহার করুন।
            </p>

            <div className="bg-gray-50 border-2 border-dashed border-primary/30 py-4 px-6 rounded-2xl flex items-center justify-between gap-4 mb-8">
              <div className="flex flex-col items-start">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">Coupon Code</span>
                <span className="text-xl font-black text-gray-900 tracking-tighter">WELCOME10</span>
              </div>
              <button 
                onClick={copyCode}
                className={`p-3 rounded-xl transition-all ${
                  copied ? 'bg-green-500 text-white' : 'bg-primary text-white hover:scale-105'
                }`}
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>

            <button 
              onClick={() => setIsVisible(false)}
              className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black active:scale-95 transition-transform"
            >
              এখনই ব্যবহার করুন
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
