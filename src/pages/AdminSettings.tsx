import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Settings, 
  Shield, 
  Bell, 
  Database, 
  Globe, 
  Zap, 
  Trash2, 
  Save,
  Moon,
  Sun,
  Lock
} from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';

const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'notifications' | 'system'>('general');

  return (
    <>
      <div className="space-y-12 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-gray-900 uppercase italic">System Parameters</h1>
            <p className="text-xs font-black text-gray-500 uppercase tracking-widest mt-2">Configure global application state and logistics logic</p>
          </div>
          <button className="flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-full font-black text-[10px] uppercase tracking-widest transition-all shadow-[0_10px_40px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_rgba(219,39,119,0.3)] hover:scale-[1.02] active:scale-95 hover:bg-pink-600">
            <Save className="w-4 h-4" />
            Commit Configuration
          </button>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
           {/* Navigation Cards */}
           <div className="lg:col-span-1 space-y-4">
              <button 
                onClick={() => setActiveTab('general')}
                className={`w-full flex items-center justify-between px-8 py-6 rounded-[2.5rem] border transition-all ${activeTab === 'general' ? 'bg-gray-900 border-gray-900 text-white shadow-lg shadow-gray-900/20 scale-[1.02]' : 'bg-white border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] text-gray-500 hover:text-gray-900 hover:bg-[#FDF9F6]'}`}
              >
                 <div className="flex items-center gap-4">
                    <Globe className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Global</span>
                 </div>
              </button>
              <button 
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center justify-between px-8 py-6 rounded-[2.5rem] border transition-all ${activeTab === 'security' ? 'bg-gray-900 border-gray-900 text-white shadow-lg shadow-gray-900/20 scale-[1.02]' : 'bg-white border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] text-gray-500 hover:text-gray-900 hover:bg-[#FDF9F6]'}`}
              >
                 <div className="flex items-center gap-4">
                    <Shield className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Protocol</span>
                 </div>
              </button>
              <button 
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center justify-between px-8 py-6 rounded-[2.5rem] border transition-all ${activeTab === 'notifications' ? 'bg-gray-900 border-gray-900 text-white shadow-lg shadow-gray-900/20 scale-[1.02]' : 'bg-white border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] text-gray-500 hover:text-gray-900 hover:bg-[#FDF9F6]'}`}
              >
                 <div className="flex items-center gap-4">
                    <Bell className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Alerts</span>
                 </div>
              </button>
              <button 
                onClick={() => setActiveTab('system')}
                className={`w-full flex items-center justify-between px-8 py-6 rounded-[2.5rem] border transition-all ${activeTab === 'system' ? 'bg-gray-900 border-gray-900 text-white shadow-lg shadow-gray-900/20 scale-[1.02]' : 'bg-white border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] text-gray-500 hover:text-gray-900 hover:bg-[#FDF9F6]'}`}
              >
                 <div className="flex items-center gap-4">
                    <Database className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Core Engine</span>
                 </div>
              </button>
           </div>

           {/* Settings Detail */}
           <div className="lg:col-span-3">
              <div className="bg-white rounded-[3rem] border border-white p-10 shadow-[0_10px_40px_rgba(0,0,0,0.03)] space-y-12">
                 {activeTab === 'general' && (
                    <div className="space-y-8">
                       <h3 className="text-2xl font-black text-gray-900 italic tracking-tighter uppercase">Platform Personality</h3>
                       <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Store Entity Name</label>
                             <input type="text" defaultValue="KOREAN Skin Food" className="w-full px-6 py-4 bg-[#FDF9F6] rounded-full border border-orange-50 font-bold text-xs outline-none focus:ring-2 focus:ring-gray-900/10 transition-all" />
                          </div>
                          <div className="space-y-3">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">WhatsApp (Orders)</label>
                             <input type="text" placeholder="+88017XXXXXXXX" className="w-full px-6 py-4 bg-[#FDF9F6] rounded-full border border-orange-50 font-bold text-xs outline-none focus:ring-2 focus:ring-gray-900/10 transition-all placeholder:text-gray-400" />
                          </div>
                          <div className="space-y-3">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Free Shipping Min ৳</label>
                             <input type="number" defaultValue="2000" className="w-full px-6 py-4 bg-[#FDF9F6] rounded-full border border-orange-50 font-bold text-xs outline-none focus:ring-2 focus:ring-gray-900/10 transition-all" />
                          </div>
                          <div className="space-y-3">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Base Currency</label>
                             <select defaultValue="BDT (৳)" className="w-full px-6 py-4 bg-[#FDF9F6] rounded-full border border-orange-50 font-bold text-xs outline-none focus:ring-2 focus:ring-gray-900/10 transition-all appearance-none cursor-pointer">
                                <option>BDT (৳)</option>
                                <option>USD ($)</option>
                             </select>
                          </div>
                       </div>
                       <div className="flex items-center justify-between p-8 bg-[#FDF9F6] border border-orange-50 rounded-[2.5rem]">
                          <div className="flex items-center gap-6">
                             <div className="w-14 h-14 bg-white border border-orange-50 rounded-2xl flex items-center justify-center shadow-sm">
                                <Moon className="w-6 h-6 text-gray-900" />
                             </div>
                             <div>
                                <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Dark Synthesis Mode</p>
                                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest italic mt-1">Adaptive visual engine</p>
                             </div>
                          </div>
                          <div className="w-14 h-8 bg-gray-200 rounded-full relative shadow-inner cursor-pointer hover:bg-gray-300 transition-colors">
                             <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all"></div>
                          </div>
                       </div>
                    </div>
                 )}

                 {activeTab === 'security' && (
                    <div className="space-y-8">
                       <h3 className="text-2xl font-black text-gray-900 italic tracking-tighter uppercase">Defense Grid</h3>
                       <div className="space-y-4">
                          <div className="flex items-center justify-between p-8 border border-orange-50 bg-[#FDF9F6] rounded-[2.5rem] hover:border-pink-200 transition-all">
                             <div className="flex items-center gap-6">
                                <div className="w-14 h-14 bg-white border border-orange-50 rounded-2xl flex items-center justify-center text-pink-500 shadow-sm">
                                   <Lock className="w-6 h-6" />
                                </div>
                                <div>
                                   <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Admin 2FA Authorization</p>
                                   <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest italic mt-1">Biometric or device token required</p>
                                </div>
                             </div>
                             <div className="w-14 h-8 bg-emerald-500 rounded-full relative shadow-inner cursor-pointer hover:bg-emerald-400 transition-colors">
                                <div className="absolute right-1 top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all"></div>
                             </div>
                          </div>
                       </div>
                    </div>
                 )}

                 {activeTab === 'system' && (
                    <div className="space-y-8">
                       <h3 className="text-2xl font-black text-gray-900 italic tracking-tighter uppercase">Infrastructure Status</h3>
                       <div className="grid md:grid-cols-2 gap-6">
                          <div className="p-10 bg-[#FDF9F6] rounded-[3rem] border border-orange-50 relative overflow-hidden group">
                             <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
                             <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-emerald-50">
                                   <Database className="w-6 h-6 text-emerald-500" />
                                </div>
                                <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Cloud SQL Master</span>
                             </div>
                             <p className="text-4xl font-black text-gray-900 italic tracking-tighter">OPERATIONAL</p>
                             <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest italic mt-3">Latency: 24ms | Uptime: 99.9%</p>
                          </div>
                          <div className="p-10 bg-[#FDF9F6] rounded-[3rem] border border-orange-50 relative overflow-hidden group">
                             <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all"></div>
                             <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-amber-50">
                                   <Zap className="w-6 h-6 text-amber-500" />
                                </div>
                                <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Vertex AI Engines</span>
                             </div>
                             <p className="text-4xl font-black text-gray-900 italic tracking-tighter">ENGAGED</p>
                             <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest italic mt-3">Bangla NLP Logic Active</p>
                          </div>
                       </div>
                    </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </>
  );
};

export default AdminSettings;
