import React from 'react';
import { motion } from 'motion/react';
import { Truck, MapPin, CheckCircle2 } from 'lucide-react';

export const ShippingCalculator: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
      className="lg:col-span-4 bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col h-full relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[50px] pointer-events-none"></div>

      <div className="flex items-center gap-2 mb-8 font-bold text-gray-900 text-[10px] uppercase tracking-widest border-b border-gray-100 pb-4">
        <MapPin className="w-4 h-4 text-primary" />
        <span>Delivery Across Bangladesh</span>
      </div>
      
      {/* Decorative Path */}
      <div className="bg-[#FDF9F6] rounded-2xl p-6 mb-8 flex items-center justify-between border border-orange-50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/40 via-transparent to-transparent pointer-events-none"></div>
          <div className="text-center relative z-10">
            <p className="font-black text-gray-900 text-[10px] uppercase tracking-widest">Dhaka</p>
          </div>
          <div className="flex-1 px-4 relative flex items-center justify-center">
            <div className="absolute w-full border-t-2 border-dashed border-primary/20"></div>
            <div className="bg-[#FDF9F6] relative z-10 px-3 text-primary">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-center relative z-10">
            <p className="font-black text-gray-900 text-[10px] uppercase tracking-widest">Nationwide</p>
          </div>
      </div>

      <div className="flex-1 space-y-5 mb-8">
        <div className="flex justify-between text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 pb-2">
          <span>Region</span>
          <span>Time</span>
          <span className="text-right">Charge</span>
        </div>
        {[
          { name: 'Dhaka City', cost: '৳60', time: '24-48 Hours' },
          { name: 'Suburbs (Savar, Gazipur)', cost: '৳100', time: '2-3 Days' },
          { name: 'Outside Dhaka', cost: '৳120', time: '3-5 Days' },
        ].map((method, idx) => (
          <div key={idx} className="flex justify-between items-center group py-1.5 border-b border-gray-50 last:border-0">
            <span className="text-xs font-bold text-gray-800 w-[45%] flex items-center gap-2">
              <CheckCircle2 className="w-3 h-3 text-primary/50" />
              {method.name}
            </span>
            <span className="text-[10px] font-semibold text-gray-400 w-[30%] text-center">{method.time}</span>
            <span className="text-xs font-black text-gray-900 w-[25%] text-right">{method.cost}</span>
          </div>
        ))}
      </div>

      <div className="bg-primary/5 text-primary px-4 py-4 rounded-xl border border-primary/10 text-[10px] font-black text-center uppercase tracking-[0.1em] leading-relaxed relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 bg-white/40 rounded-full blur-xl translate-x-1/2 -translate-y-1/2"></div>
        🎉 Free Delivery inside Dhaka <br/> on orders over <span className="text-sm">৳2000!</span>
      </div>
    </motion.div>
  );
};
