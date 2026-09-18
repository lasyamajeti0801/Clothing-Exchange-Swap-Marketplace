import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  RefreshCw,
  PlusCircle,
  Heart,
  Bell,
  User,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  Compass,
  LayoutDashboard,
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotifications } from '../context/NotificationContext.jsx';

export default function Navbar() {
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-40 bg-cream-50/95 backdrop-blur border-b border-cream-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-full bg-brand-900 flex items-center justify-center text-cream-50 shadow-sm group-hover:scale-105 transition-transform">
                <RefreshCw className="w-5 h-5 text-sage group-hover:rotate-180 transition-transform duration-500" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold tracking-tight text-brand-900 leading-none">
                  ReWear
                </span>
                <span className="text-[10px] tracking-widest uppercase font-medium text-stone-500 mt-0.5">
                  Swap · Reuse · Sustain
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-charcoal">
              <Link
                to="/clothes"
                className={`flex items-center gap-1.5 transition-colors ${
                  isActive('/clothes') ? 'text-brand-900 font-semibold' : 'hover:text-brand-700'
                }`}
              >
                <Compass className="w-4 h-4 text-brand-700" />
                Browse Closet
              </Link>
              <Link
                to="/swaps"
                className={`flex items-center gap-1.5 transition-colors ${
                  isActive('/swaps') ? 'text-brand-900 font-semibold' : 'hover:text-brand-700'
                }`}
              >
                <RefreshCw className="w-4 h-4 text-brand-700" />
                My Swaps
              </Link>
              {isLoggedIn && (
                <Link
                  to="/saved"
                  className={`flex items-center gap-1.5 transition-colors ${
                    isActive('/saved') ? 'text-brand-900 font-semibold' : 'hover:text-brand-700'
                  }`}
                >
                  <Heart className="w-4 h-4 text-terracotta" />
                  Wishlist
                </Link>
              )}
            </nav>

            {/* Right Action Area */}
            <div className="hidden md:flex items-center gap-4">
              {isLoggedIn ? (
                <>
                  <Link
                    to="/list"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider bg-brand-900 text-cream-50 hover:bg-brand-800 transition-all shadow-sm"
                  >
                    <PlusCircle className="w-4 h-4 text-sage" />
                    List an Item
                  </Link>

                  {/* Notifications */}
                  <Link
                    to="/notifications"
                    className="relative p-2 rounded-full hover:bg-cream-200 text-charcoal transition-colors"
                    title="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-terracotta text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Link>

                  {/* User Profile Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-full hover:bg-cream-200 transition-colors border border-cream-300"
                    >
                      <img
                        src={user?.avatarUrl || 'https://api.dicebear.com/7.x/initials/svg?seed=User'}
                        alt={user?.name}
                        className="w-7 h-7 rounded-full object-cover bg-stone-200"
                      />
                      <span className="text-xs font-semibold text-charcoal max-w-[100px] truncate">
                        {user?.name?.split(' ')[0]}
                      </span>
                    </button>

                    {userDropdownOpen && (
                      <div
                        className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-cream-300 py-2 z-50 text-sm animate-in fade-in slide-in-from-top-2 duration-150"
                        onMouseLeave={() => setUserDropdownOpen(false)}
                      >
                        <div className="px-4 py-2 border-b border-cream-200">
                          <p className="font-semibold text-charcoal truncate">{user?.name}</p>
                          <p className="text-xs text-stone-500 truncate">{user?.email}</p>
                          <div className="mt-1 flex items-center gap-1.5 text-xs text-brand-700 font-medium">
                            <span>★ {user?.rating?.toFixed(1) || '5.0'}</span>
                            <span>•</span>
                            <span>{user?.swapCount || 0} swaps</span>
                          </div>
                        </div>

                        <Link
                          to="/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-stone-700 hover:bg-cream-100 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-brand-700" />
                          Dashboard
                        </Link>
                        <Link
                          to={`/users/${user?.id}`}
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-stone-700 hover:bg-cream-100 transition-colors"
                        >
                          <User className="w-4 h-4 text-brand-700" />
                          Public Closet Profile
                        </Link>

                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-stone-700 hover:bg-cream-100 transition-colors"
                          >
                            <ShieldCheck className="w-4 h-4 text-terracotta" />
                            Admin Console
                          </Link>
                        )}

                        <div className="border-t border-cream-200 mt-1 pt-1">
                          <button
                            onClick={() => {
                              setUserDropdownOpen(false);
                              logout();
                            }}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-terracotta hover:bg-cream-100 transition-colors text-left"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className="text-xs font-semibold uppercase tracking-wider text-brand-900 hover:text-brand-700 px-3 py-2"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider bg-brand-900 text-cream-50 hover:bg-brand-800 transition-all shadow-sm"
                  >
                    Join ReWear
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="flex md:hidden items-center gap-2">
              {isLoggedIn && (
                <Link to="/notifications" className="relative p-2 text-charcoal">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-terracotta text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              )}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-charcoal rounded-lg hover:bg-cream-200"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-cream-300 bg-white px-4 pt-3 pb-6 space-y-3">
            <Link
              to="/clothes"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 py-2 text-charcoal font-medium"
            >
              <Compass className="w-5 h-5 text-brand-700" />
              Browse Clothes
            </Link>
            <Link
              to="/swaps"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 py-2 text-charcoal font-medium"
            >
              <RefreshCw className="w-5 h-5 text-brand-700" />
              My Swaps
            </Link>
            {isLoggedIn ? (
              <>
                <Link
                  to="/list"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 py-2 text-charcoal font-medium"
                >
                  <PlusCircle className="w-5 h-5 text-brand-700" />
                  List an Item
                </Link>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 py-2 text-charcoal font-medium"
                >
                  <LayoutDashboard className="w-5 h-5 text-brand-700" />
                  Dashboard
                </Link>
                <Link
                  to="/saved"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 py-2 text-charcoal font-medium"
                >
                  <Heart className="w-5 h-5 text-terracotta" />
                  Wishlist
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 py-2 text-charcoal font-medium"
                  >
                    <ShieldCheck className="w-5 h-5 text-terracotta" />
                    Admin Panel
                  </Link>
                )}
                <div className="pt-2 border-t border-cream-200">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="flex items-center gap-2 py-2 text-terracotta font-medium"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out ({user?.name})
                  </button>
                </div>
              </>
            ) : (
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-full text-sm font-semibold border border-brand-900 text-brand-900"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-full text-sm font-semibold bg-brand-900 text-cream-50"
                >
                  Join ReWear
                </Link>
              </div>
            )}
          </div>
        )}
      </header>
    </>
  );
}
