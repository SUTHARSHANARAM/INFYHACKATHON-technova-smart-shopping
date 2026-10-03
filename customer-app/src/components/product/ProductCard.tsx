import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Check, Layers } from 'lucide-react';
import { Product } from '../../types';
import { StarRating } from '../common/StarRating';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { wishlistService } from '../../services/wishlistService';
import { cartService } from '../../services/cartService';

interface ProductCardProps {
  product: Product;
  isInWishlist?: boolean;
  onWishlistToggle?: (productId: string, inWishlist: boolean) => void;
  isComparing?: boolean;
  onCompareToggle?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isInWishlist = false,
  onWishlistToggle,
  isComparing = false,
  onCompareToggle,
}) => {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [wishlisted, setWishlisted] = React.useState(isInWishlist);
  const [addingCart, setAddingCart] = React.useState(false);
  const [addedCart, setAddedCart] = React.useState(false);

  React.useEffect(() => {
    setWishlisted(isInWishlist);
  }, [isInWishlist]);

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      showToast('Please login to save items to your wishlist', 'info');
      return;
    }

    try {
      if (wishlisted) {
        await wishlistService.removeFromWishlist(product.id);
        setWishlisted(false);
        showToast(`Removed ${product.name} from wishlist`, 'info');
        if (onWishlistToggle) onWishlistToggle(product.id, false);
      } else {
        await wishlistService.addToWishlist(product.id);
        setWishlisted(true);
        showToast(`Added ${product.name} to wishlist`, 'success');
        if (onWishlistToggle) onWishlistToggle(product.id, true);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update wishlist', 'error');
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      showToast('Please login to add products to your cart', 'info');
      return;
    }

    if (product.stock <= 0) {
      showToast('Sorry, this product is currently out of stock', 'error');
      return;
    }

    setAddingCart(true);
    try {
      await cartService.addToCart(product.id, 1);
      setAddedCart(true);
      showToast(`Added ${product.name} to cart!`, 'success');
      setTimeout(() => setAddedCart(false), 2000);
    } catch (err: any) {
      showToast(err.message || 'Failed to add item to cart', 'error');
    } finally {
      setAddingCart(false);
    }
  };

  const mainImage = product.images?.[0] || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600';

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Discount & Wishlist Badges */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div>
          {product.discount > 0 && (
            <span className="pointer-events-auto bg-rose-500 text-white font-bold text-xs px-2.5 py-1 rounded-full shadow-sm">
              -{Math.round(product.discount)}% OFF
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {onCompareToggle && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onCompareToggle(product);
              }}
              title={isComparing ? 'Remove from comparison' : 'Compare product'}
              className={`p-2 rounded-full backdrop-blur-md transition-all ${
                isComparing
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'bg-white/80 hover:bg-white text-gray-600 hover:text-brand-600 shadow-sm'
              }`}
            >
              <Layers className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={handleWishlist}
            title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className={`p-2 rounded-full backdrop-blur-md transition-all ${
              wishlisted
                ? 'bg-rose-50 text-rose-500 shadow-sm'
                : 'bg-white/80 hover:bg-white text-gray-400 hover:text-rose-500 shadow-sm'
            }`}
          >
            <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Product Image */}
      <Link to={`/products/${product.id}`} className="block p-4 bg-gray-50/50 overflow-hidden">
        <div className="w-full h-48 sm:h-52 flex items-center justify-center overflow-hidden rounded-xl">
          <img
            src={mainImage}
            alt={product.name}
            className="h-full w-full object-contain object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600';
            }}
          />
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            <span>{product.brand}</span>
            <span className="text-gray-400 font-normal capitalize">
              {product.category?.name}
            </span>
          </div>

          <Link to={`/products/${product.id}`} className="block group-hover:text-brand-600 transition-colors">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2 mb-2 leading-snug">
              {product.name}
            </h3>
          </Link>

          <div className="mb-3">
            <StarRating rating={product.rating} count={product.reviewCount} size="sm" />
          </div>
        </div>

        <div>
          {/* Price & Stock */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-lg font-bold text-gray-900">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-gray-400 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={handleAddToCart}
            disabled={addingCart || product.stock <= 0}
            className={`w-full py-2.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
              product.stock <= 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : addedCart
                ? 'bg-emerald-600 text-white'
                : 'bg-brand-600 hover:bg-brand-700 text-white shadow-sm hover:shadow'
            }`}
          >
            {product.stock <= 0 ? (
              'Out of Stock'
            ) : addedCart ? (
              <>
                <Check className="w-4 h-4" /> Added to Cart
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
