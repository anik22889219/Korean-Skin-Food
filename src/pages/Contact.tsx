import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Phone, Mail, MapPin, Clock, Instagram, Facebook } from 'lucide-react';

export const Contact: React.FC = () => {
  const whatsapp = import.meta.env.VITE_WHATSAPP_NUMBER || '8801755837545';
  const waLink = `https://wa.me/${whatsapp}?text=${encodeURIComponent('আমি Korean Skin Food সম্পর্কে জানতে চাই।')}`;

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 space-y-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-5xl font-black tracking-tighter text-gray-900">যোগাযোগ করুন</h1>
        <p className="text-gray-500 text-lg max-w-md mx-auto">
          যেকোনো প্রশ্ন বা সাহায্যের জন্য আমাদের সাথে যোগাযোগ করুন।
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Cards */}
        <div className="space-y-5">
          {[
            {
              icon: MessageCircle,
              color: 'text-emerald-500',
              bg: 'bg-emerald-50',
              label: 'WhatsApp',
              value: '+880 1755 837545',
              href: waLink,
              cta: 'এখনই মেসেজ করুন',
            },
            {
              icon: Phone,
              color: 'text-blue-500',
              bg: 'bg-blue-50',
              label: 'ফোন',
              value: '+880 1755 837545',
              href: `tel:+8801755837545`,
              cta: 'কল করুন',
            },
            {
              icon: Instagram,
              color: 'text-pink-500',
              bg: 'bg-pink-50',
              label: 'Instagram',
              value: '@korean_skin_food_2579',
              href: import.meta.env.VITE_INSTAGRAM_URL || 'https://www.instagram.com/korean_skin_food_2579',
              cta: 'ফলো করুন',
            },
            {
              icon: Facebook,
              color: 'text-indigo-500',
              bg: 'bg-indigo-50',
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
              className="flex items-center gap-5 bg-white border border-gray-100 rounded-3xl p-5 hover:border-primary hover:shadow-md transition-all group"
            >
              <div className={`w-12 h-12 ${item.bg} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{item.label}</p>
                <p className="font-bold text-gray-900">{item.value}</p>
              </div>
              <span className="text-xs font-black text-primary opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {item.cta} →
              </span>
            </motion.a>
          ))}
        </div>

        {/* Business Info + Map Placeholder */}
        <div className="space-y-5">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 space-y-5">
            <h3 className="text-xl font-black text-gray-900 tracking-tight">ব্যবসার তথ্য</h3>
            <div className="space-y-4">
              {[
                { icon: Clock, label: 'সময়সূচি', value: 'রবিবার – শুক্রবার, সকাল ১০টা – রাত ১০টা' },
                { icon: MapPin, label: 'অবস্থান', value: 'ঢাকা, বাংলাদেশ' },
                { icon: MessageCircle, label: 'WhatsApp অর্ডার', value: 'ক্যাশ অন ডেলিভারি — সারা বাংলাদেশে' },
              ].map((info, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <info.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{info.label}</p>
                    <p className="text-sm text-gray-700 font-medium">{info.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-primary/5 border border-primary/10 rounded-3xl p-6 space-y-3">
            <h3 className="text-lg font-black text-gray-900">ডেলিভারি চার্জ</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">ঢাকার ভেতরে</span>
                <span className="font-black text-primary">৳60</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">ঢাকার বাইরে</span>
                <span className="font-black text-primary">৳120</span>
              </div>
            </div>
          </div>

          {/* WhatsApp CTA */}
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            id="contact-whatsapp-cta"
            className="flex items-center justify-center gap-3 w-full bg-emerald-500 text-white py-5 rounded-3xl font-black text-lg shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 transition-colors"
          >
            <MessageCircle className="w-6 h-6" />
            WhatsApp-এ কথা বলুন
          </a>
        </div>
      </div>
    </div>
  );
};
