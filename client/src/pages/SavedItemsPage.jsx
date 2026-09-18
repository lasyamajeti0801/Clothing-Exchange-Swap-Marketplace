import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { savedApi } from '../services/api.js';
import ClothingCard from '../components/ClothingCard.jsx';
import SwapRequestModal from '../components/SwapRequestModal.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function SavedItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSwapItem, setSelectedSwapItem] = useState(null);

  useEffect(() => {
    fetchSaved();
  }, []);

  const fetchSaved = async () => {
    setLoading(true);
    try {
      const res = await savedApi.getSaved();
      setItems(res.data?.data?.items || []);
    } catch (err) {
      console.error('Failed to load saved items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToggle = (id, isSaved) => {
    if (!isSaved) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal">
          Your Saved Wishlist
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Keep track of pieces you would love to trade for when you're ready.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-stone-400">Loading your saved items...</div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Browse sustainable garments and click the heart icon to bookmark potential swaps."
          actionText="Explore Clothes"
          actionLink="/clothes"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <ClothingCard
              key={item.id}
              item={item}
              isSaved={true}
              onSaveToggle={handleSaveToggle}
              onRequestSwap={(it) => setSelectedSwapItem(it)}
            />
          ))}
        </div>
      )}

      <SwapRequestModal
        targetItem={selectedSwapItem}
        isOpen={!!selectedSwapItem}
        onClose={() => setSelectedSwapItem(null)}
        onSuccess={() => alert('Swap proposal sent!')}
      />
    </div>
  );
}
