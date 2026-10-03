import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { cartService } from '../services/cartService';
import { CartSummary, CartItem } from '../types';
import { QuantitySelector } from '../components/common/QuantitySelector';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { useToast } from '../context/ToastContext';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [cart, setCart] = useState<CartSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await cartService.getCart();
      if (res.data) setCart(res.data);
    } catch (err: any) {
      showToast(err.message || 'Failed to load cart', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (productId: string, newQty: number) => {
    try {
      const res = await cartService.updateCartItem(productId, newQty);
      if (res.data) setCart(res.data);
      showToast('Cart updated', 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to update quantity', 'error');
    }
  };

  const handleRemove = async (productId: string, name: string) => {
    try {
      const res = await cartService.removeCartItem(productId);
      if (res.data) setCart(res.data);
      showToast(`Removed ${name} from cart`, 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to remove item', 'error');
    }
  };

  const handleClearCart = async () => {
    try {
      await cartService.clearCart();
      await fetchCart();
      showToast('Cart cleared', 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to clear cart', 'error');
    }
  };

  if (loading) return <LoadingSpinner label="Loading your shopping cart..." />;

  const items = cart?.items || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-7 h-7 text-brand-600" /> Shopping Cart
          </h1>
          <p className="text-xs text-gray-500 mt-1">{cart?.itemCount || 0} items in your order</p>
        </div>
        {items.length > 0 && (
          <button
            onClick={handleClearCart}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear Cart
          </button>
        )}
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=200'}
                    alt={item.productName}
                    className="w-20 h-20 object-contain bg-gray-50 rounded-xl p-2 flex-shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{item.brand}</span>
                    <Link
                      to={`/products/${item.productId}`}
                      className="block font-bold text-sm text-gray-900 hover:text-brand-600 line-clamp-2"
                    >
                      {item.productName}
                    </Link>
                    <p className="text-xs text-gray-500 mt-1">
                      Unit Price: ₹{item.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
                  <QuantitySelector
                    quantity={item.quantity}
                    maxStock={item.stock}
                    onChange={(qty) => handleQuantityChange(item.productId, qty)}
                  />

                  <div className="text-right min-w-[90px]">
                    <span className="block font-extrabold text-base text-gray-900">
                      ₹{item.totalItemPrice.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <button
                    onClick={() => handleRemove(item.productId, item.productName)}
                    className="p-2 text-gray-400 hover:text-rose-500 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Order Summary Sidebar */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6 sticky top-28">
            <h2 className="text-lg font-bold text-gray-900 pb-3 border-b border-gray-100">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cart?.itemCount} items)</span>
                <span className="font-semibold text-gray-900">₹{cart?.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Estimated Shipping</span>
                <span className="font-semibold text-emerald-600">FREE</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Simulated Taxes</span>
                <span className="font-semibold text-gray-900">Included</span>
              </div>
              <div className="pt-3 border-t border-gray-100 flex justify-between text-lg font-extrabold text-gray-900">
                <span>Total Amount</span>
                <span className="text-brand-600">₹{cart?.subtotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-2xl transition-all shadow-md shadow-brand-500/20 flex items-center justify-center gap-2 text-sm"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </button>

            <div className="space-y-2 pt-2 text-[11px] text-gray-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-600" />
                <span>Simulated 256-bit Secure Checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-brand-600" />
                <span>Free Express Doorstep Delivery</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={ShoppingBag}
          title="Your Shopping Cart is Empty"
          description="Looks like you haven't added any products to your cart yet. Explore our laptops, smartphones, and accessories."
          actionLabel="Start Shopping"
          actionTo="/products"
        />
      )}
    </div>
  );
};
