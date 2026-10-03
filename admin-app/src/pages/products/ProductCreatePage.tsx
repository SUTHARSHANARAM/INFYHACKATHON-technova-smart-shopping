import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, Plus, Trash2, Package } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { Category } from '../../types';
import { useToast } from '../../context/ToastContext';

const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  brand: z.string().min(1, 'Brand is required'),
  SKU: z.string().min(3, 'SKU is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().positive('Price must be greater than 0'),
  originalPrice: z.coerce.number().positive('Original price must be greater than 0'),
  discount: z.coerce.number().min(0).default(0),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative'),
  categoryId: z.string().uuid('Please select a valid category'),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
});

type ProductFormValues = z.infer<typeof productSchema>;

export const ProductCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>(['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800']);
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([
    { key: 'Processor', value: 'Intel Core i7' },
    { key: 'RAM', value: '16 GB' },
  ]);

  useEffect(() => {
    adminService.getCategories().then((res) => {
      if (res.data) setCategories(res.data);
    }).catch(console.error);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: { discount: 0, stock: 10, featured: false, active: true },
  });

  const handleAddImageUrl = () => setImageUrls([...imageUrls, '']);
  const handleImageChange = (idx: number, val: string) => {
    const copy = [...imageUrls];
    copy[idx] = val;
    setImageUrls(copy);
  };
  const handleRemoveImageUrl = (idx: number) => setImageUrls(imageUrls.filter((_, i) => i !== idx));

  const handleAddSpec = () => setSpecs([...specs, { key: '', value: '' }]);
  const handleSpecChange = (idx: number, field: 'key' | 'value', val: string) => {
    const copy = [...specs];
    copy[idx][field] = val;
    setSpecs(copy);
  };
  const handleRemoveSpec = (idx: number) => setSpecs(specs.filter((_, i) => i !== idx));

  const onSubmit = async (values: ProductFormValues) => {
    try {
      const validImages = imageUrls.filter((url) => url.trim() !== '');
      if (validImages.length === 0) {
        showToast('Please provide at least one product image URL', 'error');
        return;
      }

      const specificationsObj: Record<string, string> = {};
      specs.forEach((s) => {
        if (s.key.trim()) specificationsObj[s.key.trim()] = s.value.trim();
      });

      const payload = {
        ...values,
        images: validImages,
        specifications: specificationsObj,
      };

      await adminService.createProduct(payload);
      showToast(`Product "${values.name}" created successfully!`, 'success');
      navigate('/products');
    } catch (err: any) {
      showToast(err.message || 'Failed to create product', 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/products" className="text-xs font-bold text-sky-400 hover:underline flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" /> Back to Products List
      </Link>

      <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-sm space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-sky-400" /> Create New Product
          </h1>
          <p className="text-xs text-slate-400 mt-1">Add a new technology item to TechNova shared database</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Main Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Product Name</label>
              <input
                type="text"
                placeholder="Asus ROG Strix Laptop"
                {...register('name')}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
              />
              {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Brand</label>
              <input
                type="text"
                placeholder="Asus"
                {...register('brand')}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
              />
              {errors.brand && <p className="text-xs text-rose-400 mt-1">{errors.brand.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">SKU Code (Unique)</label>
              <input
                type="text"
                placeholder="ASU-ROG-2026"
                {...register('SKU')}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono"
              />
              {errors.SKU && <p className="text-xs text-rose-400 mt-1">{errors.SKU.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Category</label>
              <select
                {...register('categoryId')}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
              >
                <option value="">-- Select Category --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {errors.categoryId && <p className="text-xs text-rose-400 mt-1">{errors.categoryId.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Description</label>
            <textarea
              rows={3}
              placeholder="Detailed product overview..."
              {...register('description')}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
            />
            {errors.description && <p className="text-xs text-rose-400 mt-1">{errors.description.message}</p>}
          </div>

          {/* Pricing & Inventory */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-950 rounded-2xl border border-slate-800">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Selling Price (₹)</label>
              <input
                type="number"
                step="0.01"
                {...register('price')}
                className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
              />
              {errors.price && <p className="text-xs text-rose-400 mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Original Price (₹)</label>
              <input
                type="number"
                step="0.01"
                {...register('originalPrice')}
                className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
              />
              {errors.originalPrice && <p className="text-xs text-rose-400 mt-1">{errors.originalPrice.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Discount %</label>
              <input
                type="number"
                step="0.01"
                {...register('discount')}
                className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Stock Quantity</label>
              <input
                type="number"
                {...register('stock')}
                className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
              />
              {errors.stock && <p className="text-xs text-rose-400 mt-1">{errors.stock.message}</p>}
            </div>
          </div>

          {/* Images List Editor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-300 uppercase">Product Image URLs</label>
              <button type="button" onClick={handleAddImageUrl} className="text-xs text-sky-400 font-bold flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Add Image URL
              </button>
            </div>
            {imageUrls.map((url, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={url}
                  onChange={(e) => handleImageChange(i, e.target.value)}
                  className="flex-1 p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
                <button type="button" onClick={() => handleRemoveImageUrl(i)} className="p-2 text-rose-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Key-Value Specifications Editor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-300 uppercase">Technical Specifications</label>
              <button type="button" onClick={handleAddSpec} className="text-xs text-sky-400 font-bold flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Add Specification Pair
              </button>
            </div>
            {specs.map((s, i) => (
              <div key={i} className="grid grid-cols-5 gap-2 items-center">
                <input
                  type="text"
                  placeholder="Key (e.g. GPU)"
                  value={s.key}
                  onChange={(e) => handleSpecChange(i, 'key', e.target.value)}
                  className="col-span-2 p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
                <input
                  type="text"
                  placeholder="Value (e.g. RTX 4080)"
                  value={s.value}
                  onChange={(e) => handleSpecChange(i, 'value', e.target.value)}
                  className="col-span-2 p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
                <button type="button" onClick={() => handleRemoveSpec(i)} className="p-2 text-rose-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
              <input type="checkbox" {...register('featured')} className="rounded border-slate-700 bg-slate-950 text-sky-500" />
              Featured Flagship Item
            </label>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
              <input type="checkbox" {...register('active')} className="rounded border-slate-700 bg-slate-950 text-sky-500" />
              Active in Storefront
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-sky-600/20 flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" /> {isSubmitting ? 'Saving Product...' : 'Create Product'}
          </button>
        </form>
      </div>
    </div>
  );
};
