import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { seoService, SEOResponse } from '../services/seoService';
import { Product } from '../types';
import { Sparkles, Copy, Check, Loader2, Search, FileJson } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdminSEO: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SEOResponse | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    api.getProducts().then(setProducts).catch(console.error);
  }, []);

  const handleGenerate = async () => {
    if (!selectedProduct) return;
    setLoading(true);
    setResult(null);
    try {
      const details = `Description: ${selectedProduct.description_en}. Ingredients: ${selectedProduct.ingredients}. Skin Type: ${selectedProduct.skin_type}. Category: ${selectedProduct.category}`;
      const data = await seoService.generateSEO(selectedProduct.name_en, details);
      setResult(data);
    } catch (error) {
      alert("AI Generation failed. Check your API key.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-12 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-gray-900 uppercase italic">AI SEO Optimizer</h1>
          <p className="text-xs font-black text-gray-500 uppercase tracking-widest mt-2">Generate high-converting product descriptions, meta tags, and schema markup using Gemini AI.</p>
        </div>
        <div className="inline-flex items-center gap-3 bg-white border border-pink-100 text-pink-500 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-[0_5px_15px_rgba(236,72,153,0.1)]">
          <Sparkles className="w-4 h-4" />
          AI Copywriter Tool Active
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar: Product List */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[3rem] border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] h-full">
            <h3 className="font-black text-[10px] uppercase tracking-widest text-gray-400 mb-6">Select Product</h3>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-hide">
              {products.map((p, idx) => (
                <button
                  key={`${p.product_id}-${idx}`}
                  onClick={() => { setSelectedProduct(p); setResult(null); }}
                  className={`w-full text-left p-6 rounded-[2rem] transition-all border ${
                    selectedProduct?.product_id === p.product_id 
                      ? 'bg-gray-900 border-gray-900 text-white shadow-lg shadow-gray-900/20 scale-[1.02]' 
                      : 'bg-[#FDF9F6] border-orange-50 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${selectedProduct?.product_id === p.product_id ? 'text-gray-400' : 'text-gray-500'}`}>{p.category}</p>
                  <p className="font-bold text-sm italic tracking-tighter line-clamp-1">{p.name_en}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Workspace */}
        <div className="lg:col-span-2 space-y-8">
          <AnimatePresence mode="wait">
            {!selectedProduct ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full min-h-[400px] border-4 border-dashed border-gray-100 rounded-[3rem] flex flex-col items-center justify-center text-gray-300 gap-6 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.03)]"
              >
                <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center">
                   <Search className="w-10 h-10 text-gray-300" />
                </div>
                <p className="font-black text-xl uppercase italic tracking-widest">Select a product to begin</p>
              </motion.div>
            ) : (
              <motion.div 
                key="workspace"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="bg-gray-900 text-white p-10 md:p-12 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] relative overflow-hidden group">
                  <div className="relative z-10 space-y-8">
                     <div className="flex items-center gap-6">
                       <img src={selectedProduct.images[0]} className="w-24 h-24 rounded-[1.5rem] object-cover border border-white/20 shadow-xl" alt="" />
                       <div>
                         <h2 className="text-3xl font-black tracking-tighter italic">{selectedProduct.name_en}</h2>
                         <p className="text-pink-500 font-black uppercase tracking-widest text-[10px] mt-2">{selectedProduct.category}</p>
                       </div>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-6">
                       <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 backdrop-blur-sm">
                          <p className="text-[10px] uppercase font-black text-gray-400 mb-1">Target Skin Type</p>
                          <p className="font-bold text-sm tracking-tight">{selectedProduct.skin_type}</p>
                       </div>
                       <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 backdrop-blur-sm">
                          <p className="text-[10px] uppercase font-black text-gray-400 mb-1">Price Points</p>
                          <p className="font-bold text-sm tracking-tight">৳{selectedProduct.price}</p>
                       </div>
                     </div>

                     <button 
                       onClick={handleGenerate}
                       disabled={loading}
                       className="w-full bg-pink-600 text-white py-6 rounded-full font-black text-xs tracking-widest uppercase shadow-[0_10px_30px_rgba(219,39,119,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 mt-4 border border-pink-500"
                     >
                       {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                       {loading ? 'Synthesizing Content...' : 'Generate AI SEO Content'}
                     </button>
                  </div>
                  {/* Decor */}
                  <div className="absolute top-0 right-0 w-96 h-96 bg-pink-600/20 blur-[100px] -mr-32 -mt-32 rounded-full group-hover:bg-pink-600/30 transition-all duration-700 pointer-events-none" />
                </div>

                {/* Results Section */}
                <AnimatePresence>
                  {result && (
                    <motion.div 
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-8"
                    >
                      {/* SEO Title Card */}
                      <div className="bg-white p-10 rounded-[3rem] border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] space-y-6">
                         <div className="flex justify-between items-center">
                           <h4 className="font-black text-[10px] uppercase tracking-widest text-gray-400">SEO Meta Title</h4>
                           <button onClick={() => copyToClipboard(result.seo_title, 'title')} className="text-gray-400 hover:text-gray-900 bg-[#FDF9F6] hover:bg-gray-100 p-3 rounded-full transition-colors">
                             {copiedField === 'title' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                           </button>
                         </div>
                         <p className="text-2xl font-black text-gray-900 leading-snug tracking-tighter italic">{result.seo_title}</p>
                      </div>

                      {/* Meta Description Card */}
                      <div className="bg-white p-10 rounded-[3rem] border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] space-y-6">
                         <div className="flex justify-between items-center">
                           <h4 className="font-black text-[10px] uppercase tracking-widest text-gray-400">Meta Description</h4>
                           <button onClick={() => copyToClipboard(result.meta_description, 'meta')} className="text-gray-400 hover:text-gray-900 bg-[#FDF9F6] hover:bg-gray-100 p-3 rounded-full transition-colors">
                             {copiedField === 'meta' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                           </button>
                         </div>
                         <p className="text-gray-600 font-medium leading-relaxed">{result.meta_description}</p>
                      </div>

                      {/* Product Description Card */}
                      <div className="bg-white p-10 rounded-[3rem] border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] space-y-6">
                         <div className="flex justify-between items-center">
                           <h4 className="font-black text-[10px] uppercase tracking-widest text-gray-400">AI Product Narrative</h4>
                           <button onClick={() => copyToClipboard(result.product_description, 'desc')} className="text-gray-400 hover:text-gray-900 bg-[#FDF9F6] hover:bg-gray-100 p-3 rounded-full transition-colors">
                             {copiedField === 'desc' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                           </button>
                         </div>
                         <div className="prose prose-sm max-w-none text-gray-600 font-medium leading-loose space-y-4">
                           {result.product_description}
                         </div>
                      </div>

                      {/* Keywords & Schema */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="bg-[#FDF9F6] p-10 rounded-[3rem] border border-orange-50 shadow-[0_5px_15px_rgba(0,0,0,0.02)] space-y-8">
                            <h4 className="font-black text-[10px] uppercase tracking-widest text-gray-400">SEO Keywords</h4>
                            <div className="flex flex-wrap gap-3">
                               {result.keywords.map((kw, i) => (
                                 <span key={i} className="bg-white px-5 py-3 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-700 shadow-sm border border-gray-100">
                                   {kw}
                                 </span>
                               ))}
                            </div>
                         </div>
                         <div className="bg-[#FDF9F6] p-10 rounded-[3rem] border border-orange-50 shadow-[0_5px_15px_rgba(0,0,0,0.02)] space-y-6">
                            <div className="flex justify-between items-center">
                              <h4 className="font-black text-[10px] uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                <FileJson className="w-4 h-4" /> JSON-LD Schema
                              </h4>
                              <button onClick={() => copyToClipboard(JSON.stringify(result.schema_markup, null, 2), 'schema')} className="text-gray-400 hover:text-gray-900 bg-white hover:bg-gray-50 shadow-sm border border-gray-100 p-3 rounded-full transition-colors">
                                {copiedField === 'schema' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                              </button>
                            </div>
                            <pre className="text-[10px] bg-gray-900 text-emerald-400 p-6 rounded-[2rem] overflow-x-auto font-mono max-h-48 shadow-inner">
                               {JSON.stringify(result.schema_markup, null, 2)}
                            </pre>
                         </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AdminSEO;
