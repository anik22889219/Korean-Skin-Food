import React from 'react';
import { ShieldCheck, Server, Database, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminSystemFix() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-gray-900">System Fix</h1>
          <p className="text-gray-500 font-mono text-sm">সিস্টেম হেলথ এবং ট্রাবলশুটিং</p>
        </div>
        <button className="flex items-center gap-2 bg-gray-900 text-white px-5 py-3 rounded-xl text-sm font-bold shadow-lg hover:bg-black transition-colors">
          <RefreshCcw className="w-4 h-4" />
          Run Diagnostics
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { label: 'API Connection', status: 'Healthy', icon: Server, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Database Sync', status: 'Healthy', icon: Database, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Security Protocols', status: 'Active', icon: ShieldCheck, color: 'text-blue-500', bg: 'bg-blue-50' },
        ].map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${item.bg} rounded-2xl flex items-center justify-center`}>
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <div>
                <h3 className="font-black text-gray-900">{item.label}</h3>
                <p className="text-sm font-bold text-gray-500">{item.status}</p>
              </div>
            </div>
            <div className={`w-3 h-3 rounded-full ${item.status === 'Healthy' || item.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
