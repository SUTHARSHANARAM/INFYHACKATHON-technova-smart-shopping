import { prisma } from '../../config/prisma';
import { ApiError } from '../../utils/apiError';

export class AiComparisonService {
  static async compareProducts(productIds: string[]) {
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        active: true,
      },
      include: {
        category: { select: { name: true } },
      },
    });

    if (products.length < 2) {
      throw ApiError.badRequest('Could not find at least 2 valid active products to compare.');
    }

    // Collect all spec keys across selected products
    const allSpecKeysSet = new Set<string>();
    const productSummaries = products.map((p) => {
      const specs = (p.specifications || {}) as Record<string, any>;
      Object.keys(specs).forEach((k) => allSpecKeysSet.add(k));
      const images = p.images as string[];

      return {
        id: p.id,
        name: p.name,
        brand: p.brand,
        price: p.price,
        originalPrice: p.originalPrice,
        discount: p.discount,
        rating: p.rating,
        stock: p.stock,
        image: images[0] || '',
        specifications: specs,
        category: p.category.name,
      };
    });

    const comparisonMatrix: Record<string, Record<string, string>> = {};
    allSpecKeysSet.forEach((key) => {
      comparisonMatrix[key] = {};
      productSummaries.forEach((p) => {
        comparisonMatrix[key][p.id] = p.specifications[key] || 'N/A';
      });
    });

    const winner = productSummaries.reduce((best, current) =>
      current.rating > best.rating ? current : best
    );

    const verdict = `Comparison complete for ${productSummaries.length} products. "${winner.name}" leads with the highest user rating of ${winner.rating}/5 at ₹${winner.price.toLocaleString('en-IN')}.`;

    return {
      products: productSummaries,
      specKeys: Array.from(allSpecKeysSet),
      comparisonMatrix,
      verdict,
    };
  }
}
