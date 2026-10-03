import { prisma } from '../config/prisma';
import { ApiError } from '../utils/apiError';

export class CategoryService {
  static async getCategories() {
    // Return main top-level categories with subcategories
    return prisma.category.findMany({
      where: { parentId: null },
      include: {
        subcategories: {
          include: {
            _count: { select: { products: true } },
          },
        },
        _count: { select: { products: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  static async getCategoryById(idOrSlug: string) {
    const category = await prisma.category.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        parent: true,
        subcategories: true,
        _count: { select: { products: true } },
      },
    });

    if (!category) {
      throw ApiError.notFound('Category not found');
    }

    return category;
  }
}
