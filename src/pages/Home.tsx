import React from 'react';
import { useProducts } from '../hooks/queries/useProducts';
import { HeroBanner } from '../components/home/HeroBanner';
import { ShippingCalculator } from '../components/home/ShippingCalculator';
import { CategoryNavigation } from '../components/home/CategoryNavigation';
import { FeaturedProducts } from '../components/home/FeaturedProducts';
import { StoreGrowth } from '../components/home/StoreGrowth';

export const Home: React.FC = () => {
  const { data: products = [], isError } = useProducts();

  return (
    <div className="bg-[#F4F6F8] min-h-screen pb-20 font-sans">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-16">
        
        {/* Top Section: Hero Banner + Shipping Calculator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <HeroBanner />
          <ShippingCalculator />
        </div>

        {/* Premium Shop by Categories */}
        <CategoryNavigation />

        {/* Premium Hot Selling Products */}
        {!isError ? (
          <FeaturedProducts products={products} />
        ) : (
          <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-red-100">
            <p className="text-red-500 font-medium">Failed to load featured products. Please try refreshing.</p>
          </div>
        )}

        {/* Premium Grow Your Store Section */}
        <StoreGrowth />

      </div>
    </div>
  );
};
