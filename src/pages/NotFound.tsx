import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-8 max-w-md"
      >
        {/* 404 Display */}
        <div className="relative">
          <p className="text-[10rem] font-black text-gray-100 leading-none select-none">404</p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl">🌸</div>
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-black tracking-tighter text-gray-900">
            পেজটি পাওয়া যায়নি
          </h1>
          <p className="text-gray-500">
            আপনি যে পেজটি খুঁজছেন তা সরানো হয়েছে বা এটি কখনো ছিল না।
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-black text-sm shadow-lg shadow-primary/20 hover:bg-pink-700 transition-colors"
          >
            <Home className="w-4 h-4" />
            হোমে যান
          </Link>
          <Link
            to="/shop"
            className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-8 py-4 rounded-2xl font-black text-sm hover:bg-gray-200 transition-colors"
          >
            <Search className="w-4 h-4" />
            শপ দেখুন
          </Link>
        </div>

        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-primary font-bold text-sm mx-auto hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> আগের পেজে যান
        </button>
      </motion.div>
    </div>
  );
};
