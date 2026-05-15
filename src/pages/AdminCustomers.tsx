import React, { useState } from 'react';
import { Search, Download, User, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminCustomers() {
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-12">
      <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-gray-900 uppercase italic">Customers</h1>
          <p className="text-xs font-black text-gray-500 uppercase tracking-widest mt-2">Customer List & Order History</p>
        </div>

        <button className="flex items-center gap-2 px-6 py-4 bg-white border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] text-gray-700 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all hover:scale-[1.02] active:scale-95">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Customers', value: '1,248', icon: User, color: 'text-blue-600', bg: 'bg-blue-50/50', border: 'border-blue-100/50' },
          { label: 'Repeat Customers', value: '342', icon: ShoppingBag, color: 'text-emerald-600', bg: 'bg-emerald-50/50', border: 'border-emerald-100/50' },
          { label: 'Active This Month', value: '89', icon: User, color: 'text-purple-600', bg: 'bg-purple-50/50', border: 'border-purple-100/50' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-[3rem] p-8 border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all group"
          >
             <div className={`${stat.bg} border ${stat.border} w-full h-full rounded-[2rem] p-6 flex justify-between items-start group-hover:scale-[1.02] transition-transform`}>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                <p className={`text-4xl tracking-tighter italic font-black mt-2 ${stat.color}`}>{stat.value}</p>
              </div>
              <div className={`w-12 h-12 bg-white rounded-[1rem] shadow-sm flex items-center justify-center flex-shrink-0`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white p-6 rounded-[3rem] border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] flex flex-col md:flex-row gap-6 items-center">
        <div className="relative w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-[#FDF9F6] border border-orange-50 rounded-full text-xs font-bold outline-none focus:ring-2 focus:ring-gray-900/10 transition-all placeholder:text-gray-400 placeholder:font-bold"
          />
        </div>
      </div>

      {/* Empty State for now */}
      <div className="bg-white rounded-[3rem] border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] p-20 text-center space-y-6">
        <div className="w-24 h-24 bg-[#FDF9F6] rounded-[2rem] border border-orange-50 flex items-center justify-center mx-auto mb-6">
          <User className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic">Coming Soon</h3>
        <p className="text-gray-500 text-sm max-w-sm mx-auto font-bold">
          Customer database connection is being set up. You will soon see the full customer list here.
        </p>
      </div>
    </div>
  );
}
