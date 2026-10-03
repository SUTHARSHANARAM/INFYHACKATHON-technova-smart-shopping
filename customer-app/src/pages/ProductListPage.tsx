import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/product/ProductCard';
import { ProductFiltersSidebar } from '../components/filters/ProductFiltersSidebar';
import { SortingSelect } from '../components/filters/SortingSelect';
import { ProductSkeleton } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { productService } from '../services/productService';
import { Product, ProductFilters, PaginatedResult } from '../types';
import { SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';

export const ProductListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse filters from URL
  const filtersFromUrl: ProductFilters = {
    page: Number(searchParams.get('page')) || 1,
    limit: 12,
    search: searchParams.get('search') || searchParams.get('q') || undefined,
    category: searchParams.get('category') || undefined,
    subcategory: searchParams.get('subcategory') || undefined,
    brand: searchParams.get('brand') || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    minRating: searchParams.get('minRating') ? Number(searchParams.get('minRating')) : undefined,
    sortBy: searchParams.get('sortBy') || undefined,
    featured: searchParams.get('featured') === 'true' ? true : undefined,
  };

  const [filters, setFilters] = useState<ProductFilters>(filtersFromUrl);
  const [data, setData] = useState<PaginatedResult<Product> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await productService.getProducts(filters);
        if (res.data) setData(res.data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  const handleFilterChange = (newPartialFilters: Partial<ProductFilters>) => {
    const updated = { ...filters, ...newPartialFilters };
    setFilters(updated);

    // Sync to URL search params
    const params = new URLSearchParams();
    Object.entries(updated).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        params.set(k, String(v));
      }
    });
    setSearchParams(params);
  };

  const handleResetFilters = () => {
    const reset: ProductFilters = { page: 1, limit: 12 };
    setFilters(reset);
    setSearchParams(new URLSearchParams());
  };

  const handleSortChange = (sortVal: string) => {
    let sortBy: string | undefined = undefined;
    let sortOrder: 'asc' | 'desc' | undefined = undefined;

    if (sortVal === 'price-asc') {
      sortBy = 'price';
      sortOrder = 'asc';
    } else if (sortVal === 'price-desc') {
      sortBy = 'price';
      sortOrder = 'desc';
    } else if (sortVal) {
      sortBy = sortVal;
      sortOrder = 'desc';
    }

    handleFilterChange({ sortBy, sortOrder, page: 1 });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
            {filters.category ? `Category: ${filters.category}` : filters.search ? `Search: "${filters.search}"` : 'All Products'}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Showing {data?.pagination.total || 0} premium technology items
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="lg:hidden flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>

          <SortingSelect
            value={filters.sortBy === 'price' ? (filters.sortOrder === 'asc' ? 'price-asc' : 'price-desc') : filters.sortBy || ''}
            onChange={handleSortChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block lg:col-span-1">
          <ProductFiltersSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </div>

        {/* Mobile Filters Drawer */}
        {mobileFiltersOpen && (
          <div className="lg:hidden bg-white p-4 rounded-2xl border border-gray-200 shadow-md">
            <ProductFiltersSidebar
              filters={filters}
              onFilterChange={(f) => {
                handleFilterChange(f);
                setMobileFiltersOpen(false);
              }}
              onReset={() => {
                handleResetFilters();
                setMobileFiltersOpen(false);
              }}
            />
          </div>
        )}

        {/* Main Product Grid Container */}
        <div className="lg:col-span-3 space-y-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : data?.items && data.items.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {data.items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {data.pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-6">
                  <button
                    disabled={filters.page === 1}
                    onClick={() => handleFilterChange({ page: (filters.page || 1) - 1 })}
                    className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs font-semibold"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: data.pagination.totalPages }, (_, i) => i + 1).map((pg) => (
                    <button
                      key={pg}
                      onClick={() => handleFilterChange({ page: pg })}
                      className={`w-9 h-9 rounded-xl font-bold text-xs transition-all ${
                        filters.page === pg
                          ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                          : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pg}
                    </button>
                  ))}

                  <button
                    disabled={filters.page === data.pagination.totalPages}
                    onClick={() => handleFilterChange({ page: (filters.page || 1) + 1 })}
                    className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs font-semibold"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <EmptyState
              title="No matching products found"
              description="Try adjusting your filter criteria or searching for another keyword."
              actionLabel="Reset All Filters"
              onAction={handleResetFilters}
            />
          )}
        </div>
      </div>
    </div>
  );
};
