import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, Filter, Eye } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { Order, OrderStatus, PaginatedResult } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { OrderStatusBadge } from '../../components/common/StatusBadge';
import { useToast } from '../../context/ToastContext';

export const OrderListPage: React.FC = () => {
  const { showToast } = useToast();
  const [data, setData] = useState<PaginatedResult<Order> | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter, search]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await adminService.getOrders({ page, limit: 15, status: statusFilter, search });
      if (res.data) setData(res.data);
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-sky-400" /> Order Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">Review orders and manage status progression lifecycle</p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="bg-slate-950 border border-slate-800 text-xs font-semibold text-white px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="">All Order Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="DELIVERED">DELIVERED</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <LoadingSpinner label="Fetching order records..." />
      ) : (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px] bg-slate-950/60">
                  <th className="py-3.5 px-4">Order #</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Items Count</th>
                  <th className="py-3.5 px-4">Total Amount</th>
                  <th className="py-3.5 px-4">Order Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {data?.items && data.items.length > 0 ? (
                  data.items.map((ord) => (
                    <tr key={ord.id} className="border-b border-slate-800/60 hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-bold text-white">{ord.orderNumber}</td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-200 block">{ord.user?.name || ord.addressSnapshot?.fullName}</span>
                        <span className="text-[10px] text-slate-500">{ord.user?.email}</span>
                      </td>
                      <td className="py-3 px-4 font-medium">{ord.items.length} item(s)</td>
                      <td className="py-3 px-4 font-bold text-white">₹{ord.total.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4 text-slate-400">{new Date(ord.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4"><OrderStatusBadge status={ord.status} /></td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          to={`/orders/${ord.id}`}
                          className="p-1.5 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 font-bold text-xs rounded-xl transition-colors inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> Manage
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500">
                      No order records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
