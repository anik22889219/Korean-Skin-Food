// Role management utilities
export type UserRole = 'super_admin' | 'admin' | 'inventory_manager' | 'customer_support' | 'customer' | 'viewer' | 'moderator';

export interface User {
  role?: UserRole;
}

// ══════════════════════════════════════════════════════════════════════════════
// ADMIN TEAM ROLES (have access to Admin Dashboard)
// ══════════════════════════════════════════════════════════════════════════════

export const isSuperAdmin = (user: User | null): boolean => {
  if (!user) return false;
  return user.role === 'super_admin';
};

export const isAdmin = (user: User | null): boolean => {
  if (!user) return false;
  return user.role === 'admin';
};

export const isInventoryManager = (user: User | null): boolean => {
  if (!user) return false;
  return user.role === 'inventory_manager';
};

export const isCustomerSupport = (user: User | null): boolean => {
  if (!user) return false;
  return user.role === 'customer_support';
};

// Admin team: Anyone who can access admin dashboard
export const isAdminTeam = (user: User | null): boolean => {
  if (!user) return false;
  return ['super_admin', 'admin', 'inventory_manager', 'customer_support'].includes(user.role || '');
};

// ══════════════════════════════════════════════════════════════════════════════
// CUSTOMER & VIEWER ROLES (have separate dashboards)
// ══════════════════════════════════════════════════════════════════════════════

export const isCustomer = (user: User | null): boolean => {
  if (!user) return false;
  return user.role === 'customer';
};

export const isViewer = (user: User | null): boolean => {
  if (!user) return false;
  return user.role === 'viewer';
};

// ══════════════════════════════════════════════════════════════════════════════
// ROLE-SPECIFIC ACCESS CHECKS
// ══════════════════════════════════════════════════════════════════════════════

// Inventory Manager can access: Inventory, Orders, Reports
export const canAccessInventory = (user: User | null): boolean => {
  if (!user) return false;
  return ['super_admin', 'admin', 'inventory_manager'].includes(user.role || '');
};

// Customer Support can access: Orders, Customers, WhatsApp, Chat
export const canAccessCustomerSupport = (user: User | null): boolean => {
  if (!user) return false;
  return ['super_admin', 'admin', 'customer_support'].includes(user.role || '');
};

// Only Super Admin & Admin can access Settings & AI Center
export const canAccessSettings = (user: User | null): boolean => {
  if (!user) return false;
  return ['super_admin', 'admin'].includes(user.role || '');
};

// ══════════════════════════════════════════════════════════════════════════════
// ROLE DISPLAY NAMES
// ══════════════════════════════════════════════════════════════════════════════

export const getRoleDisplayName = (role: UserRole | undefined): string => {
  const roleNames: Record<UserRole, string> = {
    'super_admin': 'Super Admin',
    'admin': 'Admin',
    'inventory_manager': 'Inventory Manager',
    'customer_support': 'Customer Support',
    'customer': 'Customer',
    'viewer': 'Viewer',
    'moderator': 'Moderator',
  };
  return roleNames[role as UserRole] || 'Unknown Role';
};
