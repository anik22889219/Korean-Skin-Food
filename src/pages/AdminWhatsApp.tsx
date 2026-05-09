import React from 'react';
import { MessageCircle, ExternalLink, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminWhatsApp() {
  const whatsapp = import.meta.env.VITE_WHATSAPP_NUMBER || '+8801755837545';

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-gray-900">WhatsApp CRM</h1>
          <p className="text-gray-500 font-mono text-sm">হোয়াটসঅ্যাপ লিড এবং চ্যাট ম্যানেজমেন্ট</p>
        </div>

        <a 
          href={`https://wa.me/${whatsapp}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-emerald-500 text-white px-5 py-3 rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          Open WhatsApp Web
        </a>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center space-y-4">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageCircle className="w-10 h-10 text-emerald-500" />
        </div>
        <h3 className="text-xl font-black text-gray-900">WhatsApp Integration API</h3>
        <p className="text-gray-500 text-sm max-w-md mx-auto">
          অফিসিয়াল WhatsApp Business API কানেকশন সেটআপ করার জন্য Meta Developer Account ভেরিফিকেশন প্রয়োজন।
        </p>
        <div className="pt-4 flex justify-center">
          <button className="flex items-center gap-2 text-primary font-bold hover:underline">
            <Settings className="w-4 h-4" /> API সেটআপ গাইড
          </button>
        </div>
      </div>
    </div>
  );
}
