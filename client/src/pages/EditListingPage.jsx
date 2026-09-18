import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit3, AlertCircle, ArrowLeft } from 'lucide-react';
import { clothesApi } from '../services/api.js';

export default function EditListingPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Jackets',
    brand: '',
    size: 'M',
    color: '',
    material: 'Cotton',
    condition: 'LIKE_NEW',
    purchaseAge: '< 6 months',
    description: '',
    estimatedValue: '',
    exchangePreferences: '',
    status: 'ACTIVE',
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    clothesApi
      .getClothingById(id)
      .then((res) => {
        const item = res.data?.data?.item;
        if (item) {
          setFormData({
            title: item.title,
            category: item.category,
            brand: item.brand,
            size: item.size,
            color: item.color,
            material: item.material,
            condition: item.condition,
            purchaseAge: item.purchaseAge,
            description: item.description,
            estimatedValue: item.estimatedValue,
            exchangePreferences: item.exchangePreferences || '',
            status: item.status,
          });
        }
      })
      .catch((err) => {
        console.error('Error loading listing:', err);
        setError('Failed to load listing for editing.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await clothesApi.updateClothing(id, formData);
      navigate(`/clothes/${id}`);
    } catch (err) {
      console.error('Error updating:', err);
      setError(err.response?.data?.message || 'Failed to update listing.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-xs text-stone-400">Loading listing details...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-brand-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Cancel & Return
      </button>

      <div className="text-center mb-8">
        <h1 className="font-serif text-3xl font-bold text-charcoal">Edit Clothing Listing</h1>
        <p className="text-xs text-stone-500 mt-1">Update specifications or swap status for this item.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-2xl flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-10 border border-cream-300 shadow-xl space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full text-xs p-3 rounded-xl border border-cream-300 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full text-xs p-3 rounded-xl border border-cream-300 bg-white"
            >
              <option value="ACTIVE">ACTIVE (Available for Swap)</option>
              <option value="PENDING_SWAP">PENDING_SWAP (In Progress)</option>
              <option value="SWAPPED">SWAPPED (Completed)</option>
              <option value="ARCHIVED">ARCHIVED (Hidden)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Brand
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full text-xs p-3 rounded-xl border border-cream-300 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Size
            </label>
            <input
              type="text"
              name="size"
              value={formData.size}
              onChange={handleChange}
              className="w-full text-xs p-3 rounded-xl border border-cream-300 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Estimated Value (₹)
            </label>
            <input
              type="number"
              name="estimatedValue"
              value={formData.estimatedValue}
              onChange={handleChange}
              className="w-full text-xs p-3 rounded-xl border border-cream-300 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
            Description
          </label>
          <textarea
            rows={4}
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full text-xs p-3 rounded-xl border border-cream-300 outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
            Exchange Preferences
          </label>
          <input
            type="text"
            name="exchangePreferences"
            value={formData.exchangePreferences}
            onChange={handleChange}
            className="w-full text-xs p-3 rounded-xl border border-cream-300 outline-none"
          />
        </div>

        <div className="pt-4 border-t border-cream-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 rounded-full text-xs font-semibold text-stone-600 hover:bg-cream-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-900 text-cream-50 hover:bg-brand-800"
          >
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
