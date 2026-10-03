import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Plus, Search, Edit3, Trash2, Check, X } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { Product, PaginatedResult } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { StockBadge } from '../../components/common/StatusBadge';
import { useToast } from '../../context/ToastContext';

export const ProductListPage: React.FC = () => {
  const { showToast } = useToast();
  const [data, setData] = useState<PaginatedResult<Product> | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [page, search]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await adminService.getProducts({ page, limit: 15, search });
      if (res.data) setData(res.data);
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch products', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (id: string, name: string) => {
    if (!window.confirm(`Deactivate product "${name}"? It will no longer appear in customer storefront.`)) return;

    try {
      await adminService.deactivateProduct(id);
      showToast(`Product "${name}" deactivated successfully`, 'info');
      fetchProducts();
    } catch (err: any) {
      showToast(err.message || 'Deactivation failed', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-sky-400" /> Product Inventory Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage catalog prices, stock, images, and specifications</p>
        </div>

        <Link
          to="/products/new"
          className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-sky-600/20 flex items-center justify-center gap-2 transition-all w-fit"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Search by product name, brand, or SKU..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
      </div>

      {/* Product List Table */}
      {loading ? (
        <LoadingSpinner label="Fetching inventory records..." />
      ) : (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px] bg-slate-950/60">
                  <th className="py-3.5 px-4">Item</th>
                  <th className="py-3.5 px-4">Brand / Category</th>
                  <th className="py-3.5 px-4">SKU</th>
                  <th className="py-3.5 px-4">Price (₹)</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4">Active</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.items && data.items.length > 0 ? (
                  data.items.map((prod) => (
                    <tr key={prod.id} className="border-b border-slate-800/60 hover:bg-slate-800/40">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img
                          src={prod.images?.[0] || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=100'}
                          alt={prod.name}
                          className="w-10 h-10 object-contain bg-slate-950 rounded-lg p-1 border border-slate-800 flex-shrink-0"
                        />
                        <span className="font-bold text-white max-w-xs line-clamp-1">{prod.name}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-200 block">{prod.brand}</span>
                        <span className="text-[10px] text-slate-500">{prod.category?.name}</span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-400">{prod.SKU}</td>
                      <td className="py-3 px-4 font-bold text-white">₹{prod.price.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4"><StockBadge stock={prod.stock} /></td>
                      <td className="py-3 px-4">
                        {prod.active ? (
                          <span className="text-emerald-400 font-bold flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Active</span>
                        ) : (
                          <span className="text-slate-500 font-bold flex items-center gap-1"><X className="w-3.5 h-3.5" /> Inactive</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/products/${prod.id}/edit`}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-sky-400 rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Link>
                          {prod.active && (
                            <button
                              onClick={() => handleDeactivate(prod.id, prod.name)}
                              className="p-1.5 bg-slate-800 hover:bg-rose-950 text-rose-400 rounded-lg transition-colors"
                              title="Deactivate Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500">
                      No products found.
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
