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
  Sparkles,
  Bot,
  Globe,
  MessageCircle
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AdminChatBot } from './AdminChatBot';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAdminTeam, canAccessInventory, canAccessCustomerSupport, canAccessSettings } = useAuth();

  // ════════════════════════════════════════════════════════════════════════════════
  // ROLE-BASED MENU ITEMS
  // ════════════════════════════════════════════════════════════════════════════════
  
  const allMenuItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/admin/dashboard', requiredAccess: 'all' },
    { icon: ShoppingBag, label: 'Orders', path: '/admin/orders', requiredAccess: 'all' },
    { icon: Package, label: 'Inventory', path: '/admin/inventory', requiredAccess: 'inventory' },
    { icon: Scan, label: 'Barcode Scanner', path: '/admin/scanner', requiredAccess: 'inventory' },
    { icon: User, label: 'Customers & Leads', path: '/admin/customers', requiredAccess: 'support' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/reports', requiredAccess: 'inventory' },
    { icon: MessageCircle, label: 'WhatsApp CRM', path: '/admin/whatsapp', requiredAccess: 'support' },
    { icon: Sparkles, label: 'Meta Ads & Pixel', path: '/admin/meta-ads', requiredAccess: 'settings' },
    { icon: Bot, label: 'AI Center', path: '/admin/ai-center', requiredAccess: 'settings' },
    { icon: Globe, label: 'Dropshipping', path: '/admin/dropshipping', requiredAccess: 'settings' },
    { icon: Settings, label: 'Settings', path: '/admin/settings', requiredAccess: 'settings' },
  ];

  // Filter menu items based on user permissions
  const getVisibleMenuItems = () => {
    return allMenuItems.filter(item => {
      switch (item.requiredAccess) {
        case 'all':
          return true; // Everyone in admin team can see
        case 'inventory':
          return canAccessInventory;
        case 'support':
          return canAccessCustomerSupport;
        case 'settings':
          return canAccessSettings;
        default:
          return false;
      }
    });
  };

  const menuItems = getVisibleMenuItems();

  return (
    <div className="min-h-screen bg-[#FDF9F6] flex relative">
      {/* Admin AI Assistant */}
      <AdminChatBot />
      
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
        animate={{ width: isCollapsed ? 96 : 300 }}
        className={`bg-white border-r border-orange-50 flex flex-col fixed lg:sticky top-0 h-[100dvh] transition-transform duration-300 z-50 overflow-hidden shadow-[10px_0_40px_rgba(0,0,0,0.02)] ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-8 flex items-center justify-between border-b border-orange-50/50">
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
            className="p-2 hover:bg-[#FDF9F6] rounded-xl transition-colors hidden lg:block border border-transparent hover:border-orange-50"
          >
            {isCollapsed ? <Menu className="w-5 h-5 text-gray-900" /> : <ChevronLeft className="w-5 h-5 text-gray-900" />}
          </button>
          <button 
            onClick={() => setIsMobileOpen(false)}
            className="p-2 hover:bg-[#FDF9F6] rounded-xl transition-colors lg:hidden"
          >
            <ChevronLeft className="w-5 h-5 text-gray-900" />
          </button>
        </div>

        <nav className="flex-1 px-4 mt-8 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setIsMobileOpen(false);
              }}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all relative group border ${
                location.pathname === item.path 
                  ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20 border-gray-900' 
                  : 'bg-transparent text-gray-400 hover:text-gray-900 hover:bg-[#FDF9F6] border-transparent hover:border-orange-50'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
              )}
              {isCollapsed && (
                <div className="absolute left-full ml-4 px-4 py-2 bg-gray-900 text-white text-[10px] uppercase font-black tracking-widest rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap hidden lg:block shadow-xl z-50">
                  {item.label}
                </div>
              )}
            </button>
          ))}
        </nav>

        <div className="p-6 mt-auto border-t border-orange-50/50">
          <div className={`bg-[#FDF9F6] border border-orange-50 rounded-[2rem] p-4 flex items-center gap-4 shadow-inner ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="w-10 h-10 bg-white shadow-sm border border-orange-50 rounded-[1rem] flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-primary" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest truncate">{user?.name}</p>
                <button 
                  onClick={() => { logout(); navigate('/'); }}
                  className="text-[8px] font-black text-red-500 uppercase tracking-widest hover:underline mt-0.5"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {/* Admin sub-header toolbar */}
        <div className="h-16 bg-white border-b border-orange-50 flex items-center justify-between px-4 lg:px-8 flex-shrink-0 z-30 shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-4">
             <button 
               className="p-2 hover:bg-[#FDF9F6] border border-transparent hover:border-orange-50 rounded-xl lg:hidden transition-colors"
               onClick={() => setIsMobileOpen(true)}
             >
               <Menu className="w-5 h-5 text-gray-900" />
             </button>
             <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 hidden sm:block italic">Admin Panel</span>
          </div>
          <div className="flex items-center gap-4">
             <button className="relative p-2 bg-[#FDF9F6] border border-orange-50 rounded-xl hover:bg-white transition-colors shadow-inner hover:shadow-sm">
               <Bell className="w-4 h-4 text-gray-900" />
               <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-white shadow-sm"></span>
             </button>
             <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full shadow-inner">
               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
               <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">System Online</span>
             </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8 xl:p-12 custom-scrollbar">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
