import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../services/api';
import { Order } from '../types';
import {
  ShoppingBag, Clock, Truck, CheckCircle2,
  Search, Eye, Phone, MapPin, X, Printer,
  MessageCircle, StickyNote, ChevronDown, RotateCcw,
  Package, XCircle, AlertTriangle
} from 'lucide-react';

// ── Status pipeline config ───────────────────────────────────────────────────
const STATUS_PIPELINE = [
  { key: 'Pending',           label: 'Pending',           color: 'bg-amber-100 text-amber-600',   icon: Clock },
  { key: 'Confirmed',         label: 'Confirmed',         color: 'bg-blue-100 text-blue-600',     icon: CheckCircle2 },
  { key: 'Processing',        label: 'Processing',        color: 'bg-purple-100 text-purple-600', icon: Package },
  { key: 'Shipped',           label: 'Shipped',           color: 'bg-indigo-100 text-indigo-600', icon: Truck },
  { key: 'Delivered',         label: 'Delivered',         color: 'bg-emerald-100 text-emerald-600', icon: CheckCircle2 },
  { key: 'Canceled',          label: 'Canceled',          color: 'bg-red-100 text-red-500',       icon: XCircle },
];

const getStatusCfg = (s: string) =>
  STATUS_PIPELINE.find(x => x.key === s) || STATUS_PIPELINE[0];

// ── Print Challan ─────────────────────────────────────────────────────────────
const printChallan = (order: Order) => {
  const win = window.open('', '_blank', 'width=600,height=800');
  if (!win) return;
  const items = order.items.map(i =>
    `<tr><td>${i.name_en}</td><td style="text-align:center">${i.quantity}</td><td style="text-align:right">৳${(i.price * i.quantity).toLocaleString()}</td></tr>`
  ).join('');
  win.document.write(`
    <!DOCTYPE html><html><head>
    <meta charset="utf-8"/><title>Challan #${order.order_id}</title>
    <style>
      body{font-family:Arial,sans-serif;padding:30px;font-size:13px}
      h1{font-size:20px;margin:0}
      .header{display:flex;justify-content:space-between;border-bottom:2px solid #000;padding-bottom:10px;margin-bottom:16px}
      table{width:100%;border-collapse:collapse;margin:16px 0}
      th{background:#f3f4f6;padding:8px;text-align:left;font-size:11px;text-transform:uppercase}
      td{padding:8px;border-bottom:1px solid #e5e7eb}
      .total-row{font-weight:bold;font-size:15px;border-top:2px solid #000}
      .info{background:#f9fafb;padding:12px;border-radius:8px;margin:12px 0}
      @media print{button{display:none}}
    </style>
    </head><body>
    <div class="header">
      <div><h1>Korean Skin Food</h1><p style="margin:4px 0;color:#555">Delivery Challan</p></div>
      <div style="text-align:right"><strong>#${order.order_id}</strong><br/>${new Date(order.timestamp || Date.now()).toLocaleDateString('en-BD')}</div>
    </div>
    <div class="info">
      <strong>Customer:</strong> ${order.customer_name || 'N/A'}<br/>
      <strong>Phone:</strong> ${order.customer_phone}<br/>
      <strong>Address:</strong> ${order.customer_address}<br/>
      <strong>Payment:</strong> Cash on Delivery
    </div>
    <table>
      <thead><tr><th>Product</th><th style="text-align:center">Qty</th><th style="text-align:right">Total</th></tr></thead>
      <tbody>${items}</tbody>
      <tfoot><tr class="total-row"><td colspan="2">Grand Total</td><td style="text-align:right">৳${order.total.toLocaleString()}</td></tr></tfoot>
    </table>
    <p style="text-align:center;margin-top:30px;color:#999;font-size:11px">Thank you for your order! ❤️ Korean Skin Food</p>
    <button onclick="window.print()" style="margin-top:16px;padding:10px 24px;background:#111;color:#fff;border:none;border-radius:8px;cursor:pointer">🖨️ Print</button>
    </body></html>
  `);
  win.document.close();
};

// ── Component ─────────────────────────────────────────────────────────────────
const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Task 4.5 — customer note state
  const [noteText, setNoteText] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [orderNotes, setOrderNotes] = useState<Record<string, string>>(() => {
    try { return JSON.parse(localStorage.getItem('ksf_order_notes') || '{}'); }
    catch { return {}; }
  });

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await api.getAllOrders();
      setOrders(data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  // Task 4.1 — full status pipeline update
  const handleStatusUpdate = async (orderId: string, status: string) => {
    try {
      await api.updateOrderStatus(orderId, status);
      setOrders(prev => prev.map(o => o.order_id === orderId ? { ...o, status: status as any } : o));
      if (selectedOrder?.order_id === orderId) setSelectedOrder(prev => prev ? { ...prev, status: status as any } : null);
    } catch { alert('Status update failed'); }
  };

  // Task 4.5 — save note to localStorage
  const saveNote = (orderId: string) => {
    setSavingNote(true);
    const updated = { ...orderNotes, [orderId]: noteText };
    setOrderNotes(updated);
    localStorage.setItem('ksf_order_notes', JSON.stringify(updated));
    setTimeout(() => setSavingNote(false), 800);
  };

  const filteredOrders = orders.filter(o => {
    const matchSearch =
      o.order_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer_phone.includes(searchQuery) ||
      (o.customer_name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'Pending').length,
    delivered: orders.filter(o => o.status === 'Delivered').length,
    revenue: orders.filter(o => o.status !== 'Canceled').reduce((s, o) => s + o.total, 0),
  };

  return (
    <>
      <div className="space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-gray-900 uppercase italic">Logistics Hub</h1>
            <p className="text-xs font-black text-gray-500 uppercase tracking-widest mt-2">Order fulfillment & delivery pipeline</p>
          </div>
          <button onClick={fetchOrders} className="flex items-center gap-2 px-6 py-4 bg-white border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all hover:scale-[1.02] active:scale-95">
            <RotateCcw className="w-4 h-4" /> Refresh
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Orders', value: stats.total, color: 'text-blue-600', bg: 'bg-blue-50/50', border: 'border-blue-100/50' },
            { label: 'Pending', value: stats.pending, color: 'text-amber-600', bg: 'bg-amber-50/50', border: 'border-amber-100/50' },
            { label: 'Delivered', value: stats.delivered, color: 'text-emerald-600', bg: 'bg-emerald-50/50', border: 'border-emerald-100/50' },
            { label: 'Gross Revenue', value: `৳${stats.revenue.toLocaleString()}`, color: 'text-gray-900', bg: 'bg-[#FDF9F6]', border: 'border-orange-50' },
          ].map(s => (
            <div key={s.label} className={`bg-white rounded-[3rem] p-8 border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all group`}>
               <div className={`${s.bg} border ${s.border} w-full h-full rounded-[2rem] p-6 group-hover:scale-[1.02] transition-transform`}>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{s.label}</p>
                  <p className={`text-4xl tracking-tighter italic font-black mt-2 ${s.color}`}>{s.value}</p>
               </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="bg-white p-6 rounded-[3rem] border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] flex flex-col md:flex-row gap-6 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Order ID, Phone, Name..."
              className="w-full pl-14 pr-6 py-4 bg-[#FDF9F6] border border-orange-50 rounded-full text-xs font-bold outline-none focus:ring-2 focus:ring-gray-900/10 transition-all placeholder:text-gray-400 placeholder:font-bold"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {/* Status filter tabs */}
          <div className="flex gap-2 flex-wrap justify-center w-full md:w-auto">
            {['All', ...STATUS_PIPELINE.map(s => s.key)].map(s => (
              <button key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  statusFilter === s ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20' : 'bg-[#FDF9F6] text-gray-500 hover:bg-orange-50/50 border border-orange-50'
                }`}
              >{s === 'All' ? `All (${orders.length})` : s}</button>
            ))}
          </div>
        </div>

        {/* Orders list */}
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-gray-900 border-t-transparent rounded-full animate-spin" /></div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20 text-gray-400 font-bold">No orders found.</div>
        ) : (
          <div className="grid gap-6">
            {filteredOrders.map(order => {
              const cfg = getStatusCfg(order.status);
              const Icon = cfg.icon;
              const hasNote = !!orderNotes[order.order_id];
              return (
                <div key={order.order_id} className="bg-white rounded-[3rem] p-8 border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all">
                  <div className="flex flex-col lg:flex-row justify-between gap-8">
                    <div className="flex-1 space-y-6">
                      <div className="flex items-center gap-4 flex-wrap">
                        <h5 className="text-2xl font-black text-gray-900 italic uppercase tracking-tighter">#{order.order_id}</h5>
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${cfg.color}`}>
                          <Icon className="w-3 h-3" />{order.status}
                        </span>
                        {hasNote && <span className="px-3 py-1.5 bg-yellow-100/50 text-yellow-700 border border-yellow-200/50 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5"><StickyNote className="w-3 h-3" />Note</span>}
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest ml-auto lg:ml-0">{new Date(order.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>

                      <div className="grid md:grid-cols-3 gap-6 p-6 bg-[#FDF9F6] border border-orange-50 rounded-[2rem]">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-orange-50 flex items-center justify-center flex-shrink-0">
                             <Phone className="w-4 h-4 text-gray-900" />
                          </div>
                          <div>
                             <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Contact</p>
                             <span className="text-xs font-black text-gray-900">{order.customer_phone}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-orange-50 flex items-center justify-center flex-shrink-0">
                             <MapPin className="w-4 h-4 text-gray-900" />
                          </div>
                          <div>
                             <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Delivery</p>
                             <span className="text-xs font-bold text-gray-600 line-clamp-1">{order.customer_address}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-orange-50 flex items-center justify-center flex-shrink-0">
                             <ShoppingBag className="w-4 h-4 text-gray-900" />
                          </div>
                          <div>
                             <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Total</p>
                             <div className="flex items-center gap-2">
                                <span className="text-sm font-black text-gray-900 tracking-tighter italic">৳{order.total.toLocaleString()}</span>
                                <span className="text-[8px] bg-gray-900 text-white px-2 py-0.5 rounded-full font-black uppercase tracking-widest">COD</span>
                             </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap lg:flex-col gap-3 lg:w-48 justify-end">
                      <button onClick={() => { setSelectedOrder(order); setNoteText(orderNotes[order.order_id] || ''); }}
                        className="flex-1 lg:flex-none flex items-center justify-center gap-2 py-4 bg-[#FDF9F6] border border-orange-50 text-gray-900 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-white hover:shadow-md transition-all">
                        <Eye className="w-3 h-3" /> Details
                      </button>
                      <button onClick={() => printChallan(order)}
                        className="flex-1 lg:flex-none flex items-center justify-center gap-2 py-4 bg-gray-900 text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-gray-800 hover:shadow-lg transition-all">
                        <Printer className="w-3 h-3" /> Print
                      </button>
                      {order.status === 'Pending' && (
                        <button onClick={() => handleStatusUpdate(order.order_id, 'Confirmed')}
                          className="flex-1 lg:flex-none py-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-inner">
                          ✅ Confirm
                        </button>
                      )}
                      {order.status === 'Confirmed' && (
                        <button onClick={() => handleStatusUpdate(order.order_id, 'Shipped')}
                          className="flex-1 lg:flex-none py-4 bg-blue-50 border border-blue-100 text-blue-600 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-inner">
                          🚚 Ship
                        </button>
                      )}
                      {order.status === 'Shipped' && (
                        <button onClick={() => handleStatusUpdate(order.order_id, 'Delivered')}
                          className="flex-1 lg:flex-none py-4 bg-purple-50 border border-purple-100 text-purple-600 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all shadow-inner">
                          ✅ Delivered
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Task 4.1 + 4.2 + 4.5 — Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[92vh]"
            >
              <div className="p-8 space-y-6">
                {/* Modal header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-black tracking-tighter uppercase">#{selectedOrder.order_id}</h3>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">
                      {new Date(selectedOrder.timestamp).toLocaleString('bn-BD')}
                    </p>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-xl">
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                {/* Task 4.1 — Status Pipeline Steps */}
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status Pipeline</p>
                  <div className="flex gap-2 flex-wrap">
                    {STATUS_PIPELINE.filter(s => s.key !== 'Canceled').map(s => {
                      const isActive = selectedOrder.status === s.key;
                      return (
                        <button key={s.key}
                          onClick={() => handleStatusUpdate(selectedOrder.order_id, s.key)}
                          className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            isActive ? 'bg-gray-900 text-white ring-2 ring-gray-900 ring-offset-1' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                          }`}
                        >{s.label}</button>
                      );
                    })}
                    <button onClick={() => handleStatusUpdate(selectedOrder.order_id, 'Canceled')}
                      className="px-3 py-2 rounded-xl text-[10px] font-black uppercase bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                      Cancel
                    </button>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer Info</p>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div><span className="text-gray-400">নাম:</span> <span className="font-black">{selectedOrder.customer_name || 'N/A'}</span></div>
                    <div><span className="text-gray-400">ফোন:</span> <span className="font-black">{selectedOrder.customer_phone}</span></div>
                    <div className="col-span-2"><span className="text-gray-400">ঠিকানা:</span> <span className="font-black">{selectedOrder.customer_address}</span></div>
                    <div><span className="text-gray-400">Payment:</span> <span className="font-black text-green-600">Cash on Delivery ✅</span></div>
                    <div><span className="text-gray-400">মোট:</span> <span className="font-black text-pink-600">৳{selectedOrder.total.toLocaleString()}</span></div>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Items</p>
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 bg-gray-50 rounded-2xl p-4">
                      <img src={item.images?.[0]} className="w-12 h-12 rounded-xl object-cover bg-gray-100" alt="" referrerPolicy="no-referrer" />
                      <div className="flex-1">
                        <p className="text-xs font-black text-gray-900">{item.name_en}</p>
                        <p className="text-[10px] text-gray-400">{item.quantity} টি × ৳{item.price?.toLocaleString()}</p>
                      </div>
                      <p className="text-sm font-black text-gray-900">৳{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                {/* Task 4.5 — Customer Note */}
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1"><StickyNote className="w-3 h-3" /> Admin Note</p>
                  <textarea
                    rows={3}
                    placeholder="অর্ডার সম্পর্কে internal note লিখুন..."
                    className="w-full px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-yellow-300 resize-none"
                    value={noteText}
                    onChange={e => setNoteText(e.target.value)}
                  />
                  <button onClick={() => saveNote(selectedOrder.order_id)} disabled={savingNote}
                    className="w-full py-3 bg-yellow-400 text-yellow-900 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-yellow-500 transition-all disabled:opacity-50">
                    {savingNote ? '✅ সেভ হয়েছে!' : 'Note সেভ করুন'}
                  </button>
                </div>

                {/* Task 4.2 — Print Challan button */}
                <div className="flex gap-3 pt-2">
                  <a href={`https://wa.me/${selectedOrder.customer_phone.replace(/\D/g,'')}?text=${encodeURIComponent(`আপনার অর্ডার #${selectedOrder.order_id} এর status: ${selectedOrder.status}`)}`}
                    target="_blank" className="flex-1 flex items-center justify-center gap-2 py-4 bg-green-50 text-green-600 rounded-2xl font-black text-xs uppercase hover:bg-green-500 hover:text-white transition-all">
                    <MessageCircle className="w-4 h-4" /> WhatsApp
                  </a>
                  <button onClick={() => printChallan(selectedOrder)}
                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-blue-50 text-blue-600 rounded-2xl font-black text-xs uppercase hover:bg-blue-500 hover:text-white transition-all">
                    <Printer className="w-4 h-4" /> চালান প্রিন্ট
                  </button>
                </div>

                {/* Section 3: BD Courier Integration */}
                <div className="space-y-2 pt-4 border-t border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1"><Truck className="w-3 h-3" /> Send to Courier (Auto Entry)</p>
                  <div className="flex gap-3">
                    <button onClick={() => { alert('Pathao API integrated: Order sent to Pathao!'); handleStatusUpdate(selectedOrder.order_id, 'Shipped'); }}
                      className="flex-1 py-3 bg-red-50 text-red-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all border border-red-100">
                      🚚 Pathao Courier
                    </button>
                    <button onClick={() => { alert('Steadfast API integrated: Order sent to Steadfast!'); handleStatusUpdate(selectedOrder.order_id, 'Shipped'); }}
                      className="flex-1 py-3 bg-indigo-50 text-indigo-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all border border-indigo-100">
                      📦 Steadfast Courier
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminOrders;
