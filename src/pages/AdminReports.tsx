import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { api } from '../services/api';
import { Product, Order } from '../types';
import { 
  FileDown, 
  Search, 
  Filter, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingUp,
  Package,
  Layers,
  Activity
} from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

const AdminReports: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pData, oData] = await Promise.all([
          api.getProducts(),
          api.getAllOrders()
        ]);
        setProducts(pData);
        setOrders(oData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const exportToCSV = () => {
    const headers = ['Product ID', 'Name', 'Category', 'Price', 'Stock'];
    const rows = products.map(p => [p.product_id, p.name_en, p.category, p.price, p.stock]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `inventory_report_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const salesTrendData = orders.slice(-10).map((o, i) => ({
    name: `Order #${o.order_id.slice(-4)}`,
    amount: o.total,
    items: o.items.reduce((acc, curr) => acc + curr.quantity, 0)
  }));

  const stockValueData = products.slice(0, 8).map(p => ({
    name: p.name_en.slice(0, 10),
    value: p.stock * p.price,
    stock: p.stock
  }));

  return (
    <AdminLayout>
      <div className="space-y-8 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-gray-900 uppercase italic">Analytics Matrix</h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Global performance reporting and data extraction</p>
          </div>
          <div className="flex items-center gap-3">
             <button 
               onClick={exportToCSV}
               className="flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-gray-200"
             >
               <FileDown className="w-4 h-4" />
               Export Protocol (CSV)
             </button>
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
           {/* Section 1: Stock Value Concentration */}
           <div className="space-y-6">
              <div className="flex items-center justify-between">
                 <h4 className="text-lg font-black tracking-tighter text-gray-900 uppercase italic flex items-center gap-2">
                    <Layers className="w-5 h-5 text-primary" />
                    Asset Concentration
                 </h4>
                 <div className="px-3 py-1 bg-gray-50 rounded-lg text-[8px] font-black uppercase tracking-widest text-gray-400">Value per SKU</div>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm h-[400px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stockValueData}>
                       <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: '#A0AEC0' }} dy={10} />
                       <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: '#A0AEC0' }} />
                       <Tooltip 
                         contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontWeight: 900, fontSize: '10px' }}
                         cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                       />
                       <Bar dataKey="value" fill="#FF4C60" radius={[10, 10, 10, 10]} barSize={20} />
                    </BarChart>
                 </ResponsiveContainer>
              </div>
           </div>

           {/* Section 2: Recent Transaction Volume */}
           <div className="space-y-6">
              <div className="flex items-center justify-between">
                 <h4 className="text-lg font-black tracking-tighter text-gray-900 uppercase italic flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-500" />
                    Transaction Intensity
                 </h4>
                 <div className="px-3 py-1 bg-gray-50 rounded-lg text-[8px] font-black uppercase tracking-widest text-gray-400">Recent 10 Cycles</div>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm h-[400px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={salesTrendData}>
                       <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: '#A0AEC0' }} dy={10} />
                       <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: '#A0AEC0' }} />
                       <Tooltip 
                         contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontWeight: 900, fontSize: '10px' }}
                       />
                       <Line type="monotone" dataKey="amount" stroke="#6C5DD3" strokeWidth={4} dot={{ r: 4, fill: '#6C5DD3', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                    </LineChart>
                 </ResponsiveContainer>
              </div>
           </div>
        </div>

        {/* Detailed Metrics Table */}
        <div className="space-y-6">
           <h4 className="text-lg font-black tracking-tighter text-gray-900 uppercase italic">Enterprise Resource Planning</h4>
           <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                 <thead className="bg-gray-50/50">
                    <tr>
                       <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Asset</th>
                       <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Unit Price</th>
                       <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Quantity</th>
                       <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Inventory Value</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50">
                    {products.map((p, idx) => (
                       <tr key={`${p.product_id}-${idx}`} className="hover:bg-gray-50/50 transition-colors group">
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-gray-50 overflow-hidden">
                                   <img src={p.images[0]} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                                </div>
                                <div>
                                   <p className="text-[10px] font-black text-gray-900 uppercase italic tracking-tighter">{p.name_en}</p>
                                   <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{p.category}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-8 py-6 text-center">
                             <p className="text-[10px] font-black text-gray-600">৳{p.price.toLocaleString()}</p>
                          </td>
                          <td className="px-8 py-6 text-center">
                             <span className={`text-[10px] font-black ${p.stock < 10 ? 'text-red-500' : 'text-gray-900'}`}>{p.stock}</span>
                          </td>
                          <td className="px-8 py-6 text-right">
                             <p className="text-sm font-black text-gray-900 tracking-tighter italic italic">৳{(p.stock * p.price).toLocaleString()}</p>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
