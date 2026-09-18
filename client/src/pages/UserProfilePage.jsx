import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Star, Calendar, RefreshCw, CheckCircle2, Shield } from 'lucide-react';
import { authApi } from '../services/api.js';
import ClothingCard from '../components/ClothingCard.jsx';
import SwapRequestModal from '../components/SwapRequestModal.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function UserProfilePage() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSwapItem, setSelectedSwapItem] = useState(null);

  useEffect(() => {
    setLoading(true);
    authApi
      .getUserProfile(id)
      .then((res) => {
        setProfile(res.data?.data?.profile);
      })
      .catch((err) => {
        console.error('Error fetching user profile:', err);
        setError('User profile not found.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="py-20 text-center text-xs text-stone-400">Loading member profile...</div>;
  }

  if (error || !profile) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <h2 className="font-serif text-2xl font-bold text-charcoal mb-2">Member Not Found</h2>
        <p className="text-xs text-stone-500 mb-4">{error || 'This user profile does not exist.'}</p>
        <Link to="/clothes" className="text-xs font-bold text-brand-900 underline">
          Browse All Clothes
        </Link>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === profile.id;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-8 border border-cream-300 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-8">
        <img
          src={profile.avatarUrl || 'https://api.dicebear.com/7.x/initials/svg?seed=User'}
          alt={profile.name}
          className="w-24 h-24 rounded-full object-cover border-4 border-cream-200 bg-stone-100 shadow-sm"
        />

        <div className="space-y-3 flex-1 text-center md:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="font-serif text-3xl font-bold text-charcoal">{profile.name}</h1>
              <p className="text-xs text-stone-500 flex items-center justify-center md:justify-start gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                {profile.city}, {profile.state} · Member since {new Date(profile.createdAt).getFullYear()}
              </p>
            </div>

            <div className="flex items-center justify-center md:justify-end gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-bold text-amber-900">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>{profile.rating?.toFixed(1) || '5.0'} / 5.0</span>
              </div>
              <div className="flex items-center gap-1 px-3 py-1 bg-brand-50 border border-brand-200 rounded-full text-xs font-bold text-brand-900">
                <RefreshCw className="w-3.5 h-3.5 text-sage" />
                <span>{profile.swapCount} Swaps</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed max-w-2xl">
            {profile.bio || 'Passionate about sustainable wardrobes, slow fashion, and circular barter.'}
          </p>

          <div className="flex items-center justify-center md:justify-start gap-4 pt-1 text-[11px] text-stone-500">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-700" /> Verified Member
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-brand-700" /> Approximate Location Protected
            </span>
          </div>
        </div>
      </div>

      {/* Active Listings by User */}
      <div className="space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-700">Wardrobe</span>
          <h2 className="font-serif text-2xl font-bold text-charcoal mt-1">
            Available Clothes from {profile.name} ({profile.listings?.length || 0})
          </h2>
        </div>

        {profile.listings?.length === 0 ? (
          <div className="py-12 bg-white rounded-3xl border border-cream-300 text-center text-xs text-stone-400">
            {profile.name} currently has no active clothing listings available for swap.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {profile.listings.map((item) => (
              <ClothingCard
                key={item.id}
                item={{ ...item, owner: profile }}
                onRequestSwap={(it) => setSelectedSwapItem(it)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Community Reviews Received */}
      <div className="space-y-6 pt-6 border-t border-cream-300">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-700">Reputation</span>
          <h2 className="font-serif text-2xl font-bold text-charcoal mt-1">
            Community Swap Reviews ({profile.reviewsReceived?.length || 0})
          </h2>
        </div>

        {profile.reviewsReceived?.length === 0 ? (
          <div className="py-8 text-xs text-stone-400 italic">No reviews recorded yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.reviewsReceived.map((rev) => (
              <div
                key={rev.id}
                className="bg-white p-5 rounded-2xl border border-cream-300 shadow-sm space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={rev.reviewer?.avatarUrl || 'https://api.dicebear.com/7.x/initials/svg?seed=User'}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover bg-stone-200"
                    />
                    <div>
                      <p className="font-bold text-xs text-charcoal">{rev.reviewer?.name}</p>
                      <span className="text-[10px] text-stone-400">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5 text-amber-500">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed italic">
                  "{rev.comment || 'Smooth, honest swap handover!'}"
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <SwapRequestModal
        targetItem={selectedSwapItem}
        isOpen={!!selectedSwapItem}
        onClose={() => setSelectedSwapItem(null)}
        onSuccess={() => alert('Swap proposal sent!')}
      />
    </div>
  );
}
