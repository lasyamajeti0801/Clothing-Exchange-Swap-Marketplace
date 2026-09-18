import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, RefreshCw, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { savedApi } from '../services/api.js';

export default function ClothingCard({ item, onRequestSwap, onSaveToggle, isSaved: initialSaved = false }) {
  const { user } = useAuth();
  const [saved, setSaved] = useState(initialSaved);
  const [saving, setSaving] = useState(false);

  const isOwner = user?.id === item.ownerId;
  const primaryImage = item.images?.[0]?.url || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80';

  const formatCondition = (cond) => {
    switch (cond) {
      case 'NEW_WITH_TAGS': return { label: 'New with Tags', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'LIKE_NEW': return { label: 'Like New', bg: 'bg-teal-50 text-teal-800 border-teal-200' };
      case 'EXCELLENT': return { label: 'Excellent', bg: 'bg-sky-50 text-sky-800 border-sky-200' };
      case 'GOOD': return { label: 'Good', bg: 'bg-stone-100 text-stone-700 border-stone-200' };
      case 'FAIR': return { label: 'Fair', bg: 'bg-amber-50 text-amber-800 border-amber-200' };
      default: return { label: cond, bg: 'bg-stone-100 text-stone-700 border-stone-200' };
    }
  };

  const cond = formatCondition(item.condition);

  const handleSaveClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      window.location.href = '/login';
      return;
    }
    if (saving) return;

    setSaving(true);
    try {
      if (saved) {
        await savedApi.removeSaved(item.id);
        setSaved(false);
        if (onSaveToggle) onSaveToggle(item.id, false);
      } else {
        await savedApi.saveItem(item.id);
        setSaved(true);
        if (onSaveToggle) onSaveToggle(item.id, true);
      }
    } catch (err) {
      console.error('Failed to toggle save:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-cream-300 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Image Container */}
        <div className="relative aspect-[4/5] bg-cream-100 overflow-hidden">
          <Link to={`/clothes/${item.id}`}>
            <img
              src={primaryImage}
              alt={item.title}
              loading="lazy"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80';
              }}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
          </Link>

          {/* Condition Tag */}
          <div className="absolute top-3 left-3">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border shadow-sm ${cond.bg}`}>
              {cond.label}
            </span>
          </div>

          {/* Wishlist Heart Button */}
          {!isOwner && (
            <button
              onClick={handleSaveClick}
              disabled={saving}
              className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md shadow-sm transition-all duration-200 ${
                saved
                  ? 'bg-terracotta text-white scale-110'
                  : 'bg-white/80 text-stone-600 hover:bg-white hover:text-terracotta'
              }`}
              title={saved ? 'Remove from wishlist' : 'Save item'}
            >
              <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
            </button>
          )}

          {/* Value Badge Overlay */}
          <div className="absolute bottom-3 left-3 bg-brand-950/80 backdrop-blur-md text-cream-50 px-3 py-1 rounded-full text-xs font-semibold shadow-sm flex items-center gap-1">
            <span>₹{item.estimatedValue?.toLocaleString('en-IN')}</span>
            <span className="text-[10px] text-stone-300 font-normal">est. value</span>
          </div>

          {/* Size Pill */}
          <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-charcoal px-2.5 py-1 rounded-md text-[11px] font-bold shadow-sm">
            {item.size}
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span className="font-semibold uppercase tracking-wider text-brand-800 text-[11px]">
              {item.brand}
            </span>
            <span className="flex items-center gap-1 text-[11px]">
              <MapPin className="w-3 h-3 text-stone-400" />
              {item.city}
            </span>
          </div>

          <Link to={`/clothes/${item.id}`} className="block">
            <h3 className="font-serif font-bold text-base text-charcoal line-clamp-1 group-hover:text-brand-900 transition-colors">
              {item.title}
            </h3>
          </Link>

          <p className="text-xs text-stone-500 mt-1 line-clamp-2">
            {item.description}
          </p>
        </div>
      </div>

      {/* Card Footer: Owner & Swap Action */}
      <div className="p-4 pt-0 border-t border-cream-200 mt-2">
        <div className="flex items-center justify-between pt-3">
          <Link
            to={`/users/${item.owner?.id}`}
            className="flex items-center gap-2 group/owner hover:opacity-80"
          >
            <img
              src={item.owner?.avatarUrl || 'https://api.dicebear.com/7.x/initials/svg?seed=User'}
              alt={item.owner?.name}
              className="w-6 h-6 rounded-full object-cover bg-stone-200"
            />
            <div className="text-[11px]">
              <p className="font-medium text-stone-800 truncate max-w-[90px]">{item.owner?.name}</p>
              <div className="flex items-center gap-0.5 text-amber-600">
                <Star className="w-2.5 h-2.5 fill-current" />
                <span>{item.owner?.rating?.toFixed(1) || '5.0'}</span>
              </div>
            </div>
          </Link>

          {isOwner ? (
            <Link
              to={`/clothes/${item.id}`}
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-brand-900 bg-brand-50 border border-brand-200 hover:bg-brand-100"
            >
              Your Listing
            </Link>
          ) : (
            <button
              onClick={() => onRequestSwap && onRequestSwap(item)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-900 text-cream-50 hover:bg-brand-800 transition-all shadow-sm active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5 text-sage" />
              Swap
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
