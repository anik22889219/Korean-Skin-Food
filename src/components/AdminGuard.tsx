import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

/**
 * AdminGuard — protects all /admin/* routes.
 * Allows: super_admin, admin, inventory_manager, customer_support
 * Redirects unauthenticated users to /admin/login.
 * Redirects non-admin users to / (home).
 * Shows toast notifications for access denied.
 */
interface AdminGuardProps {
  children: React.ReactNode;
  requiredRole?: 'super_admin' | 'admin' | 'inventory_manager' | 'customer_support' | 'any';
}

export const AdminGuard: React.FC<AdminGuardProps> = ({
  children,
  requiredRole = 'any',
}) => {
  const { user, isAdminTeam, isSuperAdmin, isAdmin, isInventoryManager, isCustomerSupport } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();

  // Not logged in → redirect to admin login
  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Logged in but not in admin team
  if (!isAdminTeam) {
    useEffect(() => {
      showToast('❌ You do not have permission to access this section.', 'error');
    }, []);
    
    return <Navigate to="/" replace />;
  }

  // ════════════════════════════════════════════════════════════════════════════════
  // ROLE-SPECIFIC ACCESS CHECKS WITH TOAST NOTIFICATIONS
  // ════════════════════════════════════════════════════════════════════════════════

  if (requiredRole === 'super_admin' && !isSuperAdmin) {
    useEffect(() => {
      showToast('🚫 This section requires Super Admin privileges.', 'error');
    }, []);
    return <AccessDenied reason="Super Admin privileges required" />;
  }

  if (requiredRole === 'admin' && !isAdmin && !isSuperAdmin) {
    useEffect(() => {
      showToast('🚫 Admin or Super Admin privileges required for this section.', 'error');
    }, []);
    return <AccessDenied reason="Admin or Super Admin privileges required" />;
  }

  if (requiredRole === 'inventory_manager' && !isInventoryManager && !isAdmin && !isSuperAdmin) {
    useEffect(() => {
      showToast('🚫 Inventory Manager or higher privileges required for this section.', 'error');
    }, []);
    return <AccessDenied reason="Inventory Manager or higher privileges required" />;
  }

  if (requiredRole === 'customer_support' && !isCustomerSupport && !isAdmin && !isSuperAdmin) {
    useEffect(() => {
      showToast('🚫 Customer Support or higher privileges required for this section.', 'error');
    }, []);
    return <AccessDenied reason="Customer Support or higher privileges required" />;
  }

  return <>{children}</>;
};

// ════════════════════════════════════════════════════════════════════════════════
// ACCESS DENIED COMPONENT
// ════════════════════════════════════════════════════════════════════════════════

interface AccessDeniedProps {
  reason?: string;
}

const AccessDenied: React.FC<AccessDeniedProps> = ({ reason = 'You do not have access to this section.' }) => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="text-center space-y-3">
      <div className="text-5xl">🚫</div>
      <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">
        Access Denied
      </h2>
      <p className="text-gray-500 text-sm">
        {reason}
      </p>
    </div>
  </div>
);
