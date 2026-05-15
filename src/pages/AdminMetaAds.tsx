import React from 'react';
import { BarChart3, Settings, Play } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminMetaAds() {
  const pixelId = import.meta.env.VITE_META_PIXEL_ID || 'Not Configured';

  return (
    <div className="space-y-12 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-gray-900 uppercase italic">Meta Ads & Pixel</h1>
          <p className="text-xs font-black text-gray-500 uppercase tracking-widest mt-2">ফেসবুক পিক্সেল এবং ইভেন্ট ট্র্যাকিং</p>
        </div>
        <div className="inline-flex items-center gap-3 bg-white border border-blue-100 text-blue-500 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-[0_5px_15px_rgba(59,130,246,0.1)]">
          <Settings className="w-4 h-4" />
          Analytics Configuration
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-10 rounded-[3rem] border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] h-full">
          <div className="w-16 h-16 bg-blue-50 rounded-[1.5rem] flex items-center justify-center mb-8 border border-blue-100 shadow-sm">
            <BarChart3 className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-xl font-black text-gray-900 mb-6 italic tracking-tighter">Meta Pixel Status</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-4 border-b border-gray-50">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Pixel ID</span>
              <span className="text-xs font-black text-gray-900 bg-[#FDF9F6] border border-orange-50 px-4 py-2 rounded-full">{pixelId}</span>
            </div>
            <div className="flex justify-between items-center py-4 border-b border-gray-50">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Status</span>
              <span className="text-xs font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-full">Active</span>
            </div>
            <div className="flex justify-between items-center py-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Page Views</span>
              <span className="text-xs font-black text-blue-600 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full">Tracking...</span>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-10 rounded-[3rem] border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] h-full">
          <div className="w-16 h-16 bg-purple-50 rounded-[1.5rem] flex items-center justify-center mb-8 border border-purple-100 shadow-sm">
            <Play className="w-8 h-8 text-purple-500 ml-1" />
          </div>
          <h3 className="text-xl font-black text-gray-900 mb-4 italic tracking-tighter">Event Testing</h3>
          <p className="text-sm font-medium text-gray-500 mb-8 leading-relaxed">
            ইভেন্ট ট্র্যাকিং ঠিকভাবে কাজ করছে কিনা চেক করতে নিচের বাটনটি ব্যবহার করুন।
          </p>
          <button className="w-full bg-gray-900 text-white py-6 rounded-full font-black text-xs uppercase tracking-widest shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:scale-[1.02] active:scale-[0.98] transition-all border border-gray-800">
            Test "Add to Cart" Event
          </button>
        </motion.div>
      </div>
    </div>
  );
}
