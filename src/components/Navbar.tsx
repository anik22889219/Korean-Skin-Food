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
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${searchQuery}`);
      setIsSearchOpen(false);
      setIsMobileMenuOpen(false);
      setSearchQuery('');
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
          
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -ml-2 mr-2 md:hidden hover:bg-gray-100 rounded-full transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-900" />
          </button>

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
            <Link to="/about" className="text-sm font-semibold text-gray-700 hover:text-primary transition-colors">About Us</Link>
            <Link to="/contact" className="text-sm font-semibold text-gray-700 hover:text-primary transition-colors">Contact</Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={() => setIsSearchOpen(true)} className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden sm:block">
              <Search className="w-5 h-5 text-gray-600" />
            </button>

            <button 
              onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
              className="px-3 py-1.5 border border-gray-200 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 flex items-center gap-1"
            >
              <Globe className="w-3 h-3" />
              <span className="hidden sm:inline">{language === 'en' ? 'বাংলা' : 'English'}</span>
              <span className="sm:hidden">{language === 'en' ? 'BN' : 'EN'}</span>
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

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[280px] bg-white z-50 shadow-2xl flex flex-col md:hidden"
            >
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2">
                  <Logo className="w-8 h-8" />
                  <span className="font-extrabold tracking-tighter text-primary">KSF</span>
                </Link>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 border-b border-gray-100">
                <form onSubmit={handleSearch} className="relative">
                  <input 
                    type="text" 
                    placeholder="Search..."
                    className="w-full bg-gray-50 border-none rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </form>
              </div>

              <div className="flex-1 overflow-y-auto py-4">
                <nav className="flex flex-col space-y-1 px-2">
                  <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 text-sm font-bold text-gray-700 hover:bg-primary/5 hover:text-primary rounded-xl transition-colors">
                    {t('home')}
                  </Link>
                  <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 text-sm font-bold text-gray-700 hover:bg-primary/5 hover:text-primary rounded-xl transition-colors">
                    {t('shop')}
                  </Link>
                  <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 text-sm font-bold text-gray-700 hover:bg-primary/5 hover:text-primary rounded-xl transition-colors">
                    About Us
                  </Link>
                  <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 text-sm font-bold text-gray-700 hover:bg-primary/5 hover:text-primary rounded-xl transition-colors">
                    Contact & Support
                  </Link>
                  <Link to="/track-order" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 text-sm font-bold text-gray-700 hover:bg-primary/5 hover:text-primary rounded-xl transition-colors">
                    Track Order
                  </Link>
                </nav>
              </div>

              <div className="p-4 border-t border-gray-100 bg-gray-50">
                <Link to="/account" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl font-bold text-sm hover:border-primary/30 transition-colors shadow-sm">
                  <User className="w-5 h-5 text-gray-500" />
                  My Account
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};
