import React, { useEffect, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

/**
 * AdminGuard — protects all /admin/* routes.
 * Allowed roles: super_admin, admin, inventory_manager, customer_support
 * - Unauthenticated users → /admin/login
 * - Non-admin users       → / (home)
 */
interface AdminGuardProps {
  children: React.ReactNode;
  requiredRole?: 'super_admin' | 'admin' | 'inventory_manager' | 'customer_support' | 'any';
}

export const AdminGuard: React.FC<AdminGuardProps> = ({
  children,
  requiredRole = 'any',
}) => {
  const {
    user,
    isLoading,
    isAdminTeam,
    isSuperAdmin,
    isAdmin,
    isInventoryManager,
    isCustomerSupport,
  } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();

  // Track whether we've already shown the toast to avoid duplicate notifications
  const toastShown = useRef(false);

  // ── Show loading spinner while Firebase resolves auth state ───────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FDF9F6]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin mx-auto" />
          <p className="text-gray-400 text-xs font-black uppercase tracking-widest">
            Checking access...
          </p>
        </div>
      </div>
    );
  }

  // ── Not logged in → redirect to admin login ───────────────────────────────
  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // ── Logged in but not in admin team ──────────────────────────────────────
  if (!isAdminTeam) {
    if (!toastShown.current) {
      toastShown.current = true;
      // Defer toast to avoid setState-during-render warning
      setTimeout(() => showToast('❌ You do not have permission to access this section.', 'error'), 0);
    }
    return <Navigate to="/" replace />;
  }

  // ── Role-specific checks ──────────────────────────────────────────────────
  if (requiredRole === 'super_admin' && !isSuperAdmin) {
    if (!toastShown.current) {
      toastShown.current = true;
      setTimeout(() => showToast('🚫 This section requires Super Admin privileges.', 'error'), 0);
    }
    return <AccessDenied reason="Super Admin privileges required" />;
  }

  if (requiredRole === 'admin' && !isAdmin && !isSuperAdmin) {
    if (!toastShown.current) {
      toastShown.current = true;
      setTimeout(() => showToast('🚫 Admin or Super Admin privileges required.', 'error'), 0);
    }
    return <AccessDenied reason="Admin or Super Admin privileges required" />;
  }

  if (requiredRole === 'inventory_manager' && !isInventoryManager && !isAdmin && !isSuperAdmin) {
    if (!toastShown.current) {
      toastShown.current = true;
      setTimeout(() => showToast('🚫 Inventory Manager or higher privileges required.', 'error'), 0);
    }
    return <AccessDenied reason="Inventory Manager or higher privileges required" />;
  }

  if (requiredRole === 'customer_support' && !isCustomerSupport && !isAdmin && !isSuperAdmin) {
    if (!toastShown.current) {
      toastShown.current = true;
      setTimeout(() => showToast('🚫 Customer Support or higher privileges required.', 'error'), 0);
    }
    return <AccessDenied reason="Customer Support or higher privileges required" />;
  }

  return <>{children}</>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Access Denied UI
// ─────────────────────────────────────────────────────────────────────────────
interface AccessDeniedProps {
  reason?: string;
}

const AccessDenied: React.FC<AccessDeniedProps> = ({
  reason = 'You do not have access to this section.',
}) => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="text-center space-y-4">
      <div className="text-6xl">🚫</div>
      <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">
        Access Denied
      </h2>
      <p className="text-gray-500 text-sm max-w-xs mx-auto">{reason}</p>
    </div>
  </div>
);
