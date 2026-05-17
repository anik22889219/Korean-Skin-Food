import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AdminRoutes } from './AdminRoutes';
import { PublicRoutes } from './PublicRoutes';
import { CustomerDashboard } from '../pages/CustomerDashboard';
import { ViewerDashboard } from '../pages/ViewerDashboard';
import AdminLogin from '../pages/AdminLogin';
import { Account } from '../pages/Account';

/**
 * RoleBasedRouter — Main routing hub.
 *
 * IMPORTANT: We always wait for Firebase auth to resolve (isLoading)
 * before making routing decisions. Without this, a page refresh causes
 * a split-second redirect loop because `user` is null during init.
 *
 * Routing rules:
 * - Loading            → Full-page spinner
 * - /admin/login       → Always accessible (pre-auth)
 * - Admin team         → /admin/*
 * - Customer           → /customer/dashboard + public routes
 * - Viewer             → /viewer/dashboard + public routes
 * - No user            → /account (customer login) or /admin/login (admin)
 */
export const RoleBasedRouter: React.FC = () => {
  const { user, isLoading, isAdminTeam, isCustomer, isViewer } = useAuth();

  // 0. LOADING — wait for Firebase onAuthStateChanged to fire
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDF9F6] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin mx-auto" />
          <p className="text-gray-400 text-xs font-black uppercase tracking-widest">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // 1. NO USER — show login pages only
  if (!user) {
    return (
      <Routes>
        {/* Admin login is always reachable when not authenticated */}
        <Route path="/admin/login" element={<AdminLogin />} />
        {/* Customer login / registration page */}
        <Route path="/account"     element={<Account />} />
        <Route path="/account/*"   element={<Account />} />
        {/* Anything else → customer login (public users land here) */}
        <Route path="*"            element={<PublicRoutes />} />
      </Routes>
    );
  }

  // 2. ADMIN TEAM → admin panel
  if (isAdminTeam) {
    return (
      <Routes>
        <Route path="/admin/login" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/*"     element={<AdminRoutes />} />
        <Route path="/account"     element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/"            element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="*"            element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    );
  }

  // 3. CUSTOMER → customer dashboard + public storefront
  if (isCustomer) {
    return (
      <Routes>
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        <Route path="/account"            element={<Account />} />
        <Route path="/"                   element={<Navigate to="/customer/dashboard" replace />} />
        <Route path="*"                   element={<PublicRoutes />} />
      </Routes>
    );
  }

  // 4. VIEWER → viewer dashboard + public storefront
  if (isViewer) {
    return (
      <Routes>
        <Route path="/viewer/dashboard" element={<ViewerDashboard />} />
        <Route path="/account"          element={<Account />} />
        <Route path="/"                 element={<Navigate to="/viewer/dashboard" replace />} />
        <Route path="*"                 element={<PublicRoutes />} />
      </Routes>
    );
  }

  // 5. FALLBACK — authenticated but unknown role → show public routes
  return <PublicRoutes />;
};

export default RoleBasedRouter;
