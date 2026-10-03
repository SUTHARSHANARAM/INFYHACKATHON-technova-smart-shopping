import React, { useState, useEffect } from 'react';
import { Layers, Sparkles, Plus, X, ShoppingBag } from 'lucide-react';
import { productService } from '../services/productService';
import { aiService, AICompareResponse } from '../services/aiService';
import { Product } from '../types';
import { StarRating } from '../components/common/StarRating';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useToast } from '../context/ToastContext';
import { cartService } from '../services/cartService';

export const ComparePage: React.FC = () => {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [showSelector, setShowSelector] = useState<boolean>(false);
  const [aiVerdict, setAiVerdict] = useState<AICompareResponse | null>(null);
  const [loadingAi, setLoadingAi] = useState<boolean>(false);

  useEffect(() => {
    // Load candidate products to pick from
    productService.getProducts({ limit: 20 }).then((res) => {
      if (res.data?.items) {
        setAvailableProducts(res.data.items);
        // Pre-select first 2 products for quick demo
        if (res.data.items.length >= 2) {
          setProducts([res.data.items[0], res.data.items[1]]);
        }
      }
    }).catch(console.error);
  }, []);

  const handleAddProduct = (prod: Product) => {
    if (products.find((p) => p.id === prod.id)) return;
    if (products.length >= 4) {
      showToast('You can compare a maximum of 4 products at once.', 'info');
      return;
    }
    setProducts((prev) => [...prev, prod]);
    setShowSelector(false);
    setAiVerdict(null);
  };

  const handleRemoveProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setAiVerdict(null);
  };

  const handleRunAiComparison = async () => {
    if (products.length < 2) {
      showToast('Please select at least 2 products to compare.', 'info');
      return;
    }

    setLoadingAi(true);
    try {
      const pIds = products.map((p) => p.id);
      const res = await aiService.compare(pIds);
      if (res.data) setAiVerdict(res.data);
    } catch (err: any) {
      showToast(err.message || 'AI comparison failed', 'error');
    } finally {
      setLoadingAi(false);
    }
  };

  const handleAddToCart = async (prod: Product) => {
    try {
      await cartService.addToCart(prod.id, 1);
      showToast(`Added ${prod.name} to cart!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to add to cart', 'error');
    }
  };

  // Collect unique spec keys across selected products
  const allSpecKeys = Array.from(
    new Set(products.flatMap((p) => Object.keys(p.specifications || {})))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title & AI Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <Layers className="w-7 h-7 text-brand-600" /> Product Comparison Matrix
          </h1>
          <p className="text-xs text-gray-500 mt-1">Compare specifications, prices, and ratings side-by-side</p>
        </div>

        <button
          onClick={handleRunAiComparison}
          disabled={loadingAi || products.length < 2}
          className="bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-md shadow-brand-500/20 flex items-center justify-center gap-2 transition-all"
        >
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          {loadingAi ? 'AI Analyzing Specs...' : 'Generate AI Comparison Verdict'}
        </button>
      </div>

      {/* AI Comparison Verdict Panel */}
      {aiVerdict && (
        <div className="bg-gradient-to-r from-techDark-900 via-brand-950 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-brand-300 font-bold text-xs">
            <Sparkles className="w-5 h-5 text-amber-300" /> Grounded AI Comparison Verdict
          </div>
          <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-normal">{aiVerdict.verdict}</p>
        </div>
      )}

      {/* Comparison Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="p-4 sm:p-6 w-48 font-bold text-gray-700 uppercase tracking-wider text-xs">Features</th>
              {products.map((prod) => (
                <th key={prod.id} className="p-4 sm:p-6 min-w-[220px] max-w-[280px] align-top relative">
                  <button
                    onClick={() => handleRemoveProduct(prod.id)}
                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-rose-500"
                    title="Remove"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <img src={prod.images?.[0] || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=200'} alt={prod.name} className="w-24 h-24 object-contain mx-auto mb-2" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">{prod.brand}</span>
                  <h4 className="font-bold text-sm text-gray-900 line-clamp-2">{prod.name}</h4>
                  <div className="mt-2">
                    <span className="text-base font-extrabold text-brand-600">₹{prod.price.toLocaleString('en-IN')}</span>
                  </div>
                  <button
                    onClick={() => handleAddToCart(prod)}
                    className="mt-3 w-full py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
                  </button>
                </th>
              ))}
              {products.length < 4 && (
                <th className="p-4 sm:p-6 min-w-[180px] text-center align-middle">
                  <button
                    onClick={() => setShowSelector(true)}
                    className="w-full h-40 border-2 border-dashed border-gray-200 rounded-2xl hover:border-brand-500 hover:bg-brand-50/50 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-brand-600 transition-colors"
                  >
                    <Plus className="w-6 h-6" />
                    <span className="text-xs font-bold">Add Product</span>
                  </button>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="p-4 font-bold text-gray-700 bg-gray-50/30">Rating</td>
              {products.map((p) => (
                <td key={p.id} className="p-4">
                  <StarRating rating={p.rating} count={p.reviewCount} size="sm" />
                </td>
              ))}
            </tr>
            <tr className="border-b border-gray-100">
              <td className="p-4 font-bold text-gray-700 bg-gray-50/30">Stock Availability</td>
              {products.map((p) => (
                <td key={p.id} className="p-4 font-semibold text-emerald-600">
                  {p.stock > 0 ? `${p.stock} units available` : 'Out of Stock'}
                </td>
              ))}
            </tr>
            {allSpecKeys.map((key) => (
              <tr key={key} className="border-b border-gray-100 hover:bg-gray-50/40">
                <td className="p-4 font-semibold text-gray-700 bg-gray-50/30">{key}</td>
                {products.map((p) => (
                  <td key={p.id} className="p-4 text-gray-900 font-medium">
                    {p.specifications?.[key] || 'N/A'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {showSelector && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 shadow-2xl space-y-4 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-gray-900 text-base">Select Product to Compare</h3>
              <button onClick={() => setShowSelector(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {availableProducts
                .filter((p) => !products.find((existing) => existing.id === p.id))
                .map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => handleAddProduct(prod)}
                    className="flex items-center justify-between p-3 rounded-2xl border border-gray-100 hover:border-brand-500 hover:bg-brand-50/50 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <img src={prod.images?.[0]} alt={prod.name} className="w-10 h-10 object-contain" />
                      <div>
                        <h4 className="font-bold text-xs text-gray-900">{prod.name}</h4>
                        <span className="text-[11px] text-gray-500">{prod.brand}</span>
                      </div>
                    </div>
                    <span className="font-bold text-xs text-brand-600">₹{prod.price.toLocaleString('en-IN')}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
