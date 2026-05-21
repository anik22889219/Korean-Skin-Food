import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { socialService, SocialResponse } from '../services/socialService';
import { Product } from '../types';
import { Instagram, Facebook, Share2, Copy, Check, Loader2, Sparkles, Send, Clock, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdminSocial: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SocialResponse | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [goal, setGoal] = useState<'awareness' | 'sale' | 'engagement'>('awareness');

  useEffect(() => {
    api.getProducts().then(setProducts).catch(console.error);
  }, []);

  const handleGenerate = async () => {
    if (!selectedProduct) return;
    setLoading(true);
    setResult(null);
    try {
      const imageDesc = `A high quality shot of ${selectedProduct.name_en}. Key properties: ${selectedProduct.description_en}. Categorized as ${selectedProduct.category}.`;
      const data = await socialService.generateSocialContent(selectedProduct.name_en, imageDesc, goal);
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
          <h1 className="text-4xl font-black tracking-tighter text-gray-900 uppercase italic">AI Content Creator</h1>
          <p className="text-xs font-black text-gray-500 uppercase tracking-widest mt-2">Generate viral captions, hashtags, and story ideas for Facebook & Instagram.</p>
        </div>
        <div className="inline-flex items-center gap-3 bg-white border border-pink-100 text-pink-500 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-[0_5px_15px_rgba(236,72,153,0.1)]">
          <Share2 className="w-4 h-4" />
          Social Media Studio
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar: Product & Settings */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[3rem] border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] space-y-8 h-full">
            <div>
              <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-6">1. Campaign Goal</h3>
              <div className="grid grid-cols-1 gap-3">
                {(['awareness', 'sale', 'engagement'] as const).map(g => (
                  <button
                    key={g}
                    onClick={() => setGoal(g)}
                    className={`px-6 py-4 rounded-full font-black text-[10px] uppercase tracking-widest transition-all border ${
                      goal === g ? 'bg-gray-900 text-white border-gray-900 shadow-[0_10px_30px_rgba(0,0,0,0.1)] scale-[1.02]' : 'bg-[#FDF9F6] text-gray-400 border-orange-50 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-6">2. Select Product</h3>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                {products.map((p, idx) => (
                  <button
                    key={`${p.product_id}-${idx}`}
                    onClick={() => { setSelectedProduct(p); setResult(null); }}
                    className={`w-full text-left p-6 rounded-[2rem] transition-all border ${
                      selectedProduct?.product_id === p.product_id 
                        ? 'bg-pink-50 border-pink-200 text-pink-700 shadow-[0_10px_30px_rgba(252,165,165,0.2)] scale-[1.02]' 
                        : 'bg-[#FDF9F6] border-orange-50 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <p className="font-bold text-sm tracking-tight italic line-clamp-1">{p.name_en}</p>
                  </button>
                ))}
              </div>
            </div>

            {selectedProduct && (
              <button 
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-pink-600 text-white py-6 rounded-full font-black text-xs uppercase tracking-widest shadow-[0_10px_30px_rgba(219,39,119,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 mt-4 border border-pink-500"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                {loading ? 'Thinking...' : 'Magic Generate'}
              </button>
            )}
          </div>
        </div>

        {/* Main Feed Preview Area */}
        <div className="lg:col-span-2 space-y-8">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full min-h-[600px] border-4 border-dashed border-gray-100 rounded-[3rem] flex flex-col items-center justify-center text-gray-300 gap-6 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.03)]"
              >
                <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center">
                   <Instagram className="w-10 h-10 text-gray-300" />
                </div>
                <p className="font-black text-xl uppercase tracking-widest italic">Ready for your next post</p>
              </motion.div>
            ) : (
              <motion.div 
                key="result"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Facebook Preview */}
                <div className="bg-white rounded-[3rem] border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden">
                  <div className="bg-[#1877F2]/5 p-8 border-b border-[#1877F2]/10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-[1rem] bg-white flex items-center justify-center shadow-sm">
                          <Facebook className="text-[#1877F2] w-6 h-6" />
                       </div>
                       <span className="font-black text-[#1877F2] uppercase tracking-widest text-xs">Facebook Post</span>
                    </div>
                    <button onClick={() => copyToClipboard(result.facebook_caption, 'fb')} className="hover:bg-white p-3 rounded-full transition-colors bg-white/50 text-[#1877F2]">
                       {copiedField === 'fb' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                  <div className="p-10">
                    <p className="text-gray-800 font-medium whitespace-pre-wrap leading-relaxed">
                      {result.facebook_caption}
                    </p>
                  </div>
                </div>

                {/* Instagram Preview */}
                <div className="bg-white rounded-[3rem] border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden">
                  <div className="bg-pink-50 p-8 border-b border-pink-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-[1rem] bg-white flex items-center justify-center shadow-sm">
                          <Instagram className="text-pink-600 w-6 h-6" />
                       </div>
                       <span className="font-black text-pink-600 uppercase tracking-widest text-xs">Instagram Caption</span>
                    </div>
                    <button onClick={() => copyToClipboard(result.instagram_caption, 'ig')} className="hover:bg-white p-3 rounded-full transition-colors bg-white/50 text-pink-600">
                       {copiedField === 'ig' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                  <div className="p-10 space-y-8">
                    <p className="text-gray-800 font-medium whitespace-pre-wrap leading-relaxed italic">
                      {result.instagram_caption}
                    </p>
                    <div className="pt-8 border-t border-gray-50 flex flex-wrap gap-3">
                      <div className="w-full flex items-center gap-2 mb-2">
                         <Hash className="w-4 h-4 text-gray-300" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Hashtags</span>
                      </div>
                      {result.hashtags.map((tag, i) => (
                        <span key={i} className="bg-[#FDF9F6] border border-orange-50 px-4 py-2 rounded-full text-pink-600 font-bold text-xs">#{tag.replace('#', '')}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Bits */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="bg-gray-900 text-white p-10 rounded-[3rem] space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.15)] relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-pink-600/20 blur-[60px] -mr-24 -mt-24 rounded-full group-hover:bg-pink-600/30 transition-all duration-700 pointer-events-none" />
                      <div className="relative z-10 space-y-6">
                         <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                              <Send className="w-5 h-5 text-pink-500" />
                           </div>
                           <h4 className="font-black uppercase tracking-widest text-xs text-gray-400">Story Text</h4>
                         </div>
                         <p className="text-2xl font-black tracking-tighter italic">{result.story_text}</p>
                         <button onClick={() => copyToClipboard(result.story_text, 'story')} className="flex items-center gap-3 text-[10px] uppercase tracking-widest font-black text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-5 py-3 rounded-full w-fit">
                           {copiedField === 'story' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                           Copy Story Text
                         </button>
                      </div>
                   </div>
                   <div className="bg-[#FDF9F6] border border-orange-50 p-10 rounded-[3rem] space-y-6 shadow-[0_5px_15px_rgba(0,0,0,0.02)]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-orange-100 shadow-sm">
                           <Clock className="w-5 h-5 text-pink-500" />
                        </div>
                        <h4 className="font-black uppercase tracking-widest text-xs text-pink-500">Posting Strategy</h4>
                      </div>
                      <p className="text-3xl font-black text-gray-900 tracking-tighter italic">{result.best_time}</p>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AdminSocial;
