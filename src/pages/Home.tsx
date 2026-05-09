import React from 'react';
import { api } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ShieldCheck, Truck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

export const Home: React.FC = () => {
  const { t } = useLanguage();

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => api.getProducts(),
  });

  const featured = products.filter(p => p.is_featured).slice(0, 4);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[500px] flex items-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-[#fff5f8]">
           <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[100%] bg-primary/5 rounded-full blur-[100px]" />
           <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[100%] bg-pink-100/30 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-black text-primary uppercase tracking-widest">Premium K-Beauty</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-7xl font-black text-gray-900 leading-[0.9] tracking-tighter"
            >
              LOVE YOURSELF <br />
              <span className="text-primary italic">LOVE YOUR</span> SKIN
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-500 text-lg md:text-xl font-medium max-w-md leading-relaxed"
            >
              Authentic Korean skincare delivered to your doorstep. Experience the glass skin revolution in Bangladesh.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/shop" className="bg-primary text-white px-10 py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 group">
                Shop Now <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="hidden md:block relative"
          >
            <div className="aspect-square bg-white rounded-[4rem] shadow-2xl relative overflow-hidden border-8 border-white p-4">
               <img 
                 src="https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1000&auto=format&fit=crop" 
                 alt="K-Beauty product"
                 className="w-full h-full object-cover rounded-[3rem]"
                 referrerPolicy="no-referrer"
               />
            </div>
            {/* Floaties */}
            <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-3xl shadow-xl flex items-center gap-4 animate-bounce">
              <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center">
                <CheckCircle className="text-primary w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-black text-gray-400">Authenticity</p>
                <p className="font-black text-gray-900">100% Guaranteed</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-gray-100">
          <div className="flex flex-col items-center text-center gap-3">
             <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center">
               <ShieldCheck className="text-pink-500 w-6 h-6" />
             </div>
             <h4 className="font-bold text-sm">Authentic Products</h4>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
             <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
               <Truck className="text-blue-500 w-6 h-6" />
             </div>
             <h4 className="font-bold text-sm">Fast Delivery</h4>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
             <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center">
               <Zap className="text-primary w-6 h-6" />
             </div>
             <h4 className="font-bold text-sm">Glass Skin Result</h4>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
             <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
               <Sparkles className="text-orange-500 w-6 h-6" />
             </div>
             <h4 className="font-bold text-sm">Daily Offers</h4>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-gray-900">{t('featured_products')}</h2>
            <div className="w-20 h-1.5 bg-primary mt-2 rounded-full" />
          </div>
          <Link to="/shop" className="text-primary font-bold hover:underline mb-2 flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featured.map((p, idx) => (
            <ProductCard key={`${p.product_id}-${idx}`} product={p} />
          ))}
        </div>
      </section>

      {/* Categories Horizontal Scroll */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <h2 className="text-3xl font-black mb-8 text-center uppercase tracking-widest text-gray-400">Categories</h2>
           <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x">
             {['Serum', 'Moisturizer', 'Cleanser', 'Sunscreen', 'Mask', 'Toner'].map((cat, i) => (
                <Link 
                  key={i}
                  to={`/shop?category=${cat}`}
                  className="flex-shrink-0 w-32 md:w-48 aspect-square bg-white rounded-3xl flex flex-col items-center justify-center gap-3 border border-gray-100 hover:border-primary transition-all snap-center group"
                >
                   <div className="w-16 h-16 bg-gray-50 rounded-full group-hover:bg-primary/10 transition-colors" />
                   <span className="font-black text-xs md:text-sm text-gray-600 group-hover:text-primary">{cat}</span>
                </Link>
              ))}
           </div>
        </div>
      </section>

      {/* Latest Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-gray-900">{t('new_arrivals')}</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.slice(0, 8).map((p, idx) => (
            <ProductCard key={`${p.product_id}-latest-${idx}`} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
};

const CheckCircle: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
  </svg>
);
