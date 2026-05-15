import React from 'react';
import { motion } from 'framer-motion';
import { Search, Copy, Plane, Box, Edit3, Globe, ArrowRight } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  return (
    <div className="lg:col-span-8 space-y-8">
      {/* Premium Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-[2rem] overflow-hidden bg-[#0A0F1C] h-[400px] flex items-center shadow-2xl"
      >
        {/* Abstract Gradient Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-[50%] -right-[20%] w-[100%] h-[150%] bg-gradient-to-b from-primary/20 to-transparent rounded-full blur-[120px] mix-blend-screen"></div>
          <div className="absolute -bottom-[50%] -left-[20%] w-[80%] h-[120%] bg-gradient-to-t from-blue-500/20 to-transparent rounded-full blur-[100px] mix-blend-screen"></div>
        </div>
        
        <img 
          src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1200&auto=format&fit=crop" 
          alt="Banner Background"
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity"
          loading="eager" // Hero images should generally be eager loaded
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0F1C] via-[#0A0F1C]/90 to-transparent"></div>
        
        <div className="relative z-10 p-12 md:p-16 flex flex-col justify-center h-full max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 mb-6"
          >
            <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-primary/30 backdrop-blur-md">
              Global Sourcing
            </span>
            <span className="text-gray-400 text-sm font-medium flex items-center gap-1">
              <Globe className="w-4 h-4" /> B2B Portal
            </span>
          </motion.div>

          <h1 className="text-white text-4xl md:text-6xl font-black mb-6 leading-[1.1] tracking-tight">
            Import Products <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
              List in Your Store
            </span> <br />
            Ship Globally
          </h1>
          
          <div className="flex items-center gap-4 mt-4">
            <button className="px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary/30 flex items-center gap-2 group">
              Start Importing Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold backdrop-blur-md border border-white/10 transition-colors">
              View Catalog
            </button>
          </div>
        </div>
      </motion.div>

      {/* Premium Action Icons Row */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 md:grid-cols-5 gap-4"
      >
        {[
          { icon: Search, label: 'Global Sourcing', sub: 'Any Platform', color: 'from-blue-500 to-cyan-400' },
          { icon: Copy, label: '1-Click Listing', sub: 'Multiple Stores', color: 'from-purple-500 to-pink-500' },
          { icon: Plane, label: 'Fast Shipping', sub: '7-15 Days', color: 'from-primary to-orange-400' },
          { icon: Box, label: 'Fulfillment', sub: 'End-to-End', color: 'from-emerald-400 to-teal-500' },
          { icon: Edit3, label: 'Custom Sourcing', sub: 'On Demand', color: 'from-amber-400 to-orange-500' }
        ].map((action, i) => (
          <div key={i} className="group relative bg-white rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 transition-all cursor-pointer overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none" style={{ backgroundImage: `var(--tw-gradient-stops)` }}></div>
            <div className="flex flex-col items-center text-center gap-3 relative z-10">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${action.color} shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-800 leading-tight mb-1">{action.label}</h4>
                <p className="text-[10px] text-gray-400 font-medium">{action.sub}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};
