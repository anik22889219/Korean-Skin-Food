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
            className="w-12 h-12 bg-white rounded-2xl border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-gray-900 uppercase italic">Sourcing Marketplace</h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Direct from Seoul: Premium Skincare Suppliers</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="px-5 py-3 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">42 New Items Found This Week</span>
           </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-6">
        <div className="flex-1 relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by brand or product name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-3xl text-xs font-black uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all"
          />
        </div>
        
        <div className="flex items-center gap-3 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
          <div className="p-3 bg-gray-100 rounded-2xl text-gray-400">
            <Filter className="w-4 h-4" />
          </div>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                category === cat 
                ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20' 
                : 'bg-white border border-gray-100 text-gray-400 hover:border-gray-900 hover:text-gray-900'
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
              className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden group hover:shadow-2xl hover:shadow-primary/5 transition-all flex flex-col h-full"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-5 left-5">
                   <div className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full flex items-center gap-1.5 shadow-sm">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span className="text-[10px] font-black text-gray-900 tracking-tighter">{product.rating}</span>
                   </div>
                </div>
                {product.imported && (
                  <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-[2px] flex items-center justify-center">
                     <div className="bg-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3">
                        <Check className="w-5 h-5 text-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Already In Store</span>
                     </div>
                  </div>
                )}
              </div>

              <div className="p-8 flex-1 flex flex-col">
                <div className="mb-4">
                  <p className="text-[8px] font-black text-primary uppercase tracking-[0.2em] mb-1">{product.brand}</p>
                  <h3 className="text-sm font-black text-gray-900 uppercase italic tracking-tighter line-clamp-2 leading-tight">
                    {product.name}
                  </h3>
                </div>

                <div className="mt-auto space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100/50">
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Supplier</p>
                      <p className="text-xs font-black text-gray-900 tracking-tighter italic">৳{product.supplier_price}</p>
                    </div>
                    <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                      <p className="text-[8px] font-black text-primary uppercase tracking-widest mb-1">Profit</p>
                      <p className="text-xs font-black text-primary tracking-tighter italic">৳{product.suggested_retail - product.supplier_price}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {!product.imported ? (
                      <button 
                        onClick={() => handleImport(product)}
                        disabled={importingId === product.id}
                        className="flex-1 py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-black transition-colors disabled:opacity-50"
                      >
                        {importingId === product.id ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Importing...
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            Import Product
                          </>
                        )}
                      </button>
                    ) : (
                      <button 
                        onClick={() => navigate('/admin/inventory')}
                        className="flex-1 py-4 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-emerald-100 transition-colors"
                      >
                        <Package className="w-4 h-4" />
                        Manage In Store
                      </button>
                    )}
                    <button className="w-12 h-14 bg-white border border-gray-100 rounded-2xl flex items-center justify-center hover:bg-gray-50 transition-colors">
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
        <div className="py-24 text-center">
           <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200">
              <Search className="w-10 h-10" />
           </div>
           <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter">No Products Found</h3>
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default AdminSourcing;
