import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { productService } from '../services/productService';
import { Product } from '../types';
import { ProductCard } from '../components/product/ProductCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';

export const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }
    setLoading(true);
    productService.searchProducts(query).then((res) => {
      if (res.data?.items) setProducts(res.data.items);
    }).catch(console.error).finally(() => setLoading(false));
  }, [query]);

  if (loading) return <LoadingSpinner label={`Searching TechNova catalog for "${query}"...`} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="pb-4 border-b border-gray-100">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
          <Search className="w-7 h-7 text-brand-600" /> Search Results: "{query}"
        </h1>
        <p className="text-xs text-gray-500 mt-1">{products.length} products match your search query</p>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Search}
          title={`No products found for "${query}"`}
          description="Try searching for another electronics term like 'MacBook', 'iPhone', 'Monitor', 'SSD', or 'Headphones'."
          actionLabel="Explore All Products"
          actionTo="/products"
        />
      )}
    </div>
  );
};
