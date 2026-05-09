import React, { createContext, useContext, useState } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (phone: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('ksf_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = async (phone: string, password: string): Promise<boolean> => {
    try {
      const data = await api.loginUser(phone, password);
      if (data?.success && data?.user) {
        setUser(data.user);
        localStorage.setItem('ksf_user', JSON.stringify(data.user));
        return true;
      }
      return false;
    } catch (e) {
      console.error('[Auth] Login error:', e);
      return false;
    }
  };

  const register = async (name: string, email: string, phone: string, password: string): Promise<boolean> => {
    try {
      const data = await api.registerUser(name, email, phone, password);
      return data?.success === true;
    } catch (e) {
      console.error('[Auth] Register error:', e);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ksf_user');
  };

  const isAdmin =
    user?.role === 'admin' ||
    user?.role === 'super_admin' ||
    user?.role === 'inventory_manager' ||
    user?.role === 'customer_support' ||
    user?.role === 'moderator';

  const isSuperAdmin = user?.role === 'super_admin';

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAdmin, isSuperAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
