import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Nexora crashed:', error, info);
  }

  handleReset = () => {
    // Clear any corrupted auth state and reload fresh
    try {
      Object.keys(localStorage)
        .filter(k => k.startsWith('sb-') || k.includes('supabase') || k.startsWith('nexora_'))
        .forEach(k => localStorage.removeItem(k));
    } catch {}
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
          <div className="max-w-sm text-center">
            <div className="w-12 h-12 rounded-xl bg-[#46d369] flex items-center justify-center font-black text-black text-lg mx-auto mb-6">
              N
            </div>
            <h1 className="text-white font-bold text-xl mb-2">Something went wrong</h1>
            <p className="text-white/40 text-sm mb-6 leading-relaxed">
              Nexora ran into an unexpected error. This usually clears up with a fresh reload.
            </p>
            <button
              onClick={this.handleReset}
              className="px-6 py-3 bg-[#46d369] hover:bg-[#3ec060] text-black font-bold rounded-xl transition-all active:scale-95"
            >
              Reload Nexora
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
