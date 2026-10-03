import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Check,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Star,
  Layers,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
import { ProductGallery } from '../components/product/ProductGallery';
import { ProductSpecificationsTable } from '../components/product/ProductSpecificationsTable';
import { StarRating } from '../components/common/StarRating';
import { QuantitySelector } from '../components/common/QuantitySelector';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { productService } from '../services/productService';
import { reviewService } from '../services/reviewService';
import { cartService } from '../services/cartService';
import { wishlistService } from '../services/wishlistService';
import { aiService, AIInsightResponse } from '../services/aiService';
import { Product, Review } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  // Review Form state
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState<string>('');
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);

  // AI Insight state
  const [aiInsight, setAiInsight] = useState<AIInsightResponse | null>(null);
  const [loadingAi, setLoadingAi] = useState<boolean>(false);

  // Actions state
  const [wishlisted, setWishlisted] = useState<boolean>(false);
  const [addingCart, setAddingCart] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await productService.getProductById(id);
        if (res.data) {
          setProduct(res.data);
          // Fetch reviews
          const revRes = await reviewService.getProductReviews(res.data.id);
          if (revRes.data) setReviews(revRes.data);

          // Fetch AI Insight
          setLoadingAi(true);
          aiService.insight(res.data.id).then((aiRes) => {
            if (aiRes.data) setAiInsight(aiRes.data);
          }).catch(console.error).finally(() => setLoadingAi(false));
        }
      } catch (err: any) {
        showToast(err.message || 'Failed to load product details', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      showToast('Please login to add products to your cart', 'info');
      navigate('/login');
      return;
    }
    if (!product || product.stock <= 0) return;

    setAddingCart(true);
    try {
      await cartService.addToCart(product.id, quantity);
      showToast(`Added ${quantity} x ${product.name} to cart!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to add item to cart', 'error');
    } finally {
      setAddingCart(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate('/cart');
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      showToast('Please login to save items to your wishlist', 'info');
      return;
    }
    if (!product) return;

    try {
      if (wishlisted) {
        await wishlistService.removeFromWishlist(product.id);
        setWishlisted(false);
        showToast('Removed from wishlist', 'info');
      } else {
        await wishlistService.addToWishlist(product.id);
        setWishlisted(true);
        showToast('Added to wishlist!', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Wishlist error', 'error');
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast('Please login to submit a review', 'info');
      return;
    }
    if (!newComment.trim() || !product) return;

    setSubmittingReview(true);
    try {
      const res = await reviewService.createReview(product.id, newRating, newComment);
      showToast('Thank you! Your review has been submitted.', 'success');
      setNewComment('');
      // Refresh reviews & product
      const updatedRevs = await reviewService.getProductReviews(product.id);
      if (updatedRevs.data) setReviews(updatedRevs.data);
    } catch (err: any) {
      showToast(err.message || 'Failed to submit review', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading product details..." />;
  if (!product) return <div className="p-8 text-center text-gray-500">Product not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-gray-500">
        <Link to="/" className="hover:text-brand-600">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-brand-600">Products</Link>
        <span>/</span>
        <span className="text-gray-900 font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Specs & Buying Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left: Gallery */}
        <ProductGallery images={product.images as string[]} productName={product.name} />

        {/* Right: Info & Actions */}
        <div className="space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              <span>{product.brand}</span>
              <span className="text-gray-400 font-normal">SKU: {product.SKU}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
              {product.name}
            </h1>
            <div className="mt-3 flex items-center gap-3">
              <StarRating rating={product.rating} count={product.reviewCount} size="md" />
              <span className="text-xs text-gray-400">|</span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                product.stock > 10
                  ? 'bg-emerald-50 text-emerald-700'
                  : product.stock > 0
                  ? 'bg-amber-50 text-amber-700'
                  : 'bg-rose-50 text-rose-700'
              }`}>
                {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left!` : 'Out of Stock'}
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-100 flex items-baseline justify-between">
            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-gray-900">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-gray-400 line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-500 mt-1">Inclusive of all taxes & warranties</p>
            </div>
            {product.discount > 0 && (
              <span className="bg-rose-500 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow-sm">
                Save {Math.round(product.discount)}%
              </span>
            )}
          </div>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            {product.description}
          </p>

          {/* Quantity & Actions */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Quantity:</span>
              <QuantitySelector
                quantity={quantity}
                maxStock={product.stock}
                onChange={setQuantity}
                disabled={product.stock <= 0}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={addingCart || product.stock <= 0}
                className="py-3.5 px-6 rounded-2xl font-bold text-sm bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white shadow-md shadow-brand-500/20 flex items-center justify-center gap-2 transition-all"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="py-3.5 px-6 rounded-2xl font-bold text-sm bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white shadow-md flex items-center justify-center gap-2 transition-all"
              >
                Buy Now
              </button>
            </div>

            <div className="flex items-center justify-between pt-3 text-xs text-gray-600">
              <button
                onClick={handleWishlistToggle}
                className="flex items-center gap-2 hover:text-rose-600 transition-colors font-medium"
              >
                <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                {wishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
              </button>

              <Link to="/compare" className="flex items-center gap-1.5 hover:text-brand-600 font-medium">
                <Layers className="w-4 h-4" /> Compare Product
              </Link>
            </div>
          </div>

          {/* Service Guarantees */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100 text-center text-[11px] text-gray-600">
            <div className="p-2 bg-gray-50 rounded-xl">
              <Truck className="w-4 h-4 text-brand-600 mx-auto mb-1" />
              <span>Fast Express Shipping</span>
            </div>
            <div className="p-2 bg-gray-50 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-brand-600 mx-auto mb-1" />
              <span>Brand Warranty</span>
            </div>
            <div className="p-2 bg-gray-50 rounded-xl">
              <RotateCcw className="w-4 h-4 text-brand-600 mx-auto mb-1" />
              <span>7-Day Replacement</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grounded AI Product Insights Section */}
      {aiInsight && (
        <section className="bg-gradient-to-r from-techDark-900 via-brand-950 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-brand-300 font-bold text-xs">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
              <span>Grounded AI Product Insights</span>
            </div>
            <span className="text-[11px] text-gray-400 font-medium">Live PostgreSQL Grounding</span>
          </div>

          <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-normal">
            {aiInsight.aiSummary}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="bg-white/10 p-4 rounded-2xl border border-white/10 text-xs">
              <h4 className="font-bold text-amber-300 mb-2">Key Highlights</h4>
              <ul className="space-y-1 text-gray-300 list-disc list-inside">
                {aiInsight.keyHighlights.map((hl, i) => (
                  <li key={i}>{hl}</li>
                ))}
              </ul>
            </div>
            <div className="bg-white/10 p-4 rounded-2xl border border-white/10 text-xs">
              <h4 className="font-bold text-emerald-300 mb-2">Customer Sentiment Summary</h4>
              <p className="text-gray-300 leading-relaxed">{aiInsight.reviewSentiment}</p>
            </div>
          </div>
        </section>
      )}

      {/* Specifications & Reviews Tabs */}
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900 mb-4">Technical Specifications</h2>
          <ProductSpecificationsTable specifications={product.specifications} />
        </div>

        {/* Reviews Section */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-brand-600" /> Customer Reviews ({reviews.length})
            </h2>
            <StarRating rating={product.rating} count={product.reviewCount} size="md" />
          </div>

          {/* Submit Review Form */}
          {isAuthenticated ? (
            <form onSubmit={handleReviewSubmit} className="bg-gray-50 p-4 sm:p-6 rounded-2xl border border-gray-200 space-y-4">
              <h4 className="font-bold text-sm text-gray-900">Write a Customer Review</h4>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-gray-700">Rating:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-1 text-amber-400 focus:outline-none"
                    >
                      <Star className={`w-5 h-5 ${star <= newRating ? 'fill-amber-400' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <textarea
                  rows={3}
                  placeholder="Share your experience with this tech product..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview || !newComment.trim()}
                className="bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors"
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          ) : (
            <div className="bg-brand-50/50 p-4 rounded-2xl border border-brand-100 text-xs text-brand-800 flex items-center justify-between">
              <span>Sign in to leave a review for this product.</span>
              <Link to="/login" className="font-bold text-brand-600 hover:underline">
                Sign In
              </Link>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-4 pt-4">
            {reviews.length > 0 ? (
              reviews.map((rev) => (
                <div key={rev.id} className="p-4 bg-gray-50/60 rounded-2xl border border-gray-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-gray-900">{rev.user.name}</span>
                    <span className="text-[11px] text-gray-400">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <StarRating rating={rev.rating} showCount={false} size="sm" />
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{rev.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500 text-center py-6">No customer reviews yet. Be the first to review!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
