import React from 'react';
import { Bot, Activity, BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminAICenter() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-gray-900">AI Center</h1>
          <p className="text-gray-500 font-mono text-sm">Gemini AI কনফিগারেশন এবং লগস</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center">
            <Bot className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">Sabiha AI Chatbot</p>
            <p className="text-lg font-black text-emerald-500">Online</p>
          </div>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
            <BrainCircuit className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">Model Version</p>
            <p className="text-lg font-black text-gray-900">gemini-2.0-flash-exp</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center">
            <Activity className="w-6 h-6 text-purple-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">Requests Today</p>
            <p className="text-lg font-black text-gray-900">124</p>
          </div>
        </motion.div>
      </div>

      <div className="bg-gray-950 rounded-3xl p-8 text-white space-y-4 font-mono">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          <h3 className="text-lg font-bold">System Logs (Live)</h3>
        </div>
        <div className="space-y-2 text-sm opacity-80 h-48 overflow-y-auto">
          <p>[10:42:01] INFO: User connected to chatbot session</p>
          <p>[10:45:12] SYSTEM: Model gemini-2.0-flash-exp initialized</p>
          <p>[10:46:05] AI: Generated response (latency: 1.2s)</p>
          <p className="text-emerald-400">[10:46:08] SUCCESS: Response delivered</p>
        </div>
      </div>
    </div>
  );
}
