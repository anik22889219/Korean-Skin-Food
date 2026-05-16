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
 * RoleBasedRouter — Main routing hub
 * Directs users to appropriate section based on their role
 * - Admin team (super_admin, admin, inventory_manager, customer_support) → Admin Routes
 * - Customer → Customer Dashboard + Public Routes
 * - Viewer → Viewer Dashboard + Public Routes
 * - No user → Public Routes
 */
export const RoleBasedRouter: React.FC = () => {
  const { user, isAdminTeam, isCustomer, isViewer } = useAuth();

  // 1. GATE: No user or not authenticated - only show Account page or Admin Login
  if (!user) {
    return (
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/account" element={<Account />} />
        <Route path="/account/*" element={<Account />} />
        <Route path="*" element={<Navigate to="/account" replace />} />
      </Routes>
    );
  }

  // 2. ADMIN TEAM: Show admin routes and redirect root to dashboard
  if (isAdminTeam) {
    return (
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/account" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    );
  }

  // 3. CUSTOMER: Show customer dashboard + public routes, but land on dashboard
  if (isCustomer) {
    return (
      <Routes>
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        <Route path="/account" element={<Account />} />
        <Route path="/" element={<Navigate to="/customer/dashboard" replace />} />
        <Route path="*" element={<PublicRoutes />} />
      </Routes>
    );
  }

  // 4. VIEWER: Show viewer dashboard + public routes, but land on dashboard
  if (isViewer) {
    return (
      <Routes>
        <Route path="/viewer/dashboard" element={<ViewerDashboard />} />
        <Route path="/account" element={<Account />} />
        <Route path="/" element={<Navigate to="/viewer/dashboard" replace />} />
        <Route path="*" element={<PublicRoutes />} />
      </Routes>
    );
  }

  // Fallback (should not be reached with the above logic)
  return <PublicRoutes />;
};

export default RoleBasedRouter;
