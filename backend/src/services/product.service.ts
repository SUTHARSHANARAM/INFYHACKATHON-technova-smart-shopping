import { prisma } from '../config/prisma';
import { ApiError } from '../utils/apiError';
import { PaginationQuery, PaginatedResult } from '../types';
import { Prisma } from '@prisma/client';

export class ProductService {
  static async getProducts(query: PaginationQuery): Promise<PaginatedResult<any>> {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      active: true, // Only active products for customer facing API
    };

    if (query.search) {
      where.OR = [
        { name: { contains: query.search } },
        { brand: { contains: query.search } },
        { description: { contains: query.search } },
        { SKU: { contains: query.search } },
      ];
    }

    if (query.category) {
      // Find category by slug or id
      const cat = await prisma.category.findFirst({
        where: {
          OR: [{ id: query.category }, { slug: query.category }],
        },
        include: { subcategories: true },
      });

      if (cat) {
        const catIds = [cat.id, ...cat.subcategories.map((s) => s.id)];
        where.categoryId = { in: catIds };
      }
    }

    if (query.subcategory) {
      const sub = await prisma.category.findFirst({
        where: {
          OR: [{ id: query.subcategory }, { slug: query.subcategory }],
        },
      });
      if (sub) {
        where.categoryId = sub.id;
      }
    }

    if (query.brand) {
      where.brand = { equals: query.brand };
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.price = {};
      if (query.minPrice !== undefined && !isNaN(Number(query.minPrice))) {
        where.price.gte = Number(query.minPrice);
      }
      if (query.maxPrice !== undefined && !isNaN(Number(query.maxPrice))) {
        where.price.lte = Number(query.maxPrice);
      }
    }

    if (query.minRating !== undefined && !isNaN(Number(query.minRating))) {
      where.rating = { gte: Number(query.minRating) };
    }

    if (query.featured !== undefined) {
      where.featured = String(query.featured) === 'true';
    }

    if (query.inStock !== undefined && String(query.inStock) === 'true') {
      where.stock = { gt: 0 };
    }

    // Dynamic sorting
    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
    if (query.sortBy) {
      const direction = query.sortOrder === 'asc' ? 'asc' : 'desc';
      switch (query.sortBy) {
        case 'price':
          orderBy = { price: direction };
          break;
        case 'rating':
          orderBy = { rating: direction };
          break;
        case 'name':
          orderBy = { name: direction };
          break;
        case 'popular':
          orderBy = { reviewCount: direction };
          break;
        case 'discount':
          orderBy = { discount: direction };
          break;
        default:
          orderBy = { createdAt: 'desc' };
      }
    }

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getProductById(idOrSlug: string) {
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }, { SKU: idOrSlug }],
        active: true,
      },
      include: {
        category: {
          include: { parent: true },
        },
        reviews: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            user: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!product) {
      throw ApiError.notFound('Product not found');
    }

    return product;
  }

  static async getFeaturedProducts(limit: number = 8) {
    return prisma.product.findMany({
      where: { featured: true, active: true },
      take: limit,
      orderBy: { rating: 'desc' },
      include: { category: { select: { name: true, slug: true } } },
    });
  }

  static async getBrands() {
    const brands = await prisma.product.groupBy({
      by: ['brand'],
      where: { active: true },
      _count: { id: true },
      orderBy: { brand: 'asc' },
    });

    return brands.map((b) => ({ brand: b.brand, count: b._count.id }));
  }
}
