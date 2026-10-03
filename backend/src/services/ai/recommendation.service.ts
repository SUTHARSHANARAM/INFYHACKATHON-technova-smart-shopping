import { prisma } from '../../config/prisma';
import { Prisma } from '@prisma/client';

export class AiRecommendationService {
  static async getRecommendations(query: string, maxPrice?: number, categorySlug?: string, useCase?: string) {
    const where: Prisma.ProductWhereInput = { active: true };

    if (maxPrice && !isNaN(maxPrice)) {
      where.price = { lte: maxPrice };
    }

    if (categorySlug) {
      const cat = await prisma.category.findFirst({
        where: { OR: [{ id: categorySlug }, { slug: categorySlug }] },
        include: { subcategories: true },
      });
      if (cat) {
        const catIds = [cat.id, ...cat.subcategories.map((s) => s.id)];
        where.categoryId = { in: catIds };
      }
    }

    // Grounding database query
    const products = await prisma.product.findMany({
      where,
      take: 10,
      orderBy: [{ rating: 'desc' }, { reviewCount: 'desc' }],
      include: { category: { select: { name: true, slug: true } } },
    });

    if (products.length === 0) {
      return {
        matchedProducts: [],
        explanation: `No products matching "${query}" were found under ₹${maxPrice || 'unlimited'} in the database.`,
      };
    }

    const matchedProducts = products.map((p) => {
      const images = p.images as string[];
      return {
        id: p.id,
        name: p.name,
        brand: p.brand,
        price: p.price,
        originalPrice: p.originalPrice,
        discount: p.discount,
        rating: p.rating,
        reviewCount: p.reviewCount,
        stock: p.stock,
        specifications: p.specifications,
        image: images[0] || '',
        category: p.category.name,
      };
    });

    const explanation = `Found ${matchedProducts.length} top-rated products matching your requirement for "${query}". Top recommendation: ${matchedProducts[0].name} priced at ₹${matchedProducts[0].price.toLocaleString('en-IN')} with a rating of ${matchedProducts[0].rating}/5.`;

    return {
      matchedProducts,
      explanation,
    };
  }
}
