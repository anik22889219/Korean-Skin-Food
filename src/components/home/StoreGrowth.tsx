import React from 'react';
import { Search, ShieldCheck, Plane, Box } from 'lucide-react';

export const StoreGrowth: React.FC = () => {
  return (
    <section className="relative rounded-[2.5rem] overflow-hidden bg-gray-900 p-10 lg:p-16 mt-20 shadow-2xl">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/95 to-gray-900/80"></div>
      
      <div className="relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="bg-white/10 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-white/20 backdrop-blur-md mb-6 inline-block">
            Complete Solution
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
            Grow Your Store <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">We Handle the Rest</span>
          </h2>
          <p className="text-lg text-gray-400 font-medium">From global sourcing to local doorstep delivery, we provide the ultimate end-to-end dropshipping infrastructure.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Search, title: 'Smart Sourcing', desc: 'Discover winning products with AI-driven analytics across multiple global platforms.' },
            { icon: ShieldCheck, title: 'Verified Suppliers', desc: 'Work only with pre-vetted, high-quality manufacturers ensuring product authenticity.' },
            { icon: Plane, title: 'Express Logistics', desc: 'Optimized shipping routes with real-time tracking and end-to-end transparency.' },
            { icon: Box, title: 'Local Fulfillment', desc: 'Access our strategically located hubs for faster, more reliable last-mile delivery.' }
          ].map((feature, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md hover:bg-white/10 transition-colors group">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-bold text-white mb-3">{feature.title}</h4>
              <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
