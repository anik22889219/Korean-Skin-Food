import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Globe, 
  ShoppingBag, 
  TrendingUp, 
  ArrowUpRight, 
  Package, 
  Plus, 
  Search,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { AdminLayout } from '../components/AdminLayout';

const AdminDropshipping: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.getDropshippingStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch dropshipping stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-screen bg-white font-black uppercase text-xs tracking-widest italic animate-pulse">Connecting to Global Supply Chain...</div>;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-gray-900 uppercase italic">Dropship Hub</h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Manage global sourcing and automated fulfillment</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/admin/sourcing')}
            className="px-6 py-3 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20 flex items-center gap-2 hover:scale-105 transition-transform"
          >
            <Plus className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Source New Products</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all">
          <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 text-orange-500">
            <Globe className="w-6 h-6" />
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Global Catalog</p>
          <h3 className="text-3xl font-black text-gray-900 tracking-tighter italic">{stats.totalSourced}+</h3>
          <div className="mt-4 flex items-center gap-1 text-[10px] font-black text-orange-500 uppercase">
            <ArrowUpRight className="w-3 h-3" /> New items daily
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-500">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Active Imports</p>
          <h3 className="text-3xl font-black text-gray-900 tracking-tighter italic">{stats.totalImported}</h3>
          <div className="mt-4 flex items-center gap-1 text-[10px] font-black text-blue-500 uppercase">
            Ready for promotion
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all">
          <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 text-purple-500">
            <TrendingUp className="w-6 h-6" />
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Potential Margin</p>
          <h3 className="text-3xl font-black text-gray-900 tracking-tighter italic">৳{stats.potentialProfit.toLocaleString()}</h3>
          <div className="mt-4 flex items-center gap-1 text-[10px] font-black text-purple-500 uppercase">
            Based on current sourcing
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 text-emerald-500">
            <Package className="w-6 h-6" />
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Sourcing Requests</p>
          <h3 className="text-3xl font-black text-gray-900 tracking-tighter italic">{stats.activeRequests}</h3>
          <div className="mt-4 flex items-center gap-1 text-[10px] font-black text-emerald-500 uppercase">
            Pending response
          </div>
        </div>
      </div>

      {/* Main Sections */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Marketplace Preview */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-black tracking-tighter text-gray-900 uppercase italic">Trending in Korea</h4>
            <button 
              onClick={() => navigate('/admin/sourcing')}
              className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
            >
              View Full Catalog
            </button>
          </div>
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search global suppliers..." 
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <div className="divide-y divide-gray-50">
              {[
                { name: 'ANUA Heartleaf Toner', supplier: 'Anua Official', margin: '35%' },
                { name: 'COSRX Snail Mucin', supplier: 'COSRX Global', margin: '42%' },
                { name: 'BOJ Relief Sun', supplier: 'Beauty of Joseon', margin: '28%' }
              ].map((item, i) => (
                <div key={i} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl"></div>
                    <div>
                      <h6 className="text-[10px] font-black text-gray-900 uppercase italic tracking-tighter">{item.name}</h6>
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{item.supplier}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-emerald-500 italic">{item.margin} Profit</p>
                    <button className="text-[8px] font-black text-primary uppercase tracking-widest mt-1">Preview</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Integration Status */}
        <div className="space-y-6">
          <h4 className="text-lg font-black tracking-tighter text-gray-900 uppercase italic">Supply Chain Status</h4>
          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-6">
             <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Korea Warehouse (Incheon)</span>
                  </div>
                  <span className="text-[8px] font-black text-gray-400 uppercase">Operational</span>
                </div>
                <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden">
                  <div className="w-[95%] h-full bg-emerald-500"></div>
                </div>
             </div>

             <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Logistics Sync (Movedrop)</span>
                  </div>
                  <span className="text-[8px] font-black text-gray-400 uppercase">Active</span>
                </div>
                <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden">
                  <div className="w-[100%] h-full bg-blue-500"></div>
                </div>
             </div>

             <div className="pt-6 border-t border-gray-50">
                <div className="bg-gray-50 rounded-3xl p-6 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                         <ExternalLink className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <h6 className="text-[10px] font-black text-gray-900 uppercase italic tracking-tighter">Partner Portal</h6>
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Direct access to supplier docs</p>
                      </div>
                   </div>
                   <button className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-gray-100 transition-colors">Launch</button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDropshipping;
