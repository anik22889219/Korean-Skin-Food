import React, { createContext, useContext, useState } from 'react';
import { User } from '../types';
import { api } from '../services/api';
import {
  isAdminTeam,
  isSuperAdmin as checkSuperAdmin,
  isAdmin as checkAdmin,
  isCustomer,
  isViewer,
  isInventoryManager,
  isCustomerSupport,
  canAccessInventory,
  canAccessCustomerSupport,
  canAccessSettings,
} from '../lib/roles';

interface AuthContextType {
  user: User | null;
  login: (phone: string, password: string) => Promise<User | null>;
  loginWithGoogle: (email: string, name: string, picture?: string) => Promise<User | null>;
  register: (name: string, email: string, phone: string, password: string) => Promise<User | null>;
  logout: () => void;
  // Role checks
  isAdminTeam: boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isCustomer: boolean;
  isViewer: boolean;
  isInventoryManager: boolean;
  isCustomerSupport: boolean;
  // Feature access
  canAccessInventory: boolean;
  canAccessCustomerSupport: boolean;
  canAccessSettings: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('ksf_user');
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      // Stale data cleanup / Normalization
      if (parsed && typeof parsed.role === 'string') {
        parsed.role = parsed.role.trim().toLowerCase();
      }
      return parsed;
    } catch {
      return null;
    }
  });

  const loginWithGoogle = async (email: string, name: string, picture?: string): Promise<User | null> => {
    try {
      const data = await api.googleLogin(email, name, picture);
      // Fallback: if backend doesn't implement it yet, create a mock local session
      if (data?.success && data?.user) {
        const normalizedUser: User = {
          ...data.user,
          role: String(data.user.role).trim().toLowerCase() as any
        };
        setUser(normalizedUser);
        localStorage.setItem('ksf_user', JSON.stringify(normalizedUser));
        return normalizedUser;
      } else if (!data || !data.success) {
        // Fallback for when Apps script is missing the googleLogin action
        const mockUser: User = {
          user_id: `g_${Date.now()}`,
          name: name,
          email: email,
          phone: '', // Needs phone linkage later
          role: 'customer'
        };
        setUser(mockUser);
        localStorage.setItem('ksf_user', JSON.stringify(mockUser));
        return mockUser;
      }
      return null;
    } catch (e) {
      console.error('[Auth] Google Login error:', e);
      return null;
    }
  };

  const login = async (phone: string, password: string): Promise<User | null> => {
    try {
      // ── Local super-admin fallback (always works) ─────────────────────────
      const ADMIN_PHONE = '1755837545';
      const ADMIN_PASSWORD = '2288';
      if (phone.replace(/^0/, '') === ADMIN_PHONE.replace(/^0/, '') && password === ADMIN_PASSWORD) {
        const adminUser: User = {
          user_id: 'super_admin_001',
          name: 'Korean Skin Food Admin',
          email: 'admin@koreanskinbd.com',
          phone: ADMIN_PHONE,
          role: 'super_admin',
        };
        setUser(adminUser);
        localStorage.setItem('ksf_user', JSON.stringify(adminUser));
        return adminUser;
      }
      // ── Remote backend check ──────────────────────────────────────────────
      const data = await api.loginUser(phone, password);
      if (data?.success && data?.user) {
        const normalizedUser: User = {
          ...data.user,
          role: String(data.user.role).trim().toLowerCase() as any
        };
        setUser(normalizedUser);
        localStorage.setItem('ksf_user', JSON.stringify(normalizedUser));
        return normalizedUser;
      }
      return null;
    } catch (e) {
      console.error('[Auth] Login error:', e);
      return null;
    }
  };

  const register = async (name: string, email: string, phone: string, password: string): Promise<User | null> => {
    try {
      const data = await api.registerUser(name, email, phone, password);
      if (data?.success && data?.user) {
        const normalizedUser: User = {
          ...data.user,
          role: String(data.user.role).trim().toLowerCase() as any
        };
        setUser(normalizedUser);
        localStorage.setItem('ksf_user', JSON.stringify(normalizedUser));
        return normalizedUser;
      }
      return null;
    } catch (e) {
      console.error('[Auth] Register error:', e);
      return null;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ksf_user');
  };

  // ════════════════════════════════════════════════════════════════════════════════
  // COMPUTE ALL ROLE & FEATURE FLAGS
  // ════════════════════════════════════════════════════════════════════════════════
  const isAdminTeamFlag = isAdminTeam(user);
  const isSuperAdminFlag = checkSuperAdmin(user);
  const isAdminFlag = checkAdmin(user);
  const isCustomerFlag = isCustomer(user);
  const isViewerFlag = isViewer(user);
  const isInventoryManagerFlag = isInventoryManager(user);
  const isCustomerSupportFlag = isCustomerSupport(user);
  
  const canAccessInventoryFlag = canAccessInventory(user);
  const canAccessCustomerSupportFlag = canAccessCustomerSupport(user);
  const canAccessSettingsFlag = canAccessSettings(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginWithGoogle,
        register,
        logout,
        isAdminTeam: isAdminTeamFlag,
        isSuperAdmin: isSuperAdminFlag,
        isAdmin: isAdminFlag,
        isCustomer: isCustomerFlag,
        isViewer: isViewerFlag,
        isInventoryManager: isInventoryManagerFlag,
        isCustomerSupport: isCustomerSupportFlag,
        canAccessInventory: canAccessInventoryFlag,
        canAccessCustomerSupport: canAccessCustomerSupportFlag,
        canAccessSettings: canAccessSettingsFlag,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
