import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Package, Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminImportList: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center gap-6">
        <button 
          onClick={() => navigate('/admin/dropshipping')}
          className="w-12 h-12 bg-white rounded-2xl border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-5 h-5 text-gray-900" />
        </button>
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-gray-900 uppercase italic">Import Staging</h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Review and optimize imported products before launch</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] p-12 border border-gray-100 shadow-sm text-center max-w-2xl mx-auto mt-12">
         <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-blue-500">
            <Clock className="w-12 h-12" />
         </div>
         <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter mb-4">No Products in Staging</h2>
         <p className="text-xs font-black text-gray-400 uppercase tracking-widest leading-relaxed mb-8">
            Your import list is currently empty. Products you import from the Sourcing Marketplace will appear here for final pricing and description optimization.
         </p>
         <button 
           onClick={() => navigate('/admin/sourcing')}
           className="px-8 py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-gray-900/10"
         >
           Browse Sourcing Marketplace
         </button>
      </div>

      {/* Quick Tips */}
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-12">
         <div className="p-6 bg-white rounded-3xl border border-gray-100 flex items-start gap-4">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0 text-emerald-500">
               <Package className="w-5 h-5" />
            </div>
            <div>
               <h6 className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-1">Auto-Sync</h6>
               <p className="text-[8px] font-black text-gray-400 uppercase leading-normal">Inventory levels are synced daily with Korean suppliers.</p>
            </div>
         </div>
         <div className="p-6 bg-white rounded-3xl border border-gray-100 flex items-start gap-4">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0 text-amber-500">
               <AlertCircle className="w-5 h-5" />
            </div>
            <div>
               <h6 className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-1">Pricing Rules</h6>
               <p className="text-[8px] font-black text-gray-400 uppercase leading-normal">Set global markup rules to automate your profit margins.</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AdminImportList;
