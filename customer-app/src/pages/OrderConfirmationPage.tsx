import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, ArrowRight, MapPin, Calendar, Clock } from 'lucide-react';
import { orderService } from '../services/orderService';
import { Order } from '../types';
import { OrderStatusTimeline } from '../components/orders/OrderStatusTimeline';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const OrderConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;
    orderService.getOrderById(id).then((res) => {
      if (res.data) setOrder(res.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner label="Loading order confirmation..." />;
  if (!order) return <div className="p-8 text-center text-gray-500">Order not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Top Banner */}
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-gray-100 shadow-xl text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          Thank you! Order Placed.
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
          Your order has been received and stored in TechNova. Order Number: <span className="font-bold text-gray-900">{order.orderNumber}</span>
        </p>

        <div className="pt-4 flex flex-wrap justify-center gap-4">
          <Link
            to={`/orders/${order.id}`}
            className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md shadow-brand-500/20"
          >
            View Order Details
          </Link>
          <Link
            to="/products"
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs px-6 py-3 rounded-xl transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>

      {/* Visual Lifecycle Timeline */}
      <OrderStatusTimeline currentStatus={order.status} />

      {/* Order Summary Breakdown */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <h3 className="font-extrabold text-lg text-gray-900 pb-3 border-b border-gray-100">
          Purchased Items ({order.items.length})
        </h3>

        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50/60 rounded-2xl">
              <div className="flex items-center gap-3">
                <img src={item.image || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=100'} alt={item.productName} className="w-12 h-12 object-contain bg-white rounded-xl p-1" />
                <div>
                  <h4 className="font-bold text-xs text-gray-900 line-clamp-1">{item.productName}</h4>
                  <p className="text-[11px] text-gray-500">SKU: {item.SKU} | Qty: {item.quantity}</p>
                </div>
              </div>
              <span className="font-bold text-sm text-gray-900">₹{item.totalPrice.toLocaleString('en-IN')}</span>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-base font-extrabold text-gray-900">
          <span>Total Paid (Simulated)</span>
          <span className="text-brand-600">₹{order.total.toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
  );
};
