import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, ShieldCheck, Truck, Heart, BadgeCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HeroBanner: React.FC = () => {
  return (
    <div className="lg:col-span-8 space-y-8">
      {/* Premium Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-[2rem] overflow-hidden bg-[#FDF9F6] h-[450px] flex items-center shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-white"
      >
        {/* Abstract Soft Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[120%] bg-gradient-to-bl from-pink-200/40 via-primary/10 to-transparent rounded-full blur-[80px]"></div>
          <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[100%] bg-gradient-to-tr from-blue-100/40 via-transparent to-transparent rounded-full blur-[80px]"></div>
        </div>
        
        {/* High-end Editorial Image */}
        <div className="absolute inset-y-0 right-0 w-[55%]">
          {/* Fading gradient to blend image with background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FDF9F6] via-transparent to-transparent z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=1200&auto=format&fit=crop" 
            alt="Korean Skincare Splash"
            className="w-full h-full object-cover object-left-top opacity-90"
            loading="eager"
          />
        </div>
        
        <div className="relative z-20 p-8 md:p-14 flex flex-col justify-center h-full w-full max-w-lg">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/60 backdrop-blur-md rounded-full border border-white shadow-sm mb-6 w-max"
          >
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-gray-800">Glass Skin Journey</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-[#1A1A1A] text-4xl md:text-[3.5rem] font-black leading-[1.1] tracking-tighter mb-6 uppercase italic"
          >
            Authentic <br/>
            <span className="text-primary">K-Beauty</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-500 font-medium text-sm md:text-base leading-relaxed mb-8 max-w-sm"
          >
            Directly sourced from Seoul. Discover your perfect ritual with 100% authentic Korean skincare essentials.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-4"
          >
            <Link to="/shop" className="px-8 py-3.5 bg-gray-900 hover:bg-gray-800 text-white rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-gray-900/20 flex items-center gap-2">
              Shop Now
              <ArrowRight className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2 px-4">
              <BadgeCheck className="w-5 h-5 text-green-500" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase text-gray-800 leading-none">100% Original</span>
                <span className="text-[9px] font-medium text-gray-400">Guaranteed</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Action Icons Row */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { icon: ShieldCheck, title: 'Authentic', desc: 'Sourced from Korea', color: 'bg-[#FDF9F6] text-orange-400 border-orange-100' },
          { icon: Truck, title: 'Fast Delivery', desc: 'Inside & Outside Dhaka', color: 'bg-[#F4F8FB] text-blue-400 border-blue-100' },
          { icon: Heart, title: 'Curated', desc: 'For Your Skin Type', color: 'bg-[#FFF5F7] text-pink-400 border-pink-100' },
          { icon: Sparkles, title: 'Latest Trends', desc: 'New Arrivals Weekly', color: 'bg-[#F6F5FA] text-purple-400 border-purple-100' }
        ].map((feature, i) => (
          <div key={i} className={`flex items-center gap-3 p-4 rounded-2xl border ${feature.color} bg-opacity-50 transition-transform hover:-translate-y-1`}>
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
              <feature.icon className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black uppercase tracking-wider text-gray-900">{feature.title}</span>
              <span className="text-[10px] font-medium text-gray-500">{feature.desc}</span>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};
