import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AdminRoutes } from './AdminRoutes';
import { PublicRoutes } from './PublicRoutes';
import CustomerDashboard from '../pages/CustomerDashboard';
import ViewerDashboard from '../pages/ViewerDashboard';
import AdminLogin from '../pages/AdminLogin';

/**
 * RoleBasedRouter — Main routing hub
 * Directs users to appropriate section based on their role
 * - Admin team (super_admin, admin, inventory_manager, customer_support) → Admin Routes
 * - Customer → Customer Dashboard + Public Routes
 * - Viewer → Viewer Dashboard + Public Routes
 * - No user → Public Routes
 */
export const RoleBasedRouter: React.FC = () => {
  const { user, isAdminTeam } = useAuth();

  // Admin team access - show admin routes
  if (user && isAdminTeam) {
    return (
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    );
  }

  // Customer access - show customer dashboard + public routes
  if (user && user.role === 'customer') {
    return (
      <Routes>
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        <Route path="*" element={<PublicRoutes />} />
      </Routes>
    );
  }

  // Viewer access - show viewer dashboard + public routes
  if (user && user.role === 'viewer') {
    return (
      <Routes>
        <Route path="/viewer/dashboard" element={<ViewerDashboard />} />
        <Route path="*" element={<PublicRoutes />} />
      </Routes>
    );
  }

  // No user or unknown role - show public routes
  return <PublicRoutes />;
};

export default RoleBasedRouter;
