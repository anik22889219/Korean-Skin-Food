import React, { useState } from 'react';
import { Search, Download, User, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminCustomers() {
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-gray-900">Customers</h1>
          <p className="text-gray-500 font-mono text-sm">গ্রাহক তালিকা এবং অর্ডার হিস্ট্রি</p>
        </div>

        <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Customers', value: '1,248', icon: User, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Repeat Customers', value: '342', icon: ShoppingBag, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Active This Month', value: '89', icon: User, color: 'text-purple-500', bg: 'bg-purple-50' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-3xl font-black text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="নাম বা ফোন নম্বর দিয়ে খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-gray-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
          />
        </div>
      </div>

      {/* Empty State for now */}
      <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center space-y-4">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-10 h-10 text-gray-300" />
        </div>
        <h3 className="text-xl font-black text-gray-900">শীঘ্রই আসছে</h3>
        <p className="text-gray-500 text-sm max-w-sm mx-auto">
          Customers ডেটাবেস কানেকশন সেটআপ চলছে। শীঘ্রই আপনি এখানে সমস্ত গ্রাহকের তালিকা দেখতে পাবেন।
        </p>
      </div>
    </div>
  );
}
