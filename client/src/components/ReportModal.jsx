import React, { useState } from 'react';
import { X, ShieldAlert, AlertCircle } from 'lucide-react';
import { reportsApi } from '../services/api.js';

export default function ReportModal({ targetListing, targetUser, swapId, isOpen, onClose, onSuccess }) {
  const [reason, setReason] = useState('MISLEADING_DESCRIPTION');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Please provide details explaining your concern.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await reportsApi.createReport({
        reportedListingId: targetListing?.id,
        reportedUserId: targetUser?.id,
        swapId,
        reason,
        description,
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Report error:', err);
      setError(err.response?.data?.message || 'Failed to submit report.');
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
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-100 text-rose-600 mb-2">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-xl font-bold text-charcoal">Report Listing or Member</h2>
          <p className="text-xs text-stone-500 mt-1">
            Help maintain a trusted, safe sustainable fashion community.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Reason for Report
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-cream-300 focus:border-brand-900 focus:ring-1 focus:ring-brand-900 outline-none bg-white"
            >
              <option value="MISLEADING_DESCRIPTION">Misleading Description / Inaccurate Photos</option>
              <option value="WRONG_CONDITION">Condition Doesn't Match Claim</option>
              <option value="INAPPROPRIATE_CONTENT">Inappropriate or Commercial Content</option>
              <option value="FRAUDULENT_BEHAVIOR">Suspected Fraud or Scam</option>
              <option value="HARASSMENT">Unacceptable Behavior / Harassment</option>
              <option value="OTHER">Other Community Guideline Concern</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Explain the Issue
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide specific details so our administrative team can investigate promptly..."
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
              className="px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-rose-600 text-white hover:bg-rose-700 transition-all shadow-sm"
            >
              {submitting ? 'Submitting...' : 'File Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
