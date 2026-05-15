import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { ShoppingBag, ChevronLeft, MapPin, Phone, User, CheckCircle2, Package, Tag, X, ChevronDown, ShieldCheck } from 'lucide-react';
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
    area: 'Dhaka City'
  });
  
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState<string | null>(null);

  // Task 2.6 - Coupon Code
  const COUPONS: Record<string, { type: 'percent' | 'flat'; value: number; label: string }> = {
    'WELCOME10': { type: 'percent', value: 10, label: '10% ছাড়' },
    'SAVE50':    { type: 'flat',    value: 50, label: '৳50 ছাড়' },
    'KSF100':    { type: 'flat',    value: 100, label: '৳100 ছাড়' },
    'SUMMER20':  { type: 'percent', value: 20, label: '20% ছাড়' },
  };
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState('');

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) { setCouponError('Please enter a coupon code.'); return; }
    if (COUPONS[code]) {
      setAppliedCoupon(code);
      setCouponError('');
      setCouponInput('');
    } else {
      setCouponError('Invalid coupon. Try again.');
    }
  };

  const couponDiscount = appliedCoupon && COUPONS[appliedCoupon]
    ? COUPONS[appliedCoupon].type === 'percent'
      ? Math.round(subtotal * COUPONS[appliedCoupon].value / 100)
      : COUPONS[appliedCoupon].value
    : 0;

  const isInsideDhaka = formData.area === 'Dhaka City';
  const isSuburbs = ['Savar', 'Keraniganj', 'Gazipur', 'Narayanganj'].includes(formData.area);
  const deliveryCharge = isInsideDhaka && subtotal >= 2000 ? 0 : isInsideDhaka ? 60 : isSuburbs ? 100 : 120;
  const total = subtotal + deliveryCharge - couponDiscount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    // Basic validation — BD phone format
    const bdPhone = formData.phone.replace(/\D/g, '');
    if (!formData.name || !formData.phone || !formData.address) {
      alert('Please fill out all required fields.');
      return;
    }
    if (bdPhone.length < 10 || bdPhone.length > 13) {
      alert('Please enter a valid Bangladeshi phone number.');
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
        
        // Task 3.6 — Send SMS Notification to BD customer
        api.sendOrderConfirmationSMS(formData.phone, res.order_id, total).catch(console.error);

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
      <div className="bg-[#FDF9F6] min-h-[80vh] flex flex-col items-center justify-center space-y-8 px-4">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-md">
           <CheckCircle2 className="w-12 h-12 text-primary" />
        </div>
        <div className="space-y-4 text-center max-w-lg">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900 italic">Order Confirmed</h2>
          <p className="text-gray-500 font-medium">Your ritual is on its way. Order ID: <span className="text-primary font-black">#{orderComplete}</span></p>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-4">Please confirm via the opened WhatsApp chat.</p>
        </div>
        <Link to="/" className="inline-block bg-gray-900 text-white px-12 py-4 rounded-full text-xs uppercase tracking-widest font-black shadow-xl shadow-gray-900/20 active:scale-95 transition-transform">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FDF9F6] min-h-screen pb-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="flex items-center justify-between mb-12 border-b border-orange-50 pb-6">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900 italic">Secure <span className="text-primary">Checkout</span></h1>
          <Link to="/cart" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Return to Bag
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-[3rem] border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] space-y-8">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-8 flex items-center gap-3">
               <ShieldCheck className="w-5 h-5 text-green-500" />
               Shipping Information
            </h3>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input 
                    required
                    type="text" 
                    placeholder="Enter your name..."
                    className="w-full pl-12 pr-4 py-4 bg-[#FDF9F6] border border-orange-50 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input 
                     required
                     type="tel" 
                     placeholder="017XXXXXXXX"
                     className="w-full pl-12 pr-4 py-4 bg-[#FDF9F6] border border-orange-50 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                     value={formData.phone}
                     onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Full Address</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-5 translate-y-0 w-4 h-4 text-gray-300" />
                  <textarea 
                     required
                     rows={3}
                     placeholder="House no, Road no, Area..."
                     className="w-full pl-12 pr-4 py-4 bg-[#FDF9F6] border border-orange-50 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none resize-none transition-all"
                     value={formData.address}
                     onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Delivery Zone</label>
                 <div className="relative">
                   <select
                     required
                     value={formData.area}
                     onChange={(e) => setFormData({...formData, area: e.target.value})}
                     className="w-full px-4 py-4 bg-[#FDF9F6] border border-orange-50 rounded-2xl text-[11px] font-black uppercase tracking-widest focus:ring-2 focus:ring-primary/20 outline-none appearance-none cursor-pointer text-gray-700 transition-all"
                   >
                     <optgroup label="Inside Dhaka (৳60)">
                       <option value="Dhaka City">Dhaka City</option>
                     </optgroup>
                     <optgroup label="Dhaka Suburbs (৳100)">
                       <option value="Savar">Savar</option>
                       <option value="Keraniganj">Keraniganj</option>
                       <option value="Gazipur">Gazipur</option>
                       <option value="Narayanganj">Narayanganj</option>
                     </optgroup>
                     <optgroup label="Outside Dhaka (৳120)">
                       <option value="Outside Dhaka">Other Districts</option>
                     </optgroup>
                   </select>
                   <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                 </div>
              </div>
              
              {/* Payment Method */}
              <div className="space-y-3 pt-4 border-t border-gray-50">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Payment Method</label>
                <div className="flex items-center gap-4 p-5 bg-white border border-green-100 rounded-2xl shadow-sm">
                  <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                    💵
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] uppercase tracking-widest font-black text-gray-900">Cash on Delivery</p>
                    <p className="text-xs font-medium text-gray-500 mt-0.5">Pay when you receive your package</p>
                  </div>
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  </div>
                </div>
                {isInsideDhaka && subtotal >= 2000 && (
                  <div className="flex items-center gap-2 px-4 py-3 bg-primary/5 rounded-xl border border-primary/10">
                    <span className="text-primary text-[10px] uppercase tracking-widest font-black">✨ Free Delivery! (Dhaka 2000৳+)</span>
                  </div>
                )}
              </div>
            </div>
          </form>

          {/* Summary Overlay */}
          <div className="space-y-8 sticky top-32">
             <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] space-y-8">
                <h3 className="text-sm font-black tracking-widest uppercase text-gray-900 flex items-center justify-between">
                  <span>Order Summary</span>
                  <Package className="w-4 h-4 text-gray-400" />
                </h3>

                <div className="space-y-6 max-h-[30vh] overflow-y-auto pr-2 scrollbar-hide">
                  {cart.map((item, idx) => (
                    <div key={`${item.product_id}-${idx}`} className="flex justify-between items-center gap-4 group">
                       <img src={item.images[0]} className="w-14 h-14 rounded-2xl object-cover mix-blend-multiply bg-[#FDF9F6]" />
                       <div className="flex-1">
                         <p className="text-xs font-bold text-gray-900 line-clamp-1">{language === 'en' ? item.name_en : item.name_bn}</p>
                         <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Qty: {item.quantity}</p>
                       </div>
                       <p className="font-black text-sm text-gray-900">৳{((item.discount_price || item.price) * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 pt-6 border-t border-orange-50">
                  <div className="flex justify-between font-medium text-sm text-gray-500">
                    <span>Subtotal</span>
                    <span className="text-gray-900 font-bold">৳{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-medium text-sm text-gray-500">
                    <span>Delivery Charge</span>
                    <span className="text-gray-900 font-bold">৳{deliveryCharge.toLocaleString()}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between font-bold text-[10px] uppercase tracking-widest text-primary">
                      <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {appliedCoupon}</span>
                      <span>-৳{couponDiscount.toLocaleString()}</span>
                    </div>
                  )}

                  {/* Coupon Input */}
                  <div className="pt-2">
                    {appliedCoupon ? (
                      <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-2xl px-4 py-3">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary">✨ {appliedCoupon} applied!</p>
                          <p className="text-xs font-medium text-gray-600">{COUPONS[appliedCoupon]?.label} received</p>
                        </div>
                        <button onClick={() => setAppliedCoupon(null)} className="text-gray-400 hover:text-red-500 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Gift card or discount code"
                            className="flex-1 px-4 py-3 bg-[#FDF9F6] border border-orange-50 rounded-2xl text-xs font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            value={couponInput}
                            onChange={e => { setCouponInput(e.target.value); setCouponError(''); }}
                            onKeyDown={e => e.key === 'Enter' && applyCoupon()}
                          />
                          <button
                            type="button"
                            onClick={applyCoupon}
                            className="px-6 py-3 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-sm"
                          >Apply</button>
                        </div>
                        {couponError && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest ml-2">{couponError}</p>}
                      </div>
                    )}
                  </div>
                  <div className="pt-6 mt-4 border-t border-orange-50 flex justify-between items-end">
                     <div>
                       <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Payable Total</p>
                       <p className="text-4xl font-black text-gray-900 tracking-tighter italic">৳{total.toLocaleString()}</p>
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
                  className="w-full bg-gray-900 text-white py-5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl shadow-gray-900/20 hover:bg-gray-800 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale mt-4"
                >
                  {loading ? 'Processing...' : 'Complete Order'}
                  <CheckCircle2 className="w-4 h-4" />
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
