import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Droplets, Sparkles, Sun, Flower2, Wind, Heart, Star, Gift } from 'lucide-react';
import { motion } from 'motion/react';

const CATEGORIES = [
  { icon: Droplets, label: 'Cleansers', gradient: 'from-[#E0F2FE] to-[#F0F9FF]', iconColor: 'text-[#0284C7]' },
  { icon: Wind, label: 'Toners', gradient: 'from-[#E0E7FF] to-[#EEF2FF]', iconColor: 'text-[#4F46E5]' },
  { icon: Sparkles, label: 'Serums', gradient: 'from-[#FEF08A] to-[#FEF9C3]', iconColor: 'text-[#CA8A04]' },
  { icon: Heart, label: 'Moisturizers', gradient: 'from-[#FCE7F3] to-[#FDF2F8]', iconColor: 'text-[#DB2777]' },
  { icon: Sun, label: 'Sun Care', gradient: 'from-[#FFEDD5] to-[#FFF7ED]', iconColor: 'text-[#EA580C]' },
  { icon: Flower2, label: 'Masks', gradient: 'from-[#D1FAE5] to-[#ECFDF5]', iconColor: 'text-[#059669]' },
  { icon: Star, label: 'Eye Care', gradient: 'from-[#F3E8FF] to-[#FAF5FF]', iconColor: 'text-[#9333EA]' },
  { icon: Gift, label: 'Sets', gradient: 'from-[#FFE4E6] to-[#FFF1F2]', iconColor: 'text-[#E11D48]' },
];

export const CategoryNavigation: React.FC = () => {
  return (
    <section className="space-y-8 pt-8">
      <div className="flex items-end justify-between border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">Shop By <span className="text-primary">Ritual</span></h2>
          <p className="text-sm font-medium text-gray-400 mt-1">Curated essentials for every step of your routine</p>
        </div>
        <Link to="/shop" className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1 hover:gap-2 transition-all">
          View All <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      
      <div className="flex gap-4 md:gap-6 overflow-x-auto pb-8 hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        {CATEGORIES.map((cat, i) => (
          <Link 
            key={i} 
            to={`/shop?category=${cat.label}`} 
            className="flex flex-col items-center gap-4 min-w-[100px] md:min-w-[120px] group"
          >
            <motion.div 
              whileHover={{ y: -5, scale: 1.05 }}
              className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center bg-gradient-to-br ${cat.gradient} shadow-sm group-hover:shadow-[0_10px_40px_rgba(0,0,0,0.08)] transition-all duration-300 border-4 border-white`}
            >
              <cat.icon className={`w-8 h-8 md:w-10 md:h-10 ${cat.iconColor} group-hover:scale-110 transition-transform duration-300`} strokeWidth={1.5} />
            </motion.div>
            <span className="text-xs md:text-sm font-black text-gray-700 text-center uppercase tracking-widest">{cat.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};
