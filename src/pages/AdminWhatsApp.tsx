import React, { useState, useEffect } from 'react';
import { MessageCircle, ExternalLink, Search, Phone, User, Sparkles, ShoppingBag, Clock, Filter, RefreshCcw, Send, MapPin, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';
import { Order } from '../types';

interface LeadRecord {
  lead_id: string;
  name: string;
  phone: string;
  address: string;
  source: string;
  skin_type?: string;
  concern?: string;
  timestamp: string;
}

interface WhatsAppProspect {
  id: string;
  name: string;
  phone: string;
  address: string;
  source: 'Sabiha AI Chatbot' | 'AI_CHATBOT' | 'META_ADS' | 'ORDER' | 'DIRECT' | string;
  skin_type: string;
  concern: string;
  timestamp: string;
  totalSpent: number;
  orderCount: number;
}

// Pre-built high-converting WhatsApp message templates in Bangla
const MESSAGE_TEMPLATES = [
  {
    id: 'brightening',
    label: 'Brightening Consultation',
    labelBn: 'ব্রাইটেনিং কনসালটেশন',
    icon: '✨',
    color: 'bg-amber-50 border-amber-100 text-amber-700',
    getMessage: (name: string) =>
      `আসসালামু আলাইকুম ${name} আপু! 😊\n\nআমি সাবিহা, Korean Skin Food থেকে আপনার স্কিন কেয়ার কনসালটেন্ট বলছি।\n\nআপনি আমাদের প্রিমিয়াম কোরিয়ান গ্লো স্কিন রুটিন সম্পর্কে জানতে চেয়েছিলেন। আমাদের কাছে অথেন্টিক কোরিয়ান সিরাম, টোনার এবং সানস্ক্রিন আছে যা ত্বকে ন্যাচারাল গ্লাস স্কিন লুক দেয়! ✨\n\nআপনার ত্বকের ধরন জানালে আমি পারফেক্ট রুটিন সাজেস্ট করতে পারি। কথা বলবেন? 💕`,
  },
  {
    id: 'acne',
    label: 'Acne Treatment',
    labelBn: 'ব্রণের চিকিৎসা',
    icon: '🧴',
    color: 'bg-green-50 border-green-100 text-green-700',
    getMessage: (name: string) =>
      `আসসালামু আলাইকুম ${name}! 🌸\n\nKorean Skin Food থেকে সাবিহা বলছি।\n\nআপনি ব্রণ ও ব্রণের দাগের জন্য সমাধান খুঁজছিলেন। আমাদের COSRX Acne Pimple Master Patch এবং Snail Mucin Essence কোরিয়া থেকে সরাসরি আনা — যা ব্রণ কমায় এবং দাগ হালকা করে! 🧴\n\nআপনার স্কিন টাইপ কি? Oily নাকি Combination? জানালে সেরা কম্বো বানিয়ে দিতে পারি! 😊`,
  },
  {
    id: 'followup',
    label: 'Order Follow-up',
    labelBn: 'অর্ডার ফলো-আপ',
    icon: '📦',
    color: 'bg-blue-50 border-blue-100 text-blue-700',
    getMessage: (name: string) =>
      `আসসালামু আলাইকুম ${name}! 💝\n\nKorean Skin Food থেকে সাবিহা বলছি।\n\nআপনার অর্ডার কি ঠিকমতো পেয়েছেন? প্রোডাক্টগুলো কেমন লাগছে? 😊\n\nযেকোনো প্রশ্ন থাকলে বা নতুন প্রোডাক্ট সম্পর্কে জানতে চাইলে জানাবেন!\n\nআমাদের এই মাসে নতুন কিছু প্রিমিয়াম কোরিয়ান প্রোডাক্ট এসেছে — চাইলে দেখাতে পারি! ✨`,
  },
  {
    id: 'reorder',
    label: 'Re-order Reminder',
    labelBn: 'পুনরায় অর্ডার',
    icon: '🔄',
    color: 'bg-purple-50 border-purple-100 text-purple-700',
    getMessage: (name: string) =>
      `আসসালামু আলাইকুম ${name} আপু! 🌷\n\nKorean Skin Food থেকে সাবিহা।\n\nআপনার আগের প্রোডাক্টগুলো শেষ হয়ে যাওয়ার সময় হয়েছে মনে হয়! স্কিনকেয়ার রুটিন consistent রাখা খুব জরুরি। 🧴\n\nএখন অর্ডার করলে ঢাকার ভেতরে মাত্র ৳60 ডেলিভারি চার্জ! 🚛\n\nরি-অর্ডার করবেন? আমি হেল্প করি! 💕`,
  },
];

// Source badge color mapper
const getSourceBadge = (source: string) => {
  const s = source.toLowerCase();
  if (s.includes('chatbot') || s.includes('ai_chatbot')) return { label: 'AI Chatbot', color: 'bg-violet-50 text-violet-600 border-violet-100' };
  if (s.includes('meta') || s.includes('ads')) return { label: 'Meta Ads', color: 'bg-blue-50 text-blue-600 border-blue-100' };
  if (s.includes('order')) return { label: 'Order', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
  return { label: 'Direct', color: 'bg-gray-50 text-gray-600 border-gray-100' };
};

export default function AdminWhatsApp() {
  const whatsapp = import.meta.env.VITE_WHATSAPP_NUMBER || '+8801755837545';
  const [prospects, setProspects] = useState<WhatsAppProspect[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [selectedProspect, setSelectedProspect] = useState<WhatsAppProspect | null>(null);

  useEffect(() => {
    loadProspects();
  }, []);

  const loadProspects = async () => {
    setLoading(true);
    try {
      const [leads, orders] = await Promise.all([
        api.getAllLeads(),
        api.getAllOrders(),
      ]);

      // Aggregate orders by phone for spend metrics
      const ordersByPhone = new Map<string, { total: number; count: number }>();
      orders.forEach((o: Order) => {
        const phone = String(o.customer_phone || '').trim();
        if (!phone) return;
        const prev = ordersByPhone.get(phone) || { total: 0, count: 0 };
        ordersByPhone.set(phone, { total: prev.total + o.total, count: prev.count + 1 });
      });

      // Build prospects from leads
      const prospectMap = new Map<string, WhatsAppProspect>();

      if (Array.isArray(leads)) {
        leads.forEach((lead: LeadRecord) => {
          const phone = String(lead.phone || '').trim();
          if (!phone) return;
          const oData = ordersByPhone.get(phone) || { total: 0, count: 0 };
          prospectMap.set(phone, {
            id: lead.lead_id || `L-${Date.now()}`,
            name: lead.name || 'Unknown',
            phone,
            address: lead.address || '',
            source: lead.source || 'DIRECT',
            skin_type: lead.skin_type || '',
            concern: lead.concern || '',
            timestamp: lead.timestamp || '',
            totalSpent: oData.total,
            orderCount: oData.count,
          });
        });
      }

      // Add prospects from orders who aren't already leads
      orders.forEach((o: Order) => {
        const phone = String(o.customer_phone || '').trim();
        if (!phone || prospectMap.has(phone)) return;
        const oData = ordersByPhone.get(phone) || { total: 0, count: 0 };
        prospectMap.set(phone, {
          id: o.order_id,
          name: o.customer_name || 'Customer',
          phone,
          address: o.customer_address || '',
          source: 'ORDER',
          skin_type: '',
          concern: '',
          timestamp: o.timestamp || '',
          totalSpent: oData.total,
          orderCount: oData.count,
        });
      });

      // Sort by most recent first
      const sorted = Array.from(prospectMap.values()).sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setProspects(sorted);
    } catch (err) {
      console.error('[WhatsApp CRM] Failed to load prospects:', err);
    } finally {
      setLoading(false);
    }
  };

  const openWhatsApp = (phone: string, message: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const fullPhone = cleanPhone.startsWith('0') ? `88${cleanPhone}` : cleanPhone;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${fullPhone}?text=${encoded}`, '_blank');
  };

  // Filter logic
  const filteredProspects = prospects.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search) ||
      (p.concern || '').toLowerCase().includes(search.toLowerCase());
    const matchesSource =
      sourceFilter === 'all' ||
      p.source.toLowerCase().includes(sourceFilter.toLowerCase());
    return matchesSearch && matchesSource;
  });

  // Stats
  const totalLeads = prospects.length;
  const aiLeads = prospects.filter(p => p.source.toLowerCase().includes('chatbot') || p.source.toLowerCase().includes('ai')).length;
  const hotProspects = prospects.filter(p => p.totalSpent === 0 && p.orderCount === 0).length;

  return (
    <div className="space-y-10 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-gray-900 uppercase italic">WhatsApp CRM</h1>
          <p className="text-xs font-black text-gray-500 uppercase tracking-widest mt-2">লিড ম্যানেজমেন্ট ও কনসালটিং টেমপ্লেট</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadProspects}
            className="flex items-center gap-2 px-5 py-3 bg-white border border-orange-50 text-gray-600 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm"
          >
            <RefreshCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-full font-black text-[9px] uppercase tracking-widest shadow-[0_8px_30px_rgba(37,211,102,0.25)] hover:shadow-[0_12px_40px_rgba(37,211,102,0.35)] hover:scale-[1.02] active:scale-95 transition-all"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Open WhatsApp
          </a>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Prospects', value: totalLeads, icon: User, color: 'text-[#25D366]', bg: 'bg-emerald-50/40', border: 'border-emerald-100/50' },
          { label: 'AI Chatbot Leads', value: aiLeads, icon: Sparkles, color: 'text-violet-600', bg: 'bg-violet-50/40', border: 'border-violet-100/50' },
          { label: 'Hot (No Purchase Yet)', value: hotProspects, icon: ShoppingBag, color: 'text-rose-500', bg: 'bg-rose-50/40', border: 'border-rose-100/50' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white rounded-[2.5rem] p-6 border border-orange-50/30 shadow-[0_10px_40px_rgba(0,0,0,0.015)] group"
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

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-[2rem] border border-orange-50/30 shadow-[0_10px_40px_rgba(0,0,0,0.01)] flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name, phone, concern..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-6 py-3.5 bg-[#FDF9F6] border border-orange-50 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#25D366]/20 transition-all placeholder:text-gray-400"
          />
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Filter className="w-3.5 h-3.5 text-gray-400" />
          {['all', 'chatbot', 'order', 'meta', 'direct'].map(f => (
            <button
              key={f}
              onClick={() => setSourceFilter(f)}
              className={`px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-widest border transition-all ${
                sourceFilter === f
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-400 border-orange-50 hover:border-gray-200 hover:text-gray-600'
              }`}
            >
              {f === 'all' ? 'All' : f === 'chatbot' ? 'AI Bot' : f === 'meta' ? 'Ads' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Prospects Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-100 border-t-[#25D366] rounded-full animate-spin" />
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Loading WhatsApp prospects...</p>
        </div>
      ) : filteredProspects.length === 0 ? (
        <div className="bg-white rounded-[3rem] border border-orange-50/30 p-20 text-center space-y-6">
          <div className="w-24 h-24 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner">
            <MessageCircle className="w-8 h-8 text-[#25D366]" />
          </div>
          <h3 className="text-xl font-black text-gray-900 tracking-tighter uppercase italic">No Prospects Found</h3>
          <p className="text-gray-400 text-xs font-bold max-w-xs mx-auto">
            Leads from Sabiha AI Chatbot and orders will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProspects.map((prospect, idx) => {
            const badge = getSourceBadge(prospect.source);
            return (
              <motion.div
                key={prospect.phone}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="bg-white rounded-[2rem] border border-orange-50/30 shadow-[0_10px_40px_rgba(0,0,0,0.015)] p-6 flex flex-col gap-5 hover:shadow-[0_15px_50px_rgba(0,0,0,0.04)] transition-all group"
              >
                {/* Top row */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#25D366]/10 rounded-xl border border-[#25D366]/15 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-black text-[#25D366] uppercase">{prospect.name.substring(0, 2)}</span>
                    </div>
                    <div>
                      <p className="text-xs font-black text-gray-900 uppercase tracking-tight">{prospect.name}</p>
                      <p className="text-[10px] text-gray-400 font-bold mt-0.5">{prospect.phone}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[7px] font-black uppercase tracking-wider border ${badge.color}`}>
                    {badge.label}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2 text-[10px]">
                  {prospect.address && (
                    <div className="flex items-center gap-2 text-gray-500">
                      <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                      <span className="font-bold truncate">{prospect.address}</span>
                    </div>
                  )}
                  {prospect.skin_type && (
                    <div className="flex items-center gap-2 text-gray-500">
                      <Tag className="w-3 h-3 text-gray-400 flex-shrink-0" />
                      <span className="font-bold">Skin: {prospect.skin_type}{prospect.concern ? ` · ${prospect.concern}` : ''}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-500">
                    <Clock className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    <span className="font-bold">{prospect.timestamp ? new Date(prospect.timestamp).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#FDF9F6] rounded-xl p-3 text-center border border-orange-50/30">
                    <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest">Orders</p>
                    <p className="text-sm font-black text-gray-900 mt-0.5">{prospect.orderCount}</p>
                  </div>
                  <div className="bg-[#FDF9F6] rounded-xl p-3 text-center border border-orange-50/30">
                    <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest">Spent</p>
                    <p className="text-sm font-black text-primary mt-0.5 italic">৳{prospect.totalSpent.toLocaleString()}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => setSelectedProspect(prospect)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] text-white rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-[#20bd5a] active:scale-[0.97] transition-all shadow-sm"
                  >
                    <Send className="w-3 h-3" />
                    Send Template
                  </button>
                  <button
                    onClick={() => openWhatsApp(prospect.phone, `আসসালামু আলাইকুম ${prospect.name}!`)}
                    className="px-4 py-3 bg-white border border-orange-50 text-gray-600 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Template Selector Modal */}
      <AnimatePresence>
        {selectedProspect && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProspect(null)}
              className="fixed inset-0 bg-gray-900/40 z-[90] backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-[2.5rem] shadow-2xl border border-orange-50 w-full max-w-lg max-h-[85vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="p-6 border-b border-orange-50/50 flex items-center justify-between sticky top-0 bg-white rounded-t-[2.5rem] z-10">
                  <div>
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-wide italic">Consulting Templates</h3>
                    <p className="text-[9px] font-bold text-gray-400 mt-0.5">
                      Sending to: <span className="text-[#25D366] font-black">{selectedProspect.name}</span> ({selectedProspect.phone})
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedProspect(null)}
                    className="p-2 hover:bg-[#FDF9F6] rounded-xl text-gray-400 hover:text-gray-900 transition-colors border border-transparent hover:border-orange-50"
                  >
                    ✕
                  </button>
                </div>

                {/* Templates */}
                <div className="p-6 space-y-4">
                  {MESSAGE_TEMPLATES.map((tpl) => (
                    <button
                      key={tpl.id}
                      onClick={() => {
                        openWhatsApp(selectedProspect.phone, tpl.getMessage(selectedProspect.name));
                        setSelectedProspect(null);
                      }}
                      className={`w-full text-left p-5 rounded-2xl border ${tpl.color} hover:scale-[1.01] active:scale-[0.99] transition-all group`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xl">{tpl.icon}</span>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest">{tpl.label}</p>
                          <p className="text-[9px] font-bold opacity-70 mt-0.5">{tpl.labelBn}</p>
                        </div>
                      </div>
                      <p className="text-[10px] font-medium leading-relaxed opacity-80 line-clamp-3">
                        {tpl.getMessage(selectedProspect.name).substring(0, 140)}...
                      </p>
                      <div className="mt-3 flex items-center gap-2 text-[8px] font-black uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
                        <Send className="w-3 h-3" />
                        Click to open in WhatsApp
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
