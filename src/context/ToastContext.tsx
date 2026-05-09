import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, XCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-sm font-bold min-w-[250px] ${
                toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
                toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
                toast.type === 'warning' ? 'bg-orange-50 border-orange-200 text-orange-800' :
                'bg-blue-50 border-blue-200 text-blue-800'
              }`}
            >
              {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-500" />}
              {toast.type === 'error' && <XCircle className="w-5 h-5 text-red-500" />}
              {toast.type === 'warning' && <AlertCircle className="w-5 h-5 text-orange-500" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-blue-500" />}
              
              <span className="flex-1">{toast.message}</span>
              
              <button onClick={() => removeToast(toast.id)} className="opacity-50 hover:opacity-100 transition-opacity">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
