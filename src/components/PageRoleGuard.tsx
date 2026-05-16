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

  // Not logged in or not admin team
  if (!user || !isAdminTeam) {
    return <Navigate to="/" replace />;
  }

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

  // Show toast and redirect if no permission
  if (!hasRolePermission || !hasFeaturePermission) {
    useEffect(() => {
      const reason = !hasRolePermission ? roleReason : featureReason;
      showToast(`❌ This page requires ${reason} access. Your current role doesn't have this permission.`, 'error');
    }, []);

    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
};

export default PageRoleGuard;
