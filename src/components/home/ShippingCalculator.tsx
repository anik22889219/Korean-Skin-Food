import React from 'react';
import { motion } from 'framer-motion';
import { Plane, Globe } from 'lucide-react';

export const ShippingCalculator: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
      className="lg:col-span-4 bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col h-full relative overflow-hidden"
    >
      {/* Subtle background element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[50px] pointer-events-none"></div>

      <div className="flex items-center justify-between mb-8">
        <h3 className="font-black text-lg text-gray-900 tracking-tight">Shipping Route</h3>
        <div className="p-2 bg-gray-50 rounded-lg">
          <Globe className="w-5 h-5 text-gray-400" />
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-2xl p-4 mb-8 flex items-center justify-between border border-gray-100">
          <div className="text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">From</p>
            <p className="font-black text-gray-900 text-lg">China</p>
          </div>
          <div className="flex-1 px-4 relative flex items-center justify-center">
            <div className="absolute w-full border-t-2 border-dashed border-gray-300"></div>
            <div className="bg-gray-50 relative z-10 px-2">
              <Plane className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">To</p>
            <p className="font-black text-gray-900 text-lg">BD</p>
          </div>
      </div>

      <div className="flex-1 space-y-4 mb-8">
        <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest pb-3 border-b border-gray-100">
          <span>Method</span>
          <span>Est. Time</span>
        </div>
        {[
          { name: 'Air Express Cargo', time: '10-15 days', fast: true },
          { name: 'MoveDrop Global', time: '10-15 days', fast: false },
          { name: 'China Post Reg.', time: '7-25 days', fast: false },
        ].map((method, idx) => (
          <div key={idx} className="flex justify-between items-center group cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors -mx-2">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${method.fast ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
              <span className="text-sm font-medium text-gray-700">{method.name}</span>
            </div>
            <span className="text-sm font-bold text-gray-900">{method.time}</span>
          </div>
        ))}
      </div>

      <button className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-gray-900/20 active:scale-[0.98]">
        Calculate Shipping Cost
      </button>
    </motion.div>
  );
};
