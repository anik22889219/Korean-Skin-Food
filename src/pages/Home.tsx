import React from 'react';
import { api } from '../services/api';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, Copy, Plane, Box, Edit3, 
  Baby, Glasses, Watch, Laptop, Gem, Bike, Shirt, Smartphone,
  Flame, Star, ChevronRight, ArrowRight, ShieldCheck, Globe
} from 'lucide-react';

export const Home: React.FC = () => {
  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => api.getProducts(),
  });

  return (
    <div className="bg-[#F4F6F8] min-h-screen pb-20 font-sans">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-16">
        
        {/* Top Section: Hero Banner + Shipping Calculator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Hero Banner Area */}
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

          {/* Premium Shipping Calculator Widget */}
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
        </div>

        {/* Premium Shop by Categories */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Source by Category</h2>
            <Link to="/shop" className="text-sm font-bold text-primary flex items-center gap-1 hover:gap-2 transition-all">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-6 hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {[
              { icon: Baby, label: 'Kids & Babies', gradient: 'from-pink-100 to-pink-50', iconColor: 'text-pink-500' },
              { icon: Glasses, label: 'Sunglasses', gradient: 'from-gray-100 to-gray-50', iconColor: 'text-gray-600' },
              { icon: Watch, label: 'Smart Watch', gradient: 'from-blue-100 to-blue-50', iconColor: 'text-blue-500' },
              { icon: Laptop, label: 'Computer', gradient: 'from-indigo-100 to-indigo-50', iconColor: 'text-indigo-500' },
              { icon: Gem, label: 'Jewelry', gradient: 'from-amber-100 to-amber-50', iconColor: 'text-amber-500' },
              { icon: Bike, label: 'Bicycle', gradient: 'from-teal-100 to-teal-50', iconColor: 'text-teal-500' },
              { icon: Shirt, label: "Fashion", gradient: 'from-orange-100 to-orange-50', iconColor: 'text-orange-500' },
              { icon: Smartphone, label: 'Phones', gradient: 'from-purple-100 to-purple-50', iconColor: 'text-purple-500' },
            ].map((cat, i) => (
              <Link 
                key={i} 
                to={`/shop?category=${cat.label}`} 
                className="flex flex-col items-center gap-4 min-w-[100px] group"
              >
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center bg-gradient-to-br ${cat.gradient} shadow-sm group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-300 border border-white`}>
                  <cat.icon className={`w-8 h-8 ${cat.iconColor} group-hover:scale-110 transition-transform duration-300`} />
                </div>
                <span className="text-xs font-bold text-gray-700 text-center">{cat.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Premium Hot Selling Products */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Hot Selling Products</h2>
              </div>
              <p className="text-sm text-gray-500 font-medium">High margin products updated daily from global suppliers</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
                B2B Best Sellers
              </button>
              <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
                High Margin
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {products.slice(0, 10).map((product, idx) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                key={idx} 
                className="bg-white rounded-[1.25rem] p-4 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 group relative flex flex-col"
              >
                <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden relative mb-4">
                  <img 
                    src={product.image_url || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80'} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  {/* Premium Badge */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-md flex items-center gap-1.5 px-2 py-1 shadow-sm border border-white/50">
                    <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                    <span className="text-[9px] font-black uppercase tracking-wider text-gray-800">AliExpress</span>
                  </div>
                  
                  {/* Quick Action Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="bg-white text-gray-900 px-4 py-2 rounded-lg text-xs font-bold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl flex items-center gap-2 hover:bg-primary hover:text-white">
                      <Copy className="w-4 h-4" />
                      Add to Import List
                    </button>
                  </div>
                </div>
                
                <h3 className="text-sm font-bold text-gray-800 line-clamp-2 mb-3 leading-tight min-h-[40px] group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                
                <div className="flex items-center justify-between mb-4 mt-auto border-b border-gray-50 pb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-bold text-gray-700">4.9</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-orange-500" />
                    <span className="text-xs font-medium text-gray-500">{Math.floor(Math.random() * 5000) + 500} Sold</span>
                  </div>
                </div>
                
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-0.5">Sourcing Cost</span>
                    <span className="text-gray-900 font-black text-xl tracking-tight">৳{product.price}</span>
                  </div>
                  <button className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-900 hover:border-gray-900 hover:text-white transition-all shadow-sm active:scale-95">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Premium Grow Your Store Section */}
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

      </div>
    </div>
  );
};

