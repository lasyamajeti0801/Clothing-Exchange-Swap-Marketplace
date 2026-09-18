import React from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, Leaf, Droplets, Wind, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-950 text-cream-200 border-t border-brand-900 mt-20">
      {/* Environmental Impact Ticker */}
      <div className="bg-brand-900/60 border-b border-brand-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-brand-800 flex items-center justify-center text-sage mb-2">
                <Leaf className="w-5 h-5" />
              </div>
              <span className="text-2xl font-serif font-bold text-cream-50">1,240+</span>
              <span className="text-xs text-stone-400 mt-0.5">Garments Diverted from Landfills</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-brand-800 flex items-center justify-center text-sky-300 mb-2">
                <Droplets className="w-5 h-5" />
              </div>
              <span className="text-2xl font-serif font-bold text-cream-50">3.3M Liters</span>
              <span className="text-xs text-stone-400 mt-0.5">Freshwater Conserved</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-brand-800 flex items-center justify-center text-emerald-300 mb-2">
                <Wind className="w-5 h-5" />
              </div>
              <span className="text-2xl font-serif font-bold text-cream-50">3,100 kg</span>
              <span className="text-xs text-stone-400 mt-0.5">Carbon Emissions Avoided</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-brand-800 flex items-center justify-center text-amber-300 mb-2">
                <Shield className="w-5 h-5" />
              </div>
              <span className="text-2xl font-serif font-bold text-cream-50">100% Cashless</span>
              <span className="text-xs text-stone-400 mt-0.5">Direct Peer-to-Peer Barter</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-sage flex items-center justify-center text-brand-950 font-bold">
                <RefreshCw className="w-4 h-4" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-cream-50">ReWear</span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              ReWear transforms unused wardrobes into circular fashion communities. Exchange quality clothing directly with nearby fashion lovers without transactions, fees, or fast-fashion waste.
            </p>
            <div className="pt-2 text-[11px] text-stone-500">
              *Environmental metrics are algorithmic estimates based on circular textile lifecycle research (1 garment ≈ 2,700L water & 2.5kg CO2).
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-sage mb-3">Marketplace</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li><Link to="/clothes" className="hover:text-cream-50">All Listings</Link></li>
              <li><Link to="/clothes?category=Jackets" className="hover:text-cream-50">Jackets & Coats</Link></li>
              <li><Link to="/clothes?category=Kurtas" className="hover:text-cream-50">Kurtas & Ethnic</Link></li>
              <li><Link to="/clothes?category=Sarees" className="hover:text-cream-50">Handloom Sarees</Link></li>
              <li><Link to="/clothes?category=Hoodies" className="hover:text-cream-50">Streetwear & Hoodies</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-sage mb-3">Community</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li><Link to="/swaps" className="hover:text-cream-50">My Swaps</Link></li>
              <li><Link to="/list" className="hover:text-cream-50">List an Item</Link></li>
              <li><Link to="/dashboard" className="hover:text-cream-50">Sustainability Tracker</Link></li>
              <li><Link to="/clothes?city=Hyderabad" className="hover:text-cream-50">Hyderabad Hub</Link></li>
              <li><Link to="/clothes?city=Vijayawada" className="hover:text-cream-50">Vijayawada & Guntur Hub</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-sage mb-3">Trust & Transparency</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li><span className="text-stone-300">Valuation Benchmark</span></li>
              <li><span className="text-stone-300">Neighborhood Exchange Safety</span></li>
              <li><span className="text-stone-300">Approximate Location Privacy</span></li>
              <li><span className="text-stone-300">Community Guidelines</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-brand-900 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500">
          <p>© {new Date().getFullYear()} ReWear. Sustainable Fashion Barter Marketplace. All rights reserved.</p>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <span>Reuse</span>
            <span>•</span>
            <span>Exchange</span>
            <span>•</span>
            <span>Reduce Waste</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
