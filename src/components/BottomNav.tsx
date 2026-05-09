import React from 'react';
import { Home, ShoppingBag, Search, ShoppingCart, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';

export const BottomNav: React.FC = () => {
  const { t } = useLanguage();
  const { itemCount } = useCart();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 z-50 px-2 pb-safe shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-16">
        <Link to="/" className={`flex flex-col items-center gap-1 px-3 ${isActive('/') ? 'text-primary' : 'text-gray-400'}`}>
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-wider">{t('home')}</span>
        </Link>
        <Link to="/shop" className={`flex flex-col items-center gap-1 px-3 ${isActive('/shop') ? 'text-primary' : 'text-gray-400'}`}>
          <ShoppingBag className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-wider">{t('shop')}</span>
        </Link>
        <Link to="/search" className={`flex flex-col items-center gap-1 px-3 ${isActive('/search') ? 'text-primary' : 'text-gray-400'}`}>
          <Search className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-wider">{t('search')}</span>
        </Link>
        <Link to="/cart" className={`relative flex flex-col items-center gap-1 px-3 ${isActive('/cart') ? 'text-primary' : 'text-gray-400'}`}>
          <ShoppingCart className="w-6 h-6" />
          {itemCount > 0 && (
            <span className="absolute top-0 right-2 bg-red-500 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold border-2 border-white">
              {itemCount}
            </span>
          )}
          <span className="text-[10px] font-bold uppercase tracking-wider">{t('cart')}</span>
        </Link>
        <Link to="/account" className={`flex flex-col items-center gap-1 px-3 ${isActive('/account') ? 'text-primary' : 'text-gray-400'}`}>
          <User className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-wider">{t('account')}</span>
        </Link>
      </div>
    </div>
  );
};
