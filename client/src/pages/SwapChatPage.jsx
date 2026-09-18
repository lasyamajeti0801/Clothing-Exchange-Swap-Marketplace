import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Send,
  ArrowLeft,
  ArrowRightLeft,
  Check,
  X,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Shield,
  Clock,
  Edit,
} from 'lucide-react';
import { swapsApi, chatApi, clothesApi } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useSocket } from '../context/SocketContext.jsx';
import ReviewModal from '../components/ReviewModal.jsx';

export default function SwapChatPage() {
  const { swapId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket } = useSocket();

  const [swap, setSwap] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [counterModalOpen, setCounterModalOpen] = useState(false);
  const [myCloset, setMyCloset] = useState([]);
  const [selectedCounterItemId, setSelectedCounterItemId] = useState(null);
  const [counterNote, setCounterNote] = useState('');
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchSwapAndMessages();
  }, [swapId]);

  // Real-time socket events & joining room
  useEffect(() => {
    if (!socket || !swapId) return;

    socket.emit('join_swap', swapId);

    socket.on('new_message', (message) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === message.id)) return prev;
        return [...prev, message];
      });
      scrollToBottom();
    });

    return () => {
      socket.emit('leave_swap', swapId);
      socket.off('new_message');
    };
  }, [socket, swapId]);

  // Gentle polling fallback every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (swapId) {
        chatApi.getMessages(swapId).then((res) => {
          if (res.data?.data?.messages) {
            setMessages(res.data.data.messages);
          }
        });
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [swapId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchSwapAndMessages = async () => {
    setLoading(true);
    try {
      const [swapRes, msgsRes] = await Promise.all([
        swapsApi.getSwapById(swapId),
        chatApi.getMessages(swapId),
      ]);
      setSwap(swapRes.data?.data?.swap);
      setMessages(msgsRes.data?.data?.messages || []);
    } catch (err) {
      console.error('Error loading swap chat:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || sending) return;

    const text = inputText.trim();
    setInputText('');
    setSending(true);

    try {
      if (socket && socket.connected) {
        socket.emit('send_message', {
          swapId,
          content: text,
          messageType: 'TEXT',
        });
      } else {
        const res = await chatApi.sendMessage(swapId, { content: text });
        if (res.data?.data?.message) {
          setMessages((prev) => [...prev, res.data.data.message]);
        }
      }
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      await swapsApi.updateStatus(swapId, { status: newStatus });
      fetchSwapAndMessages();
    } catch (err) {
      console.error('Update status error:', err);
      alert(err.response?.data?.message || 'Failed to update swap status.');
    }
  };

  const handleMarkReady = async () => {
    try {
      const res = await swapsApi.markReady(swapId);
      if (res.data?.data?.isCompleted) {
        alert('🎉 Both parties marked ready! Swap is COMPLETED!');
        setIsReviewOpen(true);
      } else {
        alert('Marked ready! Waiting for swap partner to confirm.');
      }
      fetchSwapAndMessages();
    } catch (err) {
      console.error('Error marking ready:', err);
    }
  };

  const openCounterOfferModal = async () => {
    setCounterModalOpen(true);
    try {
      const res = await clothesApi.getClothes({ ownerId: user.id, status: 'ACTIVE' });
      const items = res.data?.data?.items || [];
      setMyCloset(items);
      if (items.length > 0) setSelectedCounterItemId(items[0].id);
    } catch (err) {
      console.error('Failed to load closet:', err);
    }
  };

  const submitCounterOffer = async (e) => {
    e.preventDefault();
    try {
      await swapsApi.counterOffer(swapId, {
        newOfferedItemId: selectedCounterItemId,
        note: counterNote,
      });
      setCounterModalOpen(false);
      setCounterNote('');
      fetchSwapAndMessages();
    } catch (err) {
      console.error('Counter offer error:', err);
      alert('Failed to submit counter-offer.');
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-xs text-stone-400">Loading negotiation chat...</div>;
  }

  if (!swap) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <p className="text-sm text-stone-600 mb-4">Swap negotiation not found.</p>
        <Link to="/swaps" className="text-xs font-bold text-brand-900 underline">
          Return to My Swaps
        </Link>
      </div>
    );
  }

  const isSender = user?.id === swap.senderId;
  const otherUser = isSender ? swap.receiver : swap.sender;
  const myItem = isSender ? swap.offeredItem : swap.requestedItem;
  const theirItem = isSender ? swap.requestedItem : swap.offeredItem;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-cream-300 mb-4">
        <Link
          to="/swaps"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-brand-900"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Swaps
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Status:</span>
          <span className="text-xs font-bold text-brand-900 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            {swap.status.replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(82vh-4rem)]">
        {/* Left / Sidebar: Swap Context & Fast Actions */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-cream-300 shadow-sm flex flex-col justify-between overflow-y-auto space-y-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-cream-200">
              <img
                src={otherUser?.avatarUrl || 'https://api.dicebear.com/7.x/initials/svg?seed=User'}
                alt=""
                className="w-12 h-12 rounded-full object-cover bg-stone-200"
              />
              <div>
                <h3 className="font-serif font-bold text-base text-charcoal">{otherUser?.name}</h3>
                <p className="text-xs text-stone-500">{otherUser?.city} · ★ {otherUser?.rating?.toFixed(1) || '5.0'}</p>
              </div>
            </div>

            {/* Side-by-side items preview */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block">
                Negotiation Context
              </span>

              {/* Your Item */}
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-cream-100 border border-cream-200">
                <img
                  src={myItem?.images?.[0]?.url || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200'}
                  alt=""
                  className="w-12 h-12 rounded-lg object-cover bg-stone-200"
                />
                <div className="truncate">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-brand-900 block">
                    You Offer
                  </span>
                  <p className="text-xs font-bold text-charcoal truncate">{myItem?.title}</p>
                  <p className="text-[11px] text-stone-500">₹{myItem?.estimatedValue} · {myItem?.size}</p>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <ArrowRightLeft className="w-4 h-4 text-brand-900" />
              </div>

              {/* Their Item */}
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-cream-100 border border-cream-200">
                <img
                  src={theirItem?.images?.[0]?.url || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200'}
                  alt=""
                  className="w-12 h-12 rounded-lg object-cover bg-stone-200"
                />
                <div className="truncate">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-stone-500 block">
                    You Receive
                  </span>
                  <p className="text-xs font-bold text-charcoal truncate">{theirItem?.title}</p>
                  <p className="text-[11px] text-stone-500">₹{theirItem?.estimatedValue} · {theirItem?.size}</p>
                </div>
              </div>
            </div>

            {/* Handover method info */}
            <div className="p-3 bg-brand-50/60 rounded-xl text-xs text-brand-950 border border-brand-200 space-y-1">
              <span className="font-bold text-[10px] uppercase tracking-wider">Exchange Method</span>
              <p className="text-[11px] text-stone-600">
                {swap.exchangeMethod === 'LOCAL_MEETUP' ? '📍 In-Person Neighborhood Meetup' : '📦 Courier Postal Shipping'}
              </p>
            </div>
          </div>

          {/* Quick Negotiation Actions */}
          <div className="pt-3 border-t border-cream-200 space-y-2">
            {['PENDING', 'NEGOTIATING'].includes(swap.status) && (
              <>
                <button
                  onClick={openCounterOfferModal}
                  className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-cream-200 text-charcoal hover:bg-cream-300 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Edit className="w-3.5 h-3.5 text-brand-900" /> Propose Alternative Item
                </button>

                <button
                  onClick={() => handleUpdateStatus('ACCEPTED')}
                  className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-emerald-700 text-white hover:bg-emerald-800 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Accept Terms
                </button>

                <button
                  onClick={() => handleUpdateStatus('REJECTED')}
                  className="w-full py-2 rounded-xl text-xs font-semibold text-rose-700 hover:bg-rose-50 transition-colors"
                >
                  Decline Proposal
                </button>
              </>
            )}

            {['ACCEPTED', 'SHIPPING', 'READY_FOR_EXCHANGE'].includes(swap.status) && (
              <button
                onClick={handleMarkReady}
                className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-brand-900 text-cream-50 hover:bg-brand-800 transition-colors shadow-md flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-sage" />
                Confirm Exchange Received
              </button>
            )}

            {swap.status === 'COMPLETED' && (
              <button
                onClick={() => setIsReviewOpen(true)}
                className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-900 hover:bg-amber-200 transition-colors"
              >
                ★ Leave Partner Review
              </button>
            )}
          </div>
        </div>

        {/* Right: Real-Time Chat Message Stream */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-cream-300 shadow-sm flex flex-col justify-between overflow-hidden">
          {/* Chat Messages */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.map((msg) => {
              const isMe = msg.senderId === user?.id;

              if (msg.messageType === 'STATUS_CHANGE' || msg.messageType === 'OFFER_MODIFIED') {
                return (
                  <div key={msg.id} className="flex justify-center my-2">
                    <div className="bg-cream-100 border border-cream-300 text-stone-600 px-4 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-brand-900" />
                      <span>{msg.content}</span>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  {!isMe && (
                    <img
                      src={msg.sender?.avatarUrl || 'https://api.dicebear.com/7.x/initials/svg?seed=User'}
                      alt=""
                      className="w-7 h-7 rounded-full object-cover bg-stone-200 mb-1"
                    />
                  )}

                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs shadow-sm ${
                      isMe
                        ? 'bg-brand-900 text-cream-50 rounded-br-none'
                        : 'bg-cream-100 text-charcoal border border-cream-200 rounded-bl-none'
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    <span
                      className={`text-[9px] block text-right mt-1 opacity-70`}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t border-cream-200 bg-cream-50 flex items-center gap-3"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message ${otherUser?.name}... discuss fit, meeting spot, or counter-offers`}
              className="flex-1 text-xs p-3 rounded-full bg-white border border-cream-300 focus:border-brand-900 focus:ring-1 focus:ring-brand-900 outline-none shadow-sm"
            />
            <button
              type="submit"
              disabled={sending || !inputText.trim()}
              className="w-10 h-10 rounded-full bg-brand-900 text-cream-50 hover:bg-brand-800 disabled:opacity-40 transition-colors flex items-center justify-center shrink-0 shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Counter-Offer Alternative Item Modal */}
      {counterModalOpen && (
        <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-cream-300">
            <h3 className="font-serif text-xl font-bold text-charcoal mb-1">Propose Counter-Offer</h3>
            <p className="text-xs text-stone-500 mb-4">
              Select another garment from your wardrobe to offer instead.
            </p>

            <form onSubmit={submitCounterOffer} className="space-y-4">
              <div className="max-h-48 overflow-y-auto space-y-2">
                {myCloset.map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border text-xs cursor-pointer ${
                      selectedCounterItemId === item.id
                        ? 'border-brand-900 bg-brand-50 font-semibold'
                        : 'border-cream-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="counterItem"
                      checked={selectedCounterItemId === item.id}
                      onChange={() => setSelectedCounterItemId(item.id)}
                    />
                    <img
                      src={item.images?.[0]?.url || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=100'}
                      alt=""
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div className="truncate">
                      <p className="text-charcoal truncate">{item.title}</p>
                      <p className="text-[10px] text-stone-500">{item.brand} · ₹{item.estimatedValue}</p>
                    </div>
                  </label>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Reason / Note for Alternative Offer
                </label>
                <textarea
                  rows={2}
                  value={counterNote}
                  onChange={(e) => setCounterNote(e.target.value)}
                  placeholder="e.g. Would you consider this jacket instead? It's closer in value."
                  className="w-full text-xs p-2.5 rounded-xl border border-cream-300 outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCounterModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs text-stone-600 hover:bg-cream-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full text-xs font-bold bg-brand-900 text-cream-50 hover:bg-brand-800"
                >
                  Send Counter-Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal */}
      <ReviewModal
        swap={swap}
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        onSuccess={() => alert('Review submitted!')}
      />
    </div>
  );
}
