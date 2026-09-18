import React, { useState, useEffect } from 'react';
import {
  Users,
  Shirt,
  RefreshCw,
  ShieldAlert,
  Leaf,
  CheckCircle2,
  XCircle,
  Search,
  Check,
  AlertCircle,
  Eye,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { adminApi } from '../services/api.js';

const COLORS = ['#1E3A2F', '#8FA89B', '#C26D54', '#D98973', '#3C4441', '#436b54'];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [categoryStats, setCategoryStats] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [listingsList, setListingsList] = useState([]);
  const [reportsList, setReportsList] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  const [searchUser, setSearchUser] = useState('');
  const [searchListing, setSearchListing] = useState('');
  const [loading, setLoading] = useState(true);

  // Dispute resolution modal state
  const [selectedReport, setSelectedReport] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, listingsRes, reportsRes] = await Promise.all([
        adminApi.getStats(),
        adminApi.getUsers(),
        adminApi.getListings(),
        adminApi.getStats(), // reports included or fetch reports
      ]);

      setStats(statsRes.data?.data?.stats);
      setCategoryStats(statsRes.data?.data?.categoryStats || []);
      setUsersList(usersRes.data?.data?.users || []);
      setListingsList(listingsRes.data?.data?.listings || []);
      
      // Load reports directly via api
      const rep = await adminApi.getUsers(); // fallback
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSuspend = async (userId, currentStatus) => {
    const nextStatus = !currentStatus;
    if (!window.confirm(`Confirm: ${nextStatus ? 'SUSPEND' : 'ACTIVATE'} this user?`)) return;

    try {
      await adminApi.toggleUserStatus(userId, { isSuspended: nextStatus });
      setUsersList((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isSuspended: nextStatus } : u))
      );
      alert(`User account ${nextStatus ? 'suspended' : 'activated'}.`);
    } catch (err) {
      console.error('Error changing suspension:', err);
      alert('Action failed.');
    }
  };

  const handleModerateListing = async (listingId, newStatus) => {
    try {
      await adminApi.moderateListing(listingId, { status: newStatus });
      setListingsList((prev) =>
        prev.map((l) => (l.id === listingId ? { ...l, status: newStatus } : l))
      );
      alert(`Listing status updated to ${newStatus}.`);
    } catch (err) {
      console.error('Moderation failed:', err);
      alert('Action failed.');
    }
  };

  const filteredUsers = usersList.filter(
    (u) =>
      u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.email.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.city.toLowerCase().includes(searchUser.toLowerCase())
  );

  const filteredListings = listingsList.filter(
    (l) =>
      l.title.toLowerCase().includes(searchListing.toLowerCase()) ||
      l.brand.toLowerCase().includes(searchListing.toLowerCase()) ||
      l.category.toLowerCase().includes(searchListing.toLowerCase())
  );

  if (loading) {
    return <div className="py-20 text-center text-xs text-stone-400">Loading admin console...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cream-300">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-900 text-cream-50 text-[10px] font-bold uppercase tracking-wider mb-1">
            <span>Admin Control Console</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-charcoal">Platform Moderation & Analytics</h1>
        </div>

        <div className="flex items-center gap-2">
          {['overview', 'users', 'listings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeTab === tab
                  ? 'bg-brand-900 text-cream-50'
                  : 'bg-white border border-cream-300 text-stone-700 hover:bg-cream-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* KPI Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-cream-300 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-900 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Total Swappers</p>
                <p className="font-serif text-2xl font-bold text-charcoal">{stats?.totalUsers || 0}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-cream-300 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                <Shirt className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Active Listings</p>
                <p className="font-serif text-2xl font-bold text-charcoal">{stats?.activeListings || 0}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-cream-300 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Completed Swaps</p>
                <p className="font-serif text-2xl font-bold text-charcoal">{stats?.completedSwaps || 0}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-cream-300 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Pending Inquiries</p>
                <p className="font-serif text-2xl font-bold text-charcoal">{stats?.openReports || 0}</p>
              </div>
            </div>
          </div>

          {/* Environmental Savings Summary */}
          <div className="bg-brand-900 text-cream-50 p-6 rounded-3xl border border-brand-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <Leaf className="w-5 h-5 text-sage" />
                <span className="font-serif font-bold text-lg">Total Community Ecological Diversion</span>
              </div>
              <p className="text-xs text-cream-300 max-w-lg">
                Calculated in real-time across completed barter exchanges.
              </p>
            </div>

            <div className="flex items-center gap-6 text-center">
              <div>
                <p className="font-serif text-2xl font-bold text-cream-50">{stats?.itemsReused || 0}</p>
                <p className="text-[10px] text-stone-300 uppercase">Items Reused</p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-sky-300">
                  {stats?.estimatedWaterSavedLiters?.toLocaleString() || 0} L
                </p>
                <p className="text-[10px] text-stone-300 uppercase">Water Saved</p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-emerald-300">
                  {stats?.estimatedCO2SavedKg || 0} kg
                </p>
                <p className="text-[10px] text-stone-300 uppercase">CO2 Prevented</p>
              </div>
            </div>
          </div>

          {/* Recharts Category Analytics */}
          <div className="bg-white p-6 rounded-3xl border border-cream-300 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-lg text-charcoal">Wardrobe Category Distribution</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryStats}>
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={11} />
                  <YAxis stroke="#6b7280" fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#1E3A2F" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-white p-6 rounded-3xl border border-cream-300 shadow-sm space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-serif font-bold text-xl text-charcoal">Registered Swappers ({filteredUsers.length})</h3>
            <div className="relative w-72">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                placeholder="Search user name or email..."
                className="w-full text-xs pl-9 pr-4 py-2 rounded-xl border border-cream-300 outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-charcoal">
              <thead className="bg-cream-100 text-stone-600 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-3 rounded-l-xl">User</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">City Hub</th>
                  <th className="p-3">Rating</th>
                  <th className="p-3">Swaps</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 rounded-r-xl text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-cream-50">
                    <td className="p-3 font-semibold">
                      <p>{u.name}</p>
                      <span className="text-[10px] text-stone-400">{u.email}</span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-stone-100 text-stone-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3">{u.city}</td>
                    <td className="p-3 font-bold text-amber-600">★ {u.rating?.toFixed(1) || '5.0'}</td>
                    <td className="p-3">{u.swapCount || 0}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.isSuspended ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {u.isSuspended ? 'SUSPENDED' : 'ACTIVE'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {u.role !== 'ADMIN' && (
                        <button
                          onClick={() => handleToggleSuspend(u.id, u.isSuspended)}
                          className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                            u.isSuspended
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                          }`}
                        >
                          {u.isSuspended ? 'Activate User' : 'Suspend User'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Listings Tab */}
      {activeTab === 'listings' && (
        <div className="bg-white p-6 rounded-3xl border border-cream-300 shadow-sm space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-serif font-bold text-xl text-charcoal">Wardrobe Listings ({filteredListings.length})</h3>
            <div className="relative w-72">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchListing}
                onChange={(e) => setSearchListing(e.target.value)}
                placeholder="Search listing title or brand..."
                className="w-full text-xs pl-9 pr-4 py-2 rounded-xl border border-cream-300 outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-charcoal">
              <thead className="bg-cream-100 text-stone-600 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-3 rounded-l-xl">Listing</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Owner</th>
                  <th className="p-3">Est. Value</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 rounded-r-xl text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200">
                {filteredListings.map((l) => (
                  <tr key={l.id} className="hover:bg-cream-50">
                    <td className="p-3 font-semibold flex items-center gap-2">
                      <img
                        src={l.images?.[0]?.url || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=100'}
                        alt=""
                        className="w-8 h-8 rounded-lg object-cover"
                      />
                      <div className="truncate max-w-[200px]">
                        <p className="truncate">{l.title}</p>
                        <span className="text-[10px] text-stone-400">{l.brand} · {l.size}</span>
                      </div>
                    </td>
                    <td className="p-3">{l.category}</td>
                    <td className="p-3">{l.owner?.name}</td>
                    <td className="p-3 font-bold text-brand-900">₹{l.estimatedValue}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        l.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-700'
                      }`}>
                        {l.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {l.status === 'ACTIVE' ? (
                        <button
                          onClick={() => handleModerateListing(l.id, 'REMOVED')}
                          className="px-3 py-1 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-800 hover:bg-rose-200"
                        >
                          Remove Listing
                        </button>
                      ) : (
                        <button
                          onClick={() => handleModerateListing(l.id, 'ACTIVE')}
                          className="px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                        >
                          Restore
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
