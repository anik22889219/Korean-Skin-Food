import React, { useState } from 'react';
import { ShoppingCart, User, Search, Menu, Globe, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from './Logo';

export const Navbar: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { itemCount } = useCart();
  const { user } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${searchQuery}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      {/* Announcement Bar */}
      <div className="bg-primary py-1.5 px-4 text-center text-xs font-medium text-white overflow-hidden whitespace-nowrap">
        <motion.p
          animate={{ x: [1000, -1000] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          ✨ Free Delivery inside Dhaka for orders over ৳2000! | ৫% ডিসকাউন্ট প্রথম অর্ডারে! ✨
        </motion.p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <Logo className="w-10 h-10 md:w-12 md:h-12" />
            <div className="flex flex-col leading-none">
              <span className="text-xl font-extrabold tracking-tighter text-primary">
                KOREAN
              </span>
              <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                Skin Food
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-semibold text-gray-700 hover:text-primary transition-colors">{t('home')}</Link>
            <Link to="/shop" className="text-sm font-semibold text-gray-700 hover:text-primary transition-colors">{t('shop')}</Link>
            <Link to="/about" className="text-sm font-semibold text-gray-700 hover:text-primary transition-colors">About</Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 sm:gap-6">
            <button onClick={() => setIsSearchOpen(true)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Search className="w-5 h-5 text-gray-600" />
            </button>

            <button 
              onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
              className="px-3 py-1 border border-gray-200 rounded-full text-xs font-bold hover:bg-gray-50 flex items-center gap-1"
            >
              <Globe className="w-3 h-3" />
              {language === 'en' ? 'বাংলা' : 'EN'}
            </button>

            <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ShoppingCart className="w-5 h-5 text-gray-600" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </Link>

            <Link to="/account" className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden sm:block">
              <User className="w-5 h-5 text-gray-600" />
            </Link>
          </div>
        </div>
      </div>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white border-b border-gray-200 p-4 shadow-xl"
          >
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto flex gap-2">
              <input 
                type="text" 
                autoFocus
                placeholder="Search products..."
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="bg-primary text-white px-6 rounded-xl font-bold">{t('search')}</button>
              <button 
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="p-3 text-gray-400"
              >
                <X className="w-6 h-6" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
