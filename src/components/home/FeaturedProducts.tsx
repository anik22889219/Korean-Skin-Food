import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Star, Copy, ChevronRight } from 'lucide-react';
import { Product } from '../../types';

interface FeaturedProductsProps {
  products: Product[];
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products }) => {
  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Hot Selling Products</h2>
          </div>
          <p className="text-sm text-gray-500 font-medium">High margin products updated daily from global suppliers</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
            B2B Best Sellers
          </button>
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
            High Margin
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {products.slice(0, 10).map((product, idx) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            key={idx} 
            className="bg-white rounded-[1.25rem] p-4 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 group relative flex flex-col"
          >
            <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden relative mb-4">
              <img 
                src={product.images?.[0] || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80'} 
                alt={product.name_en || product.name_bn || 'Product image'}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              {/* Premium Badge */}
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-md flex items-center gap-1.5 px-2 py-1 shadow-sm border border-white/50">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                <span className="text-[9px] font-black uppercase tracking-wider text-gray-800">AliExpress</span>
              </div>
              
              {/* Quick Action Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button className="bg-white text-gray-900 px-4 py-2 rounded-lg text-xs font-bold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl flex items-center gap-2 hover:bg-primary hover:text-white">
                  <Copy className="w-4 h-4" />
                  Add to Import List
                </button>
              </div>
            </div>
            
            <h3 className="text-sm font-bold text-gray-800 line-clamp-2 mb-3 leading-tight min-h-[40px] group-hover:text-primary transition-colors">
              {product.name_en || product.name_bn}
            </h3>
            
            <div className="flex items-center justify-between mb-4 mt-auto border-b border-gray-50 pb-3">
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="text-xs font-bold text-gray-700">4.9</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                <span className="text-xs font-medium text-gray-500">{Math.floor(Math.random() * 5000) + 500} Sold</span>
              </div>
            </div>
            
            <div className="flex items-end justify-between">
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-0.5">Sourcing Cost</span>
                <span className="text-gray-900 font-black text-xl tracking-tight">৳{product.price}</span>
              </div>
              <button className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-900 hover:border-gray-900 hover:text-white transition-all shadow-sm active:scale-95">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
