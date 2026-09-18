import React, { useState } from 'react';
import { X, Star, AlertCircle, CheckCircle2 } from 'lucide-react';
import { reviewsApi } from '../services/api.js';

export default function ReviewModal({ swap, isOpen, onClose, onSuccess }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !swap) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await reviewsApi.createReview({
        swapId: swap.id,
        rating,
        comment,
      });

      if (onSuccess) onSuccess(res.data?.data?.review);
      onClose();
    } catch (err) {
      console.error('Submit review error:', err);
      setError(err.response?.data?.message || 'Unable to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-cream-300 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-charcoal hover:bg-cream-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 text-amber-600 mb-2">
            <Star className="w-6 h-6 fill-current" />
          </div>
          <h2 className="font-serif text-xl font-bold text-charcoal">Leave Swap Feedback</h2>
          <p className="text-xs text-stone-500 mt-1">
            How was your exchange experience with your swap partner?
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center justify-center gap-2 py-2">
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 text-2xl transition-transform hover:scale-125 focus:outline-none"
                >
                  <Star
                    className={`w-7 h-7 ${
                      (hoverRating || rating) >= star
                        ? 'text-amber-500 fill-amber-500'
                        : 'text-stone-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-semibold text-stone-600">
              {rating === 5 && 'Outstanding Experience! ⭐⭐⭐⭐⭐'}
              {rating === 4 && 'Great Exchange ⭐⭐⭐⭐'}
              {rating === 3 && 'Average Handover ⭐⭐⭐'}
              {rating === 2 && 'Could Have Been Better ⭐⭐'}
              {rating === 1 && 'Unsatisfactory Exchange ⭐'}
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Review Comment (Optional)
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="e.g. Garment was in mint condition, communication was quick and friendly!"
              className="w-full text-xs p-3 rounded-xl border border-cream-300 focus:border-brand-900 focus:ring-1 focus:ring-brand-900 outline-none resize-none"
            />
          </div>

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
              disabled={submitting}
              className="px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-brand-900 text-cream-50 hover:bg-brand-800 transition-all shadow-sm"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
