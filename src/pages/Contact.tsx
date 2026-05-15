import React from 'react';
import { motion } from 'motion/react';
import { MessageCircle, Phone, Mail, MapPin, Clock, Instagram, Facebook } from 'lucide-react';

export const Contact: React.FC = () => {
  const whatsapp = import.meta.env.VITE_WHATSAPP_NUMBER || '8801755837545';
  const waLink = `https://wa.me/${whatsapp}?text=${encodeURIComponent('আমি Korean Skin Food সম্পর্কে জানতে চাই।')}`;

  return (
    <div className="min-h-screen bg-[#FDF9F6] py-16 md:py-24">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white rounded-full border border-orange-50 shadow-sm mb-4">
            <MessageCircle className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">Get in Touch</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-gray-900 italic">যোগাযোগ <span className="text-primary">করুন</span></h1>
          <p className="text-gray-500 font-medium text-lg leading-relaxed">
            যেকোনো প্রশ্ন বা সাহায্যের জন্য আমাদের সাথে যোগাযোগ করুন।
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">
          {/* Contact Cards */}
          <div className="space-y-6">
            {[
              {
                icon: MessageCircle,
                color: 'text-emerald-500',
                bg: 'bg-emerald-50 border-emerald-100',
                label: 'WhatsApp',
                value: '+880 1755 837545',
                href: waLink,
                cta: 'এখনই মেসেজ করুন',
              },
              {
                icon: Phone,
                color: 'text-blue-500',
                bg: 'bg-blue-50 border-blue-100',
                label: 'ফোন',
                value: '+880 1755 837545',
                href: `tel:+8801755837545`,
                cta: 'কল করুন',
              },
              {
                icon: Instagram,
                color: 'text-pink-500',
                bg: 'bg-pink-50 border-pink-100',
                label: 'Instagram',
                value: '@korean_skin_food_2579',
                href: import.meta.env.VITE_INSTAGRAM_URL || 'https://www.instagram.com/korean_skin_food_2579',
                cta: 'ফলো করুন',
              },
              {
                icon: Facebook,
                color: 'text-indigo-500',
                bg: 'bg-indigo-50 border-indigo-100',
                label: 'Facebook',
                value: 'Korean Skin Food',
                href: import.meta.env.VITE_FACEBOOK_URL || 'https://www.facebook.com/share/1Cbu2BNywm/',
                cta: 'লাইক করুন',
              },
            ].map((item, i) => (
              <motion.a
                key={i}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-6 bg-white border border-white rounded-[2.5rem] p-6 hover:shadow-[0_20px_60px_rgba(0,0,0,0.05)] transition-all group shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:border-orange-50 relative overflow-hidden"
              >
                <div className={`w-16 h-16 rounded-[1.5rem] border flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${item.bg}`}>
                  <item.icon className={`w-7 h-7 ${item.color}`} />
                </div>
                <div className="flex-1 relative z-10">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                  <p className="text-xl font-black text-gray-900 tracking-tight italic">{item.value}</p>
                </div>
                <div className="px-5 py-2.5 bg-[#FDF9F6] border border-orange-50 rounded-full text-[10px] font-black text-gray-900 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 shadow-sm relative z-10 whitespace-nowrap hidden sm:block">
                  {item.cta} →
                </div>
              </motion.a>
            ))}
          </div>

          {/* Business Info + Map Placeholder */}
          <div className="space-y-6">
            <div className="bg-white border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] rounded-[3rem] p-8 md:p-12 space-y-8 relative overflow-hidden">
               {/* Decorative background element */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

              <h3 className="text-3xl font-black text-gray-900 tracking-tighter italic relative z-10">ব্যবসায়িক <span className="text-primary">তথ্য</span></h3>
              <div className="space-y-6 relative z-10">
                {[
                  { icon: Clock, label: 'সময়সূচি', value: 'রবিবার – শুক্রবার, সকাল ১০টা – রাত ১০টা' },
                  { icon: MapPin, label: 'অবস্থান', value: 'ঢাকা, বাংলাদেশ' },
                  { icon: MessageCircle, label: 'WhatsApp অর্ডার', value: 'ক্যাশ অন ডেলিভারি — সারা বাংলাদেশে' },
                ].map((info, i) => (
                  <div key={i} className="flex items-start gap-5 p-4 rounded-3xl hover:bg-[#FDF9F6] transition-colors border border-transparent hover:border-orange-50">
                    <div className="w-12 h-12 bg-white shadow-sm border border-orange-50 rounded-[1rem] flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{info.label}</p>
                      <p className="text-base text-gray-900 font-bold">{info.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-white border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] rounded-[3rem] p-8 md:p-10">
              <h3 className="text-xl font-black text-gray-900 mb-6 italic tracking-tight">ডেলিভারি চার্জ</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-5 bg-[#FDF9F6] border border-orange-50 rounded-2xl">
                  <span className="text-sm font-bold text-gray-600">ঢাকার ভেতরে</span>
                  <span className="text-xl font-black text-gray-900">৳৬০</span>
                </div>
                <div className="flex justify-between items-center p-5 bg-[#FDF9F6] border border-orange-50 rounded-2xl">
                  <span className="text-sm font-bold text-gray-600">ঢাকার বাইরে</span>
                  <span className="text-xl font-black text-gray-900">৳১২০</span>
                </div>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              id="contact-whatsapp-cta"
              className="flex items-center justify-center gap-3 w-full bg-[#128C7E] text-white py-6 rounded-full font-black text-sm uppercase tracking-widest shadow-xl shadow-[#128C7E]/20 hover:bg-[#075E54] hover:shadow-2xl hover:shadow-[#128C7E]/30 transition-all hover:scale-[1.02] active:scale-95"
            >
              <MessageCircle className="w-6 h-6" />
              WhatsApp-এ কথা বলুন
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
