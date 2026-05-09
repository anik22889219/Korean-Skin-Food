import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Product } from '../types';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ChevronLeft
} from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';

const AdminInventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name_en: '',
    name_bn: '',
    category: '',
    price: 0,
    stock: 0,
    images: [''],
    description_en: '',
    description_bn: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.deleteProduct(id);
        setProducts(products.filter(p => p.product_id !== id));
      } catch (err) {
        alert('Delete failed');
      }
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.addProduct({
        ...newProduct,
        product_id: 'PRD' + Math.floor(Math.random() * 1000000)
      });
      setIsAdding(false);
      fetchProducts();
    } catch (err) {
      alert('Add failed');
    }
  };

  const filteredProducts = products.filter(p => 
    p.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-gray-900 uppercase italic">Inventory Vault</h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Manage global product catalog and parameters</p>
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-gray-200"
          >
            <Plus className="w-4 h-4" />
            Add New Asset
          </button>
        </div>

        {/* Global Toolbar */}
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
           <div className="relative flex-1">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
             <input 
               type="text" 
               placeholder="Filter by name, category or SKU..."
               className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-primary/10"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
             />
           </div>
           <div className="flex items-center gap-2">
             <button className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
               <Filter className="w-4 h-4 text-gray-400" />
             </button>
             <button onClick={fetchProducts} className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
               <RotateCcw className="w-4 h-4 text-gray-400" />
             </button>
           </div>
        </div>

        {/* Inventory List */}
        <div className="bg-white rounded-[2.5rem] border border-gray-50 shadow-xl shadow-gray-100/50 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
               <tr>
                 <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Asset Details</th>
                 <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Pricing</th>
                 <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Stock Level</th>
                 <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                 <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
               {filteredProducts.map((product, idx) => (
                 <tr key={`${product.product_id}-${idx}`} className="group hover:bg-gray-50/50 transition-colors">
                   <td className="px-8 py-6">
                      <div className="flex items-center gap-5">
                         <div className="w-16 h-16 rounded-[1.5rem] bg-gray-100 overflow-hidden relative border border-gray-100 shadow-sm">
                            <img src={product.images[0]} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                         </div>
                         <div>
                            <h6 className="text-sm font-black text-gray-900 tracking-tighter italic uppercase">{product.name_en}</h6>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{product.category}</p>
                            <p className="text-[8px] font-black text-primary/50 font-mono mt-1">{product.product_id}</p>
                         </div>
                      </div>
                   </td>
                   <td className="px-8 py-6">
                      <p className="text-sm font-black text-gray-900 italic tracking-tighter">৳{product.price.toLocaleString()}</p>
                   </td>
                   <td className="px-8 py-6">
                      <div className="flex flex-col gap-2">
                         <div className="flex items-center justify-between w-24">
                            <span className={`text-[10px] font-black ${product.stock < 10 ? 'text-red-500' : 'text-gray-900'}`}>{product.stock} Units</span>
                         </div>
                         <div className="w-24 h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-500 ${product.stock <= 0 ? 'bg-red-500' : product.stock < 10 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                              style={{ width: `${Math.min(100, (product.stock / 50) * 100)}%` }}
                            />
                         </div>
                      </div>
                   </td>
                   <td className="px-8 py-6">
                      {product.stock <= 0 ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-600 rounded-full text-[8px] font-black uppercase tracking-widest">
                           <XCircle className="w-2.5 h-2.5" />
                           Out of Stock
                        </div>
                      ) : product.stock < 10 ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-600 rounded-full text-[8px] font-black uppercase tracking-widest">
                           <AlertTriangle className="w-2.5 h-2.5" />
                           Low Stock
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-[8px] font-black uppercase tracking-widest">
                           <CheckCircle2 className="w-2.5 h-2.5" />
                           Optimal
                        </div>
                      )}
                   </td>
                   <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                           <Edit2 className="w-4 h-4 text-gray-400 hover:text-gray-900" />
                         </button>
                         <button 
                            onClick={() => handleDelete(product.product_id!)}
                            className="p-2 hover:bg-red-50 rounded-xl transition-colors"
                         >
                           <Trash2 className="w-4 h-4 text-red-300 hover:text-red-500" />
                         </button>
                      </div>
                   </td>
                 </tr>
               ))}
            </tbody>
          </table>
        </div>

        {/* Add Product Modal */}
        <AnimatePresence>
          {isAdding && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsAdding(false)}
                className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden relative shadow-2xl"
              >
                <div className="p-10">
                   <div className="flex items-center justify-between mb-8">
                      <h3 className="text-2xl font-black tracking-tighter uppercase italic">Register New Product</h3>
                      <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                         <Trash2 className="w-5 h-5 text-gray-400" />
                      </button>
                   </div>

                   <form onSubmit={handleAdd} className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Name (EN)</label>
                            <input 
                              type="text" 
                              required
                              className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-primary/10 transition-all"
                              value={newProduct.name_en}
                              onChange={(e) => setNewProduct({ ...newProduct, name_en: e.target.value })}
                            />
                         </div>
                         <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</label>
                            <input 
                              type="text" 
                              required
                              className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-primary/10 transition-all"
                              value={newProduct.category}
                              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                            />
                         </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pricing (৳)</label>
                            <input 
                              type="number" 
                              required
                              className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-primary/10 transition-all"
                              value={newProduct.price}
                              onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                            />
                         </div>
                         <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Stock Level</label>
                            <input 
                              type="number" 
                              required
                              className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-primary/10 transition-all"
                              value={newProduct.stock}
                              onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                            />
                         </div>
                      </div>

                      <div className="space-y-1">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Image URL</label>
                         <input 
                           type="url" 
                           required
                           className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-primary/10 transition-all"
                           value={newProduct.images?.[0]}
                           onChange={(e) => setNewProduct({ ...newProduct, images: [e.target.value] })}
                         />
                      </div>

                      <button 
                        type="submit"
                        className="w-full py-5 bg-gray-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-gray-200"
                      >
                        Push to Catalog
                      </button>
                   </form>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
};

export default AdminInventory;
