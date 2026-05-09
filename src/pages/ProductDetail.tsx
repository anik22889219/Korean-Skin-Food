import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, ChevronLeft, ChevronRight, Star, ShieldCheck, RefreshCw, Zap, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { StickyAddToCart } from '../components/StickyAddToCart';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'ing' | 'skin'>('desc');
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      api.getProductById(id).then(setProduct).finally(() => {
        setLoading(false);
        window.scrollTo(0, 0);
      });
    }
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center font-black animate-pulse">LOADING...</div>;

  if (!product) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-4xl font-black italic text-gray-300 uppercase tracking-tighter">Product Not Found</h2>
        <Link to="/shop" className="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all">Back to Shop</Link>
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
      <Link to="/shop" className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-900 font-bold mb-8 group">
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back to Results
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-[4/5] bg-gray-50 rounded-[3rem] overflow-hidden relative shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.img 
                key={activeImage}
                src={images[activeImage] || images[0]} 
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {images.map((img, i) => (
              <button 
                key={i} 
                onClick={() => setActiveImage(i)}
                className={`flex-shrink-0 w-24 aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                  activeImage === i ? 'border-primary opacity-100 scale-105' : 'border-transparent opacity-60'
                }`}
              >
                <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          <div className="space-y-2">
            <p className="text-primary font-black uppercase tracking-[0.2em] text-xs leading-none">{product.category}</p>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900 leading-[1.1]">{name}</h1>
            <div className="flex items-center gap-4 text-sm font-bold">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <span className="text-gray-400">4.9 (128 Reviews)</span>
              <span className="text-green-500 bg-green-50 px-2 py-0.5 rounded-lg border border-green-100">
                {product.stock > 0 ? (product.stock < 10 ? 'Low Stock' : 'In Stock') : 'Out of Stock'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {hasDiscount ? (
              <>
                <span className="text-4xl font-black text-gray-900 tracking-tighter">৳{product.discount_price?.toLocaleString()}</span>
                <span className="text-2xl text-gray-300 font-bold line-through">৳{product.price.toLocaleString()}</span>
                <span className="bg-red-500 text-white text-xs font-black px-3 py-1.5 rounded-full">
                  -{Math.round(((product.price - product.discount_price!) / product.price) * 100)}% DISCOUNT
                </span>
              </>
            ) : (
              <span className="text-4xl font-black text-gray-900 tracking-tighter">৳{product.price.toLocaleString()}</span>
            )}
          </div>

          {/* Add to Cart Controls */}
          <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
            <div className="flex items-center bg-gray-50 p-2 rounded-2xl border border-gray-100 h-16 w-32 justify-between">
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-xl transition-colors shadow-sm"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="font-black text-lg">{quantity}</span>
              <button 
                onClick={() => setQuantity(q => q + 1)}
                className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-xl transition-colors shadow-sm"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <button 
              onClick={() => {
                addToCart(product, quantity);
                setAdded(true);
                setTimeout(() => setAdded(false), 2000);
              }}
              disabled={product.stock <= 0 || added}
              className={`flex-1 h-16 rounded-2xl font-black text-lg shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale ${
                added ? 'bg-green-500 text-white' : 'bg-primary text-white shadow-primary/20 hover:scale-105 active:scale-95'
              }`}
            >
              {added ? (
                <>
                  <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                  Added!
                </>
              ) : (
                <>
                  <ShoppingBag className="w-6 h-6" />
                  {t('add_to_cart')}
                </>
              )}
            </button>
          </div>

          {/* Tabs */}
          <div className="space-y-6">
            <div className="flex gap-8 border-b border-gray-100">
              {[
                { id: 'desc', label: 'Description' },
                { id: 'ing', label: 'Ingredients' },
                { id: 'skin', label: 'Skin Type' }
              ].map(t => (
                <button 
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  className={`pb-4 text-sm font-black uppercase tracking-widest relative transition-all ${
                    activeTab === t.id ? 'text-primary' : 'text-gray-400 hover:text-gray-900'
                  }`}
                >
                  {t.label}
                  {activeTab === t.id && (
                    <motion.div layoutId="tab" className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-full" />
                  )}
                </button>
              ))}
            </div>
            
            <div className="text-gray-600 leading-relaxed text-sm h-32 overflow-y-auto pr-4 scrollbar-hide">
              {activeTab === 'desc' && desc}
              {activeTab === 'ing' && product.ingredients}
              {activeTab === 'skin' && product.skin_type}
            </div>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 gap-4">
             <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
               <ShieldCheck className="w-5 h-5 text-green-500" />
               <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">100% Authentic</span>
             </div>
             <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
               <RefreshCw className="w-5 h-5 text-blue-500" />
               <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">7-Day Return</span>
             </div>
          </div>
        </div>
      </div>
      
      {product && <StickyAddToCart product={product} />}
    </div>
  );
};
