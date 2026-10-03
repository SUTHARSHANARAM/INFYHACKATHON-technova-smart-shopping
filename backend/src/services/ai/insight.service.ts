import { prisma } from '../../config/prisma';
import { ApiError } from '../../utils/apiError';

export class AiInsightService {
  static async getProductInsight(productId: string, question?: string) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: { select: { name: true } },
        reviews: { select: { rating: true, comment: true }, take: 5 },
      },
    });

    if (!product || !product.active) {
      throw ApiError.notFound('Product not found in store database');
    }

    const specs = (product.specifications || {}) as Record<string, any>;
    const images = product.images as string[];

    const keyHighlights = Object.entries(specs)
      .slice(0, 4)
      .map(([k, v]) => `${k}: ${v}`);

    const reviewSentiment =
      product.rating >= 4.5
        ? 'Overwhelmingly Positive (Customers highlight superior performance and premium build)'
        : product.rating >= 4.0
        ? 'Very Positive'
        : 'Mixed Reviews';

    const insight = {
      product: {
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        originalPrice: product.originalPrice,
        discount: `${product.discount}% OFF`,
        rating: `${product.rating}/5 (${product.reviewCount} reviews)`,
        category: product.category.name,
        image: images[0] || '',
      },
      keyHighlights,
      reviewSentiment,
      aiSummary: `The ${product.name} offers impressive value at ₹${product.price.toLocaleString('en-IN')}. Featuring ${
        keyHighlights.join(', ') || 'flagship hardware'
      }. It is backed by a ${product.rating}/5 rating based on ${product.reviewCount} customer reviews.`,
    };

    return insight;
  }
}
