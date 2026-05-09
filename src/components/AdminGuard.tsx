import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * AdminGuard — protects all /admin/* routes.
 * Redirects unauthenticated users to /admin/login.
 */
interface AdminGuardProps {
  children: React.ReactNode;
  requiredRole?: 'super_admin' | 'admin' | 'any';
}

export const AdminGuard: React.FC<AdminGuardProps> = ({
  children,
  requiredRole = 'any',
}) => {
  const { user, isAdmin, isSuperAdmin } = useAuth();
  const location = useLocation();

  // Not logged in → redirect to admin login
  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Logged in but not an admin role
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Super admin only route — but logged in as lesser role
  if (requiredRole === 'super_admin' && !isSuperAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="text-5xl">🚫</div>
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">
            Access Denied
          </h2>
          <p className="text-gray-500 text-sm">
            This section requires Super Admin privileges.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
