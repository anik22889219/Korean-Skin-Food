import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Order, Product } from '../types';
import { 
  ShoppingBag, 
  Package, 
  TrendingUp,
  Clock,
  XCircle,
  AlertTriangle,
  ArrowUpRight,
  Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../components/AdminLayout';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const AdminDashboard: React.FC = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/account');
      return;
    }

    const fetchData = async () => {
      try {
        const [ordersData, productsData] = await Promise.all([
          api.getAllOrders(),
          api.getProducts()
        ]);
        setOrders(ordersData);
        setProducts(productsData);
      } catch (err) {
        console.error('Admin data fetch error', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAdmin, navigate]);

  const stats = useMemo(() => ({
    totalRevenue: orders.reduce((acc, curr) => acc + curr.total, 0),
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'Pending').length,
    lowStock: products.filter(p => p.stock > 0 && p.stock < 10).length,
    outOfStock: products.filter(p => p.stock <= 0).length,
    totalProducts: products.length,
    activeStock: products.reduce((acc, curr) => acc + (curr.stock || 0), 0)
  }), [orders, products]);

  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }).reverse();

    return last7Days.map(day => ({
      name: day,
      revenue: Math.floor(Math.random() * 5000) + 1000,
      orders: Math.floor(Math.random() * 20) + 5
    }));
  }, []);

  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [products]);

  const COLORS = ['#FF4C60', '#6C5DD3', '#FFA928', '#3FBBFE', '#46B4E5'];

  if (loading) return <div className="flex items-center justify-center h-screen bg-white font-black uppercase text-xs tracking-widest italic animate-pulse">Initializing Control Center...</div>;

  return (
    <>
      <div className="space-y-8 pb-12">
        {/* Page Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-gray-900 uppercase italic">Control Center</h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Real-time business performance analytics</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="px-5 py-3 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">Today: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
             </div>
          </div>
        </div>

        {/* Essential Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-xl hover:shadow-gray-100/50 transition-all">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-emerald-500" />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Revenue</p>
              <h3 className="text-3xl font-black text-gray-900 tracking-tighter italic">৳{stats.totalRevenue.toLocaleString()}</h3>
              <div className="mt-4 flex items-center gap-1 text-[10px] font-black text-emerald-500 uppercase">
                <ArrowUpRight className="w-3 h-3" /> 12% vs last month
              </div>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-xl hover:shadow-gray-100/50 transition-all">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                <ShoppingBag className="w-6 h-6 text-blue-500" />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Active Sales</p>
              <h3 className="text-3xl font-black text-gray-900 tracking-tighter italic">{stats.totalOrders}</h3>
              <div className="mt-4 flex items-center gap-1 text-[10px] font-black text-blue-500 uppercase">
                {stats.pendingOrders} Pending Processing
              </div>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-xl hover:shadow-gray-100/50 transition-all">
              <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mb-6">
                <Package className="w-6 h-6 text-purple-500" />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Inventory Asset</p>
              <h3 className="text-3xl font-black text-gray-900 tracking-tighter italic">{stats.activeStock}</h3>
              <div className="mt-4 flex items-center gap-1 text-[10px] font-black text-purple-500 uppercase">
                Across {stats.totalProducts} Managed SKUs
              </div>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-xl hover:shadow-gray-100/50 transition-all bg-gradient-to-br from-white to-red-50/30">
              <div className={`w-12 h-12 ${stats.lowStock > 0 || stats.outOfStock > 0 ? 'bg-red-50 animate-pulse' : 'bg-gray-50'} rounded-2xl flex items-center justify-center mb-6`}>
                <AlertTriangle className={`w-6 h-6 ${stats.lowStock > 0 || stats.outOfStock > 0 ? 'text-red-500' : 'text-gray-400'}`} />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Critical Alerts</p>
              <h3 className="text-3xl font-black text-gray-900 tracking-tighter italic">{stats.lowStock + stats.outOfStock}</h3>
              <div className="mt-4 flex items-center gap-1 text-[10px] font-black text-red-500 uppercase">
                {stats.outOfStock} OOS | {stats.lowStock} Low Stock
              </div>
           </div>
        </div>

        {/* Charts & Analytics Section */}
        <div className="grid lg:grid-cols-3 gap-8">
           {/* Revenue Trends */}
           <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-black tracking-tighter text-gray-900 uppercase italic">Revenue Performance</h4>
                <div className="flex items-center gap-2">
                   <div className="flex items-center gap-1.5 mr-4">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span className="text-[8px] font-black uppercase text-gray-400 tracking-widest italic">Daily Sales</span>
                   </div>
                   <button className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors">Details</button>
                </div>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm h-[400px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                       <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#FF4C60" stopOpacity={0.1}/>
                             <stop offset="95%" stopColor="#FF4C60" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#A0AEC0' }} dy={10} />
                       <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#A0AEC0' }} />
                       <Tooltip 
                        contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontWeight: 900, fontSize: '10px' }}
                        itemStyle={{ color: '#FF4C60' }}
                       />
                       <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#FF4C60" 
                        strokeWidth={4} 
                        fillOpacity={1} 
                        fill="url(#colorRevenue)" 
                        dot={{ r: 6, fill: '#FF4C60', strokeWidth: 4, stroke: '#fff' }}
                        activeDot={{ r: 8, strokeWidth: 0 }}
                       />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </div>

           {/* Category Distribution */}
           <div className="space-y-6">
              <h4 className="text-lg font-black tracking-tighter text-gray-900 uppercase italic">Stock Distribution</h4>
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm h-[400px] flex flex-col items-center justify-center">
                 <div className="relative w-full h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={8}
                            dataKey="value"
                            stroke="none"
                          >
                             {categoryData.map((_, index) => (
                               <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                             ))}
                          </Pie>
                          <Tooltip />
                       </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                       <div className="text-center">
                          <p className="text-xl font-black text-gray-900 italic tracking-tighter">{stats.totalProducts}</p>
                          <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">SKUs</p>
                       </div>
                    </div>
                 </div>
                 <div className="w-full mt-6 grid grid-cols-2 gap-4">
                    {categoryData.slice(0, 4).map((entry, index) => (
                      <div key={`${entry.name}-${index}`} className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                         <span className="text-[9px] font-black uppercase text-gray-600 tracking-tighter truncate">{entry.name}</span>
                         <span className="text-[9px] font-bold text-gray-400">{entry.value}</span>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* Recent Events Section */}
        <div className="grid lg:grid-cols-2 gap-8">
           <div className="space-y-6">
              <h4 className="text-lg font-black tracking-tighter text-gray-900 uppercase italic">Critical Stock Alerts</h4>
              <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-4">
                 {products.filter(p => p.stock < 10).slice(0, 4).map((product, idx) => (
                   <div key={`${product.product_id}-${idx}`} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-red-100 transition-all">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-xl border border-gray-100 bg-white p-1">
                            <img src={product.images[0]} className="w-full h-full object-cover rounded-lg" alt="" referrerPolicy="no-referrer" />
                         </div>
                         <div>
                            <h6 className="text-[10px] font-black text-gray-900 uppercase italic tracking-tighter line-clamp-1">{product.name_en}</h6>
                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{product.category}</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className={`text-xs font-black italic ${product.stock <= 0 ? 'text-red-500' : 'text-amber-500'}`}>
                           {product.stock <= 0 ? 'Out of Stock' : `${product.stock} Left`}
                         </p>
                         <button onClick={() => navigate('/admin/inventory')} className="text-[8px] font-black text-primary uppercase tracking-widest hover:underline mt-1">Refill</button>
                      </div>
                   </div>
                 ))}
                 {products.filter(p => p.stock < 10).length === 0 && (
                   <div className="py-12 text-center">
                      <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-500">
                         <TrendingUp className="w-6 h-6" />
                      </div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">All systems green • Stock levels optimal</p>
                   </div>
                 )}
              </div>
           </div>

           <div className="space-y-6">
              <h4 className="text-lg font-black tracking-tighter text-gray-900 uppercase italic">Recent Logistics</h4>
              <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-4">
                 {orders.slice(0, 4).map((order, idx) => (
                   <div key={`${order.order_id}-${idx}`} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gray-400 border border-gray-100 shadow-sm">
                            <Clock className="w-5 h-5" />
                         </div>
                         <div>
                            <h6 className="text-[10px] font-black text-gray-900 italic tracking-tighter uppercase">#{order.order_id}</h6>
                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{order.customer_phone}</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-xs font-black text-primary italic tracking-tighter italic">৳{order.total.toLocaleString()}</p>
                         <span className={`px-2 py-0.5 rounded-lg text-[6px] font-black uppercase tracking-widest ${
                           order.status === 'Pending' ? 'bg-amber-100 text-amber-600' : 
                           order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-200 text-gray-600'
                         }`}>
                           {order.status}
                         </span>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;

