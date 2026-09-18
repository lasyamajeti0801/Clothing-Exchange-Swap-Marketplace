import React, { useState } from 'react';
import { X, Calculator, Sparkles, Info } from 'lucide-react';
import { valuationApi } from '../services/api.js';

export default function ValueCalculatorModal({ isOpen, onClose }) {
  const [category, setCategory] = useState('Jackets');
  const [brand, setBrand] = useState("Levi's");
  const [condition, setCondition] = useState('LIKE_NEW');
  const [purchaseAge, setPurchaseAge] = useState('< 6 months');
  const [material, setMaterial] = useState('Denim');
  const [originalPrice, setOriginalPrice] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleCalculate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await valuationApi.estimate({
        category,
        brand,
        condition,
        purchaseAge,
        material,
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
      });
      setResult(res.data?.data);
    } catch (err) {
      console.error('Calculation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-cream-300 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-charcoal hover:bg-cream-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-100 text-brand-900 mb-2">
            <Calculator className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-charcoal">Swap Value Calculator</h2>
          <p className="text-xs text-stone-500 mt-1">
            Transparent algorithmic benchmark to estimate equitable clothing exchange values.
          </p>
        </div>

        <form onSubmit={handleCalculate} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-cream-300 bg-white"
              >
                {['Jackets', 'Kurtas', 'Sarees', 'Hoodies', 'Jeans', 'Dresses', 'Shirts', 'T-Shirts', 'Trousers', 'Sweaters', 'Sportswear'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                Brand
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Zara, FabIndia, Levi's"
                className="w-full text-xs p-2.5 rounded-xl border border-cream-300 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                Condition
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-cream-300 bg-white"
              >
                <option value="NEW_WITH_TAGS">New with Tags</option>
                <option value="LIKE_NEW">Like New</option>
                <option value="EXCELLENT">Excellent</option>
                <option value="GOOD">Good</option>
                <option value="FAIR">Fair</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                Purchase Age
              </label>
              <select
                value={purchaseAge}
                onChange={(e) => setPurchaseAge(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-cream-300 bg-white"
              >
                <option value="< 6 months">&lt; 6 months</option>
                <option value="6-12 months">6-12 months</option>
                <option value="1-2 years">1-2 years</option>
                <option value="2+ years">2+ years</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                Material
              </label>
              <select
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-cream-300 bg-white"
              >
                {['Cotton', 'Organic Cotton', 'Denim', 'Linen', 'Pure Silk', 'Wool', 'Polyester', 'Viscose / Rayon'].map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                Original Retail Price (₹)
              </label>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="Optional, e.g. 3999"
                className="w-full text-xs p-2.5 rounded-xl border border-cream-300 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-brand-900 text-cream-50 hover:bg-brand-800 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-sage" />
            {loading ? 'Calculating...' : 'Calculate Estimated Swap Value'}
          </button>
        </form>

        {result && (
          <div className="mt-5 p-4 bg-brand-50 border border-brand-200 rounded-2xl animate-in fade-in">
            <div className="text-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-800">
                Estimated Swap Value
              </span>
              <p className="font-serif text-3xl font-bold text-brand-900 mt-0.5">
                ₹{result.estimatedValue?.toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-stone-600 font-medium mt-1">
                Suggested Fair Trade Range: <span className="text-brand-900 font-bold">₹{result.suggestedRange?.min} – ₹{result.suggestedRange?.max}</span>
              </p>
            </div>

            <div className="mt-3 pt-3 border-t border-brand-200 flex items-start gap-2 text-[11px] text-stone-600">
              <Info className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
              <span>{result.disclaimer}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
