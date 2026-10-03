import { prisma } from '../config/prisma';
import { ApiError } from '../utils/apiError';

export class ReviewService {
  static async getProductReviews(productId: string) {
    const reviews = await prisma.review.findMany({
      where: { productId },
      include: {
        user: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return reviews;
  }

  static async createReview(userId: string, productId: string, rating: number, comment: string) {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      throw ApiError.notFound('Product not found');
    }

    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    if (existingReview) {
      throw ApiError.conflict('You have already submitted a review for this product');
    }

    const review = await prisma.review.create({
      data: {
        userId,
        productId,
        rating,
        comment,
      },
    });

    // Update Product average rating & count
    await this.updateProductRatingStats(productId);

    return review;
  }

  static async updateReview(userId: string, reviewId: string, rating?: number, comment?: string) {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) {
      throw ApiError.notFound('Review not found');
    }

    if (review.userId !== userId) {
      throw ApiError.forbidden('You can only update your own review');
    }

    const updated = await prisma.review.update({
      where: { id: reviewId },
      data: {
        ...(rating !== undefined && { rating }),
        ...(comment !== undefined && { comment }),
      },
    });

    await this.updateProductRatingStats(review.productId);

    return updated;
  }

  static async deleteReview(userId: string, reviewId: string) {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) {
      throw ApiError.notFound('Review not found');
    }

    if (review.userId !== userId) {
      throw ApiError.forbidden('You can only delete your own review');
    }

    await prisma.review.delete({ where: { id: reviewId } });

    await this.updateProductRatingStats(review.productId);

    return { message: 'Review deleted successfully' };
  }

  private static async updateProductRatingStats(productId: string) {
    const stats = await prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: { id: true },
    });

    const avgRating = stats._avg.rating ? Number(stats._avg.rating.toFixed(1)) : 0;
    const count = stats._count.id;

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: avgRating,
        reviewCount: count,
      },
    });
  }
}
