import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Heart, Package, MapPin, Calendar, Trash2 } from 'lucide-react';
import { api } from '../services/api';
import { Order } from '../types';

interface WishlistItem {
  product_id: string;
  name: string;
  price: number;
  image: string;
}

export const CustomerDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'wishlist'>('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    const fetchOrders = async () => {
      try {
        const data = await api.getUserOrders(user.phone);
        setOrders(data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const mockWishlist: WishlistItem[] = [
    {
      product_id: '1',
      name: 'Premium Face Serum',
      price: 1200,
      image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=300&fit=crop',
    },
    {
      product_id: '2',
      name: 'Hydrating Mask',
      price: 850,
      image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=300&fit=crop',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'processing':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'shipped':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'delivered':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'processing':
        return '⚙️';
      case 'shipped':
        return '🚚';
      case 'delivered':
        return '✅';
      default:
        return '📦';
    }
  };

  const menuItems = [
    { label: 'Browse Products', icon: '🛍️', href: '/shop' },
    { label: 'Track Orders', icon: '📍', href: '/track-order' },
    { label: 'My Account', icon: '👤', href: '/account' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50 pt-20 pb-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}! 👋</h1>
              <p className="text-gray-500 mt-2">Manage your orders and account</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex gap-4 border-b">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === 'overview'
                ? 'bg-pink-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === 'orders'
                ? 'bg-pink-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📦 Orders
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === 'wishlist'
                ? 'bg-pink-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            ❤️ Wishlist
          </button>
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="text-3xl font-bold text-pink-600">{orders.length}</div>
                <p className="text-gray-600 text-sm mt-1">Total Orders</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="text-3xl font-bold text-green-600">
                  ৳{orders.reduce((sum, o) => sum + (o.total || 0), 0)}
                </div>
                <p className="text-gray-600 text-sm mt-1">Total Spent</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="text-3xl font-bold text-purple-600">{mockWishlist.length}</div>
                <p className="text-gray-600 text-sm mt-1">Wishlist Items</p>
              </div>
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {menuItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow text-center group cursor-pointer"
                >
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-pink-600 transition-colors">
                    {item.label}
                  </h3>
                </a>
              ))}
            </div>

            {/* Account Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Account Information</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium text-gray-900">{user?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium text-gray-900">{user?.email || 'Not provided'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium text-gray-900">{user?.phone || 'Not provided'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Account Type:</span>
                  <span className="font-medium text-pink-600">Customer</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Order History</h2>
            {loading ? (
              <div className="text-center text-gray-500 py-12">Loading orders...</div>
            ) : orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.order_id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Package className="w-5 h-5 text-pink-600" />
                        <div>
                          <h3 className="font-bold text-gray-900">{order.order_id}</h3>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(order.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(order.status)}`}>
                        {getStatusEmoji(order.status)} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        {order.items?.length || 0} {order.items?.length === 1 ? 'item' : 'items'}
                      </div>
                      <button className="text-pink-600 font-semibold hover:text-pink-700 transition-colors">
                        View Details
                      </button>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total:</span>
                        <span className="text-lg font-bold text-gray-900">৳{order.total}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <p className="text-lg">📭 No orders yet</p>
                <p className="text-sm mt-2">Start shopping to see your orders here</p>
                <button
                  onClick={() => navigate('/shop')}
                  className="mt-4 px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-medium"
                >
                  Browse Products
                </button>
              </div>
            )}
          </div>
        )}

        {/* WISHLIST TAB */}
        {activeTab === 'wishlist' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">My Wishlist</h2>
            {mockWishlist.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockWishlist.map((item) => (
                  <div
                    key={item.product_id}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative overflow-hidden bg-gray-100 h-48">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <button
                        onClick={() => {
                          setWishlist(wishlist.filter(w => w.product_id !== item.product_id));
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-2">{item.name}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-pink-600">৳{item.price}</span>
                        <button className="bg-pink-500 text-white px-3 py-1 rounded-lg hover:bg-pink-600 transition-colors text-sm font-semibold">
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <p className="text-lg">💔 Your wishlist is empty</p>
                <p className="text-sm mt-2">Add products to your wishlist while browsing</p>
                <button
                  onClick={() => navigate('/shop')}
                  className="mt-4 px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-medium"
                >
                  Browse Products
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
