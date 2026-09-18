import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { RefreshCw, LogIn, AlertCircle, Sparkles, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  const demoAccounts = [
    { name: 'Priya (Vintage Collector)', email: 'priya@rewear.org', pass: 'Password@123', tag: 'Hyderabad' },
    { name: 'Rahul (Streetwear)', email: 'rahul@rewear.org', pass: 'Password@123', tag: 'Vijayawada' },
    { name: 'Ananya (Handlooms)', email: 'ananya@rewear.org', pass: 'Password@123', tag: 'Mangalagiri' },
    { name: 'ReWear Admin', email: 'admin@rewear.org', pass: 'Admin@123456', tag: 'Admin Role' },
  ];

  const handleFillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-cream-300 shadow-xl relative">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-brand-900 text-cream-50 mx-auto flex items-center justify-center mb-3 shadow-sm">
            <RefreshCw className="w-6 h-6 text-sage" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-charcoal">Welcome to ReWear</h1>
          <p className="text-xs text-stone-500 mt-1">
            Log in to manage your wardrobe and swap clothes directly with other members.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 1-Click Demo Accounts Chips */}
        <div className="mb-6 p-3 bg-cream-100 rounded-2xl border border-cream-200">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-brand-900 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-terracotta" />
            <span>Instant 1-Click Demo Accounts</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {demoAccounts.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => handleFillDemo(acc.email, acc.pass)}
                className="text-left p-2 rounded-xl bg-white hover:bg-brand-50 border border-cream-300 hover:border-brand-500 text-xs transition-colors"
              >
                <p className="font-bold text-charcoal truncate">{acc.name}</p>
                <p className="text-[10px] text-stone-400">{acc.tag}</p>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. priya@rewear.org"
              className="w-full text-xs p-3 rounded-xl border border-cream-300 focus:border-brand-900 focus:ring-1 focus:ring-brand-900 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-xs p-3 rounded-xl border border-cream-300 focus:border-brand-900 focus:ring-1 focus:ring-brand-900 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-900 text-cream-50 hover:bg-brand-800 transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4 text-sage" />
            {loading ? 'Authenticating...' : 'Sign In to Closet'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-stone-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-brand-900 hover:underline">
            Register for Free
          </Link>
        </div>
      </div>
    </div>
  );
}
