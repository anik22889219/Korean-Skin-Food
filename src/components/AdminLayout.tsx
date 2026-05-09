import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Scan, 
  BarChart3, 
  Settings, 
  ChevronLeft, 
  Menu,
  Bell,
  LogOut,
  User,
  MessageCircle,
  Sparkles,
  Bot
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/admin/dashboard' },
    { icon: ShoppingBag, label: 'Orders', path: '/admin/orders' },
    { icon: Package, label: 'Inventory', path: '/admin/inventory' },
    { icon: Scan, label: 'Barcode Scanner', path: '/admin/scanner' },
    { icon: User, label: 'Customers & Leads', path: '/admin/customers' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/reports' },
    { icon: MessageCircle, label: 'WhatsApp CRM', path: '/admin/whatsapp' },
    { icon: Sparkles, label: 'Meta Ads & Pixel', path: '/admin/meta-ads' },
    { icon: Bot, label: 'AI Center', path: '/admin/ai-center' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isCollapsed ? 80 : 280 }}
        className={`bg-white border-r border-gray-100 flex flex-col fixed lg:sticky top-0 h-[100dvh] transition-transform duration-300 z-50 overflow-hidden ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 flex items-center justify-between">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-2xl font-black tracking-tighter text-gray-900 uppercase italic"
              >
                ADMIN.
              </motion.h2>
            )}
          </AnimatePresence>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-gray-50 rounded-xl transition-colors hidden lg:block"
          >
            {isCollapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
          <button 
            onClick={() => setIsMobileOpen(false)}
            className="p-2 hover:bg-gray-50 rounded-xl transition-colors lg:hidden"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 mt-8 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setIsMobileOpen(false);
              }}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all relative group ${
                location.pathname === item.path 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
              )}
              {isCollapsed && (
                <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap hidden lg:block">
                  {item.label}
                </div>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <div className={`bg-gray-50 rounded-[2rem] p-4 flex items-center gap-4 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-primary" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest truncate">{user?.name}</p>
                <button 
                  onClick={() => { logout(); navigate('/'); }}
                  className="text-[8px] font-black text-red-500 uppercase tracking-widest hover:underline"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {/* Admin sub-header toolbar */}
        <div className="h-12 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 flex-shrink-0 z-30">
          <div className="flex items-center gap-3">
             <button 
               className="p-1.5 hover:bg-gray-50 rounded-xl lg:hidden"
               onClick={() => setIsMobileOpen(true)}
             >
               <Menu className="w-5 h-5 text-gray-700" />
             </button>
             <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 hidden sm:block">Admin Panel</span>
          </div>
          <div className="flex items-center gap-3">
             <button className="relative p-1.5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
               <Bell className="w-4 h-4 text-gray-400" />
               <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
             </button>
             <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-full">
               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
               <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Synced</span>
             </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
