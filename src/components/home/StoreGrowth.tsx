import React from 'react';
import { Sparkles, ShieldCheck, Plane, Heart } from 'lucide-react';

export const StoreGrowth: React.FC = () => {
  return (
    <section className="relative rounded-[2.5rem] overflow-hidden bg-gray-950 p-10 lg:p-16 mt-20 shadow-2xl">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=2000&auto=format&fit=crop')] opacity-[0.03] bg-cover bg-center mix-blend-overlay"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950"></div>
      
      <div className="relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="bg-white/5 text-white/80 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] border border-white/10 backdrop-blur-md mb-6 inline-block">
            The Korean Skin Food Promise
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tighter leading-tight italic">
            Unveil Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-300 to-pink-300">Natural Glow</span>
          </h2>
          <p className="text-sm md:text-base text-gray-400 font-medium leading-relaxed max-w-lg mx-auto">
            Directly sourced from top South Korean brands. We ensure 100% authenticity, premium quality, and transformative results in every single bottle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Sparkles, title: '100% Authentic', desc: 'Directly sourced from trusted Korean manufacturers and official distributors.' },
            { icon: ShieldCheck, title: 'Dermatologist Tested', desc: 'Safe, highly effective ingredients curated for diverse skin types and concerns.' },
            { icon: Plane, title: 'Direct from Seoul', desc: 'Imported straight from the beauty capital of the world directly to your doorstep.' },
            { icon: Heart, title: 'Ethical Beauty', desc: 'Partnering with conscious brands that care for the environment and your skin.' }
          ].map((feature, idx) => (
            <div key={idx} className="bg-white/5 border border-white/5 p-8 rounded-[2rem] backdrop-blur-md hover:bg-white/10 hover:border-white/10 transition-all duration-500 group">
              <div className="w-14 h-14 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:-translate-y-2 group-hover:shadow-[0_10px_40px_rgba(255,255,255,0.1)] transition-all duration-500 border border-white/5">
                <feature.icon className="w-6 h-6 text-white group-hover:text-primary transition-colors" strokeWidth={1.5} />
              </div>
              <h4 className="text-lg font-black text-white mb-3 tracking-wide">{feature.title}</h4>
              <p className="text-sm text-gray-400 leading-relaxed font-medium">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
