import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-red-50 border border-red-100 rounded-3xl p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-black text-gray-900">কিছু একটা ভুল হয়েছে!</h2>
            <p className="text-sm text-gray-600">
              অ্যাপ্লিকেশনটি লোড হতে সমস্যা হচ্ছে। দয়া করে পেজটি রিফ্রেশ করুন।
            </p>
            <div className="pt-4">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-600 transition-colors"
              >
                <RefreshCcw className="w-4 h-4" />
                রিফ্রেশ করুন
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}
