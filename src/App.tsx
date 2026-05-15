import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { WishlistProvider } from './context/WishlistContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { PublicRoutes } from './routes/PublicRoutes';
import { AdminRoutes } from './routes/AdminRoutes';
import AdminLogin from './pages/AdminLogin';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes cache
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAdminLogin = location.pathname === '/admin/login';

  if (isAdminLogin) {
    return <AdminLogin />;
  }

  if (isAdminRoute) {
    // The asterisk is handled by React Router v6+ when rendering sub-routes,
    // but here we just render AdminRoutes which has its own <Routes> internally.
    // However, if we put <AdminRoutes /> directly here, it will match exactly '/admin'.
    // To fix this we can just return AdminRoutes and let it handle the path.
    return <AdminRoutes />;
  }

  return <PublicRoutes />;
};

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <Router>
            <LanguageProvider>
              <AuthProvider>
                <CartProvider>
                  <WishlistProvider>
                    <div className="font-sans antialiased text-gray-900">
                      <AppContent />
                    </div>
                  </WishlistProvider>
                </CartProvider>
              </AuthProvider>
            </LanguageProvider>
          </Router>
        </ToastProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
