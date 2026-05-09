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
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 space-y-12 bg-[#fafafa] min-h-screen">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest">
          <Share2 className="w-4 h-4" />
          Social Media Studio
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter">AI Content <span className="text-primary italic">Creator</span></h1>
        <p className="text-gray-500 font-medium max-w-2xl mx-auto">Generate viral captions, hashtags, and story ideas for Facebook & Instagram.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Sidebar: Product & Settings */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 space-y-8">
            <div>
              <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-4">1. Campaign Goal</h3>
              <div className="grid grid-cols-1 gap-2">
                {(['awareness', 'sale', 'engagement'] as const).map(g => (
                  <button
                    key={g}
                    onClick={() => setGoal(g)}
                    className={`px-4 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border ${
                      goal === g ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-4">2. Select Product</h3>
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                {products.map((p, idx) => (
                  <button
                    key={`${p.product_id}-${idx}`}
                    onClick={() => { setSelectedProduct(p); setResult(null); }}
                    className={`w-full text-left p-4 rounded-2xl transition-all border ${
                      selectedProduct?.product_id === p.product_id 
                        ? 'bg-pink-50 border-pink-200 text-pink-700 shadow-lg shadow-pink-100' 
                        : 'bg-gray-50 border-transparent text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <p className="font-bold line-clamp-1">{p.name_en}</p>
                  </button>
                ))}
              </div>
            </div>

            {selectedProduct && (
              <button 
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-lg shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
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
                className="h-[600px] border-4 border-dashed border-gray-100 rounded-[3.5rem] flex flex-col items-center justify-center text-gray-200 gap-4"
              >
                <Instagram className="w-24 h-24" />
                <p className="font-black text-xl uppercase tracking-[0.3em]">Ready for your next post</p>
              </motion.div>
            ) : (
              <motion.div 
                key="result"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Facebook Preview */}
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden">
                  <div className="bg-[#1877F2]/5 p-6 border-b border-[#1877F2]/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <Facebook className="text-[#1877F2]" />
                       <span className="font-black text-[#1877F2] uppercase tracking-widest text-xs">Facebook Post</span>
                    </div>
                    <button onClick={() => copyToClipboard(result.facebook_caption, 'fb')} className="hover:bg-white p-2 rounded-xl transition-colors">
                       {copiedField === 'fb' ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-gray-400" />}
                    </button>
                  </div>
                  <div className="p-8">
                    <p className="text-gray-800 font-medium whitespace-pre-wrap leading-relaxed">
                      {result.facebook_caption}
                    </p>
                  </div>
                </div>

                {/* Instagram Preview */}
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden">
                  <div className="bg-pink-50 p-6 border-b border-pink-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <Instagram className="text-pink-600" />
                       <span className="font-black text-pink-600 uppercase tracking-widest text-xs">Instagram Caption</span>
                    </div>
                    <button onClick={() => copyToClipboard(result.instagram_caption, 'ig')} className="hover:bg-white p-2 rounded-xl transition-colors">
                       {copiedField === 'ig' ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-gray-400" />}
                    </button>
                  </div>
                  <div className="p-8 space-y-6">
                    <p className="text-gray-800 font-medium whitespace-pre-wrap leading-relaxed italic">
                      {result.instagram_caption}
                    </p>
                    <div className="pt-6 border-t border-gray-50 flex flex-wrap gap-2">
                      <Hash className="w-4 h-4 text-gray-300" />
                      {result.hashtags.map((tag, i) => (
                        <span key={i} className="text-primary font-bold text-sm">#{tag.replace('#', '')}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Bits */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="bg-gray-900 text-white p-8 rounded-[3rem] space-y-4">
                      <div className="flex items-center gap-2">
                        <Send className="w-5 h-5 text-primary" />
                        <h4 className="font-black uppercase tracking-widest text-xs text-gray-400">Story Text</h4>
                      </div>
                      <p className="text-2xl font-black tracking-tight">{result.story_text}</p>
                      <button onClick={() => copyToClipboard(result.story_text, 'story')} className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-white transition-colors">
                        {copiedField === 'story' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        Copy Story Text
                      </button>
                   </div>
                   <div className="bg-primary/10 border border-primary/20 p-8 rounded-[3rem] space-y-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" />
                        <h4 className="font-black uppercase tracking-widest text-xs text-primary/60">Posting Strategy</h4>
                      </div>
                      <p className="text-xl font-black text-gray-900">{result.best_time}</p>
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
