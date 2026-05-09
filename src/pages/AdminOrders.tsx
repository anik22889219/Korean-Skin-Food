import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../services/api';
import { Order } from '../types';
import { 
  ShoppingBag, 
  Clock, 
  Truck, 
  CheckCircle2, 
  MoreVertical, 
  Search, 
  Filter,
  Eye,
  Phone,
  MapPin,
  X
} from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await api.getAllOrders();
      setOrders(data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, status: string) => {
    try {
      await api.updateOrderStatus(orderId, status);
      setOrders(orders.map(o => o.order_id === orderId ? { ...o, status: status as any } : o));
      if (selectedOrder?.order_id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: status as any });
      }
    } catch (err) {
      alert('Status update failed');
    }
  };

  const filteredOrders = orders.filter(o => 
    o.order_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.customer_phone.includes(searchQuery)
  );

  return (
    <>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-gray-900 uppercase italic">Logistics Hub</h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Global order fulfillment and transaction management</p>
        </div>

        {/* Toolbar */}
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
           <div className="relative flex-1">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
             <input 
               type="text" 
               placeholder="Find by Transaction ID or Customer Phone..."
               className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-primary/10"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
             />
           </div>
           <div className="flex items-center gap-2">
             <button className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
               <Filter className="w-4 h-4 text-gray-400" />
             </button>
           </div>
        </div>

        <div className="grid gap-6">
           {filteredOrders.map(order => (
             <div 
               key={order.order_id} 
               className="bg-white rounded-[2.5rem] p-8 border border-gray-50 shadow-sm hover:shadow-xl hover:shadow-gray-100/50 transition-all group"
             >
                <div className="flex flex-col lg:flex-row justify-between gap-8">
                   <div className="flex-1 space-y-6">
                      <div className="flex items-center justify-between lg:justify-start lg:gap-6">
                         <h5 className="text-xl font-black text-gray-900 italic tracking-tighter uppercase shrink-0">#{order.order_id}</h5>
                         <div className="flex items-center gap-2">
                            <span className={`px-4 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                               order.status === 'Pending' ? 'bg-amber-100 text-amber-600' : 
                               order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                            }`}>
                               {order.status}
                            </span>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{new Date(order.timestamp).toLocaleDateString()}</span>
                         </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-8">
                         <div className="space-y-4">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                                  <Phone className="w-4 h-4" />
                               </div>
                               <p className="text-xs font-black text-gray-900 uppercase italic tracking-tighter">{order.customer_phone}</p>
                            </div>
                            <div className="flex items-start gap-3">
                               <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 shrink-0">
                                  <MapPin className="w-4 h-4" />
                               </div>
                               <p className="text-[10px] font-bold text-gray-400 leading-relaxed uppercase">{order.customer_address}</p>
                            </div>
                         </div>
                         <div className="space-y-4">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 bg-primary/5 rounded-lg flex items-center justify-center text-primary">
                                  <ShoppingBag className="w-4 h-4" />
                               </div>
                               <p className="text-xs font-black text-primary italic tracking-tighter">৳{order.total.toLocaleString()}</p>
                            </div>
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                                  <CheckCircle2 className="w-4 h-4" />
                               </div>
                               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{order.payment_method}</p>
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="flex lg:flex-col gap-3 lg:w-48 justify-end">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="flex-1 lg:flex-none flex items-center justify-center gap-2 py-4 bg-gray-50 text-gray-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all"
                      >
                         <Eye className="w-4 h-4" /> Details
                      </button>
                      <button 
                         onClick={() => handleStatusUpdate(order.order_id, 'Delivered')}
                         className="flex-1 lg:flex-none py-4 bg-emerald-50 text-emerald-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                      >
                         Approve Delivery
                      </button>
                   </div>
                </div>
             </div>
           ))}
        </div>

        {/* Order Details Modal */}
        <AnimatePresence>
           {selectedOrder && (
             <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/40 backdrop-blur-sm">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl overflow-y-auto max-h-[90vh]"
                >
                   <div className="p-10 space-y-8">
                      <div className="flex items-center justify-between">
                         <h3 className="text-2xl font-black tracking-tighter uppercase italic">Manifest Context</h3>
                         <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-50 rounded-xl">
                            <X className="w-5 h-5 text-gray-400" />
                         </button>
                      </div>

                      <div className="bg-gray-50/50 p-8 rounded-[2rem] space-y-4">
                         {selectedOrder.items.map((item, idx) => (
                           <div key={idx} className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 rounded-xl bg-white p-1 shadow-sm border border-gray-100">
                                    <img src={item.images?.[0]} className="w-full h-full object-cover rounded-lg" alt="" referrerPolicy="no-referrer" />
                                 </div>
                                 <div>
                                    <p className="text-[10px] font-black text-gray-900 uppercase italic tracking-tighter">{item.name}</p>
                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{item.quantity} Unit(s)</p>
                                 </div>
                              </div>
                              <p className="text-[10px] font-black text-gray-900 italic tracking-tighter">৳{(item.price * item.quantity).toLocaleString()}</p>
                           </div>
                         ))}
                         <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Valuation</p>
                            <p className="text-xl font-black text-primary italic tracking-tighter">৳{selectedOrder.total.toLocaleString()}</p>
                         </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                         <button 
                           onClick={() => { handleStatusUpdate(selectedOrder.order_id, 'Canceled'); setSelectedOrder(null); }}
                           className="py-4 bg-red-50 text-red-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                         >
                            Void Transaction
                         </button>
                         <button 
                           onClick={() => { handleStatusUpdate(selectedOrder.order_id, 'Confirmed'); setSelectedOrder(null); }}
                           className="py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary transition-all"
                         >
                            Sync to Warehouse
                         </button>
                      </div>
                   </div>
                </motion.div>
             </div>
           )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default AdminOrders;
