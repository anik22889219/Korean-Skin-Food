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
    <AdminLayout>
      <div className="space-y-8 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-gray-900 uppercase italic">System Parameters</h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Configure global application state and logistics logic</p>
          </div>
          <button className="flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-gray-200">
            <Save className="w-4 h-4" />
            Commit Configuration
          </button>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
           {/* Navigation Cards */}
           <div className="lg:col-span-1 space-y-4">
              <button 
                onClick={() => setActiveTab('general')}
                className={`w-full flex items-center justify-between p-6 rounded-[2rem] border transition-all ${activeTab === 'general' ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-white border-gray-100 text-gray-400 hover:text-gray-900 hover:bg-gray-50'}`}
              >
                 <div className="flex items-center gap-4">
                    <Globe className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Global</span>
                 </div>
              </button>
              <button 
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center justify-between p-6 rounded-[2rem] border transition-all ${activeTab === 'security' ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-white border-gray-100 text-gray-400 hover:text-gray-900 hover:bg-gray-50'}`}
              >
                 <div className="flex items-center gap-4">
                    <Shield className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Protocol</span>
                 </div>
              </button>
              <button 
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center justify-between p-6 rounded-[2rem] border transition-all ${activeTab === 'notifications' ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-white border-gray-100 text-gray-400 hover:text-gray-900 hover:bg-gray-50'}`}
              >
                 <div className="flex items-center gap-4">
                    <Bell className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Alerts</span>
                 </div>
              </button>
              <button 
                onClick={() => setActiveTab('system')}
                className={`w-full flex items-center justify-between p-6 rounded-[2rem] border transition-all ${activeTab === 'system' ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-white border-gray-100 text-gray-400 hover:text-gray-900 hover:bg-gray-50'}`}
              >
                 <div className="flex items-center gap-4">
                    <Database className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Core Engine</span>
                 </div>
              </button>
           </div>

           {/* Settings Detail */}
           <div className="lg:col-span-3">
              <div className="bg-white rounded-[3rem] border border-gray-50 p-10 shadow-sm space-y-10">
                 {activeTab === 'general' && (
                    <div className="space-y-8">
                       <h3 className="text-xl font-black text-gray-900 italic tracking-tighter uppercase">Platform Personality</h3>
                       <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Store Entity Name</label>
                             <input type="text" defaultValue="KOREAN Skin Food" className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-none font-bold text-xs outline-none focus:ring-2 focus:ring-primary/20" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">WhatsApp (Orders)</label>
                             <input type="text" placeholder="+88017XXXXXXXX" className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-none font-bold text-xs outline-none focus:ring-2 focus:ring-primary/20" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Free Shipping Min ৳</label>
                             <input type="number" defaultValue="2000" className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-none font-bold text-xs outline-none focus:ring-2 focus:ring-primary/20" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Base Currency</label>
                             <select defaultValue="BDT (৳)" className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-none font-bold text-xs outline-none focus:ring-2 focus:ring-primary/20">
                                <option>BDT (৳)</option>
                                <option>USD ($)</option>
                             </select>
                          </div>
                       </div>
                       <div className="flex items-center justify-between p-6 bg-gray-50 rounded-[2rem]">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                <Moon className="w-5 h-5 text-gray-400" />
                             </div>
                             <div>
                                <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Dark Synthesis Mode</p>
                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest italic">Adaptive visual engine</p>
                             </div>
                          </div>
                          <div className="w-12 h-6 bg-gray-200 rounded-full relative">
                             <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all"></div>
                          </div>
                       </div>
                    </div>
                 )}

                 {activeTab === 'security' && (
                    <div className="space-y-8">
                       <h3 className="text-xl font-black text-gray-900 italic tracking-tighter uppercase">Defense Grid</h3>
                       <div className="space-y-4">
                          <div className="flex items-center justify-between p-6 border border-gray-100 rounded-[2rem] hover:border-primary/20 transition-all">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-primary">
                                   <Lock className="w-5 h-5" />
                                </div>
                                <div>
                                   <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Admin 2FA Authorization</p>
                                   <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest italic">Biometric or device token required</p>
                                </div>
                             </div>
                             <div className="w-12 h-6 bg-emerald-500 rounded-full relative">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-all"></div>
                             </div>
                          </div>
                       </div>
                    </div>
                 )}

                 {activeTab === 'system' && (
                    <div className="space-y-8">
                       <h3 className="text-xl font-black text-gray-900 italic tracking-tighter uppercase">Infrastructure Status</h3>
                       <div className="grid md:grid-cols-2 gap-4">
                          <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                             <div className="flex items-center gap-3 mb-4">
                                <Database className="w-5 h-5 text-emerald-500" />
                                <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Cloud SQL Master</span>
                             </div>
                             <p className="text-3xl font-black text-gray-900 italic tracking-tighter">OPERATIONAL</p>
                             <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest italic mt-2">Latency: 24ms | Uptime: 99.9%</p>
                          </div>
                          <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                             <div className="flex items-center gap-3 mb-4">
                                <Zap className="w-5 h-5 text-amber-500" />
                                <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Vertex AI Engines</span>
                             </div>
                             <p className="text-3xl font-black text-gray-900 italic tracking-tighter">ENGAGED</p>
                             <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest italic mt-2">Bangla NLP Logic Active</p>
                          </div>
                       </div>
                    </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
