import React from 'react';
import { OrderStatus } from '../../types';

export const OrderStatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
  switch (status) {
    case 'PENDING':
      return <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold text-xs px-2.5 py-1 rounded-lg">PENDING</span>;
    case 'CONFIRMED':
      return <span className="bg-sky-500/10 text-sky-400 border border-sky-500/20 font-bold text-xs px-2.5 py-1 rounded-lg">CONFIRMED</span>;
    case 'PROCESSING':
      return <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold text-xs px-2.5 py-1 rounded-lg">PROCESSING</span>;
    case 'SHIPPED':
      return <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold text-xs px-2.5 py-1 rounded-lg">SHIPPED</span>;
    case 'DELIVERED':
      return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-xs px-2.5 py-1 rounded-lg">DELIVERED</span>;
    default:
      return null;
  }
};

export const StockBadge: React.FC<{ stock: number }> = ({ stock }) => {
  if (stock <= 0) {
    return <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold text-[11px] px-2.5 py-0.5 rounded-full">Out of Stock</span>;
  }
  if (stock <= 10) {
    return <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold text-[11px] px-2.5 py-0.5 rounded-full">Low Stock ({stock})</span>;
  }
  return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[11px] px-2.5 py-0.5 rounded-full">In Stock ({stock})</span>;
};
