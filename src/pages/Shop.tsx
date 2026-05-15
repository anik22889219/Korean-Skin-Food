import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../services/api';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { SkeletonCard } from '../components/SkeletonCard';
import { useLanguage } from '../context/LanguageContext';
import { Search, Filter, SlidersHorizontal, ChevronDown, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useQuery } from '@tanstack/react-query';

export const Shop: React.FC<{ isOffersOnly?: boolean }> = ({ isOffersOnly = false }) => {
  const { t } = useLanguage();
  const [filters, setFilters] = useState({
    category: 'All',
    skin_type: 'All',
    search: ''
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const location = useLocation();

  const { data: products = [], isLoading: loading } = useQuery({
    queryKey: ['products'],
    queryFn: () => api.getProducts(),
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search') || '';
    const category = params.get('category') || 'All';
    setFilters(prev => ({ ...prev, search, category }));
  }, [location]);

  const filtered = products.filter(p => {
    if (isOffersOnly && !p.discount_price) return false;
    
    const matchesSearch = p.name_en.toLowerCase().includes(filters.search.toLowerCase()) || 
                          p.name_bn.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCategory = filters.category === 'All' || p.category === filters.category;
    const matchesSkin = filters.skin_type === 'All' || p.skin_type.includes(filters.skin_type);
    return matchesSearch && matchesCategory && matchesSkin;
  });

  const categories = Array.from(new Set(['All', ...products.map(p => p.category)]));
  const skinTypes = ['All', 'Dry', 'Oily', 'Sensitive', 'Normal', 'Combination'];

  return (
    <div className="bg-[#FDF9F6] min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 space-y-12">
        {/* Header with Ghost Text */}
        <div className="relative text-center py-12 md:py-20 overflow-hidden rounded-[3rem] bg-white border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-50/50 via-white to-orange-50/50"></div>
          <h2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-7xl md:text-[14rem] font-black text-gray-50 select-none pointer-events-none uppercase tracking-tighter opacity-60 italic">
            K-BEAUTY
          </h2>
          <div className="relative z-10 flex flex-col items-center space-y-6">
            <span className="inline-flex items-center gap-2 px-6 py-2 bg-white border border-orange-50 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-[10px] font-black uppercase tracking-widest text-gray-500">
              <Sparkles className="w-4 h-4 text-primary" />
              Your Skincare Journey
            </span>
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-gray-900 uppercase italic">
              {t('shop')} <span className="text-primary">All</span>
            </h1>
            <p className="text-gray-400 font-bold tracking-[0.2em] uppercase text-xs">{filtered.length} Curated Items</p>
          </div>
        </div>

        {/* Premium Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between sticky top-[80px] z-40 bg-white/80 backdrop-blur-2xl p-4 rounded-full border border-white shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
          <div className="relative w-full md:flex-1 max-w-md">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search your ritual..."
              className="w-full pl-14 pr-6 py-4 bg-[#FDF9F6] rounded-full border border-transparent focus:border-orange-100 outline-none focus:ring-4 focus:ring-primary/5 text-sm font-semibold placeholder:text-gray-400 transition-all shadow-inner"
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center justify-center gap-3 w-full md:w-auto px-10 py-4 bg-gray-900 text-white rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filter
            </button>
            
            <div className="hidden md:flex bg-[#FDF9F6] p-1.5 rounded-full gap-2 border border-orange-50 shadow-inner">
              {categories.slice(0, 3).map(c => (
                <button
                  key={c}
                  onClick={() => setFilters({...filters, category: c})}
                  className={`px-8 py-3 rounded-full text-[10px] font-black transition-all uppercase tracking-widest ${
                    filters.category === c ? 'bg-white text-gray-900 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100' : 'text-gray-400 hover:text-gray-900 hover:bg-orange-50/50'
                  }`}
                >
                  {c === 'All' ? 'All' : c}
                </button>
              ))}
            </div>
            
            <div className="relative md:hidden flex-1">
               <select 
                className="w-full appearance-none bg-[#FDF9F6] px-6 py-4 rounded-full font-bold text-xs uppercase tracking-widest outline-none border border-orange-50 focus:border-orange-200 shadow-inner"
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
              >
                {categories.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
              </select>
               <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Active Filters Drawer */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white p-10 rounded-[3rem] border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <h4 className="font-black text-xs uppercase tracking-widest text-gray-900 mb-6 flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Skin Type
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {skinTypes.map(s => (
                      <button 
                        key={s}
                        onClick={() => setFilters({...filters, skin_type: s})}
                        className={`px-6 py-3 rounded-full text-[10px] font-black tracking-widest uppercase transition-all ${
                          filters.skin_type === s ? 'bg-gray-900 text-white shadow-[0_10px_20px_rgba(0,0,0,0.1)]' : 'bg-[#FDF9F6] text-gray-500 hover:text-gray-900 hover:bg-orange-50 border border-transparent hover:border-orange-100'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 md:gap-10">
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 md:gap-10">
            {filtered.map((p, idx) => <ProductCard key={`${p.product_id}-${idx}`} product={p} />)}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-[3rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-white space-y-6">
            <div className="w-24 h-24 bg-[#FDF9F6] rounded-[2rem] flex items-center justify-center mx-auto text-primary shadow-sm border border-orange-50">
              <Search className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter">No products found</h3>
            <p className="text-gray-400 font-bold tracking-widest uppercase text-[10px] max-w-[250px] mx-auto leading-relaxed">
              Try adjusting your search terms or exploring a different category to discover your perfect ritual.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
