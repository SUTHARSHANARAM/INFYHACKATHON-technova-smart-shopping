import { prisma } from '../config/prisma';
import { ApiError } from '../utils/apiError';
import { OrderStatus, Prisma } from '@prisma/client';

export class AdminService {
  // --- DASHBOARD ---
  static async getDashboardMetrics() {
    const [
      totalProducts,
      totalUsers,
      totalOrders,
      revenueResult,
      lowStockProducts,
      recentOrders,
      ordersByStatus,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.product.findMany({
        where: { stock: { lte: 10 } },
        take: 10,
        orderBy: { stock: 'asc' },
        include: { category: { select: { name: true } } },
      }),
      prisma.order.findMany({
        take: 8,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true } },
        },
      }),
      prisma.order.groupBy({
        by: ['status'],
        _count: { id: true },
      }),
    ]);

    const totalRevenue = revenueResult._sum.total || 0;

    return {
      totalProducts,
      totalUsers,
      totalOrders,
      totalRevenue,
      lowStockProducts,
      recentOrders,
      ordersByStatus: ordersByStatus.map((item) => ({
        status: item.status,
        count: item._count.id,
      })),
    };
  }

  // --- PRODUCTS MANAGEMENT ---
  static async getAdminProducts(query: any) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};

    if (query.search) {
      where.OR = [
        { name: { contains: query.search } },
        { brand: { contains: query.search } },
        { SKU: { contains: query.search } },
      ];
    }

    if (query.category) {
      where.categoryId = query.category;
    }

    if (query.active !== undefined) {
      where.active = String(query.active) === 'true';
    }

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: { select: { id: true, name: true, slug: true } },
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

  static async createProduct(data: any) {
    const existingSKU = await prisma.product.findUnique({ where: { SKU: data.SKU } });
    if (existingSKU) {
      throw ApiError.conflict(`Product with SKU "${data.SKU}" already exists`);
    }

    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.floor(1000 + Math.random() * 9000);

    return prisma.product.create({
      data: {
        ...data,
        slug,
      },
      include: { category: true },
    });
  }

  static async updateProduct(id: string, data: any) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw ApiError.notFound('Product not found');
    }

    if (data.SKU && data.SKU !== product.SKU) {
      const existingSKU = await prisma.product.findUnique({ where: { SKU: data.SKU } });
      if (existingSKU) {
        throw ApiError.conflict(`SKU "${data.SKU}" is already in use`);
      }
    }

    return prisma.product.update({
      where: { id },
      data,
      include: { category: true },
    });
  }

  static async deleteProduct(id: string) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw ApiError.notFound('Product not found');
    }

    // Soft delete / de-activate product to keep historical order items intact
    return prisma.product.update({
      where: { id },
      data: { active: false },
    });
  }

  // --- CATEGORIES MANAGEMENT ---
  static async createCategory(data: any) {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      throw ApiError.conflict('Category with this name/slug already exists');
    }

    return prisma.category.create({
      data: {
        ...data,
        slug,
      },
    });
  }

  static async updateCategory(id: string, data: any) {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw ApiError.notFound('Category not found');
    }

    if (data.name && data.name !== category.name) {
      const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      data.slug = slug;
    }

    return prisma.category.update({
      where: { id },
      data,
    });
  }

  static async deleteCategory(id: string) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        products: { select: { id: true } },
        subcategories: { select: { id: true } },
      },
    });

    if (!category) {
      throw ApiError.notFound('Category not found');
    }

    if (category.products.length > 0) {
      throw ApiError.badRequest(
        `Cannot delete category "${category.name}" because it contains ${category.products.length} products. Reassign or delete the products first.`
      );
    }

    return prisma.category.delete({ where: { id } });
  }

  // --- ORDERS MANAGEMENT ---
  static async getAdminOrders(query: any) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = {};

    if (query.status) {
      where.status = query.status as OrderStatus;
    }

    if (query.search) {
      where.OR = [
        { orderNumber: { contains: query.search } },
        { user: { name: { contains: query.search } } },
        { user: { email: { contains: query.search } } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true } },
          items: true,
        },
      }),
      prisma.order.count({ where }),
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

  static async getOrderById(id: string) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: true,
        address: true,
      },
    });

    if (!order) {
      throw ApiError.notFound('Order not found');
    }

    return order;
  }

  static async updateOrderStatus(id: string, newStatus: OrderStatus) {
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw ApiError.notFound('Order not found');
    }

    // Validate lifecycle status flow: PENDING -> CONFIRMED -> PROCESSING -> SHIPPED -> DELIVERED
    const validFlow: Record<OrderStatus, OrderStatus[]> = {
      PENDING: [OrderStatus.CONFIRMED],
      CONFIRMED: [OrderStatus.PROCESSING],
      PROCESSING: [OrderStatus.SHIPPED],
      SHIPPED: [OrderStatus.DELIVERED],
      DELIVERED: [],
    };

    const allowedNextStatuses = validFlow[order.status];
    if (!allowedNextStatuses.includes(newStatus) && order.status !== newStatus) {
      throw ApiError.badRequest(
        `Invalid order status transition from "${order.status}" to "${newStatus}". Allowed next status: ${
          allowedNextStatuses.join(', ') || 'None (Order is already DELIVERED)'
        }`
      );
    }

    return prisma.order.update({
      where: { id },
      data: { status: newStatus },
      include: { items: true, user: { select: { name: true, email: true } } },
    });
  }

  // --- USER MANAGEMENT ---
  static async getAdminUsers(query: any) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {};

    if (query.search) {
      where.OR = [
        { name: { contains: query.search } },
        { email: { contains: query.search } },
      ];
    }

    if (query.role) {
      where.role = query.role;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          _count: { select: { orders: true, reviews: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      items: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
