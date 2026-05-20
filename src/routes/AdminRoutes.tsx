import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AdminLayout } from '../components/AdminLayout';
import { AdminGuard } from '../components/AdminGuard';
import { Navbar } from '../components/Navbar';
import { NotFound } from '../pages/NotFound';

// Lazy loaded for performance
const AdminDashboard      = lazy(() => import('../pages/AdminDashboard'));
const AdminInventory      = lazy(() => import('../pages/AdminInventory'));
const AdminOrders         = lazy(() => import('../pages/AdminOrders'));
const AdminBarcodeScanner = lazy(() => import('../pages/AdminBarcodeScanner'));
const AdminReports        = lazy(() => import('../pages/AdminReports'));
const AdminSettings       = lazy(() => import('../pages/AdminSettings'));
const AdminSEO            = lazy(() => import('../pages/AdminSEO'));
const AdminSocial         = lazy(() => import('../pages/AdminSocial'));
const AdminCustomers      = lazy(() => import('../pages/AdminCustomers'));
const AdminWhatsApp       = lazy(() => import('../pages/AdminWhatsApp'));
const AdminMetaAds        = lazy(() => import('../pages/AdminMetaAds'));
const AdminAICenter       = lazy(() => import('../pages/AdminAICenter'));
const AdminSystemFix      = lazy(() => import('../pages/AdminSystemFix'));
const AdminDropshipping   = lazy(() => import('../pages/AdminDropshipping'));
const AdminSourcing       = lazy(() => import('../pages/AdminSourcing'));
const AdminImportList     = lazy(() => import('../pages/AdminImportList'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-10 h-10 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
  </div>
);

export const AdminRoutes = () => {
  return (
    <>
      <AdminGuard>
        <AdminLayout>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="orders"    element={<AdminOrders />} />
              <Route path="inventory" element={<AdminInventory />} />
              <Route path="scanner"   element={<AdminBarcodeScanner />} />
              <Route path="reports"   element={<AdminReports />} />
              <Route path="settings"  element={<AdminSettings />} />
              <Route path="seo"       element={<AdminSEO />} />
              <Route path="social"    element={<AdminSocial />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="whatsapp"  element={<AdminWhatsApp />} />
              <Route path="meta-ads"  element={<AdminMetaAds />} />
              <Route path="ai-center" element={<AdminAICenter />} />
              <Route path="system-fix" element={<AdminSystemFix />} />
              <Route path="dropshipping" element={<AdminDropshipping />} />
              <Route path="sourcing" element={<AdminSourcing />} />
              <Route path="import-list" element={<AdminImportList />} />
              <Route path="/" element={<AdminDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AdminLayout>
      </AdminGuard>
    </>
  );
};
