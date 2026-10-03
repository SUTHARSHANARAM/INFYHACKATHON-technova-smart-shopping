import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'Product name must be at least 3 characters'),
    brand: z.string().min(1, 'Brand is required'),
    SKU: z.string().min(3, 'SKU is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    price: z.number().positive('Price must be greater than 0'),
    originalPrice: z.number().positive('Original price must be greater than 0'),
    discount: z.number().min(0, 'Discount cannot be negative').default(0),
    stock: z.number().int().min(0, 'Stock cannot be negative'),
    categoryId: z.string().uuid('Invalid category ID'),
    featured: z.boolean().default(false),
    active: z.boolean().default(true),
    images: z.array(z.string().url('Image must be a valid URL')).min(1, 'At least one image is required'),
    specifications: z.record(z.any()).default({}),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid product ID'),
  }),
  body: z.object({
    name: z.string().min(3).optional(),
    brand: z.string().min(1).optional(),
    SKU: z.string().min(3).optional(),
    description: z.string().min(10).optional(),
    price: z.number().positive().optional(),
    originalPrice: z.number().positive().optional(),
    discount: z.number().min(0).optional(),
    stock: z.number().int().min(0).optional(),
    categoryId: z.string().uuid().optional(),
    featured: z.boolean().optional(),
    active: z.boolean().optional(),
    images: z.array(z.string().url()).min(1).optional(),
    specifications: z.record(z.any()).optional(),
  }),
});
