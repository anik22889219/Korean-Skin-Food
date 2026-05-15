import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Package, Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminImportList: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-12 pb-12">
      {/* Header */}
      <div className="flex items-center gap-6">
        <button 
          onClick={() => navigate('/admin/dropshipping')}
          className="w-14 h-14 bg-white rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm hover:scale-[1.02] active:scale-[0.98]"
        >
          <ArrowLeft className="w-5 h-5 text-gray-900" />
        </button>
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-gray-900 uppercase italic">Import Staging</h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Review and optimize imported products before launch</p>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] p-16 border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] text-center max-w-3xl mx-auto mt-16">
         <div className="w-28 h-28 bg-blue-50 rounded-[2rem] flex items-center justify-center mx-auto mb-10 text-blue-500 border border-blue-100 shadow-sm">
            <Clock className="w-12 h-12" />
         </div>
         <h2 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter mb-4">No Products in Staging</h2>
         <p className="text-xs font-black text-gray-400 uppercase tracking-widest leading-relaxed mb-10 max-w-lg mx-auto">
            Your import list is currently empty. Products you import from the Sourcing Marketplace will appear here for final pricing and description optimization.
         </p>
         <button 
           onClick={() => navigate('/admin/sourcing')}
           className="px-10 py-5 bg-gray-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_30px_rgba(0,0,0,0.1)]"
         >
           Browse Sourcing Marketplace
         </button>
      </div>

      {/* Quick Tips */}
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-16">
         <div className="p-8 bg-white rounded-[3rem] border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] flex items-start gap-6 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all">
            <div className="w-14 h-14 bg-emerald-50 rounded-[1.5rem] flex items-center justify-center flex-shrink-0 text-emerald-500 border border-emerald-100">
               <Package className="w-6 h-6" />
            </div>
            <div>
               <h6 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-2 italic">Auto-Sync</h6>
               <p className="text-[10px] font-black text-gray-400 uppercase leading-normal">Inventory levels are synced daily with Korean suppliers.</p>
            </div>
         </div>
         <div className="p-8 bg-white rounded-[3rem] border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] flex items-start gap-6 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all">
            <div className="w-14 h-14 bg-amber-50 rounded-[1.5rem] flex items-center justify-center flex-shrink-0 text-amber-500 border border-amber-100">
               <AlertCircle className="w-6 h-6" />
            </div>
            <div>
               <h6 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-2 italic">Pricing Rules</h6>
               <p className="text-[10px] font-black text-gray-400 uppercase leading-normal">Set global markup rules to automate your profit margins.</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AdminImportList;
