import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCheck, RefreshCw, MessageSquare, Star, ArrowRight } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  const getIcon = (type) => {
    switch (type) {
      case 'SWAP_REQUEST':
      case 'SWAP_ACCEPTED':
      case 'SWAP_COMPLETED':
        return <RefreshCw className="w-4 h-4 text-brand-700" />;
      case 'MESSAGE':
        return <MessageSquare className="w-4 h-4 text-blue-600" />;
      default:
        return <Bell className="w-4 h-4 text-terracotta" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-charcoal">Notification Center</h1>
          <p className="text-xs text-stone-500 mt-1">
            Stay updated on new swap proposals, incoming messages, and exchange progress.
          </p>
        </div>

        {notifications.some((n) => !n.isRead) && (
          <button
            onClick={markAllAsRead}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-cream-200 text-charcoal hover:bg-cream-300 transition-colors"
          >
            <CheckCheck className="w-4 h-4" /> Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications yet"
          description="When other members request your items or send messages, they will show up here."
          actionText="Browse Marketplace"
          actionLink="/clothes"
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markAsRead(notif.id)}
              className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                notif.isRead
                  ? 'bg-white border-cream-300 opacity-80'
                  : 'bg-brand-50/60 border-brand-200 shadow-sm'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-full bg-white border border-cream-300 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  {getIcon(notif.type)}
                </div>

                <div className="space-y-1">
                  <h3 className="font-serif font-bold text-sm text-charcoal">{notif.title}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">{notif.message}</p>
                  <span className="text-[10px] text-stone-400 block mt-1">
                    {new Date(notif.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {notif.link && (
                <Link
                  to={notif.link}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-900 text-cream-50 hover:bg-brand-800 shrink-0 self-center"
                >
                  <span>View</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
