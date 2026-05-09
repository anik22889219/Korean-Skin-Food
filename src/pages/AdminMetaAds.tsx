import React from 'react';
import { BarChart3, Settings, Play } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminMetaAds() {
  const pixelId = import.meta.env.VITE_META_PIXEL_ID || 'Not Configured';

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-gray-900">Meta Ads & Pixel</h1>
          <p className="text-gray-500 font-mono text-sm">ফেসবুক পিক্সেল এবং ইভেন্ট ট্র্যাকিং</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
            <BarChart3 className="w-6 h-6 text-blue-500" />
          </div>
          <h3 className="text-lg font-black text-gray-900 mb-2">Meta Pixel Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-3 border-b border-gray-50">
              <span className="text-sm font-bold text-gray-500">Pixel ID</span>
              <span className="text-sm font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">{pixelId}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-50">
              <span className="text-sm font-bold text-gray-500">Status</span>
              <span className="text-sm font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded">Active</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-sm font-bold text-gray-500">Page Views</span>
              <span className="text-sm font-bold text-gray-900">Tracking...</span>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-6">
            <Play className="w-6 h-6 text-purple-500" />
          </div>
          <h3 className="text-lg font-black text-gray-900 mb-2">Event Testing</h3>
          <p className="text-sm text-gray-500 mb-6">
            ইভেন্ট ট্র্যাকিং ঠিকভাবে কাজ করছে কিনা চেক করতে নিচের বাটনটি ব্যবহার করুন।
          </p>
          <button className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-black transition-colors">
            Test "Add to Cart" Event
          </button>
        </motion.div>
      </div>
    </div>
  );
}
