import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  RefreshCw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Leaf,
  Droplets,
  Wind,
  MapPin,
  CheckCircle2,
  Calculator,
  Compass,
} from 'lucide-react';
import { clothesApi } from '../services/api.js';
import ClothingCard from '../components/ClothingCard.jsx';
import SwapRequestModal from '../components/SwapRequestModal.jsx';
import ValueCalculatorModal from '../components/ValueCalculatorModal.jsx';
import { GridSkeleton } from '../components/SkeletonLoader.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function LandingPage() {
  const { isLoggedIn } = useAuth();
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSwapItem, setSelectedSwapItem] = useState(null);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  useEffect(() => {
    clothesApi
      .getClothes({ limit: 8, sort: 'newest' })
      .then((res) => {
        setFeaturedItems(res.data?.data?.items || []);
      })
      .catch((err) => console.error('Failed to load featured clothes:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleRequestSwap = (item) => {
    if (!isLoggedIn) {
      window.location.href = '/login';
      return;
    }
    setSelectedSwapItem(item);
  };

  return (
    <div className="space-y-24">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:py-28 bg-gradient-to-b from-cream-100/80 via-cream-50 to-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100 border border-brand-200 text-brand-900 text-xs font-semibold uppercase tracking-wider">
                <Leaf className="w-3.5 h-3.5 text-brand-700" />
                <span>Sustainable Barter Revolution</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-brand-950 tracking-tight leading-[1.15]">
                Swap Instead of Shop.
                <br />
                <span className="text-brand-700 font-normal italic">
                  Give Unworn Clothes a Second Life.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-stone-600 max-w-2xl font-normal leading-relaxed mx-auto lg:mx-0">
                Join India's dedicated zero-cash clothing exchange. Barter authentic jackets, kurtas, handloom sarees, and streetwear directly with mindful fashion lovers. No retail markup. No textile waste.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/clothes"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-semibold uppercase tracking-wider bg-brand-900 text-cream-50 hover:bg-brand-800 hover:shadow-lg transition-all active:scale-95 shadow-md"
                >
                  <Compass className="w-4 h-4 text-sage" />
                  Browse Active Closet
                </Link>

                <Link
                  to="/list"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-semibold uppercase tracking-wider bg-white text-brand-950 border border-brand-900 hover:bg-cream-100 transition-all active:scale-95"
                >
                  List an Item to Swap
                </Link>

                <button
                  onClick={() => setIsCalculatorOpen(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full text-xs font-semibold text-stone-600 hover:text-brand-900 hover:bg-cream-200 transition-colors"
                >
                  <Calculator className="w-4 h-4 text-terracotta" />
                  Valuation Estimator
                </button>
              </div>

              {/* Trust & Location Pills */}
              <div className="pt-6 border-t border-cream-300 grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <p className="font-serif text-xl font-bold text-brand-950">100%</p>
                  <p className="text-[11px] text-stone-500 uppercase tracking-wider">Cashless Trades</p>
                </div>
                <div>
                  <p className="font-serif text-xl font-bold text-brand-950">50+ Hubs</p>
                  <p className="text-[11px] text-stone-500 uppercase tracking-wider">Hyderabad · Vijayawada · Guntur</p>
                </div>
                <div>
                  <p className="font-serif text-xl font-bold text-brand-950">Verified</p>
                  <p className="text-[11px] text-stone-500 uppercase tracking-wider">Algorithmic Match Engine</p>
                </div>
              </div>
            </div>

            {/* Editorial Hero Visual Collage */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80"
                    alt="Vintage Denim Jacket"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Floating Exchange Badge */}
                <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-cream-300 max-w-xs flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="w-10 h-10 rounded-full bg-brand-900 text-cream-50 flex items-center justify-center shrink-0">
                    <RefreshCw className="w-5 h-5 text-sage" />
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-charcoal">Levi's Denim ⇄ H&M Hoodie</p>
                    <p className="text-[11px] text-emerald-700 font-medium">★ Close Match · ₹150 diff</p>
                  </div>
                </div>

                {/* Second Floating Badge */}
                <div className="hidden sm:flex absolute -top-4 -right-4 bg-brand-900 text-cream-50 rounded-2xl p-3.5 shadow-xl items-center gap-2.5 text-xs font-semibold">
                  <Leaf className="w-4 h-4 text-sage" />
                  <span>2,700L Water Saved Per Garment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. How It Works (4 Interactive Steps) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-700">Circular Fashion Blueprint</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal mt-2">
            How Clothing Swapping Works
          </h2>
          <p className="text-sm text-stone-500 mt-3">
            Pure peer-to-peer barter. Zero online payment gateway. Complete transparency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-3xl border border-cream-300 hover:shadow-md transition-shadow relative">
            <span className="text-4xl font-serif font-black text-brand-200">01</span>
            <h3 className="font-serif text-lg font-bold text-charcoal mt-3 mb-2">List Your Closet</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Upload photos of clean clothes you no longer wear. Our rule-based valuation engine automatically suggests an equitable swap benchmark.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-cream-300 hover:shadow-md transition-shadow relative">
            <span className="text-4xl font-serif font-black text-brand-200">02</span>
            <h3 className="font-serif text-lg font-bold text-charcoal mt-3 mb-2">Discover & Compare</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Browse garments across categories, brands, and local clusters (Hyderabad, Vijayawada, Mangalagiri, Guntur). View real-time value differences.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-cream-300 hover:shadow-md transition-shadow relative">
            <span className="text-4xl font-serif font-black text-brand-200">03</span>
            <h3 className="font-serif text-lg font-bold text-charcoal mt-3 mb-2">Propose & Negotiate</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Pick an item from your wardrobe to offer in return. Chat in real-time, modify counter-offers, and decide on local meetup or courier shipping.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-cream-300 hover:shadow-md transition-shadow relative">
            <span className="text-4xl font-serif font-black text-brand-200">04</span>
            <h3 className="font-serif text-lg font-bold text-charcoal mt-3 mb-2">Exchange & Review</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Confirm the handover, mark the exchange completed, and leave an authentic review to build community trust and track your environmental diversion.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Featured Clothing Listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-700">Curated Wardrobe</span>
            <h2 className="font-serif text-3xl font-bold text-charcoal mt-1">Recently Listed for Swap</h2>
          </div>
          <Link
            to="/clothes"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-900 hover:text-brand-700 mt-2 sm:mt-0"
          >
            <span>Explore All 50+ Listings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <GridSkeleton count={8} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredItems.map((item) => (
              <ClothingCard
                key={item.id}
                item={item}
                onRequestSwap={handleRequestSwap}
              />
            ))}
          </div>
        )}
      </section>

      {/* 4. Environmental Impact Banner */}
      <section className="bg-brand-900 text-cream-50 rounded-3xl max-w-7xl mx-auto px-6 py-14 relative overflow-hidden shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-8 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-sage">The Real Cost of Fast Fashion</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-snug">
              Every garment swapped saves 2,700 liters of freshwater and eliminates 2.5 kg of greenhouse emissions.
            </h2>
            <p className="text-xs text-cream-300 max-w-xl leading-relaxed">
              By exchanging wearable clothes rather than buying virgin cotton or throwing them into landfills, our community directly participates in a circular wardrobe economy.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4">
            <button
              onClick={() => setIsCalculatorOpen(true)}
              className="px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider bg-cream-50 text-brand-950 hover:bg-cream-100 transition-all shadow-md text-center"
            >
              Open Valuation Calculator
            </button>
            <Link
              to="/list"
              className="px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider border border-sage text-cream-50 hover:bg-brand-800 transition-all text-center"
            >
              List an Item Today
            </Link>
          </div>
        </div>
      </section>

      {/* Modals */}
      <SwapRequestModal
        targetItem={selectedSwapItem}
        isOpen={!!selectedSwapItem}
        onClose={() => setSelectedSwapItem(null)}
        onSuccess={(swap) => {
          alert('Swap proposal sent successfully! Check your Swaps tab to follow up in chat.');
        }}
      />

      <ValueCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />
    </div>
  );
}
