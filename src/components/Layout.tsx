import React from 'react';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { Navbar } from './Navbar';
import { BottomNav } from './BottomNav';
import { Link } from 'react-router-dom';
import { ChatBot } from './ChatBot';
import { motion } from 'motion/react';
import { Logo } from './Logo';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pb-24 pb-safe"
      >
        {children}
      </motion.main>

      {/* Footer (Simplified) */}
      <footer className="bg-gray-50 border-t border-gray-100 py-16 px-4 text-center">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col items-center justify-center gap-4">
            <Logo className="w-12 h-12" />
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tighter text-primary">
                KOREAN
              </span>
              <span className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase">
                Skin Food
              </span>
            </div>
            <p className="text-sm font-medium italic text-primary/60">
              "Love yourself, Love your skin"
            </p>
          </div>

          {/* Social Media Links */}
          <div className="flex items-center justify-center gap-6 py-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#1877F2] hover:border-[#1877F2]/20 hover:shadow-lg transition-all outline-none" title="Facebook">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#E4405F] hover:border-[#E4405F]/20 hover:shadow-lg transition-all outline-none" title="Instagram">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#1DA1F2] hover:border-[#1DA1F2]/20 hover:shadow-lg transition-all outline-none" title="Twitter">
              <Twitter className="w-5 h-5" />
            </a>
          </div>

          <p className="text-[10px] text-gray-400 font-medium max-w-sm mx-auto uppercase tracking-widest leading-loose">
            &copy; 2026 K-SkinFood Bangladesh. All rights reserved. 
            Authentic Korean Beauty within your reach.
          </p>
          <div className="pt-4 flex flex-col md:flex-row items-center justify-center gap-4">
            <Link to="/admin/seo" className="text-[10px] font-black uppercase tracking-widest text-gray-300 hover:text-primary transition-colors">
              Staff: AI SEO Optimizer
            </Link>
            <Link to="/admin/social" className="text-[10px] font-black uppercase tracking-widest text-gray-300 hover:text-primary transition-colors">
              Staff: Social Media Studio
            </Link>
          </div>
        </div>
      </footer>

      <BottomNav />
      <ChatBot />
    </div>
  );
};
