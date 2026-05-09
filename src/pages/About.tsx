import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Heart, Sparkles, Globe } from 'lucide-react';

export const About: React.FC = () => {
  useEffect(() => {
    document.title = "Our Story | Korean Skin Food — Premium K-Beauty Bangladesh";
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', 'Learn about Korean Skin Food Bangladesh. We provide 100% authentic South Korean skincare products, directly sourced from Seoul. Discover our mission to bring the authentic "Glass Skin" glow to you.');
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 md:py-32 space-y-24">
      {/* Hero */}
      <section className="text-center space-y-6">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="inline-block px-6 py-2 bg-primary/5 rounded-full border border-primary/10 text-primary font-black text-[10px] uppercase tracking-widest italic"
        >
          Our Story
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-5xl md:text-8xl font-black text-gray-900 tracking-tighter leading-none"
        >
          AUTHENTICITY <br />
          <span className="text-primary italic">MEETS BEAUTY</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto text-gray-500 font-medium text-lg leading-relaxed"
        >
          We are <strong>Korean Skin Food</strong> - your premium gateway to authentic South Korean skincare. 
          Founded with a passion for "Glass Skin" and a commitment to quality, we bring the best of Seoul to your doorstep.
        </motion.p>
      </section>

      {/* Philosophy */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { icon: ShieldCheck, title: '100% Authentic', desc: 'Directly sourced from verified Korean manufacturers and wholesalers.' },
          { icon: Heart, title: 'Curated for You', desc: 'Every product is handpicked and tested for different skin types.' },
          { icon: Sparkles, title: 'Latest Trends', desc: 'Fresh arrivals from Seoul every week to keep your glow updated.' },
          { icon: Globe, title: 'Made in Korea', desc: 'We only stock original products manufactured in South Korea.' }
        ].map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-10 bg-white rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-100 transition-all text-center space-y-4"
          >
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto text-primary">
              <item.icon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-gray-900 tracking-tighter italic uppercase">{item.title}</h3>
            <p className="text-sm text-gray-400 font-medium leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Message */}
      <section className="bg-gray-950 rounded-[4rem] p-12 md:p-24 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/20 blur-[150px] rounded-full translate-x-1/2"></div>
        <div className="relative z-10 max-w-3xl space-y-8">
          <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase whitespace-pre-wrap">
            Love yourself, {"\n"}<span className="text-primary">Love your skin.</span>
          </h2>
          <p className="text-gray-400 font-medium text-lg md:text-xl leading-relaxed">
            Skincare is not just a routine; it's a form of self-love. We believe that everyone deserves to feel confident in their own skin. That's why we don't just sell products; we offer solutions for a healthier, more radiant you.
          </p>
          <div className="pt-8 flex items-center gap-6">
            <div className="w-16 h-16 rounded-full border-2 border-primary overflow-hidden">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover" alt="Founder" />
            </div>
            <div>
              <p className="font-black italic uppercase tracking-widest text-sm">Sara Kim</p>
              <p className="text-[10px] uppercase font-bold text-primary tracking-widest">Co-Founder, K-SkinFood</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
