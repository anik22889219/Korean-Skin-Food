import React from 'react';
import { MessageCircle, ExternalLink, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminWhatsApp() {
  const whatsapp = import.meta.env.VITE_WHATSAPP_NUMBER || '+8801755837545';

  return (
    <div className="space-y-12 pb-12">
      <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-gray-900 uppercase italic">WhatsApp CRM</h1>
          <p className="text-xs font-black text-gray-500 uppercase tracking-widest mt-2">হোয়াটসঅ্যাপ লিড এবং চ্যাট ম্যানেজমেন্ট</p>
        </div>

        <a 
          href={`https://wa.me/${whatsapp}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-8 py-4 bg-emerald-500 text-white rounded-full font-black text-[10px] uppercase tracking-widest transition-all shadow-[0_10px_40px_rgba(16,185,129,0.2)] hover:shadow-[0_20px_40px_rgba(16,185,129,0.4)] hover:scale-[1.02] active:scale-95"
        >
          <MessageCircle className="w-4 h-4" />
          Open WhatsApp Web
        </a>
      </div>

      <div className="bg-white rounded-[3rem] border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] p-16 text-center space-y-6">
        <div className="w-24 h-24 bg-emerald-50 rounded-[2rem] flex items-center justify-center mx-auto shadow-sm">
          <MessageCircle className="w-10 h-10 text-emerald-500" />
        </div>
        <h3 className="text-2xl font-black tracking-tighter text-gray-900 uppercase italic">WhatsApp Integration API</h3>
        <p className="text-gray-500 text-sm max-w-md mx-auto font-black italic">
          অফিসিয়াল WhatsApp Business API কানেকশন সেটআপ করার জন্য Meta Developer Account ভেরিফিকেশন প্রয়োজন।
        </p>
        <div className="pt-6 flex justify-center">
          <button className="flex items-center gap-3 px-8 py-4 bg-[#FDF9F6] text-gray-900 rounded-full font-black text-[10px] uppercase tracking-widest transition-all shadow-sm border border-orange-50 hover:bg-gray-50">
            <Settings className="w-4 h-4" /> API সেটআপ গাইড
          </button>
        </div>
      </div>
    </div>
  );
}
