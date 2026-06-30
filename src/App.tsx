import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { AppProvider, useApp } from './context/AppContext';
import ErrorBoundary from './components/ErrorBoundary';
import NavRail from './components/layout/NavRail';
import ProtectedRoute from './components/layout/ProtectedRoute';
import VideoPlayer from './components/player/VideoPlayer';
import ToastContainer from './components/ui/Toast';

import HomePage from './pages/HomePage';
import ContentDetailsPage from './pages/ContentDetailsPage';
import SearchPage from './pages/SearchPage';
import SeriesPage from './pages/SeriesPage';
import MoviesPage from './pages/MoviesPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import AuthPage from './pages/AuthPage';

const AppShell: React.FC = () => {
  const location = useLocation();
  const { authLoading } = useApp();
  const isAuthPage = location.pathname === '/auth';

  // Show spinner while Supabase checks session
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#46d369] flex items-center justify-center font-black text-black text-lg animate-pulse">
            N
          </div>
          <div className="w-8 h-8 border-2 border-white/10 border-t-white rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {!isAuthPage && <NavRail />}

      <main
        className="min-h-screen"
        style={!isAuthPage ? { paddingLeft: 72 } : undefined}
      >
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/auth" element={<AuthPage />} />

            <Route path="/" element={
              <ProtectedRoute><HomePage /></ProtectedRoute>
            } />
            <Route path="/content/:id" element={
              <ProtectedRoute><ContentDetailsPage /></ProtectedRoute>
            } />
            <Route path="/search" element={
              <ProtectedRoute><SearchPage /></ProtectedRoute>
            } />
            <Route path="/series" element={
              <ProtectedRoute><SeriesPage /></ProtectedRoute>
            } />
            <Route path="/movies" element={
              <ProtectedRoute><MoviesPage /></ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute><ProfilePage /></ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute><SettingsPage /></ProtectedRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={
              <ProtectedRoute><HomePage /></ProtectedRoute>
            } />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Global video player overlay */}
      <VideoPlayer />

      {/* Toast notifications */}
      <ToastContainer />
    </div>
  );
};

const App: React.FC = () => (
  <ErrorBoundary>
    <BrowserRouter>
      <AppProvider>
        <AppShell />
      </AppProvider>
    </BrowserRouter>
  </ErrorBoundary>
);

export default App;
