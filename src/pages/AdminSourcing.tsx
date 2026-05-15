import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, 
  Search, 
  Filter, 
  Plus, 
  Check, 
  Star, 
  Info,
  ArrowLeft,
  Loader2,
  TrendingUp,
  Package
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

const AdminSourcing: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [importingId, setImportingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    const fetchSourced = async () => {
      try {
        const data = await api.getSourcedProducts();
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch sourced products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSourced();
  }, []);

  const handleImport = async (product: any) => {
    setImportingId(product.id);
    try {
      await api.importProduct(product);
      showToast(`${product.name} imported successfully!`, 'success');
      // Update local state to show as imported
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, imported: true } : p));
    } catch (err) {
      showToast('Failed to import product. Please try again.', 'error');
    } finally {
      setImportingId(null);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === 'All' || p.category === category;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', ...new Set(products.map(p => p.category))];

  if (loading) return <div className="flex items-center justify-center h-screen bg-white font-black uppercase text-xs tracking-widest italic animate-pulse">Scanning Korean Marketplaces...</div>;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/admin/dropshipping')}
            className="w-14 h-14 bg-white rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm hover:scale-[1.02] active:scale-[0.98]"
          >
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-gray-900 uppercase italic">Sourcing Marketplace</h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Direct from Seoul: Premium Skincare Suppliers</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="px-6 py-4 bg-white rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-white flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">42 New Items Found This Week</span>
           </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-8 rounded-[3rem] border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] flex flex-col lg:flex-row gap-6">
        <div className="flex-1 relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by brand or product name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-16 pr-6 py-5 bg-[#FDF9F6] rounded-full text-xs font-black uppercase tracking-widest focus:outline-none border border-orange-50 focus:border-gray-300 transition-all"
          />
        </div>
        
        <div className="flex items-center gap-4 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
          <div className="p-4 bg-[#FDF9F6] rounded-full text-gray-400 border border-orange-50">
            <Filter className="w-5 h-5" />
          </div>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                category === cat 
                ? 'bg-gray-900 text-white border-gray-900 shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:scale-[1.02]' 
                : 'bg-white border-gray-100 text-gray-400 hover:border-gray-300 hover:text-gray-900 hover:bg-[#FDF9F6]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product, idx) => (
            <motion.div 
              key={product.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-[3rem] border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden group hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all flex flex-col h-full"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[#FDF9F6]">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-6 left-6">
                   <div className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-full flex items-center gap-2 shadow-sm border border-white/50">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span className="text-[10px] font-black text-gray-900 tracking-tighter">{product.rating}</span>
                   </div>
                </div>
                {product.imported && (
                  <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-sm flex items-center justify-center">
                     <div className="bg-white px-8 py-4 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.1)] flex items-center gap-3 border border-emerald-100">
                        <Check className="w-5 h-5 text-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Already In Store</span>
                     </div>
                  </div>
                )}
              </div>

              <div className="p-8 flex-1 flex flex-col">
                <div className="mb-6">
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">{product.brand}</p>
                  <h3 className="text-sm font-black text-gray-900 uppercase italic tracking-tighter line-clamp-2 leading-tight">
                    {product.name}
                  </h3>
                </div>

                <div className="mt-auto space-y-8">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-[#FDF9F6] rounded-[2rem] border border-orange-50">
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Supplier</p>
                      <p className="text-sm font-black text-gray-900 tracking-tighter italic">৳{product.supplier_price}</p>
                    </div>
                    <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100">
                      <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest mb-1">Profit</p>
                      <p className="text-sm font-black text-emerald-600 tracking-tighter italic">৳{product.suggested_retail - product.supplier_price}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {!product.imported ? (
                      <button 
                        onClick={() => handleImport(product)}
                        disabled={importingId === product.id}
                        className="flex-1 py-5 bg-gray-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-[0_10px_30px_rgba(0,0,0,0.1)]"
                      >
                        {importingId === product.id ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Importing...
                          </>
                        ) : (
                          <>
                            <Plus className="w-5 h-5" />
                            Import Product
                          </>
                        )}
                      </button>
                    ) : (
                      <button 
                        onClick={() => navigate('/admin/inventory')}
                        className="flex-1 py-5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-emerald-100 transition-colors shadow-[0_10px_30px_rgba(16,185,129,0.1)]"
                      >
                        <Package className="w-5 h-5" />
                        Manage In Store
                      </button>
                    )}
                    <button className="w-14 h-14 bg-[#FDF9F6] border border-orange-50 rounded-full flex shrink-0 items-center justify-center hover:bg-orange-100 transition-colors shadow-sm">
                      <Info className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredProducts.length === 0 && (
        <div className="py-32 text-center">
           <div className="w-24 h-24 bg-[#FDF9F6] border border-orange-50 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-300">
              <Search className="w-10 h-10" />
           </div>
           <h3 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter">No Products Found</h3>
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-3">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default AdminSourcing;
