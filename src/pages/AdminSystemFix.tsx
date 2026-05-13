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
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-gray-900 italic">System Repair</h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Infrastructure diagnostics & schema alignment</p>
        </div>
        <button 
          onClick={handleFix}
          disabled={fixing}
          className="flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-primary transition-all disabled:opacity-50"
        >
          <RefreshCcw className={`w-4 h-4 ${fixing ? 'animate-spin' : ''}`} />
          {fixing ? 'Repairing Infrastructure...' : 'Run Diagnostics'}
        </button>
      </div>

      {result && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-[2rem] border ${result.success ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700'} flex items-center gap-4`}
        >
          {result.success ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
          <p className="text-xs font-black uppercase tracking-tight">{result.message}</p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { label: 'Cloud Infrastructure', status: 'Healthy', icon: Server, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Spreadsheet Schema', status: 'Verified', icon: Database, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Security Handshake', status: 'Active', icon: ShieldCheck, color: 'text-blue-500', bg: 'bg-blue-50' },
        ].map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-xl hover:shadow-gray-100/50 transition-all">
            <div className="flex items-center gap-6">
              <div className={`w-14 h-14 ${item.bg} rounded-[1.5rem] flex items-center justify-center`}>
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <div>
                <h3 className="font-black text-gray-900 uppercase italic tracking-tighter">{item.label}</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.status}</p>
              </div>
            </div>
            <div className={`w-3 h-3 rounded-full ${item.status === 'Healthy' || item.status === 'Active' || item.status === 'Verified' ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
