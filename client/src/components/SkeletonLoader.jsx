import React from 'react';

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-cream-300 overflow-hidden animate-pulse">
      <div className="aspect-[4/5] bg-cream-200" />
      <div className="p-4 space-y-2.5">
        <div className="flex justify-between">
          <div className="h-3 w-16 bg-cream-200 rounded" />
          <div className="h-3 w-12 bg-cream-200 rounded" />
        </div>
        <div className="h-4 w-3/4 bg-cream-200 rounded" />
        <div className="h-3 w-1/2 bg-cream-200 rounded" />
        <div className="pt-3 border-t border-cream-200 flex justify-between items-center">
          <div className="h-6 w-20 bg-cream-200 rounded-full" />
          <div className="h-6 w-16 bg-cream-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
