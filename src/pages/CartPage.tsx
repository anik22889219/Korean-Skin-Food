import React from 'react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ChevronLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, subtotal, itemCount } = useCart();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center space-y-6">
        <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center">
          <ShoppingBag className="w-16 h-16 text-gray-200" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 tracking-tighter">কার্ট খালি!</h2>
        <p className="text-gray-400 font-medium">আপনার পছন্দমতো স্কিনকেয়ার প্রোডাক্ট যোগ করুন।</p>
        <Link to="/shop" className="bg-primary text-white px-10 py-4 rounded-2xl font-black text-lg shadow-xl shadow-primary/20">
          শপিং শুরু করুন
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
       <div className="flex items-center justify-between mb-12">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-gray-900">{t('cart')}</h1>
          <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">{itemCount} Items</span>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Item List */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence>
              {cart.map((item, idx) => (
                <motion.div 
                  key={`${item.product_id}-${idx}`}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white p-4 md:p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-6 group hover:shadow-xl hover:shadow-gray-100 transition-all duration-500"
                >
                  <div className="w-24 md:w-32 aspect-square rounded-[2rem] overflow-hidden bg-gray-50 flex-shrink-0">
                    <img 
                      src={item.images[0]} 
                      alt={item.name_en} 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{item.category}</p>
                    <h3 className="text-md md:text-lg font-black text-gray-900 leading-tight">
                      {language === 'en' ? item.name_en : item.name_bn}
                    </h3>
                    <p className="text-lg font-black text-gray-900">৳{(item.discount_price || item.price).toLocaleString()}</p>
                  </div>

                  <div className="flex flex-col items-end justify-between self-stretch py-1">
                    <button 
                      onClick={() => removeFromCart(item.product_id)}
                      className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>

                    <div className="flex items-center bg-gray-50 px-2 py-1.5 rounded-xl border border-gray-100">
                      <button onClick={() => updateQuantity(item.product_id, item.quantity - 1)} className="p-1 hover:bg-white rounded-md shadow-sm transition-all"><Minus className="w-3 h-3" /></button>
                      <span className="w-8 text-center text-xs font-black">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product_id, item.quantity + 1)} className="p-1 hover:bg-white rounded-md shadow-sm transition-all"><Plus className="w-3 h-3" /></button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            <Link to="/shop" className="inline-flex items-center gap-2 text-primary font-bold group mt-4">
               <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
               Continue Shopping
            </Link>
          </div>

          {/* Summary Panel */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 space-y-8 sticky top-32">
               <h3 className="text-xl font-black tracking-widest uppercase text-gray-400">Order Summary</h3>
               
               <div className="space-y-4">
                  <div className="flex justify-between font-bold text-gray-500">
                    <span>{t('subtotal')}</span>
                    <span className="text-gray-900">৳{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-500">
                    <span>{t('delivery')}</span>
                    <span className="text-gray-900">৳0 - ৳120</span>
                  </div>
                  <div className="pt-4 border-t border-gray-200 flex justify-between items-end">
                     <div>
                       <p className="text-xs uppercase font-black text-gray-400 tracking-widest">{t('total')}</p>
                       <p className="text-4xl font-black text-gray-900 tracking-tighter">৳{subtotal.toLocaleString()}</p>
                     </div>
                  </div>
               </div>

               <button 
                 onClick={() => navigate('/checkout')}
                 className="w-full bg-primary text-white py-6 rounded-2xl font-black text-xl shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
               >
                 {t('checkout')}
                 <ArrowRight className="w-6 h-6" />
               </button>

               <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 text-xs font-bold text-gray-400">
                     <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                     </div>
                     Cash on Delivery Available
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-gray-400">
                     <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                     </div>
                     Authentic K-Beauty Products
                  </div>
               </div>
            </div>
          </div>
       </div>
    </div>
  );
};

const CheckCircle: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
  </svg>
);
