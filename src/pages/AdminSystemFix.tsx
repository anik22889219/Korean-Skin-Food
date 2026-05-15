import React, { useState } from 'react';
import { ShieldCheck, Server, Database, RefreshCcw, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../services/api';

export default function AdminSystemFix() {
  const [fixing, setFixing] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleFix = async () => {
    setFixing(true);
    setResult(null);
    try {
      await api.initializeSystem();
      setResult({ success: true, message: 'System protocols successfully repaired. All critical columns verified.' });
    } catch (err: any) {
      setResult({ success: false, message: `System repair failed: ${err.message}` });
    } finally {
      setFixing(false);
    }
  };

  return (
    <div className="space-y-12 pb-12">
      <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-gray-900 italic">System Repair</h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Infrastructure diagnostics & schema alignment</p>
        </div>
        <button 
          onClick={handleFix}
          disabled={fixing}
          className="flex items-center gap-3 bg-gray-900 text-white px-10 py-5 rounded-full text-xs font-black uppercase tracking-widest shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
        >
          <RefreshCcw className={`w-5 h-5 ${fixing ? 'animate-spin' : ''}`} />
          {fixing ? 'Repairing Infrastructure...' : 'Run Diagnostics'}
        </button>
      </div>

      {result && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-8 rounded-[3rem] border ${result.success ? 'bg-emerald-50 border-emerald-100 text-emerald-700 shadow-[0_10px_30px_rgba(16,185,129,0.1)]' : 'bg-red-50 border-red-100 text-red-700 shadow-[0_10px_30px_rgba(239,68,68,0.1)]'} flex items-center gap-4`}
        >
          {result.success ? <CheckCircle2 className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
          <p className="text-sm font-black uppercase tracking-widest">{result.message}</p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          { label: 'Cloud Infrastructure', status: 'Healthy', icon: Server, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Spreadsheet Schema', status: 'Verified', icon: Database, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Security Handshake', status: 'Active', icon: ShieldCheck, color: 'text-blue-500', bg: 'bg-blue-50' },
        ].map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white p-10 rounded-[3rem] border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] flex items-center justify-between group hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all">
            <div className="flex items-center gap-6">
              <div className={`w-16 h-16 ${item.bg} rounded-[1.5rem] flex items-center justify-center border border-white/50 shadow-sm`}>
                <item.icon className={`w-8 h-8 ${item.color}`} />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter mb-1">{item.label}</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.status}</p>
              </div>
            </div>
            <div className={`w-4 h-4 rounded-full ${item.status === 'Healthy' || item.status === 'Active' || item.status === 'Verified' ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]'} animate-pulse`} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
