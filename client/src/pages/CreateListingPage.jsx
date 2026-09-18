import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  X,
  Sparkles,
  Info,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
} from 'lucide-react';
import { clothesApi, valuationApi } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const CATEGORIES = [
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
  'Skirts',
  'Ethnic Wear',
];

const CONDITIONS = [
  { value: 'NEW_WITH_TAGS', label: 'New with Tags (Unworn with tags attached)' },
  { value: 'LIKE_NEW', label: 'Like New (Worn 1-2 times, flawless)' },
  { value: 'EXCELLENT', label: 'Excellent (Gently used, no visible flaws)' },
  { value: 'GOOD', label: 'Good (Minor wash wear or normal use)' },
  { value: 'FAIR', label: 'Fair (Noticeable wear, still fully wearable)' },
];

export default function CreateListingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Jackets',
    subcategory: '',
    brand: "Levi's",
    size: 'M',
    color: 'Navy Blue',
    material: 'Denim',
    condition: 'LIKE_NEW',
    purchaseAge: '< 6 months',
    description: '',
    originalPrice: '',
    estimatedValue: '',
    exchangePreferences: '',
    city: user?.city || 'Hyderabad',
    state: user?.state || 'Telangana',
  });

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [calculating, setCalculating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [valuationBreakdown, setValuationBreakdown] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Image selection handler
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      setError('You can upload up to 5 images per listing.');
      return;
    }

    const newFiles = [...images, ...files];
    setImages(newFiles);

    // Generate previews
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);
    setError('');
  };

  const handleRemoveImage = (index) => {
    const newFiles = images.filter((_, i) => i !== index);
    setImages(newFiles);
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
  };

  // Auto-calculate suggested swap value
  const handleEstimateValue = async () => {
    setCalculating(true);
    try {
      const res = await valuationApi.estimate({
        category: formData.category,
        brand: formData.brand,
        condition: formData.condition,
        purchaseAge: formData.purchaseAge,
        material: formData.material,
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
      });

      if (res.data?.data) {
        setFormData((prev) => ({
          ...prev,
          estimatedValue: res.data.data.estimatedValue,
        }));
        setValuationBreakdown(res.data.data);
      }
    } catch (err) {
      console.error('Estimate error:', err);
    } finally {
      setCalculating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      setError('Please fill in title and description.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== undefined) {
          data.append(key, formData[key]);
        }
      });

      images.forEach((file) => {
        data.append('images', file);
      });

      const res = await clothesApi.createClothing(data);
      navigate(`/clothes/${res.data?.data?.item?.id}`);
    } catch (err) {
      console.error('Create listing error:', err);
      setError(err.response?.data?.message || 'Failed to publish clothing listing.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-700">Give Clothes A Second Life</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal mt-1">
          List an Item for Swap
        </h1>
        <p className="text-xs text-stone-500 mt-2 max-w-md mx-auto">
          Share high-quality photos and accurate details. All items are verified by our circular fashion community.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-2xl flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-10 border border-cream-300 shadow-xl space-y-6">
        {/* Photo Upload Section */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
            Garment Photos ({images.length}/5)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {previews.map((url, idx) => (
              <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-cream-300 group">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-1.5 right-1.5 p-1 bg-charcoal/70 text-white rounded-full hover:bg-rose-600 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                {idx === 0 && (
                  <span className="absolute bottom-1.5 left-1.5 bg-brand-900 text-cream-50 text-[9px] font-bold px-1.5 py-0.5 rounded">
                    Cover
                  </span>
                )}
              </div>
            ))}

            {images.length < 5 && (
              <label className="aspect-square rounded-2xl border-2 border-dashed border-stone-300 hover:border-brand-900 bg-cream-50 hover:bg-cream-100 flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-colors">
                <UploadCloud className="w-6 h-6 text-stone-400 mb-1" />
                <span className="text-[10px] font-semibold text-stone-600">Add Photo</span>
                <span className="text-[9px] text-stone-400">Max 5MB</span>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Title & Brand */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Clothing Title *
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Levi's Classic Sherpa Denim Trucker Jacket"
              className="w-full text-xs p-3 rounded-xl border border-cream-300 focus:border-brand-900 focus:ring-1 focus:ring-brand-900 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Brand / Label *
            </label>
            <input
              type="text"
              name="brand"
              required
              value={formData.brand}
              onChange={handleChange}
              placeholder="e.g. Zara, FabIndia, H&M, Uniqlo"
              className="w-full text-xs p-3 rounded-xl border border-cream-300 focus:border-brand-900 focus:ring-1 focus:ring-brand-900 outline-none"
            />
          </div>
        </div>

        {/* Category, Size, Color */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full text-xs p-3 rounded-xl border border-cream-300 bg-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Size *
            </label>
            <select
              name="size"
              value={formData.size}
              onChange={handleChange}
              className="w-full text-xs p-3 rounded-xl border border-cream-300 bg-white"
            >
              {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Color
            </label>
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleChange}
              placeholder="e.g. Rust Orange, Indigo"
              className="w-full text-xs p-3 rounded-xl border border-cream-300 outline-none"
            />
          </div>
        </div>

        {/* Material, Condition, Purchase Age */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Material Fabric
            </label>
            <select
              name="material"
              value={formData.material}
              onChange={handleChange}
              className="w-full text-xs p-3 rounded-xl border border-cream-300 bg-white"
            >
              {['Cotton', 'Organic Cotton', 'Denim', 'Linen', 'Pure Silk', 'Wool', 'Polyester', 'Viscose / Rayon', 'Chanderi Silk', 'Blend'].map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Condition *
            </label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className="w-full text-xs p-3 rounded-xl border border-cream-300 bg-white"
            >
              {CONDITIONS.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Purchase Age
            </label>
            <select
              name="purchaseAge"
              value={formData.purchaseAge}
              onChange={handleChange}
              className="w-full text-xs p-3 rounded-xl border border-cream-300 bg-white"
            >
              <option value="< 6 months">&lt; 6 months</option>
              <option value="6-12 months">6-12 months</option>
              <option value="1-2 years">1-2 years</option>
              <option value="2+ years">2+ years</option>
            </select>
          </div>
        </div>

        {/* Valuation Box */}
        <div className="bg-brand-50/60 p-5 rounded-2xl border border-brand-200 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-terracotta" />
                <span>Estimated Swap Valuation</span>
              </span>
              <p className="text-[11px] text-stone-500">
                Let our valuation algorithm suggest a fair exchange benchmark, or specify your own.
              </p>
            </div>

            <button
              type="button"
              onClick={handleEstimateValue}
              disabled={calculating}
              className="px-4 py-2 rounded-full text-xs font-semibold bg-brand-900 text-cream-50 hover:bg-brand-800 transition-colors shrink-0"
            >
              {calculating ? 'Estimating...' : 'Auto-Calculate Value'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                Original Retail Price (₹)
              </label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                placeholder="Optional (e.g. 4500)"
                className="w-full text-xs p-2.5 rounded-xl border border-cream-300 bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                Estimated Swap Value (₹) *
              </label>
              <input
                type="number"
                name="estimatedValue"
                required
                value={formData.estimatedValue}
                onChange={handleChange}
                placeholder="e.g. 1800"
                className="w-full text-xs p-2.5 rounded-xl border border-brand-900 bg-white font-bold text-brand-950 outline-none"
              />
            </div>
          </div>

          {valuationBreakdown && (
            <div className="text-[11px] text-brand-900 font-medium pt-1">
              Suggested Range: ₹{valuationBreakdown.suggestedRange?.min} – ₹{valuationBreakdown.suggestedRange?.max}
            </div>
          )}
        </div>

        {/* Description & Exchange Preferences */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
            Detailed Description *
          </label>
          <textarea
            rows={4}
            name="description"
            required
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the fit, drape, how often it was worn, any special features, washing instructions..."
            className="w-full text-xs p-3 rounded-xl border border-cream-300 focus:border-brand-900 focus:ring-1 focus:ring-brand-900 outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
            Exchange Preferences (What would you love in return?)
          </label>
          <input
            type="text"
            name="exchangePreferences"
            value={formData.exchangePreferences}
            onChange={handleChange}
            placeholder="e.g. Looking for an oversized hoodie, linen shirts, or cotton sarees in size M"
            className="w-full text-xs p-3 rounded-xl border border-cream-300 outline-none"
          />
        </div>

        {/* Location Hub */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              City Hub
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full text-xs p-3 rounded-xl border border-cream-300 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              State
            </label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full text-xs p-3 rounded-xl border border-cream-300 outline-none"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-cream-200 flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-full text-xs font-semibold text-stone-600 hover:bg-cream-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-900 text-cream-50 hover:bg-brand-800 transition-all shadow-md flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-sage" />
            {submitting ? 'Publishing...' : 'Publish Listing to Swap'}
          </button>
        </div>
      </form>
    </div>
  );
}
