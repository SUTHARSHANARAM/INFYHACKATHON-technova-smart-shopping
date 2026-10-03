import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Flame, Cpu, Smartphone, Laptop, Monitor, Headphones, HardDrive, Keyboard, Gamepad2, Usb } from 'lucide-react';
import { ProductCard } from '../components/product/ProductCard';
import { LoadingSpinner, ProductSkeleton } from '../components/common/LoadingSpinner';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { Category, Product } from '../types';

export const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [dealProducts, setDealProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, featRes, dealsRes] = await Promise.all([
          categoryService.getCategories(),
          productService.getFeaturedProducts(8),
          productService.getProducts({ limit: 8, sortBy: 'discount', sortOrder: 'desc' }),
        ]);

        if (catRes.data) setCategories(catRes.data);
        if (featRes.data) setFeaturedProducts(featRes.data);
        if (dealsRes.data?.items) setDealProducts(dealsRes.data.items);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'smartphones-tablets': return Smartphone;
      case 'laptops-computers': return Laptop;
      case 'displays-monitors': return Monitor;
      case 'audio-headphones': return Headphones;
      case 'keyboards-mice': return Keyboard;
      case 'gaming-gear': return Gamepad2;
      case 'storage-devices': return HardDrive;
      default: return Usb;
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Banner Section */}
      <section className="relative bg-gradient-to-br from-techDark-950 via-techDark-900 to-brand-950 text-white overflow-hidden py-16 lg:py-24">
        {/* Background Decorative Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 text-brand-300 px-3.5 py-1.5 rounded-full text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>Next-Gen Electronics Marketplace</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Smart Technology. <br />
              <span className="bg-gradient-to-r from-brand-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                Smarter Shopping.
              </span>
            </h1>

            <p className="text-gray-300 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Discover flagship smartphones, ultrabooks, 4K gaming displays, mechanical keyboards, and high-speed NVMe storage with AI-powered recommendations.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/products"
                className="bg-brand-600 hover:bg-brand-500 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-brand-500/25 transition-all hover:scale-105 flex items-center gap-2 text-sm"
              >
                Explore All Products <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/products?featured=true"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold px-6 py-3.5 rounded-xl transition-all text-sm"
              >
                View Hot Deals
              </Link>
            </div>
          </div>

          {/* Hero Featured Visual */}
          <div className="relative flex justify-center">
            <div className="relative w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl space-y-4">
              <div className="flex items-center justify-between text-xs text-brand-300 font-bold uppercase tracking-wider">
                <span>Featured Tech Special</span>
                <span className="bg-rose-500 text-white px-2 py-0.5 rounded text-[10px]">SAVE UP TO 20%</span>
              </div>
              <img
                src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800"
                alt="MacBook Pro M3 Max"
                className="w-full h-48 object-contain rounded-xl hover:scale-105 transition-transform duration-500"
              />
              <div>
                <h3 className="text-white font-bold text-lg">Apple MacBook Pro 16" M3 Max</h3>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">16-core CPU, 40-core GPU, 36GB Unified Memory, 1TB NVMe SSD.</p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <div>
                  <span className="text-xl font-extrabold text-white">₹3,49,900</span>
                  <span className="text-xs text-gray-400 line-through ml-2">₹3,79,900</span>
                </div>
                <Link
                  to="/products?search=MacBook"
                  className="bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
                >
                  Buy Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Major Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Explore Niche Categories
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Browse top-rated technology categories</p>
          </div>
          <Link to="/products" className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const Icon = getCategoryIcon(cat.slug);
            return (
              <Link
                key={cat.id}
                to={`/products?category=${cat.slug}`}
                className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-brand-200 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white flex items-center justify-center transition-colors mb-4 shadow-sm">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base group-hover:text-brand-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {cat._count?.products || 0}+ products available
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              Featured Flagships
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Handpicked premium laptops, smartphones, and displays</p>
          </div>
          <Link to="/products?featured=true" className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1">
            Browse Flagships <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => <ProductSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Hot Deals & Discounts */}
      <section className="bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-rose-500/10 py-12 border-y border-amber-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                <Flame className="w-7 h-7 text-amber-500 fill-amber-500" /> Hot Tech Discounts
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Biggest price drops on headsets, storage drives, and accessories</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {dealProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* AI Assistant Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-techDark-900 via-brand-950 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-brand-500/20 text-brand-300 font-bold text-xs px-3 py-1 rounded-full border border-brand-500/30">
              <Sparkles className="w-4 h-4 text-amber-300" /> Powered by Grounded TechNova AI
            </div>
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Unsure which laptop or SSD to pick?
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
              Ask our AI Shopping Assistant. It analyzes live specifications and real store stock in PostgreSQL to give you exact product matches and spec breakdowns.
            </p>
          </div>

          <Link
            to="/products"
            className="bg-brand-500 hover:bg-brand-400 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-brand-500/30 transition-all hover:scale-105 text-sm flex-shrink-0"
          >
            Start Shopping with AI
          </Link>
        </div>
      </section>
    </div>
  );
};
