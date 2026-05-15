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
    <div className="space-y-12 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-gray-900 uppercase italic">Dropship Hub</h1>
          <p className="text-xs font-black text-gray-500 uppercase tracking-widest mt-2">Manage global sourcing and automated fulfillment</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/admin/sourcing')}
            className="px-8 py-4 bg-gray-900 text-white rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.1)] flex items-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-widest">Source New Products</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-white p-10 rounded-[3rem] border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] relative overflow-hidden group hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all">
          <div className="w-16 h-16 bg-orange-50 rounded-[1.5rem] flex items-center justify-center mb-8 text-orange-500 border border-orange-100 shadow-sm group-hover:scale-110 transition-transform">
            <Globe className="w-8 h-8" />
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Global Catalog</p>
          <h3 className="text-4xl font-black text-gray-900 tracking-tighter italic">{stats.totalSourced}+</h3>
          <div className="mt-6 flex items-center gap-2 text-xs font-black text-orange-500 uppercase">
            <ArrowUpRight className="w-4 h-4" /> New items daily
          </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] relative overflow-hidden group hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all">
          <div className="w-16 h-16 bg-blue-50 rounded-[1.5rem] flex items-center justify-center mb-8 text-blue-500 border border-blue-100 shadow-sm group-hover:scale-110 transition-transform">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Active Imports</p>
          <h3 className="text-4xl font-black text-gray-900 tracking-tighter italic">{stats.totalImported}</h3>
          <div className="mt-6 flex items-center gap-2 text-xs font-black text-blue-500 uppercase">
            Ready for promotion
          </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] relative overflow-hidden group hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all">
          <div className="w-16 h-16 bg-purple-50 rounded-[1.5rem] flex items-center justify-center mb-8 text-purple-500 border border-purple-100 shadow-sm group-hover:scale-110 transition-transform">
            <TrendingUp className="w-8 h-8" />
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Potential Margin</p>
          <h3 className="text-4xl font-black text-gray-900 tracking-tighter italic">৳{stats.potentialProfit.toLocaleString()}</h3>
          <div className="mt-6 flex items-center gap-2 text-xs font-black text-purple-500 uppercase">
            Based on current sourcing
          </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] relative overflow-hidden group hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all">
          <div className="w-16 h-16 bg-emerald-50 rounded-[1.5rem] flex items-center justify-center mb-8 text-emerald-500 border border-emerald-100 shadow-sm group-hover:scale-110 transition-transform">
            <Package className="w-8 h-8" />
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Sourcing Requests</p>
          <h3 className="text-4xl font-black text-gray-900 tracking-tighter italic">{stats.activeRequests}</h3>
          <div className="mt-6 flex items-center gap-2 text-xs font-black text-emerald-500 uppercase">
            Pending response
          </div>
        </div>
      </div>

      {/* Main Sections */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Marketplace Preview */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-black tracking-tighter text-gray-900 uppercase italic">Trending in Korea</h4>
            <button 
              onClick={() => navigate('/admin/sourcing')}
              className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
            >
              View Full Catalog
            </button>
          </div>
          <div className="bg-white rounded-[3rem] border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search global suppliers..." 
                  className="w-full pl-14 pr-6 py-4 bg-[#FDF9F6] rounded-full text-[10px] font-black uppercase tracking-widest focus:outline-none border border-orange-50 focus:border-gray-300 transition-colors"
                />
              </div>
            </div>
            <div className="divide-y divide-gray-50">
              {[
                { name: 'ANUA Heartleaf Toner', supplier: 'Anua Official', margin: '35%' },
                { name: 'COSRX Snail Mucin', supplier: 'COSRX Global', margin: '42%' },
                { name: 'BOJ Relief Sun', supplier: 'Beauty of Joseon', margin: '28%' }
              ].map((item, i) => (
                <div key={i} className="p-8 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-[#FDF9F6] rounded-[1.5rem] border border-orange-50 shadow-sm"></div>
                    <div>
                      <h6 className="text-xs font-black text-gray-900 uppercase italic tracking-tighter">{item.name}</h6>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{item.supplier}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-emerald-500 italic bg-emerald-50 px-3 py-1 rounded-full">{item.margin} Profit</p>
                    <button className="text-[10px] font-black text-primary uppercase tracking-widest mt-2 hover:underline">Preview</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Integration Status */}
        <div className="space-y-6">
          <h4 className="text-xl font-black tracking-tighter text-gray-900 uppercase italic">Supply Chain Status</h4>
          <div className="bg-white rounded-[3rem] p-10 border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] space-y-8">
             <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                    <span className="text-xs font-black text-gray-900 uppercase tracking-widest italic">Korea Warehouse (Incheon)</span>
                  </div>
                  <span className="text-[10px] font-black text-emerald-500 uppercase">Operational</span>
                </div>
                <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden shadow-inner">
                  <div className="w-[95%] h-full bg-emerald-500"></div>
                </div>
             </div>

             <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                    <span className="text-xs font-black text-gray-900 uppercase tracking-widest italic">Logistics Sync (Movedrop)</span>
                  </div>
                  <span className="text-[10px] font-black text-blue-500 uppercase">Active</span>
                </div>
                <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden shadow-inner">
                  <div className="w-[100%] h-full bg-blue-500"></div>
                </div>
             </div>

             <div className="pt-8 border-t border-gray-50">
                <div className="bg-[#FDF9F6] rounded-[2rem] p-8 flex items-center justify-between border border-orange-50">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                         <ExternalLink className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <h6 className="text-xs font-black text-gray-900 uppercase italic tracking-tighter">Partner Portal</h6>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Direct access to supplier docs</p>
                      </div>
                   </div>
                   <button className="px-6 py-3 bg-white border border-gray-100 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 shadow-sm transition-colors">Launch</button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDropshipping;
