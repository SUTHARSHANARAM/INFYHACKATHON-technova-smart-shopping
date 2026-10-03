import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { wishlistService } from '../services/wishlistService';
import { cartService } from '../services/cartService';
import { WishlistItem } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { useToast } from '../context/ToastContext';

export const WishlistPage: React.FC = () => {
  const { showToast } = useToast();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const res = await wishlistService.getWishlist();
      if (res.data?.items) setItems(res.data.items);
    } catch (err: any) {
      showToast(err.message || 'Failed to load wishlist', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId: string, name: string) => {
    try {
      await wishlistService.removeFromWishlist(productId);
      setItems((prev) => prev.filter((item) => item.productId !== productId));
      showToast(`Removed ${name} from wishlist`, 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to remove item', 'error');
    }
  };

  const handleMoveToCart = async (productId: string, name: string) => {
    try {
      await cartService.addToCart(productId, 1);
      await wishlistService.removeFromWishlist(productId);
      setItems((prev) => prev.filter((item) => item.productId !== productId));
      showToast(`Moved ${name} to shopping cart!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to move item to cart', 'error');
    }
  };

  if (loading) return <LoadingSpinner label="Loading your saved wishlist..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <Heart className="w-7 h-7 text-rose-500 fill-rose-500" /> My Saved Wishlist
          </h1>
          <p className="text-xs text-gray-500 mt-1">{items.length} items saved for later purchase</p>
        </div>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => {
            const prod = item.product;
            const img = prod?.images?.[0] || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600';
            return (
              <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col justify-between group">
                <div>
                  <div className="relative h-44 flex items-center justify-center bg-gray-50 rounded-xl overflow-hidden mb-3">
                    <img src={img} alt={prod.name} className="h-full w-full object-contain p-2 group-hover:scale-105 transition-transform" />
                    <button
                      onClick={() => handleRemove(prod.id, prod.name)}
                      className="absolute top-2 right-2 p-1.5 bg-white/80 hover:bg-white text-gray-400 hover:text-rose-500 rounded-full shadow-sm"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{prod.brand}</span>
                  <Link to={`/products/${prod.id}`} className="block font-semibold text-sm text-gray-900 hover:text-brand-600 line-clamp-2 mb-2">
                    {prod.name}
                  </Link>
                  <p className="font-bold text-base text-gray-900 mb-4">₹{prod.price.toLocaleString('en-IN')}</p>
                </div>

                <button
                  onClick={() => handleMoveToCart(prod.id, prod.name)}
                  className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" /> Move to Cart
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Heart}
          title="Your Wishlist is Empty"
          description="Save your favorite smartphones, ultrabooks, and accessories here to buy them later."
          actionLabel="Explore Technology Catalog"
          actionTo="/products"
        />
      )}
    </div>
  );
};
