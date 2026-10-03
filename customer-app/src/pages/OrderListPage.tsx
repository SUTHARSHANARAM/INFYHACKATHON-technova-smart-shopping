import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, Clock, CheckCircle2, Truck, PackageCheck } from 'lucide-react';
import { orderService } from '../services/orderService';
import { Order, OrderStatus } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { useToast } from '../context/ToastContext';

export const OrderListPage: React.FC = () => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    orderService.getOrders().then((res) => {
      if (res.data) setOrders(res.data);
    }).catch((err) => {
      showToast(err.message || 'Failed to load order history', 'error');
    }).finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return <span className="bg-amber-50 text-amber-700 font-bold text-xs px-3 py-1 rounded-full border border-amber-200">Pending</span>;
      case 'CONFIRMED':
        return <span className="bg-sky-50 text-sky-700 font-bold text-xs px-3 py-1 rounded-full border border-sky-200">Confirmed</span>;
      case 'PROCESSING':
        return <span className="bg-indigo-50 text-indigo-700 font-bold text-xs px-3 py-1 rounded-full border border-indigo-200">Processing</span>;
      case 'SHIPPED':
        return <span className="bg-purple-50 text-purple-700 font-bold text-xs px-3 py-1 rounded-full border border-purple-200">Shipped</span>;
      case 'DELIVERED':
        return <span className="bg-emerald-50 text-emerald-700 font-bold text-xs px-3 py-1 rounded-full border border-emerald-200">Delivered</span>;
      default:
        return null;
    }
  };

  if (loading) return <LoadingSpinner label="Fetching your order history..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="pb-4 border-b border-gray-100">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
          <Package className="w-7 h-7 text-brand-600" /> Order History
        </h1>
        <p className="text-xs text-gray-500 mt-1">Track and view your past TechNova orders</p>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-5 sm:p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 hover:border-gray-200 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                <div>
                  <span className="font-extrabold text-gray-900 text-sm">{order.orderNumber}</span>
                  <span className="text-xs text-gray-400 block sm:inline sm:ml-3">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>{getStatusBadge(order.status)}</div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-3 overflow-hidden">
                    {order.items.slice(0, 3).map((item, idx) => (
                      <img
                        key={idx}
                        src={item.image || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=100'}
                        alt={item.productName}
                        className="w-10 h-10 object-contain bg-gray-50 rounded-xl p-1 border-2 border-white"
                      />
                    ))}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">{order.items.length} Product(s)</p>
                    <p className="text-xs text-gray-500 line-clamp-1">{order.items.map((i) => i.productName).join(', ')}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                  <span className="font-extrabold text-base text-gray-900">
                    ₹{order.total.toLocaleString('en-IN')}
                  </span>
                  <Link
                    to={`/orders/${order.id}`}
                    className="bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-xs px-4 py-2 rounded-xl transition-colors flex items-center gap-1"
                  >
                    View Details <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Package}
          title="No Orders Found"
          description="You haven't placed any orders yet. Browse our catalog to get started."
          actionLabel="Start Shopping"
          actionTo="/products"
        />
      )}
    </div>
  );
};
