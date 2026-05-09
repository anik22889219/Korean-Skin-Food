import React from 'react';
import { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Eye, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const [added, setAdded] = React.useState(false);

  const name = language === 'en' ? product.name_en : product.name_bn;
  const isOutOfStock = product.stock <= 0;
  const hasDiscount = product.discount_price && product.discount_price < product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const mainImage = (product.images && product.images.length > 0) 
    ? product.images[0] 
    : 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1000&auto=format&fit=crop';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
    >
      <Link to={`/product/${product.product_id}`} className="block aspect-[4/5] overflow-hidden relative">
        <img 
          src={mainImage} 
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.dataset.fallback) {
              target.dataset.fallback = '1';
              target.src = 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=600&auto=format&fit=crop';
            }
          }}
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {hasDiscount && (
            <span className="bg-[#FF3B30] text-white text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-tighter shadow-lg shadow-red-500/20">
              -{Math.round(((product.price - product.discount_price!) / product.price) * 100)}%
            </span>
          )}
          {product.is_featured && (
            <span className="bg-primary text-white text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-tighter shadow-lg shadow-primary/20">
              Featured
            </span>
          )}
        </div>

        {/* Quick Action Overlay */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
           <button className="bg-white p-3 rounded-full shadow-lg transform translate-y-10 group-hover:translate-y-0 transition-transform duration-500 delay-75">
            <Eye className="w-5 h-5 text-gray-800" />
           </button>
        </div>
      </Link>

      <div className="p-4 space-y-2">
        <div className="flex items-center gap-1">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
          </div>
          <span className="text-[10px] text-gray-400 font-medium">(24)</span>
        </div>

        <Link to={`/product/${product.product_id}`} className="block">
          <h3 className="text-sm font-bold text-gray-900 line-clamp-2 min-h-[40px] group-hover:text-primary transition-colors">
            {name}
          </h3>
        </Link>

        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{product.category}</p>

        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-col">
            {hasDiscount ? (
              <>
                <span className="text-primary font-black text-lg">৳{product.discount_price?.toLocaleString()}</span>
                <span className="text-gray-400 text-xs line-through">৳{product.price.toLocaleString()}</span>
              </>
            ) : (
              <span className="text-gray-900 font-black text-lg">৳{product.price.toLocaleString()}</span>
            )}
          </div>

          <button
            disabled={isOutOfStock || added}
            onClick={handleAddToCart}
            className={`p-3 rounded-xl transition-all duration-300 flex items-center justify-center min-w-[44px] ${
              isOutOfStock 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : added
                  ? 'bg-green-500 text-white'
                  : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
            }`}
          >
            {added ? (
              <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <ShoppingBag className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
