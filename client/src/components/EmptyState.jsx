import React from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, PlusCircle, Compass } from 'lucide-react';

export default function EmptyState({
  icon: Icon = RefreshCw,
  title = 'Nothing here yet',
  description = 'Start browsing sustainable fashion and find something worth swapping.',
  actionText = 'Browse Clothes',
  actionLink = '/clothes',
  onActionClick,
}) {
  return (
    <div className="bg-white rounded-3xl border border-cream-300 p-12 text-center max-w-lg mx-auto my-8">
      <div className="w-16 h-16 rounded-full bg-cream-100 text-brand-900 mx-auto flex items-center justify-center mb-4 border border-cream-300">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="font-serif text-xl font-bold text-charcoal">{title}</h3>
      <p className="text-xs text-stone-500 mt-2 leading-relaxed max-w-sm mx-auto">
        {description}
      </p>

      {actionText && (
        <div className="mt-6">
          {actionLink ? (
            <Link
              to={actionLink}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-brand-900 text-cream-50 hover:bg-brand-800 transition-all shadow-sm"
            >
              {actionText}
            </Link>
          ) : (
            <button
              onClick={onActionClick}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-brand-900 text-cream-50 hover:bg-brand-800 transition-all shadow-sm"
            >
              {actionText}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
