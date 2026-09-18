import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  RefreshCw,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Calculator,
} from 'lucide-react';
import { clothesApi } from '../services/api.js';
import ClothingCard from '../components/ClothingCard.jsx';
import SwapRequestModal from '../components/SwapRequestModal.jsx';
import ValueCalculatorModal from '../components/ValueCalculatorModal.jsx';
import { GridSkeleton } from '../components/SkeletonLoader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const CATEGORIES = [
  'All',
  'Jackets',
  'Kurtas',
  'Sarees',
  'Hoodies',
  'Jeans',
  'Dresses',
  'Shirts',
  'T-Shirts',
  'Trousers',
  'Sweaters',
  'Sportswear',
  'Tops',
];

const CITIES = ['All', 'Hyderabad', 'Vijayawada', 'Mangalagiri', 'Guntur', 'Bengaluru', 'Mumbai', 'Delhi'];

export default function BrowseClothesPage() {
  const { isLoggedIn } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  // Filter states
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [city, setCity] = useState(searchParams.get('city') || 'All');
  const [condition, setCondition] = useState(searchParams.get('condition') || 'All');
  const [size, setSize] = useState(searchParams.get('size') || 'All');
  const [brand, setBrand] = useState(searchParams.get('brand') || '');
  const [minVal, setMinVal] = useState(searchParams.get('minVal') || '');
  const [maxVal, setMaxVal] = useState(searchParams.get('maxVal') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(parseInt(searchParams.get('page'), 10) || 1);

  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [selectedSwapItem, setSelectedSwapItem] = useState(null);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  // Debounced search fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchListings();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, category, city, condition, size, brand, minVal, maxVal, sort, page]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 12,
        sort,
      };
      if (search.trim()) params.search = search.trim();
      if (category !== 'All') params.category = category;
      if (city !== 'All') params.city = city;
      if (condition !== 'All') params.condition = condition;
      if (size !== 'All') params.size = size;
      if (brand.trim()) params.brand = brand.trim();
      if (minVal) params.minVal = minVal;
      if (maxVal) params.maxVal = maxVal;

      const res = await clothesApi.getClothes(params);
      if (res.data?.data) {
        setItems(res.data.data.items || []);
        setPagination(res.data.data.pagination || { page: 1, totalPages: 1, total: 0 });
      }
    } catch (err) {
      console.error('Error browsing clothes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setCity('All');
    setCondition('All');
    setSize('All');
    setBrand('');
    setMinVal('');
    setMaxVal('');
    setSort('newest');
    setPage(1);
  };

  const handleRequestSwap = (item) => {
    if (!isLoggedIn) {
      window.location.href = '/login';
      return;
    }
    setSelectedSwapItem(item);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal">
            Browse Clothes
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Discover {pagination.total} pre-loved wearable garments ready for direct barter.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCalculatorOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full text-xs font-semibold border border-cream-300 bg-white hover:bg-cream-100 text-stone-700 shadow-sm"
          >
            <Calculator className="w-4 h-4 text-terracotta" />
            <span>Valuation Estimator</span>
          </button>

          <button
            onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
            className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold border shadow-sm transition-colors ${
              filterDrawerOpen
                ? 'bg-brand-900 text-cream-50 border-brand-900'
                : 'bg-white text-stone-700 border-cream-300 hover:bg-cream-100'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>

          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
            className="text-xs p-2.5 rounded-full border border-cream-300 bg-white text-stone-700 outline-none shadow-sm"
          >
            <option value="newest">Recently Added</option>
            <option value="value_asc">Swap Value: Low to High</option>
            <option value="value_desc">Swap Value: High to Low</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search by garment title, brand (e.g. Zara, Levi's, FabIndia), fabric or style..."
          className="w-full text-sm pl-12 pr-10 py-3.5 rounded-2xl bg-white border border-cream-300 focus:border-brand-900 focus:ring-1 focus:ring-brand-900 outline-none shadow-sm"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-charcoal"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setCategory(cat);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all shadow-sm ${
              category === cat
                ? 'bg-brand-900 text-cream-50'
                : 'bg-white border border-cream-300 text-stone-700 hover:bg-cream-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Expandable Filter Drawer */}
      {filterDrawerOpen && (
        <div className="bg-white p-6 rounded-3xl border border-cream-300 shadow-md space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-cream-200">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal">
              Refine Search Criteria
            </span>
            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-terracotta hover:underline"
            >
              Reset All Filters
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* City Hub */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                Regional Hub / City
              </label>
              <select
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setPage(1);
                }}
                className="w-full text-xs p-2.5 rounded-xl border border-cream-300 bg-white"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Condition */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                Condition
              </label>
              <select
                value={condition}
                onChange={(e) => {
                  setCondition(e.target.value);
                  setPage(1);
                }}
                className="w-full text-xs p-2.5 rounded-xl border border-cream-300 bg-white"
              >
                <option value="All">All Conditions</option>
                <option value="NEW_WITH_TAGS">New with Tags</option>
                <option value="LIKE_NEW">Like New</option>
                <option value="EXCELLENT">Excellent</option>
                <option value="GOOD">Good</option>
                <option value="FAIR">Fair</option>
              </select>
            </div>

            {/* Size */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                Size
              </label>
              <select
                value={size}
                onChange={(e) => {
                  setSize(e.target.value);
                  setPage(1);
                }}
                className="w-full text-xs p-2.5 rounded-xl border border-cream-300 bg-white"
              >
                <option value="All">All Sizes</option>
                {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Value Range (₹) */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                Est. Value Range (₹)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minVal}
                  onChange={(e) => {
                    setMinVal(e.target.value);
                    setPage(1);
                  }}
                  className="w-1/2 text-xs p-2 rounded-xl border border-cream-300"
                />
                <span className="text-stone-400">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxVal}
                  onChange={(e) => {
                    setMaxVal(e.target.value);
                    setPage(1);
                  }}
                  className="w-1/2 text-xs p-2 rounded-xl border border-cream-300"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Listings Grid */}
      {loading ? (
        <GridSkeleton count={12} />
      ) : items.length === 0 ? (
        <EmptyState
          title="No clothing items found"
          description="Try broadening your search query or resetting filters to explore more sustainable items."
          actionText="Clear All Filters"
          onActionClick={handleResetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <ClothingCard
              key={item.id}
              item={item}
              onRequestSwap={handleRequestSwap}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="p-2.5 rounded-full border border-cream-300 bg-white hover:bg-cream-100 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-semibold text-stone-600">
            Page {pagination.page} of {pagination.totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
            disabled={page >= pagination.totalPages}
            className="p-2.5 rounded-full border border-cream-300 bg-white hover:bg-cream-100 disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Modals */}
      <SwapRequestModal
        targetItem={selectedSwapItem}
        isOpen={!!selectedSwapItem}
        onClose={() => setSelectedSwapItem(null)}
        onSuccess={() => {
          alert('Swap request submitted! View active negotiations in My Swaps.');
        }}
      />

      <ValueCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />
    </div>
  );
}
