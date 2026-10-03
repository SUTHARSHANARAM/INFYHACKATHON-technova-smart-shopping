import { prisma } from '../config/prisma';
import { ApiError } from '../utils/apiError';

export class WishlistService {
  static async getWishlist(userId: string) {
    let wishlist = await prisma.wishlist.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: { category: { select: { name: true, slug: true } } },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                include: { category: { select: { name: true, slug: true } } },
              },
            },
          },
        },
      });
    }

    return wishlist;
  }

  static async addToWishlist(userId: string, productId: string) {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      throw ApiError.notFound('Product not found');
    }

    let wishlist = await prisma.wishlist.findUnique({ where: { userId } });
    if (!wishlist) {
      wishlist = await prisma.wishlist.create({ data: { userId } });
    }

    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId,
        },
      },
    });

    if (existingItem) {
      throw ApiError.conflict('Product is already in wishlist');
    }

    const item = await prisma.wishlistItem.create({
      data: {
        wishlistId: wishlist.id,
        productId,
      },
      include: { product: true },
    });

    return item;
  }

  static async removeFromWishlist(userId: string, productId: string) {
    const wishlist = await prisma.wishlist.findUnique({ where: { userId } });
    if (!wishlist) {
      throw ApiError.notFound('Wishlist not found');
    }

    const item = await prisma.wishlistItem.findUnique({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId,
        },
      },
    });

    if (!item) {
      throw ApiError.notFound('Item not found in wishlist');
    }

    await prisma.wishlistItem.delete({
      where: { id: item.id },
    });

    return { message: 'Item removed from wishlist successfully' };
  }
}
