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

      {/* Premium Footer Design */}
      <footer className="bg-gray-950 pt-20 pb-10 px-4 mt-20 rounded-t-[3rem] relative overflow-hidden text-white">
        {/* Decorative BG element */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none -translate-x-1/3 translate-y-1/3"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
            
            {/* Brand Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Logo className="w-10 h-10 text-white" />
                <div className="flex flex-col leading-none">
                  <span className="text-xl font-extrabold tracking-tighter text-white">
                    KOREAN
                  </span>
                  <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase">
                    Skin Food
                  </span>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-400 leading-relaxed max-w-xs">
                Your premium gateway to authentic South Korean skincare. We bring the best of Seoul to your doorstep in Bangladesh.
              </p>
              <div className="flex items-center gap-4 pt-2">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all outline-none" title="Facebook">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all outline-none" title="Instagram">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all outline-none" title="Twitter">
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-white mb-6">Explore</h3>
              <ul className="space-y-4">
                <li><Link to="/" className="text-sm font-medium text-gray-400 hover:text-primary transition-colors">Home</Link></li>
                <li><Link to="/shop" className="text-sm font-medium text-gray-400 hover:text-primary transition-colors">Shop All Skincare</Link></li>
                <li><Link to="/about" className="text-sm font-medium text-gray-400 hover:text-primary transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="text-sm font-medium text-gray-400 hover:text-primary transition-colors">Contact Support</Link></li>
              </ul>
            </div>

            {/* Customer Care */}
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-white mb-6">Customer Care</h3>
              <ul className="space-y-4">
                <li><Link to="/track-order" className="text-sm font-medium text-gray-400 hover:text-primary transition-colors">Track Your Ritual (Order)</Link></li>
                <li><Link to="/account" className="text-sm font-medium text-gray-400 hover:text-primary transition-colors">My Sanctuary (Account)</Link></li>
                <li><Link to="#" className="text-sm font-medium text-gray-400 hover:text-primary transition-colors">Return Policy</Link></li>
                <li><Link to="#" className="text-sm font-medium text-gray-400 hover:text-primary transition-colors">Shipping Info</Link></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-white mb-6">Stay Glowing</h3>
              <p className="text-sm font-medium text-gray-400 mb-4">
                Subscribe for exclusive drops and skincare tips from Seoul.
              </p>
              <form className="relative" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Enter your email..." 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50"
                  required
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-pink-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-lg transition-colors">
                  Join
                </button>
              </form>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">
              &copy; 2026 K-SkinFood Bangladesh. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/admin" className="text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-primary transition-colors">
                Admin Portal
              </Link>
              <span className="text-gray-700">•</span>
              <Link to="/admin/seo" className="text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-primary transition-colors">
                SEO Optimizer
              </Link>
              <span className="text-gray-700">•</span>
              <Link to="/admin/social" className="text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-primary transition-colors">
                Social Studio
              </Link>
            </div>
          </div>
        </div>
      </footer>

      <BottomNav />
      <ChatBot />
    </div>
  );
};
