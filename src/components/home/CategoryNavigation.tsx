import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Baby, Glasses, Watch, Laptop, Gem, Bike, Shirt, Smartphone } from 'lucide-react';

const CATEGORIES = [
  { icon: Baby, label: 'Kids & Babies', gradient: 'from-pink-100 to-pink-50', iconColor: 'text-pink-500' },
  { icon: Glasses, label: 'Sunglasses', gradient: 'from-gray-100 to-gray-50', iconColor: 'text-gray-600' },
  { icon: Watch, label: 'Smart Watch', gradient: 'from-blue-100 to-blue-50', iconColor: 'text-blue-500' },
  { icon: Laptop, label: 'Computer', gradient: 'from-indigo-100 to-indigo-50', iconColor: 'text-indigo-500' },
  { icon: Gem, label: 'Jewelry', gradient: 'from-amber-100 to-amber-50', iconColor: 'text-amber-500' },
  { icon: Bike, label: 'Bicycle', gradient: 'from-teal-100 to-teal-50', iconColor: 'text-teal-500' },
  { icon: Shirt, label: "Fashion", gradient: 'from-orange-100 to-orange-50', iconColor: 'text-orange-500' },
  { icon: Smartphone, label: 'Phones', gradient: 'from-purple-100 to-purple-50', iconColor: 'text-purple-500' },
];

export const CategoryNavigation: React.FC = () => {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Source by Category</h2>
        <Link to="/shop" className="text-sm font-bold text-primary flex items-center gap-1 hover:gap-2 transition-all">
          View All <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-6 hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        {CATEGORIES.map((cat, i) => (
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
  );
};
