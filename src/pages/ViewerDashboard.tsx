import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  badge?: string;
}

export const ViewerDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
    fetchProducts();
  }, [user, navigate]);

  const fetchProducts = async () => {
    setLoading(true);
    // Mock data - replace with actual API call
    const mockFeatured: Product[] = [
      {
        id: '1',
        name: 'Premium Face Serum',
        price: 1200,
        image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=300&fit=crop',
        rating: 4.8,
        reviews: 234,
        badge: 'Best Seller',
      },
      {
        id: '2',
        name: 'Hydrating Facial Mask',
        price: 850,
        image: 'https://images.unsplash.com/photo-1617634924626-92292c2c2f37?w=300&h=300&fit=crop',
        rating: 4.6,
        reviews: 189,
        badge: 'New',
      },
      {
        id: '3',
        name: 'Brightening Sheet Mask',
        price: 450,
        image: 'https://images.unsplash.com/photo-1620293915637-c51194221d37?w=300&h=300&fit=crop',
        rating: 4.7,
        reviews: 312,
      },
      {
        id: '4',
        name: 'Anti-Aging Eye Cream',
        price: 1800,
        image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=300&fit=crop',
        rating: 4.9,
        reviews: 456,
        badge: 'Premium',
      },
    ];

    const mockRecommendations: Product[] = [
      {
        id: '5',
        name: 'Gentle Cleansing Oil',
        price: 650,
        image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=300&fit=crop',
        rating: 4.5,
        reviews: 156,
      },
      {
        id: '6',
        name: 'Vitamin C Essence',
        price: 1100,
        image: 'https://images.unsplash.com/photo-1617634924626-92292c2c2f37?w=300&h=300&fit=crop',
        rating: 4.7,
        reviews: 287,
      },
      {
        id: '7',
        name: 'Hydration Boost Serum',
        price: 950,
        image: 'https://images.unsplash.com/photo-1620293915637-c51194221d37?w=300&h=300&fit=crop',
        rating: 4.6,
        reviews: 198,
      },
      {
        id: '8',
        name: 'Soothing Toner',
        price: 520,
        image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=300&fit=crop',
        rating: 4.4,
        reviews: 127,
      },
    ];

    setFeaturedProducts(mockFeatured);
    setRecommendations(mockRecommendations);
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { label: 'Browse Products', icon: '🛍️', href: '/shop' },
    { label: 'Search', icon: '🔍', href: '/search' },
    { label: 'Special Offers', icon: '🎁', href: '/offers' },
    { label: 'About Us', icon: 'ℹ️', href: '/about' },
  ];

  const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
      <div className="relative overflow-hidden bg-gray-100 h-48">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {product.badge && (
          <div className="absolute top-3 right-3 bg-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            {product.badge}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${i < Math.round(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-600 ml-2">({product.reviews})</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-pink-600">৳{product.price}</span>
          <button className="bg-pink-500 text-white p-2 rounded-lg hover:bg-pink-600 transition-colors">
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome to Korean Skin Food 👋</h1>
              <p className="text-gray-500 mt-2">Browse and explore our premium skincare products</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">👁️ Viewer Account</h2>
          <p className="text-blue-700 text-sm">
            You are viewing the store as a guest. Create a customer account to place orders and track deliveries.
          </p>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {menuItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow text-center group cursor-pointer"
            >
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {item.label}
              </h3>
            </a>
          ))}
        </div>

        {/* Featured Products */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">✨ Featured Products</h2>
            <a href="/shop" className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
              View All →
            </a>
          </div>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading products...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

        {/* Recommended For You */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">💡 Recommended For You</h2>
            <a href="/shop" className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
              View All →
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendations.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-4xl mb-3">🚚</div>
            <h3 className="font-semibold text-gray-900 mb-2 text-lg">Fast Delivery</h3>
            <p className="text-gray-600 text-sm">Nationwide delivery across Bangladesh within 2-3 days</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-4xl mb-3">✅</div>
            <h3 className="font-semibold text-gray-900 mb-2 text-lg">100% Authentic</h3>
            <p className="text-gray-600 text-sm">Genuine Korean skincare products directly from verified suppliers</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-4xl mb-3">💬</div>
            <h3 className="font-semibold text-gray-900 mb-2 text-lg">Expert Support</h3>
            <p className="text-gray-600 text-sm">24/7 support via chat, WhatsApp, and email from skincare experts</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-3">Ready to Shop?</h2>
          <p className="text-blue-100 mb-6">Create an account to enjoy exclusive offers and track your orders</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/shop')}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors"
            >
              Start Shopping
            </button>
            <button
              onClick={() => navigate('/account')}
              className="bg-blue-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors border-2 border-white"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewerDashboard;
