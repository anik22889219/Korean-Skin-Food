import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Star, ShoppingBag, ChevronRight, Heart } from 'lucide-react';
import { Product } from '../../types';
import { Link } from 'react-router-dom';

interface FeaturedProductsProps {
  products: Product[];
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products }) => {
  return (
    <section className="space-y-8 pt-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">
            Trending <span className="text-primary">Must-Haves</span>
          </h2>
          <p className="text-sm font-medium text-gray-400 mt-1">Our most loved K-beauty essentials</p>
        </div>
        <div className="flex gap-2">
          <Link to="/shop" className="px-5 py-2.5 bg-[#FDF9F6] border border-orange-100 rounded-full text-xs font-bold text-gray-800 hover:bg-orange-50 transition-colors shadow-sm uppercase tracking-widest">
            New Arrivals
          </Link>
          <Link to="/shop" className="px-5 py-2.5 bg-gray-900 border border-gray-900 rounded-full text-xs font-bold text-white hover:bg-gray-800 transition-colors shadow-sm uppercase tracking-widest">
            Best Sellers
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
        {products.slice(0, 10).map((product, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            key={idx} 
            className="bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_10px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 group relative flex flex-col"
          >
            <div className="aspect-[4/5] bg-[#FDF9F6] rounded-xl overflow-hidden relative mb-4">
              <img 
                src={product.images?.[0] || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80'} 
                alt={product.name_en || product.name_bn || 'Product image'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out mix-blend-multiply"
                loading="lazy"
              />
              
              {/* Premium Badge */}
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md rounded-full flex items-center gap-1.5 px-2.5 py-1 shadow-sm border border-white">
                <Sparkles className="w-2.5 h-2.5 text-primary" />
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-800">Top Rated</span>
              </div>

              {/* Wishlist Button */}
              <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm border border-white text-gray-400 hover:text-red-500 hover:bg-white transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
                <Heart className="w-4 h-4" />
              </button>
              
              {/* Quick Action Overlay */}
              <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                <button className="w-full bg-gray-900/95 backdrop-blur-md text-white py-3 rounded-xl text-xs font-bold shadow-xl flex items-center justify-center gap-2 hover:bg-primary transition-colors">
                  <ShoppingBag className="w-4 h-4" />
                  Quick Add
                </button>
              </div>
            </div>
            
            <h3 className="text-xs md:text-sm font-bold text-gray-800 line-clamp-2 mb-2 leading-relaxed min-h-[40px] group-hover:text-primary transition-colors">
              {product.name_en || product.name_bn}
            </h3>
            
            <div className="flex items-center gap-3 mb-4 mt-auto">
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="text-xs font-black text-gray-700">4.9</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-gray-200"></div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Authentic</span>
            </div>
            
            <div className="flex items-end justify-between border-t border-gray-50 pt-3">
              <div>
                <span className="text-gray-900 font-black text-lg tracking-tight">৳{product.price}</span>
              </div>
              <Link to={`/shop`} className="w-8 h-8 rounded-full bg-[#FDF9F6] border border-orange-50 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
