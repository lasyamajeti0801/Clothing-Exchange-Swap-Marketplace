import React, { useState, useEffect } from 'react';
import { X, RefreshCw, ArrowRightLeft, ShieldCheck, CheckCircle2, AlertCircle, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { clothesApi, swapsApi, valuationApi } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function SwapRequestModal({ targetItem, isOpen, onClose, onSuccess }) {
  const { user } = useAuth();
  const [myItems, setMyItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [message, setMessage] = useState('');
  const [exchangeMethod, setExchangeMethod] = useState('LOCAL_MEETUP');
  const [loadingItems, setLoadingItems] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [comparison, setComparison] = useState(null);
  const [error, setError] = useState('');

  // Load current user's available active listings
  useEffect(() => {
    if (isOpen && user) {
      setLoadingItems(true);
      setError('');
      clothesApi
        .getClothes({ ownerId: user.id, status: 'ACTIVE', limit: 50 })
        .then((res) => {
          const items = res.data?.data?.items || [];
          setMyItems(items);
          if (items.length > 0) {
            setSelectedItemId(items[0].id);
          }
        })
        .catch((err) => {
          console.error('Failed to load user closet:', err);
          setError('Failed to load your clothing items.');
        })
        .finally(() => setLoadingItems(false));
    }
  }, [isOpen, user]);

  // Recalculate comparison whenever selected item changes
  const selectedItem = myItems.find((i) => i.id === selectedItemId);

  useEffect(() => {
    if (selectedItem && targetItem) {
      valuationApi
        .compare({ offeredItem: selectedItem, requestedItem: targetItem })
        .then((res) => {
          setComparison(res.data?.data);
        })
        .catch((err) => console.error('Error comparing items:', err));
    } else {
      setComparison(null);
    }
  }, [selectedItemId, targetItem]);

  if (!isOpen || !targetItem) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedItemId) {
      setError('Please select an item from your closet to offer.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await swapsApi.createSwap({
        offeredItemId: selectedItemId,
        requestedItemId: targetItem.id,
        message: message.trim() || `Hi! I'd love to swap my "${selectedItem?.title}" for your "${targetItem.title}".`,
        exchangeMethod,
      });

      if (onSuccess) onSuccess(res.data?.data?.swap);
      onClose();
    } catch (err) {
      console.error('Swap proposal error:', err);
      setError(err.response?.data?.message || 'Unable to submit swap proposal.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-cream-300 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-charcoal hover:bg-cream-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-100 text-brand-900 mb-2">
            <RefreshCw className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-charcoal">Propose a Clothing Swap</h2>
          <p className="text-xs text-stone-500 mt-1">
            Choose an item from your closet to exchange with <span className="font-semibold text-brand-900">{targetItem.owner?.name}</span>.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Side-by-Side Exchange Comparison Box */}
        <div className="bg-cream-100 rounded-2xl p-4 border border-cream-300 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
            {/* Left: Your Offered Item */}
            <div className="md:col-span-3 text-center md:text-left bg-white p-3 rounded-xl border border-cream-200 shadow-sm">
              <span className="text-[10px] font-bold tracking-wider uppercase text-stone-400 block mb-1">
                Your Offered Item
              </span>
              {selectedItem ? (
                <div className="flex items-center gap-3">
                  <img
                    src={selectedItem.images?.[0]?.url || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200'}
                    alt={selectedItem.title}
                    className="w-14 h-14 rounded-lg object-cover bg-stone-100"
                  />
                  <div className="truncate">
                    <p className="font-serif font-bold text-xs text-charcoal truncate">{selectedItem.title}</p>
                    <p className="text-[11px] text-stone-500">{selectedItem.brand} · {selectedItem.size}</p>
                    <p className="text-xs font-semibold text-brand-900 mt-0.5">₹{selectedItem.estimatedValue}</p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-stone-400 py-3 italic">No item selected</p>
              )}
            </div>

            {/* Center: Exchange Arrow & Difference */}
            <div className="md:col-span-1 flex flex-col items-center justify-center py-1">
              <div className="w-8 h-8 rounded-full bg-brand-900 text-cream-50 flex items-center justify-center shadow-sm">
                <ArrowRightLeft className="w-4 h-4" />
              </div>
            </div>

            {/* Right: Their Requested Item */}
            <div className="md:col-span-3 text-center md:text-left bg-white p-3 rounded-xl border border-cream-200 shadow-sm">
              <span className="text-[10px] font-bold tracking-wider uppercase text-stone-400 block mb-1">
                Requested Item
              </span>
              <div className="flex items-center gap-3">
                <img
                  src={targetItem.images?.[0]?.url || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200'}
                  alt={targetItem.title}
                  className="w-14 h-14 rounded-lg object-cover bg-stone-100"
                />
                <div className="truncate">
                  <p className="font-serif font-bold text-xs text-charcoal truncate">{targetItem.title}</p>
                  <p className="text-[11px] text-stone-500">{targetItem.brand} · {targetItem.size}</p>
                  <p className="text-xs font-semibold text-brand-900 mt-0.5">₹{targetItem.estimatedValue}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Algorithmic Valuation Difference & Fairness Indicator */}
          {comparison && (
            <div className="mt-4 pt-3 border-t border-cream-300 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-charcoal">
                  Estimated Difference: ₹{comparison.difference}
                </span>
                <span className="text-[11px] text-stone-500">
                  ({comparison.percentageDifference}% gap)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                    comparison.fairnessCategory === 'Close Match'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : comparison.fairnessCategory === 'Moderate Difference'
                      ? 'bg-blue-50 text-blue-800 border-blue-300'
                      : 'bg-amber-50 text-amber-800 border-amber-300'
                  }`}
                >
                  ● {comparison.fairnessCategory}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Closet Picker Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Select Item from Your Closet ({myItems.length})
            </label>
            <Link
              to="/list"
              className="text-xs font-semibold text-brand-900 hover:text-brand-700 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> List New Item
            </Link>
          </div>

          {loadingItems ? (
            <div className="py-8 text-center text-xs text-stone-400">Loading your closet...</div>
          ) : myItems.length === 0 ? (
            <div className="p-4 bg-cream-100 rounded-xl text-center border border-dashed border-stone-300">
              <p className="text-xs text-stone-600 mb-2">You don't have any active clothing listings to swap!</p>
              <Link
                to="/list"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-brand-900 text-cream-50"
              >
                List Your Clothes First
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto p-1">
              {myItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedItemId(item.id)}
                  className={`p-2 rounded-xl text-left border transition-all flex items-center gap-2.5 relative ${
                    selectedItemId === item.id
                      ? 'border-brand-900 bg-brand-50/50 ring-2 ring-brand-900'
                      : 'border-cream-300 bg-white hover:border-brand-500'
                  }`}
                >
                  <img
                    src={item.images?.[0]?.url || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=100'}
                    alt={item.title}
                    className="w-10 h-10 rounded-lg object-cover bg-stone-100 shrink-0"
                  />
                  <div className="truncate">
                    <p className="text-xs font-semibold text-charcoal truncate">{item.title}</p>
                    <p className="text-[10px] text-stone-500">{item.brand} · ₹{item.estimatedValue}</p>
                  </div>
                  {selectedItemId === item.id && (
                    <CheckCircle2 className="w-4 h-4 text-brand-900 absolute top-1.5 right-1.5" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Exchange Preferences & Offer Note */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Preferred Handover Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center gap-2 p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                  exchangeMethod === 'LOCAL_MEETUP'
                    ? 'border-brand-900 bg-brand-50/60 font-semibold text-brand-950'
                    : 'border-cream-300 hover:bg-cream-100 text-stone-700'
                }`}
              >
                <input
                  type="radio"
                  name="exchangeMethod"
                  value="LOCAL_MEETUP"
                  checked={exchangeMethod === 'LOCAL_MEETUP'}
                  onChange={() => setExchangeMethod('LOCAL_MEETUP')}
                  className="text-brand-900 focus:ring-brand-900"
                />
                <span>Local Meetup (Direct)</span>
              </label>

              <label
                className={`flex items-center gap-2 p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                  exchangeMethod === 'SHIPPING'
                    ? 'border-brand-900 bg-brand-50/60 font-semibold text-brand-950'
                    : 'border-cream-300 hover:bg-cream-100 text-stone-700'
                }`}
              >
                <input
                  type="radio"
                  name="exchangeMethod"
                  value="SHIPPING"
                  checked={exchangeMethod === 'SHIPPING'}
                  onChange={() => setExchangeMethod('SHIPPING')}
                  className="text-brand-900 focus:ring-brand-900"
                />
                <span>Shipping / Courier</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Offer Note / Message
            </label>
            <textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Hi! I'd love to exchange my denim jacket for your hoodie. It fits like a true M and is barely worn."
              className="w-full text-xs p-3 rounded-xl border border-cream-300 focus:border-brand-900 focus:ring-1 focus:ring-brand-900 outline-none resize-none"
            />
          </div>

          {/* Cashless Barter Disclaimer */}
          <div className="flex items-center gap-2 text-[11px] text-stone-500 bg-cream-100 p-2.5 rounded-xl">
            <ShieldCheck className="w-4 h-4 text-brand-700 shrink-0" />
            <span>
              ReWear is 100% cashless barter. Both parties inspect items and complete the exchange mutually without payments.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-semibold text-stone-600 hover:bg-cream-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || myItems.length === 0}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-brand-900 text-cream-50 hover:bg-brand-800 disabled:opacity-50 transition-all shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${submitting ? 'animate-spin' : ''}`} />
              {submitting ? 'Sending...' : 'Send Swap Proposal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
