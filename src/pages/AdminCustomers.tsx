import React, { useState, useEffect } from 'react';
import { Search, Download, User, ShoppingBag, DollarSign, Calendar, ChevronRight, X, Phone, MapPin, Mail, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';
import { Order } from '../types';

interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  orderCount: number;
  totalSpent: number;
  lastOrderDate: string;
  orders: Order[];
}

export default function AdminCustomers() {
  const [search, setSearch] = useState('');
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null);

  useEffect(() => {
    async function loadCRMData() {
      setLoading(true);
      try {
        // Fetch all orders and all registered customers
        const [orders, regUsers] = await Promise.all([
          api.getAllOrders(),
          api.getAllCustomers()
        ]);

        // Map phone to registered user for fast lookup
        const userMap = new Map<string, any>();
        if (Array.isArray(regUsers)) {
          regUsers.forEach(u => {
            if (u.phone) userMap.set(String(u.phone).trim(), u);
          });
        }

        // Aggregate unique customer metrics from orders
        const customerAggMap = new Map<string, {
          orders: Order[];
          totalSpent: number;
        }>();

        orders.forEach((ord: Order) => {
          const phone = String(ord.customer_phone || '').trim();
          if (!phone) return;

          if (!customerAggMap.has(phone)) {
            customerAggMap.set(phone, { orders: [], totalSpent: 0 });
          }
          const data = customerAggMap.get(phone)!;
          data.orders.push(ord);
          data.totalSpent += ord.total;
        });

        // Construct consolidated customer database records
        const records: CustomerRecord[] = [];

        // 1. Gather aggregated customers who placed orders
        customerAggMap.forEach((agg, phone) => {
          // Sort customer orders by newest first
          const sortedOrders = agg.orders.sort(
            (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
          const latestOrder = sortedOrders[0];

          // Check if user is registered in spreadsheet Users tab
          const regUser = userMap.get(phone);

          records.push({
            id: regUser?.user_id || `C-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            name: regUser?.name || latestOrder.customer_name || 'Guest Customer',
            phone: phone,
            email: regUser?.email || '',
            address: latestOrder.customer_address || regUser?.address || 'Dhaka, Bangladesh',
            orderCount: sortedOrders.length,
            totalSpent: agg.totalSpent,
            lastOrderDate: latestOrder.timestamp,
            orders: sortedOrders
          });
        });

        // 2. Add registered users who haven't placed an order yet
        userMap.forEach((userRecord, phone) => {
          const exists = records.some(r => r.phone === phone);
          if (!exists) {
            records.push({
              id: userRecord.user_id || `C-${Date.now()}`,
              name: userRecord.name || 'Anonymous User',
              phone: phone,
              email: userRecord.email || '',
              address: userRecord.address || 'Bangladesh',
              orderCount: 0,
              totalSpent: 0,
              lastOrderDate: '',
              orders: []
            });
          }
        });

        setCustomers(records.sort((a, b) => b.totalSpent - a.totalSpent));
      } catch (err) {
        console.error('[KSF CRM] Error aggregates customers:', err);
      } finally {
        setLoading(false);
      }
    }

    loadCRMData();
  }, []);

  // Filter customers by search term
  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    c.address.toLowerCase().includes(search.toLowerCase())
  );

  // Compute CRM stats
  const totalCustomersCount = customers.length;
  const totalSpentAll = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const averageSpent = totalCustomersCount > 0 ? totalSpentAll / totalCustomersCount : 0;
  const repeatCustomersCount = customers.filter(c => c.orderCount > 1).length;

  const exportCRMtoCSV = () => {
    const headers = ['Customer ID', 'Name', 'Phone', 'Email', 'Address', 'Total Orders', 'Total Spent (BDT)', 'Last Purchase'];
    const rows = customers.map(c => [
      c.id,
      c.name,
      c.phone,
      c.email,
      c.address,
      c.orderCount,
      c.totalSpent,
      c.lastOrderDate ? new Date(c.lastOrderDate).toLocaleDateString() : 'N/A'
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ksf_customers_crm_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-12 pb-12 relative min-h-[70vh]">
      <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-gray-900 uppercase italic">Customers & CRM</h1>
          <p className="text-xs font-black text-gray-500 uppercase tracking-widest mt-2">Relational Customer Database & Lifetime Value</p>
        </div>

        <button 
          onClick={exportCRMtoCSV}
          disabled={customers.length === 0}
          className="flex items-center gap-2 px-6 py-4 bg-white border border-orange-50 shadow-[0_10px_40px_rgba(0,0,0,0.03)] text-gray-700 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 hover:border-gray-200 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
        >
          <Download className="w-4 h-4 text-primary" />
          Export CRM Database (CSV)
        </button>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Consolidated CRM Profiles', value: totalCustomersCount, icon: User, color: 'text-primary', bg: 'bg-[#FFE8F4]/40', border: 'border-pink-100/50' },
          { label: 'Repeat Buyers (>1 Order)', value: repeatCustomersCount, icon: ShoppingBag, color: 'text-emerald-600', bg: 'bg-emerald-50/40', border: 'border-emerald-100/50' },
          { label: 'Avg Customer Lifetime Value', value: `৳${Math.round(averageSpent).toLocaleString()}`, icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50/40', border: 'border-blue-100/50' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-[2.5rem] p-6 border border-orange-50/30 shadow-[0_10px_45px_rgba(0,0,0,0.015)] group"
          >
             <div className={`${stat.bg} border ${stat.border} rounded-[2rem] p-6 flex justify-between items-start group-hover:scale-[1.01] transition-transform`}>
              <div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                <p className={`text-3xl tracking-tighter italic font-black mt-2 ${stat.color}`}>{stat.value}</p>
              </div>
              <div className="w-12 h-12 bg-white rounded-[1rem] shadow-sm flex items-center justify-center flex-shrink-0">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search Toolbar */}
      <div className="bg-white p-4 rounded-[2rem] border border-orange-50/30 shadow-[0_10px_40px_rgba(0,0,0,0.01)] flex items-center">
        <div className="relative w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by customer name, phone number, address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-[#FDF9F6] border border-orange-50 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-gray-900/10 transition-all placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Main CRM Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <div className="w-12 h-12 border-4 border-pink-100 border-t-primary rounded-full animate-spin" />
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Compiling Customer Relations...</p>
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="bg-white rounded-[3rem] border border-orange-50/30 shadow-[0_10px_40px_rgba(0,0,0,0.015)] p-20 text-center space-y-6">
          <div className="w-24 h-24 bg-[#FDF9F6] rounded-[2.5rem] border border-orange-50 flex items-center justify-center mx-auto shadow-inner">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-black text-gray-900 tracking-tighter uppercase italic">No Customers Found</h3>
          <p className="text-gray-400 text-xs font-bold max-w-xs mx-auto">
            Try adjusting your search criteria or make sure orders/users exist in Google Sheets.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] border border-orange-50/30 shadow-[0_10px_45px_rgba(0,0,0,0.015)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FDF9F6] border-b border-orange-50/50">
                  <th className="px-8 py-5 text-[9px] font-black text-gray-400 uppercase tracking-widest">Customer Details</th>
                  <th className="px-6 py-5 text-[9px] font-black text-gray-400 uppercase tracking-widest">Location</th>
                  <th className="px-6 py-5 text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">Orders</th>
                  <th className="px-6 py-5 text-[9px] font-black text-gray-400 uppercase tracking-widest text-right">LTV (Spent)</th>
                  <th className="px-6 py-5 text-[9px] font-black text-gray-400 uppercase tracking-widest">Last Activity</th>
                  <th className="px-8 py-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-50/20">
                {filteredCustomers.map((cust) => (
                  <tr 
                    key={cust.phone}
                    className="hover:bg-[#FDF9F6]/20 transition-colors group cursor-pointer"
                    onClick={() => setSelectedCustomer(cust)}
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/5 rounded-xl border border-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-black text-primary uppercase">{cust.name.substring(0, 2)}</span>
                        </div>
                        <div>
                          <p className="text-xs font-black text-gray-900 tracking-tight uppercase group-hover:text-primary transition-colors">{cust.name}</p>
                          <p className="text-[10px] text-gray-400 font-bold mt-0.5">{cust.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <p className="text-xs font-bold text-gray-600 truncate max-w-[200px]" title={cust.address}>
                        {cust.address}
                      </p>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <span className="inline-flex items-center justify-center px-3 py-1 bg-gray-100 text-gray-900 rounded-full text-[10px] font-black tracking-tighter">
                        {cust.orderCount} Orders
                      </span>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <p className="text-xs font-black text-primary italic">৳{cust.totalSpent.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-6">
                      {cust.lastOrderDate ? (
                        <div>
                          <p className="text-xs font-bold text-gray-700">{new Date(cust.lastOrderDate).toLocaleDateString()}</p>
                          <p className="text-[8px] font-bold text-gray-400 uppercase mt-0.5">
                            {new Date(cust.lastOrderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      ) : (
                        <p className="text-[10px] text-gray-300 font-black uppercase">No Purchases</p>
                      )}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-2 hover:bg-primary/5 rounded-xl transition-all group-hover:translate-x-1 duration-200">
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Customer Profile Slide-over Drawer */}
      <AnimatePresence>
        {selectedCustomer && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCustomer(null)}
              className="fixed inset-0 bg-gray-900/40 z-[90] backdrop-blur-sm"
            />

            {/* Slide Drawer */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-screen w-full sm:w-[500px] bg-[#FDF9F6] shadow-2xl z-[100] border-l border-orange-50 flex flex-col"
            >
              {/* Header */}
              <div className="p-6 bg-white border-b border-orange-50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-wide">Customer Sanctuary</h3>
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mt-0.5">Timeline & Orders History</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedCustomer(null)}
                  className="p-2 hover:bg-[#FDF9F6] border border-orange-50/50 hover:border-orange-50 rounded-xl text-gray-400 hover:text-gray-900 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                
                {/* Profile Overview Card */}
                <div className="bg-white p-6 rounded-[2rem] border border-orange-50/30 shadow-[0_10px_30px_rgba(0,0,0,0.01)] space-y-4">
                  <div>
                    <h4 className="text-lg font-black tracking-tight text-gray-900 uppercase italic">{selectedCustomer.name}</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">ID: {selectedCustomer.id}</p>
                  </div>

                  <div className="space-y-3 pt-2 text-xs">
                    <div className="flex items-center gap-3 text-gray-600">
                      <Phone className="w-4 h-4 text-primary/70 flex-shrink-0" />
                      <span className="font-bold">{selectedCustomer.phone}</span>
                    </div>
                    {selectedCustomer.email && (
                      <div className="flex items-center gap-3 text-gray-600">
                        <Mail className="w-4 h-4 text-primary/70 flex-shrink-0" />
                        <span className="font-bold truncate">{selectedCustomer.email}</span>
                      </div>
                    )}
                    <div className="flex items-start gap-3 text-gray-600">
                      <MapPin className="w-4 h-4 text-primary/70 flex-shrink-0 mt-0.5" />
                      <span className="font-medium leading-relaxed">{selectedCustomer.address}</span>
                    </div>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-5 rounded-[1.5rem] border border-orange-50/30 text-center">
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Total Purchases</p>
                    <p className="text-2xl font-black text-gray-900 mt-2 italic">{selectedCustomer.orderCount}</p>
                  </div>
                  <div className="bg-white p-5 rounded-[1.5rem] border border-orange-50/30 text-center">
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">LTV (Spent)</p>
                    <p className="text-2xl font-black text-primary mt-2 italic">৳{selectedCustomer.totalSpent.toLocaleString()}</p>
                  </div>
                </div>

                {/* Order History List */}
                <div className="space-y-4">
                  <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] italic">Timeline & Purchase Logs</h5>
                  {selectedCustomer.orders.length === 0 ? (
                    <div className="text-center py-8 bg-white rounded-3xl border border-dashed border-orange-100 p-6">
                      <ShoppingCart className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                      <p className="text-[10px] font-black text-gray-400 uppercase">No orders logged yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedCustomer.orders.map((ord, idx) => (
                        <div key={ord.order_id} className="bg-white p-5 rounded-[2rem] border border-orange-50/30 shadow-[0_5px_15px_rgba(0,0,0,0.005)] relative flex flex-col gap-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-[10px] font-black text-gray-900 uppercase">ID: #{ord.order_id}</p>
                              <p className="text-[8px] text-gray-400 font-bold mt-0.5">
                                {new Date(ord.timestamp).toLocaleDateString()} {new Date(ord.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-wider ${
                              ord.status === 'Delivered' 
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                                : ord.status === 'Pending' 
                                ? 'bg-amber-50 text-amber-600 border border-amber-100' 
                                : 'bg-blue-50 text-blue-600 border border-blue-100'
                            }`}>
                              {ord.status}
                            </span>
                          </div>

                          {/* Items preview */}
                          <div className="border-t border-orange-50/30 pt-3 space-y-2">
                            {Array.isArray(ord.items) && ord.items.map((item: any, i: number) => (
                              <div key={i} className="flex justify-between items-center text-[10px] text-gray-500 font-bold">
                                <span className="truncate max-w-[240px]">{item.name_en || item.name || 'Skincare Ritual Item'}</span>
                                <span className="text-gray-400">Qty: {item.quantity || 1}</span>
                              </div>
                            ))}
                          </div>

                          <div className="flex justify-between items-center border-t border-orange-50/30 pt-3 text-[10px]">
                            <span className="font-bold text-gray-400 uppercase tracking-wide">Method: {ord.payment_method}</span>
                            <span className="font-black text-primary italic text-xs">৳{ord.total.toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
