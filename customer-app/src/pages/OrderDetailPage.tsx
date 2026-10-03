import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Package, MapPin, Calendar, ArrowLeft } from 'lucide-react';
import { orderService } from '../services/orderService';
import { Order } from '../types';
import { OrderStatusTimeline } from '../components/orders/OrderStatusTimeline';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;
    orderService.getOrderById(id).then((res) => {
      if (res.data) setOrder(res.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner label="Loading order details..." />;
  if (!order) return <div className="p-8 text-center text-gray-500">Order not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Link to="/orders" className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" /> Back to Orders
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Order {order.orderNumber}
          </h1>
          <p className="text-xs text-gray-500 mt-1">Placed on {new Date(order.createdAt).toLocaleString()}</p>
        </div>
      </div>

      {/* Status Timeline */}
      <OrderStatusTimeline currentStatus={order.status} />

      {/* Items Breakdown & Address Snapshot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-gray-900 pb-2 border-b border-gray-100">Items Ordered</h3>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={item.image || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=100'} alt={item.productName} className="w-12 h-12 object-contain bg-gray-50 rounded-xl p-1" />
                  <div>
                    <h4 className="font-bold text-xs text-gray-900">{item.productName}</h4>
                    <p className="text-[11px] text-gray-500">Qty: {item.quantity} x ₹{item.unitPrice.toLocaleString('en-IN')}</p>
                  </div>
                </div>
                <span className="font-bold text-xs text-gray-900">₹{item.totalPrice.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-sm font-extrabold text-gray-900">
            <span>Grand Total</span>
            <span className="text-brand-600">₹{order.total.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Shipping Address Snapshot */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
          <h3 className="font-bold text-sm text-gray-900 pb-2 border-b border-gray-100 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand-600" /> Delivery Address
          </h3>
          <p className="font-bold text-xs text-gray-900">{order.addressSnapshot.fullName}</p>
          <p className="text-xs text-gray-600 leading-relaxed">
            {order.addressSnapshot.addressLine1} {order.addressSnapshot.addressLine2 && `, ${order.addressSnapshot.addressLine2}`}
            <br />
            {order.addressSnapshot.city}, {order.addressSnapshot.state} - {order.addressSnapshot.postalCode}
          </p>
          <p className="text-xs font-semibold text-gray-800">Phone: {order.addressSnapshot.phone}</p>
        </div>
      </div>
    </div>
  );
};
