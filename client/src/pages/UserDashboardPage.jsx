import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  RefreshCw,
  Heart,
  Leaf,
  Droplets,
  Wind,
  Star,
  Clock,
  Layers,
  Edit3,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { clothesApi, swapsApi, authApi } from '../services/api.js';
import ClothingCard from '../components/ClothingCard.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function UserDashboardPage() {
  const { user, updateUser } = useAuth();
  const [myListings, setMyListings] = useState([]);
  const [activeSwaps, setActiveSwaps] = useState([]);
  const [listingsTab, setListingsTab] = useState('ACTIVE');
  const [loading, setLoading] = useState(true);

  // Profile Edit State
  const [editingProfile, setEditingProfile] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [city, setCity] = useState(user?.city || '');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setBio(user.bio || '');
      setCity(user.city || '');
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [itemsRes, swapsRes] = await Promise.all([
        clothesApi.getClothes({ ownerId: user.id, status: 'ALL', limit: 50 }),
        swapsApi.getUserSwaps('active'),
      ]);
      setMyListings(itemsRes.data?.data?.items || []);
      setActiveSwaps(swapsRes.data?.data?.swaps || []);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await authApi.updateProfile({ name, bio, city });
      if (res.data?.data?.user) {
        updateUser(res.data.data.user);
        setEditingProfile(false);
        alert('Profile updated successfully!');
      }
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update profile.');
    }
  };

  const filteredListings = myListings.filter((item) => {
    if (listingsTab === 'ALL') return true;
    return item.status === listingsTab;
  });

  // Personal Sustainability Metrics
  // 1 swap = 2 garments exchanged = 5.4 kg CO2 prevented, ~5,400L water saved
  const swapCount = user?.swapCount || 0;
  const itemsKeptInCirculation = swapCount * 2;
  const waterSavedLiters = itemsKeptInCirculation * 2700;
  const co2SavedKg = Math.round(itemsKeptInCirculation * 2.5 * 10) / 10;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* 1. Header Profile & Sustainability Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-300 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* User Bio & Meta */}
          <div className="lg:col-span-7 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <img
              src={user?.avatarUrl || 'https://api.dicebear.com/7.x/initials/svg?seed=User'}
              alt={user?.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-brand-900 bg-stone-100 shadow-sm"
            />
            <div className="space-y-2 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal">{user?.name}</h1>
                <div className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{user?.rating?.toFixed(1) || '5.0'} Rating</span>
                </div>
              </div>

              <p className="text-xs text-stone-500 flex items-center justify-center sm:justify-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                {user?.city}, {user?.state} · Member since {new Date(user?.createdAt || Date.now()).getFullYear()}
              </p>

              {editingProfile ? (
                <form onSubmit={handleUpdateProfile} className="space-y-2 pt-2">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-cream-300"
                    placeholder="Name"
                  />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-cream-300"
                    placeholder="City"
                  />
                  <textarea
                    rows={2}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-cream-300"
                    placeholder="Bio / Style Ethos"
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-full text-xs font-bold bg-brand-900 text-cream-50"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingProfile(false)}
                      className="px-4 py-1.5 rounded-full text-xs text-stone-600 hover:bg-cream-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <p className="text-xs text-stone-600 leading-relaxed max-w-lg">
                    {user?.bio || 'Conscious swapper embracing sustainable, circular fashion.'}
                  </p>
                  <button
                    onClick={() => setEditingProfile(true)}
                    className="text-xs font-semibold text-brand-900 hover:underline inline-flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit Profile
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Personal Sustainability Meter */}
          <div className="lg:col-span-5 bg-brand-900 text-cream-50 rounded-2xl p-5 border border-brand-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-sage">
                Your Circular Wardrobe Impact
              </span>
              <Leaf className="w-4 h-4 text-emerald-400" />
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-brand-950/60 p-2.5 rounded-xl">
                <span className="text-xl font-serif font-bold text-cream-50">{itemsKeptInCirculation}</span>
                <span className="text-[9px] text-stone-400 block uppercase">Garments Swapped</span>
              </div>
              <div className="bg-brand-950/60 p-2.5 rounded-xl">
                <span className="text-xl font-serif font-bold text-sky-300">{waterSavedLiters.toLocaleString()}L</span>
                <span className="text-[9px] text-stone-400 block uppercase">Water Saved</span>
              </div>
              <div className="bg-brand-950/60 p-2.5 rounded-xl">
                <span className="text-xl font-serif font-bold text-emerald-300">{co2SavedKg} kg</span>
                <span className="text-[9px] text-stone-400 block uppercase">CO2 Prevented</span>
              </div>
            </div>

            <p className="text-[10px] text-stone-300 italic text-center">
              "You've helped give {itemsKeptInCirculation} clothing items a second life."
            </p>
          </div>
        </div>
      </div>

      {/* 2. Active Swaps In-Progress Banner */}
      {activeSwaps.length > 0 && (
        <div className="bg-brand-50 border border-brand-200 rounded-3xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-brand-950 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-brand-700 animate-spin" />
              <span>Active Handover Swaps ({activeSwaps.length})</span>
            </h2>
            <Link
              to="/swaps?tab=active"
              className="text-xs font-semibold text-brand-900 hover:underline"
            >
              View All In My Swaps
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeSwaps.slice(0, 2).map((s) => (
              <div
                key={s.id}
                className="bg-white p-3.5 rounded-2xl border border-brand-200 flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-bold text-charcoal">
                    {s.offeredItem?.title} ⇄ {s.requestedItem?.title}
                  </p>
                  <p className="text-[11px] text-stone-500 mt-0.5">Status: {s.status.replace(/_/g, ' ')}</p>
                </div>
                <Link
                  to={`/chat/${s.id}`}
                  className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-brand-900 text-cream-50"
                >
                  Open Chat
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. My Listings Closet Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-bold text-charcoal">My Wardrobe Listings</h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Manage your listed items and review their current availability.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/list"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-900 text-cream-50 hover:bg-brand-800 transition-colors shadow-sm"
            >
              <PlusCircle className="w-4 h-4 text-sage" /> Add New Garment
            </Link>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-cream-300 pb-2 overflow-x-auto">
          {['ACTIVE', 'PENDING_SWAP', 'SWAPPED', 'ALL'].map((tab) => (
            <button
              key={tab}
              onClick={() => setListingsTab(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                listingsTab === tab
                  ? 'bg-brand-900 text-cream-50'
                  : 'bg-white border border-cream-300 text-stone-600 hover:bg-cream-100'
              }`}
            >
              {tab === 'ACTIVE' && 'Available (Active)'}
              {tab === 'PENDING_SWAP' && 'Pending Swap'}
              {tab === 'SWAPPED' && 'Exchanged (Swapped)'}
              {tab === 'ALL' && 'All Listings'}
            </button>
          ))}
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="py-20 text-center text-xs text-stone-400">Loading your closet...</div>
        ) : filteredListings.length === 0 ? (
          <EmptyState
            title="No items in this status"
            description="Add clean, quality clothes you no longer wear to exchange with the community."
            actionText="List a Garment Now"
            actionLink="/list"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredListings.map((item) => (
              <ClothingCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
