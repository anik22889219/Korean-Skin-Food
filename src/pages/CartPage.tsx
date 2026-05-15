import React from 'react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ChevronLeft, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, subtotal, itemCount } = useCart();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="bg-[#FDF9F6] min-h-[80vh] flex flex-col items-center justify-center space-y-6 px-4">
        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-sm">
          <ShoppingBag className="w-12 h-12 text-primary/30" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 tracking-tighter italic">Your Bag is Empty</h2>
        <p className="text-gray-500 font-medium">Curate your perfect skincare ritual today.</p>
        <Link to="/shop" className="bg-gray-900 text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest text-xs shadow-xl shadow-gray-900/20 hover:bg-gray-800 transition-all mt-4">
          Discover Products
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FDF9F6] min-h-screen pb-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
         <div className="flex items-end justify-between mb-12 border-b border-orange-50 pb-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Checkout</p>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900 italic">Your Bag</h1>
            </div>
            <span className="text-gray-500 font-bold uppercase tracking-widest text-xs bg-white px-4 py-2 rounded-full border border-orange-50">{itemCount} Items</span>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">
            {/* Item List */}
            <div className="lg:col-span-2 space-y-6">
              <AnimatePresence>
                {cart.map((item, idx) => (
                  <motion.div 
                    key={`${item.product_id}-${idx}`}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white p-4 md:p-6 rounded-[2.5rem] border border-white shadow-[0_4px_30px_rgba(0,0,0,0.02)] flex items-center gap-6 group hover:border-orange-50 transition-all duration-500 relative"
                  >
                    <div className="w-28 md:w-36 aspect-[4/5] rounded-[1.5rem] overflow-hidden bg-[#FDF9F6] flex-shrink-0 relative">
                      <img 
                        src={item.images[0]} 
                        alt={item.name_en} 
                        className="w-full h-full object-cover mix-blend-multiply" 
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    
                    <div className="flex-1 py-2 flex flex-col justify-between h-full">
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-primary uppercase tracking-widest">{item.category}</p>
                        <h3 className="text-sm md:text-base font-bold text-gray-900 leading-snug">
                          {language === 'en' ? item.name_en : item.name_bn}
                        </h3>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <p className="text-xl font-black text-gray-900 tracking-tighter">৳{(item.discount_price || item.price).toLocaleString()}</p>
                        <div className="flex items-center bg-[#FDF9F6] px-2 py-1.5 rounded-full border border-orange-50">
                          <button onClick={() => updateQuantity(item.product_id, item.quantity - 1)} className="p-1 hover:bg-white rounded-full shadow-sm transition-all text-gray-400 hover:text-gray-900"><Minus className="w-3 h-3" /></button>
                          <span className="w-8 text-center text-xs font-black text-gray-900">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product_id, item.quantity + 1)} className="p-1 hover:bg-white rounded-full shadow-sm transition-all text-gray-400 hover:text-gray-900"><Plus className="w-3 h-3" /></button>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.product_id)}
                      className="absolute top-6 right-6 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              <Link to="/shop" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-400 hover:text-gray-900 font-bold group mt-8 transition-colors">
                 <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                 Continue Shopping
              </Link>
            </div>

            {/* Summary Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-[3rem] border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] space-y-8 sticky top-32">
                 <h3 className="text-sm font-black tracking-widest uppercase text-gray-900 flex items-center justify-between">
                   Order Summary
                   <ShieldCheck className="w-5 h-5 text-green-500" />
                 </h3>
                 
                 <div className="space-y-4 text-sm font-medium">
                    <div className="flex justify-between text-gray-500">
                      <span>{t('subtotal')}</span>
                      <span className="text-gray-900">৳{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>{t('delivery')}</span>
                      <span className="text-gray-900">Calculated next</span>
                    </div>
                    <div className="pt-6 border-t border-orange-50 flex justify-between items-end">
                       <div>
                         <p className="text-[10px] uppercase font-black text-primary tracking-widest mb-1">{t('total')}</p>
                         <p className="text-4xl font-black text-gray-900 tracking-tighter">৳{subtotal.toLocaleString()}</p>
                       </div>
                    </div>
                 </div>

                 <button 
                   onClick={() => navigate('/checkout')}
                   className="w-full bg-gray-900 text-white py-5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl shadow-gray-900/20 hover:bg-gray-800 active:scale-95 transition-all flex items-center justify-center gap-3"
                 >
                   Secure Checkout
                   <ArrowRight className="w-4 h-4" />
                 </button>

                 <div className="flex flex-col gap-4 pt-6 border-t border-gray-50">
                    <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest font-bold text-gray-500">
                       <CheckCircle2 className="w-4 h-4 text-green-500" />
                       Cash on Delivery Available
                    </div>
                    <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest font-bold text-gray-500">
                       <CheckCircle2 className="w-4 h-4 text-green-500" />
                       100% Authentic Products
                    </div>
                 </div>
              </div>
            </div>
         </div>
      </div>
    </div>
  );
};
