import React, { useEffect, useState } from 'react';
import { FolderTree, Plus, Trash2, Edit3, Folder, CornerDownRight } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { Category } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';

export const CategoryListPage: React.FC = () => {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [parentId, setParentId] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await adminService.getCategories();
      if (res.data) setCategories(res.data);
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch categories', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    try {
      const payload: any = { name: name.trim(), description: description.trim() };
      if (parentId) payload.parentId = parentId;

      await adminService.createCategory(payload);
      showToast(`Category "${name}" created successfully!`, 'success');
      setName('');
      setDescription('');
      setParentId('');
      fetchCategories();
    } catch (err: any) {
      showToast(err.message || 'Failed to create category', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: string, catName: string) => {
    if (!window.confirm(`Delete category "${catName}"?`)) return;

    try {
      await adminService.deleteCategory(id);
      showToast(`Category "${catName}" deleted`, 'info');
      fetchCategories();
    } catch (err: any) {
      showToast(err.message || 'Safe delete prevented deletion', 'error');
    }
  };

  if (loading) return <LoadingSpinner label="Loading category taxonomy..." />;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <FolderTree className="w-6 h-6 text-sky-400" /> Category & Taxonomy Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage parent categories, subcategories, and hierarchy</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Category Hierarchy List */}
        <div className="lg:col-span-2 bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-sm space-y-4">
          <h2 className="font-bold text-sm text-white pb-3 border-b border-slate-800 flex items-center justify-between">
            <span>Category Taxonomy Tree</span>
            <span className="text-xs text-slate-400 font-normal">{categories.length} Parent Categories</span>
          </h2>

          <div className="space-y-4">
            {categories.map((cat) => (
              <div key={cat.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/20">
                      <Folder className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white">{cat.name}</h3>
                      <p className="text-[11px] text-slate-400">{cat._count?.products || 0} Products • slug: {cat.slug}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteCategory(cat.id, cat.name)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Subcategories */}
                {cat.subcategories && cat.subcategories.length > 0 && (
                  <div className="pl-6 space-y-2 border-l border-slate-800 ml-4 pt-1">
                    {cat.subcategories.map((sub) => (
                      <div key={sub.id} className="flex items-center justify-between p-2 bg-slate-900/60 rounded-xl border border-slate-800/60">
                        <div className="flex items-center gap-2">
                          <CornerDownRight className="w-3.5 h-3.5 text-slate-500" />
                          <span className="font-semibold text-xs text-slate-300">{sub.name}</span>
                          <span className="text-[10px] text-slate-500">({sub._count?.products || 0} prods)</span>
                        </div>
                        <button
                          onClick={() => handleDeleteCategory(sub.id, sub.name)}
                          className="p-1 text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Add Category Form */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-sm space-y-4 sticky top-24">
          <h2 className="font-bold text-sm text-white pb-3 border-b border-slate-800 flex items-center gap-2">
            <Plus className="w-4 h-4 text-sky-400" /> Add New Category
          </h2>

          <form onSubmit={handleCreateCategory} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Category Name</label>
              <input
                type="text"
                placeholder="e.g. Wearables or Gaming Mice"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Parent Category (Optional)</label>
              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
              >
                <option value="">-- None (Create Parent Category) --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Description</label>
              <textarea
                rows={2}
                placeholder="Short description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !name.trim()}
              className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-sky-600/20 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> {submitting ? 'Creating...' : 'Create Category'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
