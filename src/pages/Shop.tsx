import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../services/api';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { SkeletonCard } from '../components/SkeletonCard';
import { useLanguage } from '../context/LanguageContext';
import { Search, Filter, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Shop: React.FC = () => {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'All',
    skin_type: 'All',
    search: ''
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search') || '';
    const category = params.get('category') || 'All';
    setFilters(prev => ({ ...prev, search, category }));
  }, [location]);

  useEffect(() => {
    setLoading(true);
    api.getProducts().then(data => {
      setProducts(data);
      setLoading(false);
    }).catch(e => {
      console.error(e);
      setLoading(false);
    });
  }, []);

  const filtered = products.filter(p => {
    const matchesSearch = p.name_en.toLowerCase().includes(filters.search.toLowerCase()) || 
                          p.name_bn.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCategory = filters.category === 'All' || p.category === filters.category;
    const matchesSkin = filters.skin_type === 'All' || p.skin_type.includes(filters.skin_type);
    return matchesSearch && matchesCategory && matchesSkin;
  });

  const categories = Array.from(new Set(['All', ...products.map(p => p.category)]));
  const skinTypes = ['All', 'Dry', 'Oily', 'Sensitive', 'Normal', 'Combination'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 space-y-12">
      {/* Header with Ghost Text */}
      <div className="relative text-center py-10 overflow-hidden">
        <h2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl md:text-[12rem] font-black text-gray-50 select-none pointer-events-none uppercase tracking-tighter opacity-50">
          Shop
        </h2>
        <div className="relative z-10 space-y-2">
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-gray-900 uppercase">{t('shop')}</h1>
          <p className="text-gray-400 font-bold tracking-widest uppercase text-[10px]">{filtered.length} Results Found</p>
        </div>
      </div>

      {/* Redesigned Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between sticky top-[80px] z-40 bg-white/90 backdrop-blur-xl p-3 rounded-[2rem] border border-gray-100 shadow-2xl shadow-gray-200/50">
        <div className="relative w-full md:flex-1 max-w-md">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search skincare products..."
            className="w-full pl-14 pr-6 py-4 bg-gray-50/50 rounded-full border-none outline-none focus:ring-2 focus:ring-primary/10 text-sm font-semibold placeholder:text-gray-300"
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-3 px-8 py-4 bg-[#111111] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-gray-900/10 active:scale-95 transition-all hover:bg-black"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filter
          </button>
          
          <div className="hidden md:flex bg-gray-50 p-1 rounded-2xl gap-1">
            {categories.slice(0, 3).map(c => (
              <button
                key={c}
                onClick={() => setFilters({...filters, category: c})}
                className={`px-6 py-3 rounded-xl text-xs font-black transition-all uppercase tracking-widest ${
                  filters.category === c ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {c === 'All' ? 'All' : c}
              </button>
            ))}
          </div>
          
          <div className="relative md:hidden flex-1">
             <select 
              className="w-full appearance-none bg-gray-50 px-6 py-4 rounded-2xl font-bold text-xs uppercase outline-none"
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
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
            <div className="bg-gray-50 p-8 rounded-[2.5rem] grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h4 className="font-black text-xs uppercase tracking-widest text-gray-400 mb-4">Skin Type</h4>
                <div className="flex flex-wrap gap-2">
                  {skinTypes.map(s => (
                    <button 
                      key={s}
                      onClick={() => setFilters({...filters, skin_type: s})}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                        filters.skin_type === s ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 md:gap-8">
          {[...Array(8)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 md:gap-8">
          {filtered.map((p, idx) => <ProductCard key={`${p.product_id}-${idx}`} product={p} />)}
        </div>
      ) : (
        <div className="text-center py-20 space-y-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
            <Search className="w-10 h-10" />
          </div>
          <p className="text-gray-500 font-bold">No products found matching your results.</p>
        </div>
      )}
    </div>
  );
};
