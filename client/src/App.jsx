import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';
import { SocketProvider } from './context/SocketContext.jsx';

import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import BrowseClothesPage from './pages/BrowseClothesPage.jsx';
import ClothingDetailPage from './pages/ClothingDetailPage.jsx';
import CreateListingPage from './pages/CreateListingPage.jsx';
import EditListingPage from './pages/EditListingPage.jsx';
import SwapManagementPage from './pages/SwapManagementPage.jsx';
import SwapChatPage from './pages/SwapChatPage.jsx';
import UserDashboardPage from './pages/UserDashboardPage.jsx';
import UserProfilePage from './pages/UserProfilePage.jsx';
import SavedItemsPage from './pages/SavedItemsPage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

import { Home, Compass, PlusCircle, RefreshCw, User as UserIcon } from 'lucide-react';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="py-24 text-center text-xs text-stone-400">Verifying session...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function AdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="py-24 text-center text-xs text-stone-400">Verifying admin privileges...</div>;
  }

  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

// Mobile persistent bottom navigation bar (Section 28 of prompt)
function MobileBottomNav() {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-cream-300 py-2 px-6 flex items-center justify-between">
      <Link
        to="/"
        className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
          isActive('/') ? 'text-brand-900 font-bold' : 'text-stone-500'
        }`}
      >
        <Home className="w-5 h-5" />
        <span>Home</span>
      </Link>

      <Link
        to="/clothes"
        className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
          isActive('/clothes') ? 'text-brand-900 font-bold' : 'text-stone-500'
        }`}
      >
        <Compass className="w-5 h-5" />
        <span>Browse</span>
      </Link>

      <Link
        to="/list"
        className="flex flex-col items-center -mt-5"
      >
        <div className="w-11 h-11 rounded-full bg-brand-900 text-cream-50 flex items-center justify-center shadow-lg active:scale-95">
          <PlusCircle className="w-6 h-6 text-sage" />
        </div>
        <span className="text-[9px] font-bold text-brand-900 mt-0.5">List</span>
      </Link>

      <Link
        to="/swaps"
        className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
          isActive('/swaps') ? 'text-brand-900 font-bold' : 'text-stone-500'
        }`}
      >
        <RefreshCw className="w-5 h-5" />
        <span>Swaps</span>
      </Link>

      <Link
        to={isLoggedIn ? '/dashboard' : '/login'}
        className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
          isActive('/dashboard') || isActive('/login') ? 'text-brand-900 font-bold' : 'text-stone-500'
        }`}
      >
        <UserIcon className="w-5 h-5" />
        <span>{isLoggedIn ? 'Closet' : 'Login'}</span>
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <NotificationProvider>
          <SocketProvider>
            <div className="min-h-screen flex flex-col justify-between pb-16 md:pb-0">
              <div>
                <Navbar />
                <main>
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/clothes" element={<BrowseClothesPage />} />
                    <Route path="/clothes/:id" element={<ClothingDetailPage />} />
                    <Route path="/users/:id" element={<UserProfilePage />} />

                    {/* Protected Routes */}
                    <Route
                      path="/list"
                      element={
                        <ProtectedRoute>
                          <CreateListingPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/list/:id/edit"
                      element={
                        <ProtectedRoute>
                          <EditListingPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/swaps"
                      element={
                        <ProtectedRoute>
                          <SwapManagementPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/chat/:swapId"
                      element={
                        <ProtectedRoute>
                          <SwapChatPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <UserDashboardPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/saved"
                      element={
                        <ProtectedRoute>
                          <SavedItemsPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/notifications"
                      element={
                        <ProtectedRoute>
                          <NotificationsPage />
                        </ProtectedRoute>
                      }
                    />

                    {/* Admin Route */}
                    <Route
                      path="/admin"
                      element={
                        <AdminRoute>
                          <AdminDashboardPage />
                        </AdminRoute>
                      }
                    />

                    {/* 404 Route */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </main>
              </div>

              <Footer />
              <MobileBottomNav />
            </div>
          </SocketProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
