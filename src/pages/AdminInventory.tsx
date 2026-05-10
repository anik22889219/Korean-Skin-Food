import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../services/api';
import { uploadImageToCloudinary } from '../services/cloudinary';
import { Product } from '../types';
import {
  Plus, Search, Filter, Edit2, Trash2, AlertTriangle,
  RotateCcw, CheckCircle2, XCircle, Sparkles, Upload,
  Camera, X, Loader2, ImageIcon
} from 'lucide-react';

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
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
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
const AdminInventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);

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
      // Step 1: Upload image
      setStepMsg('☁️ ছবি Cloudinary-তে আপলোড হচ্ছে...'); setProgress(20);
      const imageUrl = await uploadImageToCloudinary(imageFile, (p) => setProgress(20 + p * 0.3));

      // Step 2: AI research
      setStepMsg('🤖 Gemini AI পণ্যের তথ্য সংগ্রহ করছে...'); setProgress(55);
      const ai = await researchProduct(productName);

      // Step 3: Merge
      setProgress(90);
      setStepMsg('✅ সব তথ্য প্রস্তুত, পর্যালোচনা করুন...');
      setAiData({ ...ai, images: [imageUrl], price: Number(price), stock: Number(stock) });
      setStep('review');
      setProgress(100);
    } catch (err: any) {
      setError(err.message || 'একটি সমস্যা হয়েছে।');
      setStep('input');
    }
  };

  const handleSave = async () => {
    setStep('processing'); setStepMsg('💾 Google Sheet-এ সংরক্ষণ হচ্ছে...');
    try {
      await api.addProduct({
        ...aiData,
        product_id: 'PRD' + Date.now(),
      });
      setStep('done');
      fetchProducts();
    } catch {
      setError('Save failed. Try again.');
      setStep('review');
    }
  };

  const filtered = products.filter(p =>
    (p.name_en || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-gray-900 uppercase italic">Inventory Vault</h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">AI-Powered Product Management</p>
          </div>
          <button
            onClick={() => { setShowModal(true); setStep('input'); }}
            className="flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-pink-600 transition-all shadow-xl"
          >
            <Sparkles className="w-4 h-4" /> AI দিয়ে পণ্য যোগ করুন
          </button>
        </div>

        {/* Search bar */}
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="নাম বা ক্যাটাগরি দিয়ে খুঁজুন..."
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-xl text-xs font-bold outline-none"
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <button onClick={fetchProducts} className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100">
            <RotateCcw className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[2.5rem] border border-gray-50 shadow-xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-50/50">
                <tr>
                  {['পণ্য', 'মূল্য', 'স্টক', 'স্ট্যাটাস', 'অ্যাকশন'].map(h => (
                    <th key={h} className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((p, i) => (
                  <tr key={i} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <img src={p.images[0]} className="w-14 h-14 rounded-2xl object-cover bg-gray-100" referrerPolicy="no-referrer" alt="" />
                        <div>
                          <p className="text-sm font-black text-gray-900 uppercase italic">{p.name_en}</p>
                          <p className="text-[10px] text-gray-400 uppercase">{p.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm font-black text-gray-900">৳{p.price.toLocaleString()}</td>
                    <td className="px-8 py-6">
                      <span className={`text-xs font-black ${p.stock < 10 ? 'text-red-500' : 'text-gray-900'}`}>{p.stock} টি</span>
                    </td>
                    <td className="px-8 py-6">
                      {p.stock <= 0
                        ? <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-[9px] font-black">স্টক নেই</span>
                        : p.stock < 10
                        ? <span className="px-3 py-1 bg-amber-100 text-amber-600 rounded-full text-[9px] font-black">কম স্টক</span>
                        : <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-[9px] font-black">স্বাভাবিক</span>
                      }
                    </td>
                    <td className="px-8 py-6">
                      <button onClick={() => api.deleteProduct(p.product_id!).then(fetchProducts)}
                        className="p-2 hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                        <img src={imagePreview} className="w-full h-full object-cover" alt="preview" />
                      ) : (
                        <div className="text-center p-4">
                          <Camera className="w-10 h-10 text-pink-400 mx-auto mb-2" />
                          <p className="text-sm font-black text-gray-700 uppercase italic">ক্যামেরা দিয়ে ছবি তুলুন</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">অথবা গ্যালারি থেকে আপলোড করুন</p>
                        </div>
                      )}
                      <input ref={fileRef} type="file" accept="image/*" capture="environment"
                        className="hidden" onChange={handleImagePick} />
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
    </>
  );
};

export default AdminInventory;
