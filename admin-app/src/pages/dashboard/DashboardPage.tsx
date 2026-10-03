import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Users,
  ShoppingBag,
  IndianRupee,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { adminService } from '../../services/adminService';
import { DashboardMetrics } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { OrderStatusBadge, StockBadge } from '../../components/common/StatusBadge';

export const DashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    adminService.getDashboard().then((res) => {
      if (res.data) setMetrics(res.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner label="Compiling live SaaS dashboard analytics..." />;
  if (!metrics) return <div className="p-8 text-center text-slate-400">Failed to load dashboard metrics.</div>;

  const chartColors = ['#f59e0b', '#38bdf8', '#818cf8', '#c084fc', '#34d399'];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">System Dashboard</h1>
        <p className="text-xs text-slate-400 mt-1">Real-time overview of TechNova store metrics from shared PostgreSQL database</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Products</span>
            <span className="text-2xl font-extrabold text-white mt-1 block">{metrics.totalProducts}</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/20">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Users</span>
            <span className="text-2xl font-extrabold text-white mt-1 block">{metrics.totalUsers}</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Orders</span>
            <span className="text-2xl font-extrabold text-white mt-1 block">{metrics.totalOrders}</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Revenue</span>
            <span className="text-2xl font-extrabold text-emerald-400 mt-1 block">
              ₹{metrics.totalRevenue.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <IndianRupee className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Analytics & Low Stock Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Recharts Bar Chart: Orders by Status */}
        <div className="lg:col-span-2 bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="font-bold text-sm text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-sky-400" /> Order Lifecycle Status Breakdown
            </h2>
            <span className="text-[10px] text-slate-400 uppercase">Live Distribution</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.ordersByStatus}>
                <XAxis dataKey="status" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {metrics.ordersByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Low Stock Panel */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="font-bold text-sm text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> Low Stock Alerts
            </h2>
            <Link to="/products" className="text-xs text-sky-400 hover:underline">View All</Link>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {metrics.lowStockProducts.length > 0 ? (
              metrics.lowStockProducts.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-xl border border-slate-800 text-xs">
                  <div className="min-w-0 pr-2">
                    <p className="font-bold text-slate-200 truncate">{p.name}</p>
                    <span className="text-[10px] text-slate-500 font-mono">SKU: {p.SKU}</span>
                  </div>
                  <StockBadge stock={p.stock} />
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 text-center py-6">All inventory levels healthy!</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="font-bold text-sm text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-400" /> Recent Customer Orders
          </h2>
          <Link to="/orders" className="text-xs text-sky-400 hover:underline flex items-center gap-1">
            Manage Orders <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {metrics.recentOrders.map((ord) => (
                <tr key={ord.id} className="border-b border-slate-800/60 hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-bold text-white">{ord.orderNumber}</td>
                  <td className="py-3 px-4">{ord.user?.name || ord.addressSnapshot?.fullName}</td>
                  <td className="py-3 px-4">{new Date(ord.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4 font-bold text-slate-200">₹{ord.total.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4"><OrderStatusBadge status={ord.status} /></td>
                  <td className="py-3 px-4 text-right">
                    <Link to={`/orders/${ord.id}`} className="text-sky-400 hover:text-sky-300 font-bold">
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
