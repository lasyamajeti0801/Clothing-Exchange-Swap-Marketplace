import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  RefreshCw,
  ArrowRightLeft,
  MessageSquare,
  Check,
  X,
  Clock,
  Truck,
  CheckCircle2,
  AlertCircle,
  Star,
  ShieldAlert,
} from 'lucide-react';
import { swapsApi } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import ReviewModal from '../components/ReviewModal.jsx';
import ReportModal from '../components/ReportModal.jsx';
import EmptyState from '../components/EmptyState.jsx';

const TABS = [
  { id: 'all', label: 'All Swaps' },
  { id: 'incoming', label: 'Incoming' },
  { id: 'outgoing', label: 'Outgoing' },
  { id: 'active', label: 'Active & In-Progress' },
  { id: 'completed', label: 'Completed' },
  { id: 'rejected', label: 'Rejected / Cancelled' },
];

export default function SwapManagementPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'all';

  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSwapForReview, setSelectedSwapForReview] = useState(null);
  const [selectedSwapForReport, setSelectedSwapForReport] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchSwaps();
  }, [activeTab]);

  const fetchSwaps = async () => {
    setLoading(true);
    try {
      const res = await swapsApi.getUserSwaps(activeTab);
      setSwaps(res.data?.data?.swaps || []);
    } catch (err) {
      console.error('Failed to load swaps:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (swapId, newStatus) => {
    if (!window.confirm(`Are you sure you want to change this swap status to ${newStatus}?`)) {
      return;
    }
    setActionLoading(true);
    try {
      await swapsApi.updateStatus(swapId, { status: newStatus });
      fetchSwaps();
    } catch (err) {
      console.error('Update status error:', err);
      alert(err.response?.data?.message || 'Failed to update swap status.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkReady = async (swapId) => {
    setActionLoading(true);
    try {
      const res = await swapsApi.markReady(swapId);
      if (res.data?.data?.isCompleted) {
        alert('🎉 Both parties confirmed! The swap has been COMPLETED!');
      } else {
        alert('You marked yourself ready! Waiting for partner confirmation.');
      }
      fetchSwaps();
    } catch (err) {
      console.error('Error marking ready:', err);
      alert('Failed to mark ready.');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return { label: 'Proposal Pending', bg: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'NEGOTIATING':
        return { label: 'In Negotiation', bg: 'bg-blue-50 text-blue-800 border-blue-200' };
      case 'ACCEPTED':
        return { label: 'Offer Accepted', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'SHIPPING':
        return { label: 'Courier Shipping', bg: 'bg-purple-50 text-purple-800 border-purple-200' };
      case 'READY_FOR_EXCHANGE':
        return { label: 'Ready for Handover', bg: 'bg-teal-50 text-teal-800 border-teal-200' };
      case 'COMPLETED':
        return { label: 'Completed Swap', bg: 'bg-brand-50 text-brand-900 border-brand-300' };
      case 'REJECTED':
        return { label: 'Declined', bg: 'bg-rose-50 text-rose-800 border-rose-200' };
      case 'CANCELLED':
        return { label: 'Cancelled', bg: 'bg-stone-100 text-stone-600 border-stone-200' };
      case 'DISPUTED':
        return { label: 'Under Dispute', bg: 'bg-red-50 text-red-900 border-red-300' };
      default:
        return { label: status, bg: 'bg-stone-100 text-stone-600 border-stone-200' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal">
          Swap Request Exchange
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Review incoming offers, negotiate counter-proposals, and track completed sustainable trades.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-cream-300">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSearchParams({ tab: tab.id })}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-brand-900 text-cream-50'
                : 'bg-white border border-cream-300 text-stone-700 hover:bg-cream-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Swaps List */}
      {loading ? (
        <div className="py-20 text-center text-xs text-stone-400">Loading your swap proposals...</div>
      ) : swaps.length === 0 ? (
        <EmptyState
          title="No swaps found in this category"
          description="Browse the marketplace and propose an exchange to get circular items moving."
          actionText="Discover Clothes to Swap"
          actionLink="/clothes"
        />
      ) : (
        <div className="space-y-6">
          {swaps.map((swap) => {
            const isSender = user?.id === swap.senderId;
            const otherUser = isSender ? swap.receiver : swap.sender;
            const myItem = isSender ? swap.offeredItem : swap.requestedItem;
            const theirItem = isSender ? swap.requestedItem : swap.offeredItem;
            const badge = getStatusBadge(swap.status);
            const valueDiff = Math.abs((myItem?.estimatedValue || 0) - (theirItem?.estimatedValue || 0));

            return (
              <div
                key={swap.id}
                className="bg-white rounded-3xl p-6 border border-cream-300 shadow-sm hover:shadow-md transition-shadow space-y-5"
              >
                {/* Header row: Partner & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-cream-200">
                  <div className="flex items-center gap-3">
                    <img
                      src={otherUser?.avatarUrl || 'https://api.dicebear.com/7.x/initials/svg?seed=User'}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover bg-stone-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-stone-500 font-medium">
                          {isSender ? 'Outgoing proposal to' : 'Incoming proposal from'}
                        </span>
                        <Link
                          to={`/users/${otherUser?.id}`}
                          className="font-serif font-bold text-sm text-charcoal hover:text-brand-900"
                        >
                          {otherUser?.name}
                        </Link>
                      </div>
                      <p className="text-[11px] text-stone-400">
                        {otherUser?.city} · Handover: {swap.exchangeMethod === 'LOCAL_MEETUP' ? 'Local Meetup' : 'Shipping'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${badge.bg}`}>
                      {badge.label}
                    </span>
                  </div>
                </div>

                {/* Items Comparison Box */}
                <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center bg-cream-100/70 p-4 rounded-2xl border border-cream-300">
                  {/* Left: Your Item */}
                  <div className="md:col-span-3 flex items-center gap-3 bg-white p-3 rounded-xl border border-cream-200 shadow-sm">
                    <img
                      src={myItem?.images?.[0]?.url || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200'}
                      alt=""
                      className="w-14 h-14 rounded-lg object-cover bg-stone-100"
                    />
                    <div className="truncate">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-brand-900 block">
                        Your Garment
                      </span>
                      <p className="font-serif font-bold text-xs text-charcoal truncate">{myItem?.title}</p>
                      <p className="text-[11px] text-stone-500">{myItem?.brand} · {myItem?.size}</p>
                      <p className="text-xs font-semibold text-brand-900">₹{myItem?.estimatedValue}</p>
                    </div>
                  </div>

                  {/* Arrow & Difference */}
                  <div className="md:col-span-1 flex flex-col items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-brand-900 text-cream-50 flex items-center justify-center">
                      <ArrowRightLeft className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] text-stone-500 font-medium mt-1">
                      Δ ₹{valueDiff}
                    </span>
                  </div>

                  {/* Right: Their Item */}
                  <div className="md:col-span-3 flex items-center gap-3 bg-white p-3 rounded-xl border border-cream-200 shadow-sm">
                    <img
                      src={theirItem?.images?.[0]?.url || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200'}
                      alt=""
                      className="w-14 h-14 rounded-lg object-cover bg-stone-100"
                    />
                    <div className="truncate">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-stone-400 block">
                        Their Garment
                      </span>
                      <p className="font-serif font-bold text-xs text-charcoal truncate">{theirItem?.title}</p>
                      <p className="text-[11px] text-stone-500">{theirItem?.brand} · {theirItem?.size}</p>
                      <p className="text-xs font-semibold text-brand-900">₹{theirItem?.estimatedValue}</p>
                    </div>
                  </div>
                </div>

                {/* Offer Note / Latest Chat Preview */}
                {swap.message && (
                  <div className="text-xs text-stone-600 bg-white p-3 rounded-xl border border-cream-200 italic">
                    "{swap.message}"
                  </div>
                )}

                {/* Action Buttons Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/chat/${swap.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-900 text-cream-50 hover:bg-brand-800 transition-colors shadow-sm"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-sage" />
                      Open Negotiation Chat
                    </Link>

                    {swap.status !== 'COMPLETED' && swap.status !== 'REJECTED' && swap.status !== 'CANCELLED' && (
                      <button
                        onClick={() => setSelectedSwapForReport(swap)}
                        className="p-2 text-stone-400 hover:text-rose-600 transition-colors"
                        title="Report Issue"
                      >
                        <ShieldAlert className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Contextual State Actions */}
                  <div className="flex items-center gap-2">
                    {/* Incoming Pending Actions */}
                    {!isSender && swap.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(swap.id, 'ACCEPTED')}
                          disabled={actionLoading}
                          className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-800 transition-colors shadow-sm"
                        >
                          <Check className="w-3.5 h-3.5" /> Accept Proposal
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(swap.id, 'REJECTED')}
                          disabled={actionLoading}
                          className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-xs font-bold border border-rose-300 text-rose-700 hover:bg-rose-50 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" /> Decline
                        </button>
                      </>
                    )}

                    {/* Active In-Progress Handover Actions */}
                    {['ACCEPTED', 'SHIPPING', 'READY_FOR_EXCHANGE'].includes(swap.status) && (
                      <>
                        <button
                          onClick={() => handleMarkReady(swap.id)}
                          disabled={actionLoading}
                          className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-xs font-bold bg-brand-900 text-cream-50 hover:bg-brand-800 transition-colors shadow-sm"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-sage" />
                          Confirm & Complete Handover
                        </button>
                      </>
                    )}

                    {/* Completed Actions */}
                    {swap.status === 'COMPLETED' && (
                      <button
                        onClick={() => setSelectedSwapForReview(swap)}
                        className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-xs font-bold bg-amber-50 border border-amber-300 text-amber-900 hover:bg-amber-100 transition-colors shadow-sm"
                      >
                        <Star className="w-3.5 h-3.5 fill-current text-amber-600" />
                        Leave Review
                      </button>
                    )}

                    {/* Outgoing Cancel */}
                    {isSender && ['PENDING', 'NEGOTIATING'].includes(swap.status) && (
                      <button
                        onClick={() => handleUpdateStatus(swap.id, 'CANCELLED')}
                        disabled={actionLoading}
                        className="px-3.5 py-2 rounded-full text-xs font-semibold text-stone-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                      >
                        Cancel Proposal
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review Modal */}
      <ReviewModal
        swap={selectedSwapForReview}
        isOpen={!!selectedSwapForReview}
        onClose={() => setSelectedSwapForReview(null)}
        onSuccess={() => {
          alert('Review submitted! Thank you for supporting community trust.');
        }}
      />

      {/* Report Issue Modal */}
      <ReportModal
        swapId={selectedSwapForReport?.id}
        isOpen={!!selectedSwapForReport}
        onClose={() => setSelectedSwapForReport(null)}
        onSuccess={() => {
          alert('Issue reported to ReWear moderation.');
        }}
      />
    </div>
  );
}
