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
  const { isAdminTeam, isAdmin, isInventoryManager, isCustomerSupport } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdminTeam) {
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
  }, [isAdminTeam, navigate]);

  const stats = useMemo(() => ({
    totalRevenue: orders.reduce((acc, curr) => acc + curr.total, 0),
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'Pending').length,
    lowStock: products.filter(p => p.stock > 0 && p.stock < 10).length,
    outOfStock: products.filter(p => p.stock <= 0).length,
    totalProducts: products.length,
    activeStock: products.reduce((acc, curr) => acc + (curr.stock || 0), 0)
  }), [orders, products]);

  // Task 4.6 — Real chart from actual orders (last 7 days)
  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        dateStr: date.toLocaleDateString('en-US', { weekday: 'short' }),
        fullDate: date.toDateString(),
      };
    });

    return last7Days.map(({ dateStr, fullDate }) => {
      const dayOrders = orders.filter(o => new Date(o.timestamp).toDateString() === fullDate && o.status !== 'Cancelled');
      return {
        name: dateStr,
        revenue: dayOrders.reduce((s, o) => s + o.total, 0),
        orders: dayOrders.length,
      };
    });
  }, [orders]);

  // Task 4.7 — Top selling products by order frequency
  const topProducts = useMemo(() => {
    const freq: Record<string, { name: string; count: number; revenue: number }> = {};
    orders.forEach(o => {
      o.items.forEach(item => {
        if (!freq[item.name_en]) freq[item.name_en] = { name: item.name_en, count: 0, revenue: 0 };
        freq[item.name_en].count += item.quantity;
        freq[item.name_en].revenue += item.price * item.quantity;
      });
    });
    return Object.values(freq).sort((a, b) => b.count - a.count).slice(0, 5);
  }, [orders]);

  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [products]);

  const COLORS = ['#FF4C60', '#6C5DD3', '#FFA928', '#3FBBFE', '#46B4E5'];

  if (loading) return <div className="flex items-center justify-center h-screen font-black uppercase text-xs tracking-widest italic animate-pulse">Initializing Control Center...</div>;

  return (
    <>
      <div className="space-y-12 pb-12">
        {/* Page Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-gray-900 uppercase italic">Control Center</h1>
            <p className="text-xs font-black text-gray-500 uppercase tracking-widest mt-2">Real-time business performance analytics</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="px-6 py-4 bg-white rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-white flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gray-900" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
             </div>
          </div>
        </div>

        {/* Essential Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {isAdmin && (
             <>
               <div className="bg-white p-8 rounded-[3rem] border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] relative overflow-hidden group hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all">
                  <div className="w-14 h-14 bg-[#FDF9F6] border border-orange-50 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-6 h-6 text-gray-900" />
                  </div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Revenue</p>
                  <h3 className="text-4xl font-black text-gray-900 tracking-tighter italic">৳{stats.totalRevenue.toLocaleString()}</h3>
                  <div className="mt-6 flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-[10px] font-black text-emerald-600 uppercase tracking-widest rounded-full w-max">
                    <ArrowUpRight className="w-3 h-3" /> 12% vs last month
                  </div>
               </div>

               <div className="bg-white p-8 rounded-[3rem] border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] relative overflow-hidden group hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all">
                  <div className="w-14 h-14 bg-[#FDF9F6] border border-orange-50 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
                    <ShoppingBag className="w-6 h-6 text-gray-900" />
                  </div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Active Sales</p>
                  <h3 className="text-4xl font-black text-gray-900 tracking-tighter italic">{stats.totalOrders}</h3>
                  <div className="mt-6 flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-[10px] font-black text-blue-600 uppercase tracking-widest rounded-full w-max">
                    {stats.pendingOrders} Pending
                  </div>
               </div>
             </>
           )}

           {(isAdmin || isInventoryManager) && (
             <>
               <div className="bg-white p-8 rounded-[3rem] border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] relative overflow-hidden group hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all">
                  <div className="w-14 h-14 bg-[#FDF9F6] border border-orange-50 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
                    <Package className="w-6 h-6 text-gray-900" />
                  </div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Inventory Asset</p>
                  <h3 className="text-4xl font-black text-gray-900 tracking-tighter italic">{stats.activeStock}</h3>
                  <div className="mt-6 flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-[10px] font-black text-purple-600 uppercase tracking-widest rounded-full w-max">
                    {stats.totalProducts} Managed SKUs
                  </div>
               </div>

               <div className="bg-gray-900 p-8 rounded-[3rem] shadow-[0_10px_40px_rgba(0,0,0,0.1)] relative overflow-hidden group hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition-all">
                  <div className={`w-14 h-14 ${stats.lowStock > 0 || stats.outOfStock > 0 ? 'bg-red-500/20 border border-red-500/30 animate-pulse' : 'bg-white/10 border border-white/10'} rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform`}>
                    <AlertTriangle className={`w-6 h-6 ${stats.lowStock > 0 || stats.outOfStock > 0 ? 'text-red-400' : 'text-white'}`} />
                  </div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Critical Alerts</p>
                  <h3 className="text-4xl font-black text-white tracking-tighter italic">{stats.lowStock + stats.outOfStock}</h3>
                  <div className={`mt-6 flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full w-max ${stats.lowStock > 0 || stats.outOfStock > 0 ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white'}`}>
                    {stats.outOfStock} OOS | {stats.lowStock} Low Stock
                  </div>
               </div>
             </>
           )}
        </div>

        {/* Charts & Analytics Section */}
        <div className="grid lg:grid-cols-3 gap-8">
           {/* Revenue Trends */}
           {isAdmin && (
             <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                <h4 className="text-xl font-black tracking-tighter text-gray-900 uppercase italic">Revenue Performance</h4>
                <div className="flex items-center gap-2">
                   <div className="flex items-center gap-2 mr-4">
                      <div className="w-2.5 h-2.5 rounded-full bg-gray-900"></div>
                      <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest italic">Daily Sales</span>
                   </div>
                   <button className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors border border-transparent hover:border-gray-200 px-4 py-2 rounded-full">Details</button>
                </div>
              </div>
              <div className="bg-white p-8 rounded-[3rem] border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] h-[400px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                       <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#111827" stopOpacity={0.1}/>
                             <stop offset="95%" stopColor="#111827" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#9CA3AF' }} dy={10} />
                       <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#9CA3AF' }} />
                       <Tooltip 
                        contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', fontWeight: 900, fontSize: '12px' }}
                        itemStyle={{ color: '#111827' }}
                       />
                       <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#111827" 
                        strokeWidth={4} 
                        fillOpacity={1} 
                        fill="url(#colorRevenue)" 
                        dot={{ r: 6, fill: '#111827', strokeWidth: 4, stroke: '#fff' }}
                        activeDot={{ r: 8, strokeWidth: 0, fill: '#111827' }}
                       />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </div>
           )}

           {/* Category Distribution */}
           {(isAdmin || isInventoryManager) && (
           <div className="space-y-6">
              <h4 className="text-xl font-black tracking-tighter text-gray-900 uppercase italic">Stock Distribution</h4>
              <div className="bg-white p-8 rounded-[3rem] border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] h-[400px] flex flex-col items-center justify-center">
                 <div className="relative w-full h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={110}
                            paddingAngle={8}
                            dataKey="value"
                            stroke="none"
                          >
                             {categoryData.map((_, index) => (
                               <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                             ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontWeight: 900, fontSize: '10px' }}
                          />
                       </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                       <div className="text-center">
                          <p className="text-3xl font-black text-gray-900 italic tracking-tighter">{stats.totalProducts}</p>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">SKUs</p>
                       </div>
                    </div>
                 </div>
                 <div className="w-full mt-6 grid grid-cols-2 gap-4">
                    {categoryData.slice(0, 4).map((entry, index) => (
                      <div key={`${entry.name}-${index}`} className="flex items-center gap-2">
                         <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                         <span className="text-[10px] font-black uppercase text-gray-600 tracking-tighter truncate">{entry.name}</span>
                         <span className="text-[10px] font-bold text-gray-400">{entry.value}</span>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
           )}
        </div>

        {/* Recent Events Section */}
        <div className="grid lg:grid-cols-2 gap-8">
           {(isAdmin || isInventoryManager) && (
             <div className="space-y-6">
                <h4 className="text-xl font-black tracking-tighter text-gray-900 uppercase italic">Critical Stock Alerts</h4>
                <div className="bg-white rounded-[3rem] p-8 border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] space-y-4">
                 {products.filter(p => p.stock < 10).slice(0, 4).map((product, idx) => (
                   <div key={`${product.product_id}-${idx}`} className="flex items-center justify-between p-4 bg-[#FDF9F6] rounded-3xl border border-transparent hover:border-orange-100 transition-all">
                      <div className="flex items-center gap-4">
                         <div className="w-14 h-14 rounded-2xl border border-white bg-white p-1 shadow-sm">
                            <img src={product.images[0]} className="w-full h-full object-cover rounded-xl" alt="" referrerPolicy="no-referrer" />
                         </div>
                         <div>
                            <h6 className="text-xs font-black text-gray-900 uppercase italic tracking-tighter line-clamp-1">{product.name_en}</h6>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">{product.category}</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className={`text-sm font-black italic ${product.stock <= 0 ? 'text-red-500' : 'text-amber-500'}`}>
                           {product.stock <= 0 ? 'Out of Stock' : `${product.stock} Left`}
                         </p>
                         <button onClick={() => navigate('/admin/inventory')} className="text-[9px] font-black text-gray-900 uppercase tracking-widest hover:underline mt-1">Refill</button>
                      </div>
                   </div>
                 ))}
                 {products.filter(p => p.stock < 10).length === 0 && (
                   <div className="py-16 text-center">
                      <div className="w-16 h-16 bg-emerald-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-emerald-500 shadow-inner">
                         <TrendingUp className="w-8 h-8" />
                      </div>
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest italic">All systems green • Stock levels optimal</p>
                   </div>
                 )}
              </div>
           </div>
           )}

           {(isAdmin || isCustomerSupport) && (
           <div className="space-y-6">
              <h4 className="text-xl font-black tracking-tighter text-gray-900 uppercase italic">Recent Logistics</h4>
              <div className="bg-white rounded-[3rem] p-8 border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] space-y-4">
                 {orders.slice(0, 4).map((order, idx) => (
                   <div key={`${order.order_id}-${idx}`} className="flex items-center justify-between p-4 bg-[#FDF9F6] rounded-3xl border border-transparent hover:border-orange-50 transition-all">
                      <div className="flex items-center gap-4">
                         <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-gray-900 border border-orange-50 shadow-sm">
                            <Clock className="w-6 h-6" />
                         </div>
                         <div>
                            <h6 className="text-xs font-black text-gray-900 italic tracking-tighter uppercase">#{order.order_id}</h6>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">{order.customer_phone}</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-sm font-black text-gray-900 tracking-tighter italic">৳{order.total.toLocaleString()}</p>
                         <span className={`inline-block mt-1 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                           order.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 
                           order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-700'
                         }`}>
                           {order.status}
                         </span>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
           )}

           {/* Task 4.7 — Top selling products */}
           {isAdmin && (
             <div className="space-y-6">
              <h4 className="text-xl font-black tracking-tighter text-gray-900 uppercase italic">🏆 Top Selling</h4>
              <div className="bg-white rounded-[3rem] p-8 border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] space-y-6">
                {topProducts.length === 0 ? (
                  <p className="text-[10px] text-gray-400 font-black uppercase text-center py-8">No Sales Data</p>
                ) : topProducts.map((p, i) => (
                  <div key={p.name} className="flex items-center gap-4 p-2">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black text-white shadow-sm ${
                      i === 0 ? 'bg-gray-900' : i === 1 ? 'bg-gray-700' : i === 2 ? 'bg-gray-500' : 'bg-gray-200 text-gray-500'
                    }`}>#{i + 1}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-gray-900 truncate">{p.name}</p>
                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-1">{p.count} Sold • ৳{p.revenue.toLocaleString()}</p>
                    </div>
                    <div className="w-20 bg-[#FDF9F6] rounded-full h-2">
                      <div className="bg-gray-900 h-2 rounded-full" style={{ width: `${Math.min(100, (p.count / (topProducts[0]?.count || 1)) * 100)}%` }} />
                    </div>
                  </div>
                ))}
               </div>
             </div>
           )}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;

