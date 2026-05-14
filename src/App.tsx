import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { AdminLayout } from './components/AdminLayout';
import { AdminGuard } from './components/AdminGuard';
import { DiscountPopup } from './components/DiscountPopup';
import { Navbar } from './components/Navbar';

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
const AdminCustomers      = lazy(() => import('./pages/AdminCustomers'));
const AdminWhatsApp       = lazy(() => import('./pages/AdminWhatsApp'));
const AdminMetaAds        = lazy(() => import('./pages/AdminMetaAds'));
const AdminAICenter       = lazy(() => import('./pages/AdminAICenter'));
const AdminSystemFix      = lazy(() => import('./pages/AdminSystemFix'));
const AdminDropshipping   = lazy(() => import('./pages/AdminDropshipping'));
const AdminSourcing       = lazy(() => import('./pages/AdminSourcing'));
const AdminImportList     = lazy(() => import('./pages/AdminImportList'));

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
  const isAdminLogin = location.pathname === '/admin/login';

  // Admin login page — completely standalone (no layout)
  if (isAdminLogin) {
    return <AdminLogin />;
  }

  if (isAdminRoute) {
    return (
      <>
        <Navbar />
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
                <Route path="/admin/customers" element={<AdminCustomers />} />
                <Route path="/admin/whatsapp"  element={<AdminWhatsApp />} />
                <Route path="/admin/meta-ads"  element={<AdminMetaAds />} />
                <Route path="/admin/ai-center" element={<AdminAICenter />} />
                <Route path="/admin/system-fix" element={<AdminSystemFix />} />
                <Route path="/admin/dropshipping" element={<AdminDropshipping />} />
                <Route path="/admin/sourcing" element={<AdminSourcing />} />
                <Route path="/admin/import-list" element={<AdminImportList />} />
                {/* Default admin redirect */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </AdminLayout>
        </AdminGuard>
      </>
    );
  }

  return (
    <Layout>
      <Routes>
        {/* Core */}
        <Route path="/"                   element={<Home />} />
        <Route path="/shop"               element={<Shop />} />
        <Route path="/search"             element={<Shop />} />
        <Route path="/offers"             element={<Shop isOffersOnly />} />
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

import { ToastProvider } from './context/ToastContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes cache
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
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
        </ToastProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
