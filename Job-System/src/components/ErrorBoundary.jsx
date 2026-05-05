import React from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("CRITICAL_UI_FAILURE:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-white border border-slate-200 rounded-[3rem] p-12 shadow-2xl space-y-8 animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
              <AlertTriangle size={48} />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                System <span className="text-rose-500 text-6xl">Crash.</span>
              </h1>
              <p className="text-slate-500 font-medium">
                The UI matrix encountered an unhandled exception. Professional synchronization has been suspended.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => window.location.reload()}
                className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl active:scale-95"
              >
                <RefreshCcw size={18} /> Re-Sync Dashboard
              </button>
              
              <button 
                onClick={() => window.location.href = '/'}
                className="w-full py-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-all active:scale-95"
              >
                <Home size={18} /> Return to Base
              </button>
            </div>

            <div className="pt-6 border-t border-slate-100 italic text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Error Debug Log: {this.state.error?.message || "Unknown Core Violation"}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
