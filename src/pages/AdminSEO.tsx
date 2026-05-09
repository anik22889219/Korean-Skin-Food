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
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 space-y-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest">
          <Sparkles className="w-4 h-4" />
          AI Copywriter Tool
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter">AI SEO <span className="text-primary italic">Optimizer</span></h1>
        <p className="text-gray-500 font-medium max-w-2xl mx-auto">Generate high-converting product descriptions, meta tags, and schema markup using Gemini AI.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Sidebar: Product List */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100">
            <h3 className="font-black text-xs uppercase tracking-widest text-gray-400 mb-6">Select Product</h3>
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 scrollbar-hide">
              {products.map((p, idx) => (
                <button
                  key={`${p.product_id}-${idx}`}
                  onClick={() => { setSelectedProduct(p); setResult(null); }}
                  className={`w-full text-left p-4 rounded-2xl transition-all border ${
                    selectedProduct?.product_id === p.product_id 
                      ? 'bg-primary/5 border-primary text-primary shadow-lg shadow-primary/5' 
                      : 'bg-gray-50 border-transparent text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <p className="text-xs font-black uppercase tracking-tight opacity-50">{p.category}</p>
                  <p className="font-bold line-clamp-1">{p.name_en}</p>
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
                className="h-[400px] border-4 border-dashed border-gray-100 rounded-[3rem] flex flex-col items-center justify-center text-gray-300 gap-4"
              >
                <Search className="w-20 h-20" />
                <p className="font-black text-xl uppercase tracking-[0.2em]">Select a product to begin</p>
              </motion.div>
            ) : (
              <motion.div 
                key="workspace"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="bg-gray-900 text-white p-8 md:p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
                  <div className="relative z-10 space-y-6">
                     <div className="flex items-center gap-4">
                       <img src={selectedProduct.images[0]} className="w-20 h-20 rounded-2xl object-cover border-4 border-white/10" alt="" />
                       <div>
                         <h2 className="text-2xl font-black tracking-tighter">{selectedProduct.name_en}</h2>
                         <p className="text-primary font-bold uppercase tracking-widest text-xs">{selectedProduct.category}</p>
                       </div>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-4">
                       <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                          <p className="text-[10px] uppercase font-black text-gray-400">Target Skin Type</p>
                          <p className="font-bold">{selectedProduct.skin_type}</p>
                       </div>
                       <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                          <p className="text-[10px] uppercase font-black text-gray-400">Price Points</p>
                          <p className="font-bold">৳{selectedProduct.price}</p>
                       </div>
                     </div>

                     <button 
                       onClick={handleGenerate}
                       disabled={loading}
                       className="w-full bg-primary text-white py-6 rounded-2xl font-black text-xl shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                     >
                       {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
                       {loading ? 'Optimizing Content...' : 'Generate AI SEO Content'}
                     </button>
                  </div>
                  {/* Decor */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] -mr-32 -mt-32 rounded-full" />
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
                      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl space-y-4">
                         <div className="flex justify-between items-center">
                           <h4 className="font-black text-xs uppercase tracking-widest text-gray-400">SEO Meta Title</h4>
                           <button onClick={() => copyToClipboard(result.seo_title, 'title')} className="text-primary hover:bg-primary/10 p-2 rounded-lg transition-colors">
                             {copiedField === 'title' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                           </button>
                         </div>
                         <p className="text-xl font-black text-gray-900 leading-snug">{result.seo_title}</p>
                      </div>

                      {/* Meta Description Card */}
                      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl space-y-4">
                         <div className="flex justify-between items-center">
                           <h4 className="font-black text-xs uppercase tracking-widest text-gray-400">Meta Description</h4>
                           <button onClick={() => copyToClipboard(result.meta_description, 'meta')} className="text-primary hover:bg-primary/10 p-2 rounded-lg transition-colors">
                             {copiedField === 'meta' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                           </button>
                         </div>
                         <p className="text-gray-600 font-medium leading-relaxed">{result.meta_description}</p>
                      </div>

                      {/* Product Description Card */}
                      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl space-y-6">
                         <div className="flex justify-between items-center">
                           <h4 className="font-black text-xs uppercase tracking-widest text-gray-400">AI Product Narrative</h4>
                           <button onClick={() => copyToClipboard(result.product_description, 'desc')} className="text-primary hover:bg-primary/10 p-2 rounded-lg transition-colors">
                             {copiedField === 'desc' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                           </button>
                         </div>
                         <div className="prose prose-sm max-w-none text-gray-600 font-medium leading-loose space-y-4">
                           {result.product_description}
                         </div>
                      </div>

                      {/* Keywords & Schema */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 space-y-6">
                            <h4 className="font-black text-xs uppercase tracking-widest text-gray-400">SEO Keywords</h4>
                            <div className="flex flex-wrap gap-2">
                               {result.keywords.map((kw, i) => (
                                 <span key={i} className="bg-white px-4 py-2 rounded-full text-xs font-bold text-gray-700 shadow-sm border border-gray-100">
                                   {kw}
                                 </span>
                               ))}
                            </div>
                         </div>
                         <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 space-y-4">
                            <div className="flex justify-between items-center">
                              <h4 className="font-black text-xs uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                <FileJson className="w-4 h-4" /> JSON-LD Schema
                              </h4>
                              <button onClick={() => copyToClipboard(JSON.stringify(result.schema_markup, null, 2), 'schema')} className="text-primary hover:bg-primary/10 p-2 rounded-lg transition-colors">
                                {copiedField === 'schema' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                              </button>
                            </div>
                            <pre className="text-[10px] bg-gray-900 text-green-400 p-4 rounded-2xl overflow-x-auto font-mono max-h-48">
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
