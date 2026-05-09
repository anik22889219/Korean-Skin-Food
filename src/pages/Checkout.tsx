import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { ShoppingBag, ChevronLeft, MapPin, Phone, User, CheckCircle2, Package } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export const Checkout: React.FC = () => {
  const { cart, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    area: 'Inside Dhaka'
  });
  
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState<string | null>(null);

  const isInsideDhaka = formData.area === 'Inside Dhaka';
  const deliveryCharge = (isInsideDhaka && subtotal >= 2000) ? 0 : (isInsideDhaka ? 60 : 120);
  const total = subtotal + deliveryCharge;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    // Basic validation
    if (!formData.name || !formData.phone || !formData.address) {
      alert('Please fill in all shipping details.');
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        customer_name: formData.name,
        customer_phone: formData.phone,
        customer_address: formData.address,
        area: formData.area,
        delivery_charge: deliveryCharge,
        items: cart.map(i => ({ 
          id: i.product_id, 
          name: i.name_en, 
          quantity: i.quantity, 
          price: i.discount_price || i.price,
          images: i.images
        })),
        total: total,
        payment_method: 'COD'
      };

      // Auto account creation for guests
      if (!user) {
        try {
          const autoEmail = `${formData.phone.replace(/[^0-9]/g, '')}@ksf.com`;
          const autoPassword = formData.phone;
          // Attempt registration, ignore errors if user already exists
          api.registerUser(formData.name, autoEmail, formData.phone, autoPassword).catch(() => {});
        } catch (e) {
          // Silent catch
        }
      }

      const res = await api.placeOrder(orderPayload);
      
      if (res.success) {
        setOrderComplete(res.order_id);
        
        // Generate WhatsApp Link
        const itemsStr = cart.map(i => `• ${i.name_en} (${i.quantity}টি)`).join('\n');
        const waMessage = `🛍️ নুতুন অর্ডার!\n\n🆔 আইডি: #${res.order_id}\n👤 নাম: ${formData.name}\n📞 ফোন: ${formData.phone}\n📍 ঠিকানা: ${formData.address}\n🚚 এলাকা: ${formData.area}\n\n📦 পণ্যসমূহ:\n${itemsStr}\n\n💵 সাবটোটাল: ৳${subtotal}\n🚚 ডেলিভারি: ৳${deliveryCharge}\n💰 মোট: ৳${total}\n💳 পেমেন্ট: ক্যাশ অন ডেলিভারি\n\nধন্যবাদ! ❤️`;
        
        // Use a safe fallback for WhatsApp number
        const waNumber = (import.meta as any).env.VITE_WHATSAPP_NUMBER || '8801700000000';
        const waUrl = `https://wa.me/${waNumber.replace('+', '')}?text=${encodeURIComponent(waMessage)}`;
        
        clearCart();
        window.open(waUrl, '_blank');
      } else {
        throw new Error(res.error || 'Server error');
      }
    } catch (err: any) {
      console.error(err);
      alert(`Order submission failed: ${err.message || 'Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-8">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-500">
           <CheckCircle2 className="w-12 h-12" />
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-black tracking-tighter text-gray-900">অর্ডার সফল হয়েছে!</h2>
          <p className="text-gray-500 font-medium">আপনার অর্ডার আইডি: <span className="text-primary font-black">#{orderComplete}</span></p>
          <p className="text-sm text-gray-400">আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব। হোয়াটসঅ্যাপ চ্যাটটি ওপেন করে অর্ডার কনফার্ম করুন।</p>
        </div>
        <Link to="/" className="inline-block bg-gray-900 text-white px-12 py-5 rounded-2xl font-black shadow-xl shadow-gray-200 active:scale-95 transition-transform">
          শপিং এ ফিরে যান
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-gray-900">Check<span className="text-primary italic">out</span></h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-gray-100 shadow-xl shadow-gray-100 space-y-8">
          <h3 className="text-2xl font-black tracking-tighter text-gray-900 mb-8 flex items-center gap-3">
             <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center">
               <MapPin className="w-5 h-5 text-primary" />
             </div>
             Shipping Information
          </h3>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                <input 
                  required
                  type="text" 
                  placeholder="আপনার নাম লিখুন..."
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl font-medium focus:ring-2 focus:ring-primary/20 outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                <input 
                   required
                   type="tel" 
                   placeholder="০১৭XXXXXXXX"
                   className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl font-medium focus:ring-2 focus:ring-primary/20 outline-none"
                   value={formData.phone}
                   onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400">Full Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-10 translate-y-0 w-5 h-5 text-gray-300" />
                <textarea 
                   required
                   rows={3}
                   placeholder="বাসা নম্বর, রোড নম্বর, এলাকা..."
                   className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl font-medium focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                   value={formData.address}
                   onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
               <label className="text-xs font-black uppercase tracking-widest text-gray-400">Area</label>
               <div className="grid grid-cols-2 gap-4">
                  {['Inside Dhaka', 'Outside Dhaka'].map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setFormData({...formData, area: a})}
                      className={`py-4 rounded-2xl font-black text-xs uppercase tracking-widest border-2 transition-all ${
                        formData.area === a 
                          ? 'border-primary bg-primary/5 text-primary' 
                          : 'border-gray-100 text-gray-400 hover:border-gray-200'
                      }`}
                    >
                      {a === 'Inside Dhaka' ? t('dhaka_inside') : t('dhaka_outside')}
                    </button>
                  ))}
               </div>
            </div>
          </div>
        </form>

        {/* Summary Overlay */}
        <div className="space-y-8 sticky top-32">
           <div className="bg-gray-50 p-10 rounded-[3.5rem] border border-gray-100 space-y-8">
              <h3 className="text-xl font-black tracking-widest uppercase text-gray-400 flex items-center justify-between">
                <span>Summary</span>
                <Package className="w-5 h-5" />
              </h3>

              <div className="space-y-6 max-h-[30vh] overflow-y-auto pr-2 scrollbar-hide">
                {cart.map((item, idx) => (
                  <div key={`${item.product_id}-${idx}`} className="flex justify-between items-center gap-4">
                     <img src={item.images[0]} className="w-12 h-12 rounded-xl object-cover" />
                     <div className="flex-1">
                       <p className="text-xs font-black text-gray-800 line-clamp-1">{language === 'en' ? item.name_en : item.name_bn}</p>
                       <p className="text-[10px] text-gray-400">Qty: {item.quantity}</p>
                     </div>
                     <p className="font-black text-sm">৳{((item.discount_price || item.price) * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t border-gray-200">
                <div className="flex justify-between font-bold text-gray-500">
                  <span>Subtotal</span>
                  <span className="text-gray-900">৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-500">
                  <span>Delivery Charge</span>
                  <span className="text-gray-900">৳{deliveryCharge.toLocaleString()}</span>
                </div>
                <div className="pt-4 flex justify-between items-end">
                   <div>
                     <p className="text-xs uppercase font-black text-gray-400 tracking-widest">Payable Total</p>
                     <p className="text-4xl font-black text-gray-900 tracking-tighter">৳{total.toLocaleString()}</p>
                   </div>
                   <div className="bg-green-100 text-green-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-green-200">
                      Cash on Delivery
                   </div>
                </div>
              </div>

              <button 
                type="submit"
                onClick={(e) => {
                   const form = document.querySelector('form');
                   if (form) form.requestSubmit();
                }}
                disabled={loading || cart.length === 0}
                className="w-full bg-primary text-white py-6 rounded-2xl font-black text-xl shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale"
              >
                {loading ? 'Processing...' : 'Place Order'}
                <CheckCircle2 className="w-6 h-6" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
