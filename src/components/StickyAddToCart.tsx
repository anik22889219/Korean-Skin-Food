import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StickyAddToCartProps {
  product: Product;
}

export const StickyAddToCart: React.FC<StickyAddToCartProps> = ({ product }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [added, setAdded] = useState(false);
  const { language, t } = useLanguage();
  const { addToCart } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 600px
      setIsVisible(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const name = language === 'en' ? product.name_en : product.name_bn;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="fixed bottom-0 md:bottom-auto md:bottom-8 left-0 md:left-auto md:right-8 w-full md:w-auto z-[45] bg-white border-t md:border border-gray-100 md:rounded-3xl shadow-[0_-10px_30px_rgba(0,0,0,0.1)] p-4 flex items-center gap-4 md:min-w-[400px]"
        >
          <div className="flex-1 flex items-center gap-3">
             <img src={product.images[0] || 'https://via.placeholder.com/100'} className="w-12 h-12 rounded-xl object-cover" referrerPolicy="no-referrer" />
             <div className="flex-1">
               <h4 className="text-sm font-black text-gray-900 line-clamp-1">{name}</h4>
               <p className="text-primary font-black">৳{(product.discount_price || product.price).toLocaleString()}</p>
             </div>
          </div>
          <button
            onClick={() => {
              addToCart(product);
              setAdded(true);
              setTimeout(() => setAdded(false), 2000);
            }}
            disabled={added}
            className={`px-6 py-4 rounded-2xl font-black flex items-center gap-2 active:scale-95 transition-all shadow-lg ${
              added ? 'bg-green-500 text-white' : 'bg-primary text-white shadow-primary/20'
            }`}
          >
            {added ? (
              <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <ShoppingBag className="w-5 h-5" />
            )}
            <span className="hidden sm:inline">{added ? 'Added!' : t('add_to_cart')}</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
