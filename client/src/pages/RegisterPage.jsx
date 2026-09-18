import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RefreshCw, UserPlus, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    city: 'Hyderabad',
    state: 'Telangana',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-cream-300 shadow-xl relative">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-brand-900 text-cream-50 mx-auto flex items-center justify-center mb-3 shadow-sm">
            <RefreshCw className="w-6 h-6 text-sage" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-charcoal">Join ReWear Community</h1>
          <p className="text-xs text-stone-500 mt-1">
            Exchange clothes, minimize textile waste, and refresh your personal style.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Priya Sharma"
              className="w-full text-xs p-3 rounded-xl border border-cream-300 focus:border-brand-900 focus:ring-1 focus:ring-brand-900 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. priya@example.com"
              className="w-full text-xs p-3 rounded-xl border border-cream-300 focus:border-brand-900 focus:ring-1 focus:ring-brand-900 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                City
              </label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full text-xs p-3 rounded-xl border border-cream-300 bg-white outline-none"
              >
                <option value="Hyderabad">Hyderabad</option>
                <option value="Vijayawada">Vijayawada</option>
                <option value="Mangalagiri">Mangalagiri</option>
                <option value="Guntur">Guntur</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Chennai">Chennai</option>
                <option value="Pune">Pune</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                State
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full text-xs p-3 rounded-xl border border-cream-300 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Min. 6 characters"
              className="w-full text-xs p-3 rounded-xl border border-cream-300 focus:border-brand-900 focus:ring-1 focus:ring-brand-900 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter password"
              className="w-full text-xs p-3 rounded-xl border border-cream-300 focus:border-brand-900 focus:ring-1 focus:ring-brand-900 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-900 text-cream-50 hover:bg-brand-800 transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4 text-sage" />
            {loading ? 'Creating Account...' : 'Create Swapper Account'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-stone-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-brand-900 hover:underline">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
