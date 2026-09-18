import React from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, ArrowLeft, Compass } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-cream-200 text-brand-900 mx-auto flex items-center justify-center">
          <RefreshCw className="w-10 h-10 text-brand-900" />
        </div>

        <div>
          <span className="text-4xl sm:text-5xl font-serif font-black text-brand-900">404</span>
          <h1 className="font-serif text-2xl font-bold text-charcoal mt-2">Garment Not Found</h1>
          <p className="text-xs text-stone-500 mt-2 leading-relaxed">
            The page or clothing item you are looking for has been moved, swapped, or does not exist.
          </p>
        </div>

        <div className="flex items-center justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-900 text-cream-50 hover:bg-brand-800 transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Return Home
          </Link>
          <Link
            to="/clothes"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider border border-cream-300 bg-white hover:bg-cream-100 text-stone-700 shadow-sm"
          >
            <Compass className="w-4 h-4 text-brand-700" /> Browse Closet
          </Link>
        </div>
      </div>
    </div>
  );
}
