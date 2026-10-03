import React, { useState, useEffect } from 'react';
import { Filter, RotateCcw, Check, Star } from 'lucide-react';
import { Category, ProductFilters } from '../../types';
import { categoryService } from '../../services/categoryService';
import { productService } from '../../services/productService';

interface ProductFiltersSidebarProps {
  filters: ProductFilters;
  onFilterChange: (newFilters: Partial<ProductFilters>) => void;
  onReset: () => void;
}

export const ProductFiltersSidebar: React.FC<ProductFiltersSidebarProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<{ brand: string; count: number }[]>([]);
  const [minPrice, setMinPrice] = useState<string>(filters.minPrice ? String(filters.minPrice) : '');
  const [maxPrice, setMaxPrice] = useState<string>(filters.maxPrice ? String(filters.maxPrice) : '');

  useEffect(() => {
    categoryService.getCategories().then((res) => {
      if (res.data) setCategories(res.data);
    }).catch(console.error);

    productService.getBrands().then((res) => {
      if (res.data) setBrands(res.data);
    }).catch(console.error);
  }, []);

  const handlePriceApply = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      page: 1,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-6">
      {/* Title & Reset */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
          <Filter className="w-4 h-4 text-brand-600" /> Filter Products
        </h3>
        <button
          onClick={onReset}
          className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      {/* Categories Accordion/List */}
      <div>
        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Category</h4>
        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          <button
            onClick={() => onFilterChange({ category: undefined, subcategory: undefined, page: 1 })}
            className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
              !filters.category ? 'bg-brand-50 text-brand-700 font-bold' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <div key={cat.id} className="space-y-1">
              <button
                onClick={() => onFilterChange({ category: cat.slug, subcategory: undefined, page: 1 })}
                className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                  filters.category === cat.slug ? 'bg-brand-50 text-brand-700 font-bold' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {cat.name}
              </button>

              {/* Subcategories */}
              {cat.subcategories && cat.subcategories.length > 0 && (
                <div className="pl-4 space-y-1 border-l border-gray-100 ml-2">
                  {cat.subcategories.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => onFilterChange({ subcategory: sub.slug, page: 1 })}
                      className={`w-full text-left text-[11px] px-2 py-1 rounded transition-colors ${
                        filters.subcategory === sub.slug ? 'text-brand-600 font-bold' : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="pt-4 border-t border-gray-100">
        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Price Range (₹)</h4>
        <form onSubmit={handlePriceApply} className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
            />
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
            />
          </div>
          <button
            type="submit"
            className="w-full py-1.5 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Apply Price
          </button>
        </form>
      </div>

      {/* Brands List */}
      <div className="pt-4 border-t border-gray-100">
        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Brand</h4>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {brands.map((b) => (
            <label
              key={b.brand}
              className="flex items-center justify-between text-xs text-gray-700 hover:text-gray-900 cursor-pointer py-0.5"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.brand === b.brand}
                  onChange={(e) =>
                    onFilterChange({ brand: e.target.checked ? b.brand : undefined, page: 1 })
                  }
                  className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                />
                <span>{b.brand}</span>
              </div>
              <span className="text-[10px] text-gray-400">({b.count})</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div className="pt-4 border-t border-gray-100">
        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Minimum Rating</h4>
        <div className="space-y-1.5">
          {[4, 3, 2].map((stars) => (
            <button
              key={stars}
              onClick={() =>
                onFilterChange({
                  minRating: filters.minRating === stars ? undefined : stars,
                  page: 1,
                })
              }
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs transition-colors ${
                filters.minRating === stars ? 'bg-amber-50 text-amber-900 font-bold border border-amber-200' : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <div className="flex items-center text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              </div>
              <span>{stars} Stars & Above</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
