import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  RefreshCw,
  Heart,
  MapPin,
  Star,
  ShieldAlert,
  Edit3,
  Trash2,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Share2,
  Clock,
  Layers,
  Info,
} from 'lucide-react';
import { clothesApi, savedApi } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import SwapRequestModal from '../components/SwapRequestModal.jsx';
import ReportModal from '../components/ReportModal.jsx';
import ClothingCard from '../components/ClothingCard.jsx';

export default function ClothingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();

  const [item, setItem] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError('');
    clothesApi
      .getClothingById(id)
      .then((res) => {
        if (res.data?.data) {
          setItem(res.data.data.item);
          setIsSaved(res.data.data.isSaved);
          setRecommendations(res.data.data.recommendations || []);
        }
      })
      .catch((err) => {
        console.error('Error fetching detail:', err);
        setError('Clothing listing not found or has been removed.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const isOwner = user?.id === item?.ownerId;

  const handleToggleSave = async () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    try {
      if (isSaved) {
        await savedApi.removeSaved(item.id);
        setIsSaved(false);
      } else {
        await savedApi.saveItem(item.id);
        setIsSaved(true);
      }
    } catch (err) {
      console.error('Error saving item:', err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to remove this clothing listing from the swap exchange?')) {
      return;
    }
    try {
      await clothesApi.deleteClothing(item.id);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error deleting listing:', err);
      alert('Failed to delete listing.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-xs text-stone-400">
        Loading circular wardrobe item...
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-2xl font-bold text-charcoal mb-2">Item Unavailable</h2>
        <p className="text-xs text-stone-500 mb-6">{error || 'Unable to locate listing.'}</p>
        <Link
          to="/clothes"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold bg-brand-900 text-cream-50"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Marketplace
        </Link>
      </div>
    );
  }

  const images = item.images && item.images.length > 0
    ? item.images
    : [{ url: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600' }];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Back Navigation */}
      <Link
        to="/clothes"
        className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-brand-900"
      >
        <ArrowLeft className="w-4 h-4" /> Back to All Clothing
      </Link>

      {/* Main Item Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Multi-Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-cream-200 border border-cream-300 shadow-md relative">
            <img
              src={images[selectedImageIdx]?.url}
              alt={item.title}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute top-4 left-4 bg-brand-950/80 backdrop-blur-md text-cream-50 text-xs px-3.5 py-1 rounded-full font-semibold">
              {item.category}
            </div>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={img.id || idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImageIdx === idx
                      ? 'border-brand-900 ring-2 ring-brand-900/30'
                      : 'border-cream-300 hover:border-brand-500 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Item Specs & Swap Launcher */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
              <span className="font-bold uppercase tracking-wider text-brand-900">
                {item.brand}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                {item.city}, {item.state}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal leading-tight">
              {item.title}
            </h1>
          </div>

          {/* Valuation Card */}
          <div className="bg-brand-50/70 border border-brand-200 rounded-3xl p-5 space-y-3">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-800">
                  Estimated Swap Value
                </span>
                <p className="font-serif text-3xl font-bold text-brand-950">
                  ₹{item.estimatedValue?.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider text-stone-500 block">
                  Suggested Range
                </span>
                <span className="text-xs font-bold text-charcoal">
                  ₹{Math.round(item.estimatedValue * 0.88)} – ₹{Math.round(item.estimatedValue * 1.12)}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-stone-600 leading-relaxed border-t border-brand-200 pt-2 flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 text-brand-700 shrink-0 mt-0.5" />
              <span>
                Computed via the ReWear Valuation Engine based on brand factor ({item.brand}), condition multiplier ({item.condition}), and category base rates. Non-binding peer benchmark.
              </span>
            </p>
          </div>

          {/* Quick Details Chips */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-white rounded-2xl border border-cream-300">
              <span className="text-[10px] text-stone-400 block uppercase font-bold">Size</span>
              <span className="font-bold text-charcoal">{item.size}</span>
            </div>
            <div className="p-3 bg-white rounded-2xl border border-cream-300">
              <span className="text-[10px] text-stone-400 block uppercase font-bold">Condition</span>
              <span className="font-bold text-charcoal capitalize">
                {item.condition?.replace(/_/g, ' ').toLowerCase()}
              </span>
            </div>
            <div className="p-3 bg-white rounded-2xl border border-cream-300">
              <span className="text-[10px] text-stone-400 block uppercase font-bold">Material</span>
              <span className="font-bold text-charcoal">{item.material}</span>
            </div>
            <div className="p-3 bg-white rounded-2xl border border-cream-300">
              <span className="text-[10px] text-stone-400 block uppercase font-bold">Color</span>
              <span className="font-bold text-charcoal">{item.color}</span>
            </div>
          </div>

          {/* Description & Exchange Preferences */}
          <div className="space-y-3 bg-white p-5 rounded-3xl border border-cream-300 text-xs">
            <div>
              <h3 className="font-bold uppercase tracking-wider text-stone-700 mb-1">Description</h3>
              <p className="text-stone-600 leading-relaxed whitespace-pre-line">{item.description}</p>
            </div>

            {item.exchangePreferences && (
              <div className="pt-3 border-t border-cream-200">
                <h3 className="font-bold uppercase tracking-wider text-brand-900 mb-1">
                  Owner's Swap Preferences
                </h3>
                <p className="text-stone-600 leading-relaxed italic">"{item.exchangePreferences}"</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            {isOwner ? (
              <div className="flex items-center gap-3">
                <Link
                  to={`/list/${item.id}/edit`}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-900 text-cream-50 hover:bg-brand-800 transition-all shadow-sm"
                >
                  <Edit3 className="w-4 h-4" /> Edit Listing
                </Link>
                <button
                  onClick={handleDelete}
                  className="px-5 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider border border-rose-300 text-rose-700 hover:bg-rose-50 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsSwapModalOpen(true)}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-4 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-900 text-cream-50 hover:bg-brand-800 transition-all shadow-lg active:scale-95"
                >
                  <RefreshCw className="w-4 h-4 text-sage" /> Request Swap
                </button>

                <button
                  onClick={handleToggleSave}
                  className={`p-3.5 rounded-full border transition-all ${
                    isSaved
                      ? 'bg-terracotta text-white border-terracotta'
                      : 'bg-white text-stone-600 border-cream-300 hover:bg-cream-100 hover:text-terracotta'
                  }`}
                  title={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
                >
                  <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                </button>

                <button
                  onClick={() => setIsReportModalOpen(true)}
                  className="p-3.5 rounded-full border border-cream-300 bg-white text-stone-400 hover:text-rose-600 hover:bg-cream-100 transition-colors"
                  title="Report Listing"
                >
                  <ShieldAlert className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Owner Profile Snippet */}
          <div className="pt-4 border-t border-cream-300">
            <Link
              to={`/users/${item.owner?.id}`}
              className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-cream-300 hover:shadow-sm transition-all"
            >
              <img
                src={item.owner?.avatarUrl || 'https://api.dicebear.com/7.x/initials/svg?seed=User'}
                alt={item.owner?.name}
                className="w-12 h-12 rounded-full object-cover bg-stone-200"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-sm text-charcoal">{item.owner?.name}</h4>
                  <div className="flex items-center gap-1 text-xs text-amber-600 font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{item.owner?.rating?.toFixed(1) || '5.0'}</span>
                  </div>
                </div>
                <p className="text-xs text-stone-500 line-clamp-1">{item.owner?.bio || 'Sustainable swapper'}</p>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-stone-400">
                  <span>{item.owner?.city}, {item.owner?.state}</span>
                  <span>•</span>
                  <span>{item.owner?.swapCount || 0} completed swaps</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Recommended Compatible Listings */}
      {recommendations.length > 0 && (
        <div className="pt-12 border-t border-cream-300 space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-700">Compatible Alternatives</span>
            <h2 className="font-serif text-2xl font-bold text-charcoal mt-1">
              You Might Also Be Interested In Swapping
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {recommendations.map((rec) => (
              <ClothingCard
                key={rec.id}
                item={rec}
                onRequestSwap={(it) => {
                  setItem(it);
                  setIsSwapModalOpen(true);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <SwapRequestModal
        targetItem={item}
        isOpen={isSwapModalOpen}
        onClose={() => setIsSwapModalOpen(false)}
        onSuccess={() => {
          alert('Swap proposal submitted! Track status under My Swaps.');
          navigate('/swaps');
        }}
      />

      <ReportModal
        targetListing={item}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSuccess={() => {
          alert('Report filed. Thank you for keeping our sustainable marketplace safe.');
        }}
      />
    </div>
  );
}
