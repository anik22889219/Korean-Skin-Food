import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Heart, Sparkles, Globe, Map, PackageCheck, Box } from 'lucide-react';

export const About: React.FC = () => {
  useEffect(() => {
    document.title = "Our Story | Korean Skin Food — Premium K-Beauty Bangladesh";
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', 'Learn about Korean Skin Food Bangladesh. Authentic Beauty. Validated Roots.');
  }, []);

  return (
    <div className="min-h-screen bg-[#FDF9F6] py-16 md:py-32">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-32">
        
        {/* Hero Section */}
        <section className="text-center space-y-6 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-100/50 rounded-full blur-[120px] pointer-events-none" />
          
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white rounded-full border border-orange-50 shadow-[0_10px_40px_rgba(0,0,0,0.03)] relative z-10"
          >
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">Est. 2014</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-[8rem] font-black text-gray-900 tracking-tighter leading-[0.9] relative z-10 uppercase"
          >
            AUTHENTIC BEAUTY. <br />
            <span className="text-orange-400 italic">VALIDATED ROOTS.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-gray-500 font-medium text-lg md:text-xl leading-relaxed relative z-10"
          >
            The Ritual of Light. We are <strong className="text-gray-900">Korean Skin Food</strong> - bringing the timeless wisdom of Korean botanical traditions to a modern world seeking authenticity.
          </motion.p>
        </section>

        {/* Our Founders' Story */}
        <section className="bg-white rounded-[3rem] p-12 md:p-24 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-orange-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full md:w-1/2 h-full bg-orange-50/30 blur-[100px] rounded-full translate-x-1/3 pointer-events-none"></div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-block px-4 py-1.5 bg-orange-50 text-orange-600 font-black text-[10px] uppercase tracking-widest rounded-full">
                Our Founders' Story
              </div>
              <h2 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase leading-none text-gray-900">
                A Legacy of <br/><span className="text-orange-400">Love & Light</span>
              </h2>
              <blockquote className="text-2xl md:text-3xl font-medium text-gray-900 italic leading-snug border-l-4 border-orange-400 pl-6">
                "We didn't just want to create another skincare brand. We wanted to build a bridge—a way to share the timeless wisdom of Korean botanical traditions with a modern world seeking authenticity."
              </blockquote>
              <p className="text-gray-500 font-medium text-lg leading-relaxed">
                Born from a shared passion for pure ingredients and rigorous standards, Korean Skin Food began as a small initiative to bring high-potency, ethically sourced heritage ingredients to global markets. Today, our founders remain deeply involved in every step of the 'Ritual of Light'.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl relative z-10">
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop" alt="Founders" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-[#FDF9F6] rounded-[2rem] border border-orange-100 flex flex-col items-center justify-center shadow-xl z-20">
                 <Heart className="w-8 h-8 text-orange-400 mb-2" />
                 <span className="text-xs font-black uppercase tracking-widest text-gray-900 text-center">Built on<br/>Partnerships</span>
              </div>
            </div>
          </div>
        </section>

        {/* Quality Assurance */}
        <section className="space-y-16">
          <div className="text-center space-y-6">
            <div className="inline-block px-4 py-1.5 bg-white shadow-sm border border-orange-50 text-gray-900 font-black text-[10px] uppercase tracking-widest rounded-full">
              Quality Assurance
            </div>
            <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-gray-900">
              A Global Standard of Integrity
            </h2>
            <p className="max-w-3xl mx-auto text-gray-500 font-medium text-lg">
              Beyond formulation, we control every step of the journey. From our certified sorting facilities to climate-controlled transit, we ensure the botanical integrity of our products remains uncompromised from Korea to the world.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: Box,
                title: 'Inventory Precision',
                desc: 'Our warehouse operations utilize rigorous batch tracking to guarantee freshness and potency for every client.'
              },
              {
                icon: PackageCheck,
                title: 'Direct Logistics',
                desc: 'Proprietary cargo solutions eliminate third-party handling, preserving the sanctuary of our ingredients.'
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-[3rem] p-12 border border-orange-50 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.05)] transition-all group"
              >
                <div className="w-20 h-20 bg-[#FDF9F6] rounded-[1.5rem] flex items-center justify-center border border-orange-100 mb-8 transition-transform group-hover:scale-110">
                  <feature.icon className="w-8 h-8 text-orange-400" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tighter italic uppercase mb-4">{feature.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="bg-gray-900 rounded-[2rem] p-10 text-center shadow-xl relative overflow-hidden">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-orange-400/10 blur-[50px] pointer-events-none"></div>
             <p className="text-xl md:text-2xl font-medium text-white italic relative z-10">
               "Our reach is global, but our standard is singular. We treat every shipment as a ritual of trust."
             </p>
          </div>
        </section>

        {/* Reach & Reliability */}
        <section className="bg-white rounded-[3rem] p-12 md:p-24 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-orange-50 relative overflow-hidden">
           <div className="relative z-10 text-center space-y-12 max-w-4xl mx-auto">
             <div className="inline-block px-4 py-1.5 bg-orange-50 text-orange-600 font-black text-[10px] uppercase tracking-widest rounded-full">
                Reach & Reliability
             </div>
             <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-gray-900">
                Bridging Continents
             </h2>
             <p className="text-gray-500 font-medium text-lg leading-relaxed">
               From our meticulous operations hubs in South Korea to our specialized regional offices, we ensure every product arrives with its botanical potency fully preserved. We operate with a transparency that is as clear as the light we promote.
             </p>
             
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-10 border-t border-orange-50">
                <div className="space-y-2">
                  <h4 className="text-4xl font-black text-orange-400 italic">Secure</h4>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-900">Transit</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-4xl font-black text-orange-400 italic">Direct</h4>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-900">Channels</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-4xl font-black text-orange-400 italic">100%</h4>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-900">Verified Origins</p>
                </div>
             </div>
           </div>
        </section>
      </div>
    </div>
  );
};

