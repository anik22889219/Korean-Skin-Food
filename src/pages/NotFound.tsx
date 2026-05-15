import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home, Search, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[80vh] bg-[#FDF9F6] flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-8 max-w-md bg-white p-10 md:p-14 rounded-[3rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-white relative overflow-hidden"
      >
         {/* Decorative background element */}
         <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        {/* 404 Display */}
        <div className="relative z-10">
          <p className="text-[10rem] font-black text-[#FDF9F6] leading-none select-none italic tracking-tighter">404</p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl">🌸</div>
          </div>
        </div>

        <div className="space-y-4 relative z-10">
          <h1 className="text-4xl font-black tracking-tighter text-gray-900 italic">
            Lost in <span className="text-primary">Beauty?</span>
          </h1>
          <p className="text-gray-500 font-medium text-sm">
            আপনি যে পেজটি খুঁজছেন তা সরানো হয়েছে বা এটি কখনো ছিল না।
          </p>
        </div>

        <div className="flex flex-col gap-4 justify-center relative z-10 pt-4 border-t border-orange-50">
          <Link
            to="/"
            className="flex items-center justify-center gap-3 bg-gray-900 text-white px-8 py-5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl shadow-gray-900/20 hover:bg-gray-800 transition-all active:scale-95 hover:scale-[1.02]"
          >
            <Home className="w-4 h-4" />
            Return Home
          </Link>
          <Link
            to="/shop"
            className="flex items-center justify-center gap-3 bg-[#FDF9F6] text-gray-900 border border-orange-50 px-8 py-5 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-orange-50/50 transition-all shadow-sm active:scale-95"
          >
            <Search className="w-4 h-4" />
            Explore Shop
          </Link>
        </div>

        <button
          onClick={() => window.history.back()}
          className="flex items-center justify-center gap-2 text-gray-400 hover:text-gray-900 font-bold text-[10px] uppercase tracking-widest mx-auto transition-colors mt-6 relative z-10"
        >
          <ArrowLeft className="w-3 h-3" /> Go Back
        </button>
      </motion.div>
    </div>
  );
};
