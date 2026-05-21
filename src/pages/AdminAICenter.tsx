import React from 'react';
import { Bot, Activity, BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminAICenter() {
  return (
    <div className="space-y-12 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-gray-900 uppercase italic">AI Center</h1>
          <p className="text-xs font-black text-gray-500 uppercase tracking-widest mt-2">Gemini AI কনফিগারেশন এবং লগস</p>
        </div>
        <div className="inline-flex items-center gap-3 bg-white border border-purple-100 text-purple-500 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-[0_5px_15px_rgba(168,85,247,0.1)]">
          <BrainCircuit className="w-4 h-4" />
          Neural Engine Active
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-[3rem] border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] flex items-center gap-6">
          <div className="w-16 h-16 bg-pink-50 rounded-[1.5rem] flex items-center justify-center border border-pink-100 shadow-sm">
            <Bot className="w-8 h-8 text-primary" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Sabiha AI Chatbot</p>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <p className="text-xl font-black text-gray-900 tracking-tighter italic">Online</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-8 rounded-[3rem] border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] flex items-center gap-6">
          <div className="w-16 h-16 bg-blue-50 rounded-[1.5rem] flex items-center justify-center border border-blue-100 shadow-sm">
            <BrainCircuit className="w-8 h-8 text-blue-500" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Model Version</p>
            <p className="text-lg font-black text-gray-900 tracking-tighter italic">gemini-1.5-flash</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-8 rounded-[3rem] border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] flex items-center gap-6">
          <div className="w-16 h-16 bg-purple-50 rounded-[1.5rem] flex items-center justify-center border border-purple-100 shadow-sm">
            <Activity className="w-8 h-8 text-purple-500" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Requests Today</p>
            <p className="text-3xl font-black text-gray-900 tracking-tighter italic">124</p>
          </div>
        </motion.div>
      </div>

      <div className="bg-gray-900 rounded-[3rem] p-10 text-white space-y-6 font-mono shadow-[0_20px_50px_rgba(0,0,0,0.15)] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] -mr-32 -mt-32 rounded-full group-hover:bg-emerald-500/20 transition-all duration-700 pointer-events-none" />
        <div className="relative z-10">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">System Logs (Live)</h3>
              </div>
              <span className="text-[10px] text-gray-500 bg-white/5 px-3 py-1 rounded-full border border-white/10">Auto-refreshing...</span>
            </div>
            <div className="space-y-4 text-xs h-64 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              <div className="flex gap-4">
                  <span className="text-gray-500">[10:42:01]</span>
                  <span className="text-blue-400 font-bold">INFO:</span>
                  <span className="text-gray-300">User connected to chatbot session</span>
              </div>
              <div className="flex gap-4">
                  <span className="text-gray-500">[10:45:12]</span>
                  <span className="text-purple-400 font-bold">SYSTEM:</span>
                  <span className="text-gray-300">Model gemini-1.5-flash initialized</span>
              </div>
              <div className="flex gap-4">
                  <span className="text-gray-500">[10:46:05]</span>
                  <span className="text-yellow-400 font-bold">AI:</span>
                  <span className="text-gray-300">Generated response (latency: 1.2s)</span>
              </div>
              <div className="flex gap-4">
                  <span className="text-gray-500">[10:46:08]</span>
                  <span className="text-emerald-400 font-bold">SUCCESS:</span>
                  <span className="text-gray-300">Response delivered</span>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
