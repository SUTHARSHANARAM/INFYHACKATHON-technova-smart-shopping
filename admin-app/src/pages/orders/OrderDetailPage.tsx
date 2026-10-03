import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, User as UserIcon, CheckCircle2, ArrowRight, ShieldAlert } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { Order, OrderStatus } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { OrderStatusBadge } from '../../components/common/StatusBadge';
import { useToast } from '../../context/ToastContext';

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await adminService.getOrderById(id);
      if (res.data) setOrder(res.data);
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch order', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getNextAllowedStatus = (current: OrderStatus): OrderStatus | null => {
    switch (current) {
      case 'PENDING': return 'CONFIRMED';
      case 'CONFIRMED': return 'PROCESSING';
      case 'PROCESSING': return 'SHIPPED';
      case 'SHIPPED': return 'DELIVERED';
      case 'DELIVERED': return null;
      default: return null;
    }
  };

  const handleUpdateStatus = async (nextStatus: OrderStatus) => {
    if (!order) return;
    if (!window.confirm(`Update order ${order.orderNumber} status from "${order.status}" to "${nextStatus}"?`)) return;

    setUpdating(true);
    try {
      const res = await adminService.updateOrderStatus(order.id, nextStatus);
      if (res.data) {
        setOrder(res.data);
        showToast(`Order status updated to ${nextStatus}!`, 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update order status', 'error');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading order details..." />;
  if (!order) return <div className="p-8 text-center text-slate-400">Order not found.</div>;

  const nextStatus = getNextAllowedStatus(order.status);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/orders" className="text-xs font-bold text-sky-400 hover:underline flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" /> Back to Orders List
      </Link>

      {/* Header & Status Change Action */}
      <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">Order {order.orderNumber}</h1>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="text-xs text-slate-400 mt-1">Placed on {new Date(order.createdAt).toLocaleString()}</p>
          </div>

          {/* Lifecycle Action Button */}
          {nextStatus ? (
            <button
              onClick={() => handleUpdateStatus(nextStatus)}
              disabled={updating}
              className="bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-sky-600/20 flex items-center justify-center gap-2 transition-all"
            >
              Advance Status to <span className="underline">{nextStatus}</span> <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <span className="bg-emerald-500/10 text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-xl border border-emerald-500/20 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Order Fully Delivered
            </span>
          )}
        </div>

        {/* Status progression flow explanation */}
        <div className="text-[11px] text-slate-400 flex items-center gap-2">
          <span>Lifecycle Flow:</span>
          <span className="font-mono text-slate-300">PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED</span>
        </div>
      </div>

      {/* Order Items & Customer Snapshot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-white pb-3 border-b border-slate-800">Order Items</h3>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-slate-950/60 rounded-2xl border border-slate-800/60 text-xs">
                <div className="flex items-center gap-3">
                  <img src={item.image || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=100'} alt={item.productName} className="w-10 h-10 object-contain bg-slate-900 rounded-lg p-1" />
                  <div>
                    <h4 className="font-bold text-slate-200">{item.productName}</h4>
                    <span className="text-[10px] text-slate-400">SKU: {item.SKU} | Qty: {item.quantity} x ₹{item.unitPrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <span className="font-bold text-white">₹{item.totalPrice.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-sm font-extrabold text-white">
            <span>Total Order Amount</span>
            <span className="text-sky-400">₹{order.total.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Address & Customer Info */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-sm space-y-4 text-xs">
          <h3 className="font-bold text-sm text-white pb-3 border-b border-slate-800 flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-sky-400" /> Customer Information
          </h3>
          <p className="font-bold text-slate-200">{order.user?.name || order.addressSnapshot?.fullName}</p>
          <p className="text-slate-400">{order.user?.email}</p>

          <h4 className="font-bold text-xs text-white pt-2 border-t border-slate-800 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-sky-400" /> Shipping Address
          </h4>
          <p className="text-slate-300 leading-relaxed">
            {order.addressSnapshot?.addressLine1} {order.addressSnapshot?.addressLine2 && `, ${order.addressSnapshot.addressLine2}`}
            <br />
            {order.addressSnapshot?.city}, {order.addressSnapshot?.state} - {order.addressSnapshot?.postalCode}
          </p>
          <p className="font-semibold text-slate-200">Phone: {order.addressSnapshot?.phone}</p>
        </div>
      </div>
    </div>
  );
};
