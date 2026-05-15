import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../services/api';
import { uploadImageToCloudinary, uploadBase64ToCloudinary } from '../services/cloudinary';
import { processProductImage } from '../services/imageProcessor';
import { Product } from '../types';
import {
  Plus, Search, Edit2, Trash2, AlertTriangle,
  RotateCcw, CheckCircle2, Sparkles,
  Camera, X, Loader2, Save, Bell, History, Tag, ImageIcon as Image
} from 'lucide-react';

import { BarcodeGenerator } from '../components/BarcodeGenerator';

// ── Gemini AI Research ────────────────────────────────────────────────────────
async function researchProduct(name: string): Promise<Partial<Product>> {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (!key) throw new Error('VITE_GEMINI_API_KEY not set');

  const prompt = `You are a K-beauty product expert. Research this product: "${name}"
Return ONLY valid JSON (no markdown) with these exact keys:
{
  "name_en": "English product name",
  "name_bn": "Bengali product name",
  "category": "one of: Serum|Toner|Moisturizer|Cleanser|Sunscreen|Mask|Eye Care|Lip Care|Other",
  "description_en": "2-3 sentence description",
  "description_bn": "Bengali description",
  "ingredients": "top 5 ingredients comma separated",
  "skin_type": "All|Dry|Oily|Combination|Sensitive",
  "tags": "3-5 relevant tags comma separated"
}`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    }
  );
  
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Gemini Error: ${res.status}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

// ── Component ─────────────────────────────────────────────────────────────────
const CATEGORIES = ['All', 'Serum', 'Toner', 'Moisturizer', 'Cleanser', 'Sunscreen', 'Mask', 'Eye Care', 'Lip Care', 'Other'];

const AdminInventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [printProduct, setPrintProduct] = useState<Product | null>(null);

  // Task 1.1 - Edit product state
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState('');

  // Task 1.6 - Stock log state
  const [showLogs, setShowLogs] = useState(false);
  const [stockLogs, setStockLogs] = useState<any[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);

  // AI Agent state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [step, setStep] = useState<'input' | 'processing' | 'review' | 'done'>('input');
  const [stepMsg, setStepMsg] = useState('');
  const [progress, setProgress] = useState(0);
  const [aiData, setAiData] = useState<Partial<Product>>({});
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const data = await api.getProducts();
    setProducts(data);
    setLoading(false);
  };

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setImageFile(f);
    setImagePreview(URL.createObjectURL(f));
  };

  const resetModal = () => {
    setImageFile(null); setImagePreview(null);
    setProductName(''); setPrice(''); setStock('');
    setStep('input'); setStepMsg(''); setProgress(0);
    setAiData({}); setError('');
    setShowModal(false);
  };

  const runAIAgent = async () => {
    if (!imageFile || !productName || !price || !stock) {
      setError('ছবি, নাম, মূল্য এবং স্টক দিন।');
      return;
    }
    setError('');
    setStep('processing');

    try {
      // Step 1: AI research (Name -> Info)
      setStepMsg('🤖 Gemini AI পণ্যের তথ্য সংগ্রহ করছে...'); setProgress(20);
      const ai = await researchProduct(productName);
      
      // Step 2: Image Processing (BG Removal + Canvas)
      setStepMsg('📸 ছবির ব্যাকগ্রাউন্ড পরিবর্তন করা হচ্ছে...'); setProgress(45);
      const processed = await processProductImage(imageFile, ai.ingredients || productName, (msg) => {
        setStepMsg(msg);
      });
      setImagePreview(processed.dataUrl);

      // Step 3: Upload processed image
      setStepMsg('☁️ প্রসেসড ছবি Cloudinary-তে আপলোড হচ্ছে...'); setProgress(75);
      const imageUrl = await uploadBase64ToCloudinary(processed.dataUrl, (p) => setProgress(75 + p * 0.2));

      // Step 4: Finalize
      setProgress(100);
      setStepMsg('✅ সব তথ্য প্রস্তুত, পর্যালোচনা করুন...');
      setAiData({ ...ai, images: [imageUrl], price: Number(price), stock: Number(stock) });
      setStep('review');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'একটি সমস্যা হয়েছে।');
      setStep('input');
    }
  };

  const handleSave = async () => {
    setStep('processing'); setStepMsg('💾 Google Sheet-এ সংরক্ষণ হচ্ছে...');
    try {
      const res = await api.addProduct({
        ...aiData,
        product_id: 'PRD' + Date.now(),
      });
      if (res.data && res.data.success === false) {
        throw new Error(res.data.error || 'Failed to add product');
      }
      setStep('done');
      fetchProducts();
    } catch (err: any) {
      setError(err.message || 'Save failed. Try again.');
      setStep('review');
    }
  };

  // Task 1.1 - Save edited product
  const handleEditSave = async () => {
    if (!editProduct) return;
    setEditSaving(true);
    setEditError('');
    try {
      await api.updateProduct(editProduct);
      setEditProduct(null);
      fetchProducts();
    } catch (err: any) {
      setEditError(err.message || 'Update failed');
    } finally {
      setEditSaving(false);
    }
  };

  // Task 1.6 - Load stock logs
  const fetchStockLogs = async () => {
    setLogsLoading(true);
    try {
      const res = await (await import('../services/api/client')).get({ action: 'getInventoryLogs' });
      setStockLogs(Array.isArray(res.data) ? res.data : []);
    } catch { setStockLogs([]); }
    setLogsLoading(false);
  };

  // Task 1.3 & 1.4 - Filter by search + category
  const filtered = products.filter(p => {
    const matchSearch =
      (p.name_en || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.category || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = categoryFilter === 'All' || (p.category || '') === categoryFilter;
    return matchSearch && matchCat;
  });

  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock < 10);
  const outOfStockProducts = products.filter(p => p.stock <= 0);

  return (
    <>
      <div className="space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-gray-900 uppercase italic">Inventory Vault</h1>
            <p className="text-xs font-black text-gray-500 uppercase tracking-widest mt-2">
              {products.length} Products · {lowStockProducts.length} Low Stock · {outOfStockProducts.length} Out of Stock
            </p>
          </div>
          <div className="flex gap-4 flex-wrap justify-end">
            {/* Task 3.7 - Facebook Shop product sync feed export */}
            <button
              onClick={() => {
                const header = 'id,title,description,availability,condition,price,link,image_link,brand\n';
                const rows = products.map(p => {
                  const desc = (p.description_en || p.name_en).replace(/"/g, '""');
                  const url = `https://koreanskinbd.com/product/${p.product_id}`;
                  return `"${p.product_id}","${p.name_en}","${desc}","${p.stock > 0 ? 'in stock' : 'out of stock'}","new","${p.price} BDT","${url}","${p.images[0]}","Korean Skin Food"`;
                }).join('\n');
                const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `fb_product_feed_${new Date().toISOString().split('T')[0]}.csv`;
                link.click();
              }}
              className="flex items-center gap-2 px-6 py-4 bg-white border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] text-blue-700 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-blue-50 transition-all hover:scale-[1.02] active:scale-95"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              FB Feed (CSV)
            </button>
            <button
              onClick={() => { setShowLogs(true); fetchStockLogs(); }}
              className="flex items-center gap-2 px-6 py-4 bg-white border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] text-gray-700 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all hover:scale-[1.02] active:scale-95"
            >
              <History className="w-4 h-4" /> Stock Logs
            </button>
            <button
              onClick={() => { setShowModal(true); setStep('input'); }}
              className="flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-pink-600 transition-all shadow-[0_10px_40px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_rgba(219,39,119,0.3)] hover:scale-[1.02] active:scale-95"
            >
              <Sparkles className="w-4 h-4" /> Add Product with AI
            </button>
          </div>
        </div>

        {/* Task 1.3 - Low Stock Alert Banner */}
        {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
          <div className="flex flex-col sm:flex-row gap-3">
            {outOfStockProducts.length > 0 && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-5 py-3 flex-1">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                </div>
                <div>
                  <p className="text-xs font-black text-red-700">{outOfStockProducts.length}টি পণ্যের স্টক শেষ!</p>
                  <p className="text-[10px] text-red-400">{outOfStockProducts.map(p => p.name_en).join(', ')}</p>
                </div>
              </div>
            )}
            {lowStockProducts.length > 0 && (
              <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3 flex-1">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bell className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <p className="text-xs font-black text-amber-700">{lowStockProducts.length}টি পণ্যের স্টক কম!</p>
                  <p className="text-[10px] text-amber-400">{lowStockProducts.map(p => `${p.name_en} (${p.stock})`).join(', ')}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Search bar */}
        <div className="bg-white p-6 rounded-[3rem] border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] flex flex-col md:flex-row gap-6 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search by name or category..."
              className="w-full pl-14 pr-6 py-4 bg-[#FDF9F6] border border-orange-50 rounded-full text-xs font-bold outline-none focus:ring-2 focus:ring-gray-900/10 transition-all placeholder:text-gray-400 placeholder:font-bold"
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <button onClick={fetchProducts} className="p-4 bg-[#FDF9F6] border border-orange-50 rounded-full hover:bg-white hover:shadow-md transition-all">
            <RotateCcw className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Task 1.4 - Category Filter Tabs */}
        <div className="flex gap-2 flex-wrap justify-center w-full">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                categoryFilter === cat
                  ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20'
                  : 'bg-white border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] text-gray-500 hover:bg-orange-50/50'
              }`}
            >
              {cat === 'All' ? `All (${products.length})` : cat}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-[3rem] border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-gray-900" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#FDF9F6] border-b border-orange-50/50">
                  <tr>
                    {['Product', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-50/30">
                  {filtered.map((p, i) => (
                    <tr key={i} className="group hover:bg-[#FDF9F6]/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <img src={p.images[0]} className="w-16 h-16 rounded-[1.25rem] object-cover bg-white shadow-sm border border-orange-50" referrerPolicy="no-referrer" alt="" />
                          <div>
                            <p className="text-sm font-black text-gray-900 uppercase italic tracking-tighter">{p.name_en}</p>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">{p.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <span className="text-sm font-black text-gray-900 tracking-tighter italic">৳{p.price.toLocaleString()}</span>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <span className={`text-xs font-black ${p.stock < 10 ? 'text-red-500' : 'text-gray-900'}`}>{p.stock} units</span>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        {p.stock <= 0
                          ? <span className="px-3 py-1.5 bg-red-100/50 border border-red-200/50 text-red-600 rounded-full text-[9px] font-black uppercase tracking-widest">Out of Stock</span>
                          : p.stock < 10
                          ? <span className="px-3 py-1.5 bg-amber-100/50 border border-amber-200/50 text-amber-600 rounded-full text-[9px] font-black uppercase tracking-widest">Low Stock</span>
                          : <span className="px-3 py-1.5 bg-emerald-100/50 border border-emerald-200/50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest">In Stock</span>
                        }
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditProduct({ ...p })}
                            className="p-3 bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4 text-blue-500" />
                          </button>
                          <button onClick={() => {
                            if (window.confirm(`Delete "${p.name_en}"?`))
                              api.deleteProduct(p.product_id!).then(fetchProducts);
                          }}
                            className="p-3 bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-red-100 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* AI Product Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={resetModal} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="relative bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden">

              {/* Modal Header */}
              <div className="flex items-center justify-between p-8 pb-0">
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tighter">
                    {step === 'done' ? '✅ সফল হয়েছে!' : step === 'review' ? '🔍 পর্যালোচনা' : '🤖 AI Product Agent'}
                  </h2>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-0.5">
                    Korean Skin Food Inventory
                  </p>
                </div>
                <button onClick={resetModal} className="p-2 hover:bg-gray-100 rounded-xl">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="p-8 space-y-5">

                {/* INPUT STEP */}
                {step === 'input' && (
                  <>
                    {/* Image Upload */}
                    <div
                      onClick={() => fileRef.current?.click()}
                      className="relative border-2 border-dashed border-gray-200 rounded-2xl h-48 flex flex-col items-center justify-center cursor-pointer hover:border-pink-400 hover:bg-pink-50/30 transition-all overflow-hidden"
                    >
                      {imagePreview ? (
                        <div className="relative w-full h-full">
                          <img src={imagePreview} className="w-full h-full object-cover" alt="preview" />
                          <button 
                            onClick={(e) => { e.stopPropagation(); setImagePreview(null); setImageFile(null); }}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-lg"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-4 p-6">
                          <div className="grid grid-cols-2 gap-4">
                            <button
                              onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}
                              className="flex flex-col items-center justify-center p-4 bg-pink-50 rounded-xl border-2 border-dashed border-pink-200 hover:bg-pink-100 transition-colors group"
                            >
                              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-2 group-hover:scale-110 transition-transform">
                                <Image className="w-6 h-6 text-pink-500" />
                              </div>
                              <span className="text-xs font-black text-gray-700 uppercase">গ্যালারি</span>
                            </button>

                            <button
                              onClick={(e) => { e.stopPropagation(); cameraRef.current?.click(); }}
                              className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-xl border-2 border-dashed border-blue-200 hover:bg-blue-100 transition-colors group"
                            >
                              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-2 group-hover:scale-110 transition-transform">
                                <Camera className="w-6 h-6 text-blue-500" />
                              </div>
                              <span className="text-xs font-black text-gray-700 uppercase">ক্যামেরা</span>
                            </button>
                          </div>
                          
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center">
                            যেকোনো একটি অপশন বেছে নিন
                          </p>
                        </div>
                      )}
                      
                      {/* Hidden Inputs */}
                      <input 
                        ref={fileRef} 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImagePick} 
                      />
                      <input 
                        ref={cameraRef} 
                        type="file" 
                        accept="image/*" 
                        capture="environment" 
                        className="hidden" 
                        onChange={handleImagePick} 
                      />
                    </div>

                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">টিপস: পরিষ্কার ছবি তুললে AI দ্রুত কাজ করবে</p>

                    {/* Fields */}
                    {[
                      { label: 'পণ্যের নাম (ইংরেজি)', val: productName, set: setProductName, type: 'text', ph: 'যেমন: Centella Hyaluronic Acid Serum' },
                      { label: 'মূল্য (৳)', val: price, set: setPrice, type: 'number', ph: '1400' },
                      { label: 'স্টক পরিমাণ', val: stock, set: setStock, type: 'number', ph: '20' },
                    ].map(f => (
                      <div key={f.label} className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{f.label}</label>
                        <input type={f.type} placeholder={f.ph}
                          className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-pink-200 transition-all"
                          value={f.val} onChange={e => f.set(e.target.value)} />
                      </div>
                    ))}

                    {error && <p className="text-xs text-red-500 font-bold">{error}</p>}

                    <button onClick={runAIAgent}
                      className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-pink-600 transition-all flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4" /> AI দিয়ে প্রসেস করুন
                    </button>
                  </>
                )}

                {/* PROCESSING STEP */}
                {step === 'processing' && (
                  <div className="py-12 text-center space-y-6">
                    <div className="relative w-20 h-20 mx-auto">
                      <div className="absolute inset-0 rounded-full bg-pink-100 animate-ping" />
                      <div className="relative w-20 h-20 rounded-full bg-pink-500 flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-white animate-pulse" />
                      </div>
                    </div>
                    <div>
                      <p className="font-black text-gray-800 text-sm">{stepMsg}</p>
                      <div className="w-full bg-gray-100 rounded-full h-2 mt-4">
                        <motion.div className="h-2 bg-pink-500 rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
                      </div>
                      <p className="text-xs text-gray-400 mt-2">{progress}%</p>
                    </div>
                  </div>
                )}

                {/* REVIEW STEP */}
                {step === 'review' && (
                  <>
                    <div className="flex gap-4">
                      {aiData.images?.[0] && (
                        <img src={aiData.images[0]} className="w-24 h-24 rounded-2xl object-cover" alt="product" />
                      )}
                      <div className="flex-1 space-y-1">
                        <p className="font-black text-gray-900">{aiData.name_en}</p>
                        <p className="text-sm text-gray-500">{aiData.name_bn}</p>
                        <div className="flex gap-2 mt-2">
                          <span className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-[9px] font-black uppercase">{aiData.category}</span>
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[9px] font-black">৳{aiData.price}</span>
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-[9px] font-black">স্টক: {aiData.stock}</span>
                        </div>
                      </div>
                    </div>
                    {aiData.ingredients && (
                      <div className="bg-gray-50 rounded-2xl p-4">
                        <p className="text-[10px] font-black text-gray-400 uppercase mb-1">উপাদান</p>
                        <p className="text-xs text-gray-700">{aiData.ingredients}</p>
                      </div>
                    )}
                    {aiData.description_en && (
                      <div className="bg-gray-50 rounded-2xl p-4">
                        <p className="text-[10px] font-black text-gray-400 uppercase mb-1">বিবরণ</p>
                        <p className="text-xs text-gray-700 line-clamp-3">{aiData.description_en}</p>
                      </div>
                    )}
                    {error && <p className="text-xs text-red-500 font-bold">{error}</p>}
                    <div className="flex gap-3">
                      <button onClick={() => setStep('input')} className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-2xl font-black text-xs uppercase hover:bg-gray-50 transition-all">
                        পরিবর্তন করুন
                      </button>
                      <button onClick={handleSave} className="flex-1 py-3 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase hover:bg-pink-600 transition-all flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> সংরক্ষণ করুন
                      </button>
                    </div>
                  </>
                )}

                {/* DONE STEP */}
                {step === 'done' && (
                  <div className="py-10 text-center space-y-4">
                    <div className="w-20 h-20 mx-auto bg-emerald-100 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    </div>
                    <p className="font-black text-gray-900 text-lg">পণ্য সফলভাবে যুক্ত হয়েছে!</p>
                    <p className="text-xs text-gray-400">Google Sheet-এ সংরক্ষণ সম্পন্ন।</p>
                    <button onClick={resetModal}
                      className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase hover:bg-pink-600 transition-all">
                      বন্ধ করুন
                    </button>
                  </div>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Print Barcode Modal */}
      <AnimatePresence>
        {printProduct && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setPrintProduct(null)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="relative bg-white rounded-[2.5rem] p-8 shadow-2xl overflow-hidden min-w-[300px]">
              <div className="flex justify-end mb-4">
                <button onClick={() => setPrintProduct(null)} className="p-2 hover:bg-gray-100 rounded-xl">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <BarcodeGenerator product={printProduct} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Task 1.1 - Edit Product Modal */}
      <AnimatePresence>
        {editProduct && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setEditProduct(null)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="relative bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between p-8 pb-0">
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tighter">✏️ পণ্য সম্পাদনা</h2>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-0.5">{editProduct.product_id}</p>
                </div>
                <button onClick={() => setEditProduct(null)} className="p-2 hover:bg-gray-100 rounded-xl">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <div className="p-8 space-y-4">
                {/* Product image preview */}
                {editProduct.images?.[0] && (
                  <div className="flex justify-center">
                    <img src={editProduct.images[0]} className="w-24 h-24 rounded-2xl object-cover border border-gray-100" alt="" />
                  </div>
                )}
                {[
                  { label: 'পণ্যের নাম (ইংরেজি)', key: 'name_en', type: 'text' },
                  { label: 'পণ্যের নাম (বাংলা)', key: 'name_bn', type: 'text' },
                  { label: 'মূল্য (৳)', key: 'price', type: 'number' },
                  { label: 'ছাড়ের মূল্য (৳) — খালি রাখলে ছাড় নেই', key: 'discount_price', type: 'number' },
                  { label: 'স্টক পরিমাণ', key: 'stock', type: 'number' },
                ].map(f => (
                  <div key={f.key} className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{f.label}</label>
                    <input
                      type={f.type}
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-200 transition-all"
                      value={(editProduct as any)[f.key] ?? ''}
                      onChange={e => setEditProduct(prev => prev ? {
                        ...prev,
                        [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value
                      } : null)}
                    />
                  </div>
                ))}
                {/* Category select */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ক্যাটাগরি</label>
                  <select
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-200"
                    value={editProduct.category || ''}
                    onChange={e => setEditProduct(prev => prev ? { ...prev, category: e.target.value } : null)}
                  >
                    {CATEGORIES.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                {editError && <p className="text-xs text-red-500 font-bold">{editError}</p>}
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setEditProduct(null)}
                    className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-2xl font-black text-xs uppercase hover:bg-gray-50 transition-all">
                    বাতিল
                  </button>
                  <button onClick={handleEditSave} disabled={editSaving}
                    className="flex-1 py-3 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase hover:bg-blue-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                    {editSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {editSaving ? 'সেভ হচ্ছে...' : 'সেভ করুন'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Task 1.6 - Stock History Log Modal */}
      <AnimatePresence>
        {showLogs && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowLogs(false)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="relative bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[80vh] shadow-2xl overflow-hidden flex flex-col">
              <div className="flex items-center justify-between p-8 pb-4 border-b border-gray-100">
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tighter">📋 স্টক ইতিহাস</h2>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-0.5">Inventory Change Log</p>
                </div>
                <button onClick={() => setShowLogs(false)} className="p-2 hover:bg-gray-100 rounded-xl">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <div className="overflow-y-auto flex-1 p-6">
                {logsLoading ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
                  </div>
                ) : stockLogs.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-gray-400 text-sm font-bold">এখনো কোনো লগ নেই।</p>
                  </div>
                ) : (
                  <table className="w-full text-left">
                    <thead>
                      <tr>
                        {['পণ্য ID', 'পরিবর্তন', 'পরিমাণ', 'সময়'].map(h => (
                          <th key={h} className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {[...stockLogs].reverse().map((log: any, i) => (
                        <tr key={i} className="text-xs">
                          <td className="py-3 font-bold text-gray-700">{log.product_id}</td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded-full text-[9px] font-black ${
                              log.change_type === 'STOCK_UPDATE' ? 'bg-blue-100 text-blue-600' :
                              log.change_type === 'SCAN_PACK' ? 'bg-purple-100 text-purple-600' :
                              'bg-gray-100 text-gray-600'
                            }`}>{log.change_type}</span>
                          </td>
                          <td className="py-3 font-black text-gray-900">{log.quantity}</td>
                          <td className="py-3 text-gray-400">{new Date(log.timestamp).toLocaleString('bn-BD')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};


export default AdminInventory;
