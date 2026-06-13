import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

/**
 * PageRoleGuard — Protects specific admin pages based on role
 * Shows toast notification and redirects if user lacks permissions
 */
interface PageRoleGuardProps {
  children: React.ReactNode;
  requiredRole?: 'super_admin' | 'admin' | 'inventory_manager' | 'customer_support' | 'all';
  requiredFeature?: 'inventory' | 'support' | 'settings' | 'all';
}

export const PageRoleGuard: React.FC<PageRoleGuardProps> = ({
  children,
  requiredRole = 'all',
  requiredFeature = 'all',
}) => {
  const { user, isAdminTeam, isSuperAdmin, isAdmin, isInventoryManager, isCustomerSupport, canAccessInventory, canAccessCustomerSupport, canAccessSettings } = useAuth();
  const { showToast } = useToast();

  // Check role requirements
  let hasRolePermission = true;
  let roleReason = '';

  if (requiredRole !== 'all') {
    switch (requiredRole) {
      case 'super_admin':
        hasRolePermission = isSuperAdmin;
        roleReason = 'Super Admin';
        break;
      case 'admin':
        hasRolePermission = isAdmin || isSuperAdmin;
        roleReason = 'Admin';
        break;
      case 'inventory_manager':
        hasRolePermission = isInventoryManager || isAdmin || isSuperAdmin;
        roleReason = 'Inventory Manager';
        break;
      case 'customer_support':
        hasRolePermission = isCustomerSupport || isAdmin || isSuperAdmin;
        roleReason = 'Customer Support';
        break;
      default:
        hasRolePermission = true;
    }
  }

  // Check feature requirements
  let hasFeaturePermission = true;
  let featureReason = '';

  if (requiredFeature !== 'all') {
    switch (requiredFeature) {
      case 'inventory':
        hasFeaturePermission = canAccessInventory;
        featureReason = 'Inventory Management';
        break;
      case 'support':
        hasFeaturePermission = canAccessCustomerSupport;
        featureReason = 'Customer Support';
        break;
      case 'settings':
        hasFeaturePermission = canAccessSettings;
        featureReason = 'System Settings';
        break;
      default:
        hasFeaturePermission = true;
    }
  }

  const notInAdminTeam = !user || !isAdminTeam;
  const accessDenied = !hasRolePermission || !hasFeaturePermission;
  const deniedReason = !hasRolePermission ? roleReason : featureReason;

  // ── Toast side-effect — MUST be unconditional (Rules of Hooks) ─────────────
  useEffect(() => {
    if (notInAdminTeam) return;
    if (accessDenied) {
      showToast(
        `❌ This page requires ${deniedReason} access. Your current role doesn't have this permission.`,
        'error'
      );
    }
  // showToast is stable (from context), safe to omit from deps
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessDenied, deniedReason, notInAdminTeam]);

  // Not logged in or not admin team
  if (notInAdminTeam) {
    return <Navigate to="/" replace />;
  }

  if (accessDenied) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
};

export default PageRoleGuard;
