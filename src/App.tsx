import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { AdminLayout } from './components/AdminLayout';
import { AdminGuard } from './components/AdminGuard';
import { DiscountPopup } from './components/DiscountPopup';

// ── Public Pages ────────────────────────────────────────────────────────────
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { CartPage } from './pages/CartPage';
import { Checkout } from './pages/Checkout';
import { Account } from './pages/Account';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { TrackOrder } from './pages/TrackOrder';
import { OrderConfirmation } from './pages/OrderConfirmation';
import { NotFound } from './pages/NotFound';

// ── Admin Pages (lazy loaded for performance) ───────────────────────────────
import AdminLogin from './pages/AdminLogin';

const AdminDashboard      = lazy(() => import('./pages/AdminDashboard'));
const AdminInventory      = lazy(() => import('./pages/AdminInventory'));
const AdminOrders         = lazy(() => import('./pages/AdminOrders'));
const AdminBarcodeScanner = lazy(() => import('./pages/AdminBarcodeScanner'));
const AdminReports        = lazy(() => import('./pages/AdminReports'));
const AdminSettings       = lazy(() => import('./pages/AdminSettings'));
const AdminSEO            = lazy(() => import('./pages/AdminSEO'));
const AdminSocial         = lazy(() => import('./pages/AdminSocial'));

// ── Admin Placeholder (for sections being built) ────────────────────────────
const AdminPlaceholder = ({ title, emoji = '🔧' }: { title: string; emoji?: string }) => (
  <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 text-center space-y-4">
    <div className="text-5xl">{emoji}</div>
    <h1 className="text-2xl font-black uppercase tracking-tighter text-gray-900">{title}</h1>
    <p className="text-gray-400 font-mono text-sm max-w-sm mx-auto">
      এই সেকশনটি তৈরি হচ্ছে। শীঘ্রই লাইভ হবে।
    </p>
  </div>
);

// ── Suspense Fallback ───────────────────────────────────────────────────────
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-10 h-10 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
  </div>
);

// ── App Router ──────────────────────────────────────────────────────────────
const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Admin login page — standalone (no AdminLayout)
  if (location.pathname === '/admin/login') {
    return <AdminLogin />;
  }

  if (isAdminRoute) {
    return (
      <AdminGuard>
        <AdminLayout>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/orders"    element={<AdminOrders />} />
              <Route path="/admin/inventory" element={<AdminInventory />} />
              <Route path="/admin/scanner"   element={<AdminBarcodeScanner />} />
              <Route path="/admin/reports"   element={<AdminReports />} />
              <Route path="/admin/settings"  element={<AdminSettings />} />
              <Route path="/admin/seo"       element={<AdminSEO />} />
              <Route path="/admin/social"    element={<AdminSocial />} />
              <Route path="/admin/customers" element={<AdminPlaceholder title="Customers & Leads" emoji="👥" />} />
              <Route path="/admin/whatsapp"  element={<AdminPlaceholder title="WhatsApp CRM" emoji="💬" />} />
              <Route path="/admin/meta-ads"  element={<AdminPlaceholder title="Meta Ads & Pixel" emoji="📊" />} />
              <Route path="/admin/ai-center" element={<AdminPlaceholder title="AI Center" emoji="🤖" />} />
              <Route path="/admin/system-fix" element={<AdminPlaceholder title="System Fix" emoji="⚙️" />} />
              {/* Default admin redirect */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AdminLayout>
      </AdminGuard>
    );
  }

  return (
    <Layout>
      <Routes>
        {/* Core */}
        <Route path="/"                   element={<Home />} />
        <Route path="/shop"               element={<Shop />} />
        <Route path="/search"             element={<Shop />} />
        <Route path="/product/:id"        element={<ProductDetail />} />
        <Route path="/category/:slug"     element={<Shop />} />
        {/* Cart & Orders */}
        <Route path="/cart"               element={<CartPage />} />
        <Route path="/checkout"           element={<Checkout />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/track-order"        element={<TrackOrder />} />
        {/* Account */}
        <Route path="/account"            element={<Account />} />
        <Route path="/account/*"          element={<Account />} />
        {/* Info */}
        <Route path="/about"              element={<About />} />
        <Route path="/contact"            element={<Contact />} />
        {/* 404 */}
        <Route path="*"                   element={<NotFound />} />
      </Routes>
      <DiscountPopup />
    </Layout>
  );
};

export default function App() {
  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <CartProvider>
            <div className="font-sans antialiased text-gray-900">
              <AppContent />
            </div>
          </CartProvider>
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
}
