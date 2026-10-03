import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, ShieldCheck, Truck, RotateCcw, Headphones } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-techDark-950 text-gray-400 border-t border-gray-800">
      {/* Value Proposition Highlights */}
      <div className="border-b border-gray-800/80 py-8 bg-techDark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="flex items-center gap-4 justify-center sm:justify-start p-3">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center flex-shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold">Fast Express Shipping</h4>
              <p className="text-xs text-gray-400">Doorstep delivery across 19,000+ pincodes</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center sm:justify-start p-3">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold">100% Genuine Products</h4>
              <p className="text-xs text-gray-400">Official brand warranty & GST invoice</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center sm:justify-start p-3">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center flex-shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold">Easy 7-Day Returns</h4>
              <p className="text-xs text-gray-400">Hassle-free replacement policy</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center sm:justify-start p-3">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center flex-shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold">Tech Expert Support</h4>
              <p className="text-xs text-gray-400">AI-assisted & expert phone help</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Tech<span className="text-brand-500">Nova</span>
            </span>
          </Link>
          <p className="text-xs text-gray-400 leading-relaxed max-w-sm mb-4">
            TechNova is India's premier destination for smartphones, ultrabooks, gaming laptops, 4K monitors, high-speed NVMe SSDs, and computer accessories.
          </p>
          <p className="text-[11px] text-gray-500">
            Official Entry for INFYHACKATHON 2.0 — TECHNOVA.
          </p>
        </div>

        <div>
          <h5 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Shop Categories</h5>
          <ul className="space-y-2.5 text-xs">
            <li><Link to="/products?category=smartphones-tablets" className="hover:text-white transition-colors">Smartphones & Tablets</Link></li>
            <li><Link to="/products?category=laptops-computers" className="hover:text-white transition-colors">Laptops & Computers</Link></li>
            <li><Link to="/products?category=displays-monitors" className="hover:text-white transition-colors">Displays & Monitors</Link></li>
            <li><Link to="/products?category=audio-headphones" className="hover:text-white transition-colors">Audio & Headphones</Link></li>
            <li><Link to="/products?category=gaming-gear" className="hover:text-white transition-colors">Gaming Gear</Link></li>
            <li><Link to="/products?category=storage-devices" className="hover:text-white transition-colors">Storage Devices</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Customer Account</h5>
          <ul className="space-y-2.5 text-xs">
            <li><Link to="/login" className="hover:text-white transition-colors">Sign In / Register</Link></li>
            <li><Link to="/orders" className="hover:text-white transition-colors">Track Orders</Link></li>
            <li><Link to="/wishlist" className="hover:text-white transition-colors">My Wishlist</Link></li>
            <li><Link to="/cart" className="hover:text-white transition-colors">Shopping Cart</Link></li>
            <li><Link to="/compare" className="hover:text-white transition-colors">Product Comparison</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="text-white text-xs font-bold uppercase tracking-wider mb-4">TechNova AI</h5>
          <p className="text-xs text-gray-400 mb-3 leading-relaxed">
            Use our grounded AI Shopping Assistant for smart recommendations and instant spec comparisons.
          </p>
          <span className="inline-block bg-brand-500/20 text-brand-300 font-semibold text-[11px] px-3 py-1.5 rounded-lg border border-brand-500/30">
            Powered by TechNova AI
          </span>
        </div>
      </div>

      <div className="border-t border-gray-800/80 py-6 text-center text-xs text-gray-500">
        <p>© {new Date().getFullYear()} TechNova E-Commerce. All rights reserved. INFYHACKATHON 2.0 project.</p>
      </div>
    </footer>
  );
};
