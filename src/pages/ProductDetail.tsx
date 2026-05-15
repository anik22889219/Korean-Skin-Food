import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ShoppingBag, ChevronLeft, Star, ShieldCheck, RefreshCw, Plus, Minus, Heart, MessageCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { StickyAddToCart } from '../components/StickyAddToCart';
import { useQuery } from '@tanstack/react-query';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'ing' | 'skin'>('desc');
  const [added, setAdded] = useState(false);

  const { data: product, isLoading: loading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => api.getProductById(id!),
    enabled: !!id,
  });

  if (loading) return <div className="h-screen flex items-center justify-center font-black animate-pulse text-primary tracking-widest uppercase">Curating...</div>;

  if (!product) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 bg-[#FDF9F6]">
        <h2 className="text-4xl font-black italic text-gray-300 uppercase tracking-tighter">Product Not Found</h2>
        <Link to="/shop" className="bg-gray-900 text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg shadow-gray-900/20 hover:bg-gray-800 transition-all">Back to Shop</Link>
      </div>
    );
  }

  const images = (product.images && product.images.length > 0 && product.images[0] !== '') 
    ? product.images 
    : ['https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1000&auto=format&fit=crop'];

  const name = language === 'en' ? product.name_en : product.name_bn;
  const desc = language === 'en' ? product.description_en : product.description_bn;
  const hasDiscount = product.discount_price && product.discount_price < product.price;

  return (
    <div className="bg-[#FDF9F6] min-h-screen pb-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <Link to="/shop" className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-900 text-[10px] uppercase tracking-widest font-bold mb-8 group transition-colors">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Rituals
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-[4/5] bg-white rounded-[3rem] overflow-hidden relative shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-white">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={activeImage}
                  src={images[activeImage] || images[0]} 
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full object-cover mix-blend-multiply"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>
              
              {/* Premium Top Badge */}
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md rounded-full flex items-center gap-2 px-4 py-2 shadow-sm border border-white">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-800">Authentic K-Beauty</span>
              </div>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-2">
              {images.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImage(i)}
                  className={`flex-shrink-0 w-24 aspect-square rounded-[1.5rem] overflow-hidden border-2 transition-all ${
                    activeImage === i ? 'border-primary opacity-100 scale-105 shadow-md' : 'border-white opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover mix-blend-multiply bg-white" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8 bg-white/60 p-8 md:p-12 rounded-[3rem] border border-white shadow-[0_4px_30px_rgba(0,0,0,0.02)] backdrop-blur-sm">
            <div className="space-y-4">
              <p className="text-primary font-black uppercase tracking-[0.2em] text-[10px] leading-none">{product.category}</p>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900 leading-[1.1] italic">{name}</h1>
              <div className="flex items-center gap-4 text-xs font-bold">
                <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span className="text-gray-800">4.9</span>
                </div>
                <span className="text-gray-400 underline decoration-gray-200 underline-offset-4">128 Reviews</span>
                <span className={`px-3 py-1.5 rounded-full border ${
                  product.stock > 0 
                    ? (product.stock < 10 ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-green-50 text-green-600 border-green-100')
                    : 'bg-red-50 text-red-600 border-red-100'
                }`}>
                  {product.stock > 0 ? (product.stock < 10 ? 'Low Stock' : 'In Stock') : 'Out of Stock'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 py-6 border-y border-orange-50/50">
              {hasDiscount ? (
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-black text-gray-900 tracking-tighter">৳{product.discount_price?.toLocaleString()}</span>
                  <span className="text-xl text-gray-300 font-bold line-through">৳{product.price.toLocaleString()}</span>
                  <span className="bg-red-50 text-red-500 border border-red-100 text-[10px] font-black px-3 py-1 rounded-full tracking-widest uppercase ml-2">
                    -{Math.round(((product.price - product.discount_price!) / product.price) * 100)}%
                  </span>
                </div>
              ) : (
                <span className="text-4xl font-black text-gray-900 tracking-tighter">৳{product.price.toLocaleString()}</span>
              )}
            </div>

            {/* Add to Cart Controls */}
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-white p-2 rounded-full border border-gray-100 h-16 w-36 justify-between shadow-sm">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 rounded-full transition-colors text-gray-400 hover:text-gray-900"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-black text-lg text-gray-900">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 rounded-full transition-colors text-gray-400 hover:text-gray-900"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <button 
                onClick={() => {
                  addToCart(product, quantity);
                  setAdded(true);
                  setTimeout(() => setAdded(false), 2000);
                }}
                disabled={product.stock <= 0 || added}
                className={`flex-1 h-16 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale ${
                  added ? 'bg-green-500 text-white shadow-green-500/20' : 'bg-gray-900 text-white shadow-gray-900/20 hover:bg-gray-800 active:scale-95'
                }`}
              >
                {added ? (
                  <>
                    <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                    Added to Bag
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    {t('add_to_cart')}
                  </>
                )}
              </button>
              
              <button
                onClick={() => toggleWishlist(product)}
                className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all bg-white shadow-sm ${
                  isWishlisted(product.product_id!)
                    ? 'border-red-100 text-red-500 bg-red-50'
                    : 'border-white text-gray-300 hover:text-red-400 hover:border-red-50'
                }`}
              >
                <Heart className={`w-6 h-6 ${isWishlisted(product.product_id!) ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* WhatsApp Order Button */}
            <a
              href={`https://wa.me/${(import.meta as any).env.VITE_WHATSAPP_NUMBER?.replace('+','') || '8801700000000'}?text=${encodeURIComponent(`🛍️ আমি এই পণ্যটি অর্ডার করতে চাই:\n\n📦 ${product.name_en}\n💰 মূল্য: ৳${product.discount_price || product.price}\n\nঅনুগ্রহ করে আমাকে সাহায্য করুন।`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full h-14 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-[#25D366]/20"
            >
              <MessageCircle className="w-5 h-5" />
              Order via WhatsApp
            </a>

            {/* Tabs */}
            <div className="space-y-6 pt-6">
              <div className="flex gap-8 border-b border-gray-100">
                {[
                  { id: 'desc', label: 'The Details' },
                  { id: 'ing', label: 'Key Ingredients' },
                  { id: 'skin', label: 'Skin Concern' }
                ].map(t => (
                  <button 
                    key={t.id}
                    onClick={() => setActiveTab(t.id as any)}
                    className={`pb-4 text-[10px] font-black uppercase tracking-widest relative transition-all ${
                      activeTab === t.id ? 'text-primary' : 'text-gray-400 hover:text-gray-900'
                    }`}
                  >
                    {t.label}
                    {activeTab === t.id && (
                      <motion.div layoutId="tab" className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />
                    )}
                  </button>
                ))}
              </div>
              
              <div className="text-gray-600 leading-relaxed text-sm h-32 overflow-y-auto pr-4 scrollbar-hide font-medium">
                {activeTab === 'desc' && desc}
                {activeTab === 'ing' && product.ingredients}
                {activeTab === 'skin' && product.skin_type}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 pt-4">
               <div className="flex items-center gap-4 bg-[#FDF9F6] p-4 rounded-2xl border border-orange-50">
                 <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                   <ShieldCheck className="w-5 h-5 text-primary" />
                 </div>
                 <div className="flex flex-col">
                   <span className="text-[9px] font-black uppercase tracking-widest text-gray-900">Guaranteed</span>
                   <span className="text-[10px] font-bold text-gray-500">100% Authentic</span>
                 </div>
               </div>
               <div className="flex items-center gap-4 bg-[#FDF9F6] p-4 rounded-2xl border border-orange-50">
                 <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                   <RefreshCw className="w-5 h-5 text-primary" />
                 </div>
                 <div className="flex flex-col">
                   <span className="text-[9px] font-black uppercase tracking-widest text-gray-900">Returns</span>
                   <span className="text-[10px] font-bold text-gray-500">7-Day Policy</span>
                 </div>
               </div>
            </div>
          </div>
        </div>
        
        {product && <StickyAddToCart product={product} />}
      </div>
    </div>
  );
};
