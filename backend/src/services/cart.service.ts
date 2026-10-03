import { prisma } from '../config/prisma';
import { ApiError } from '../utils/apiError';

export class CartService {
  static async getCart(userId: string) {
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                brand: true,
                price: true,
                originalPrice: true,
                stock: true,
                images: true,
                active: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    }

    // Calculate cart summary metrics
    const items = cart.items.map((item) => {
      const imgList = item.product.images as string[];
      return {
        id: item.id,
        productId: item.productId,
        productName: item.product.name,
        productSlug: item.product.slug,
        brand: item.product.brand,
        price: item.product.price,
        originalPrice: item.product.originalPrice,
        stock: item.product.stock,
        quantity: item.quantity,
        totalItemPrice: item.product.price * item.quantity,
        image: imgList[0] || '',
        active: item.product.active,
      };
    });

    const subtotal = items.reduce((sum, item) => sum + item.totalItemPrice, 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      id: cart.id,
      userId: cart.userId,
      items,
      itemCount,
      subtotal,
    };
  }

  static async addToCart(userId: string, productId: string, quantity: number) {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || !product.active) {
      throw ApiError.notFound('Product not available');
    }

    if (quantity <= 0) {
      throw ApiError.badRequest('Quantity must be greater than 0');
    }

    if (product.stock < quantity) {
      throw ApiError.badRequest(`Insufficient stock available. Only ${product.stock} items remaining.`);
    }

    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } });
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (product.stock < newQuantity) {
        throw ApiError.badRequest(`Cannot add more. Stock limit of ${product.stock} reached.`);
      }

      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    return this.getCart(userId);
  }

  static async updateCartItem(userId: string, productId: string, quantity: number) {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      throw ApiError.notFound('Cart not found');
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      throw ApiError.notFound('Product not found');
    }

    if (quantity <= 0) {
      return this.removeCartItem(userId, productId);
    }

    if (product.stock < quantity) {
      throw ApiError.badRequest(`Insufficient stock. Only ${product.stock} units available.`);
    }

    const item = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (!item) {
      throw ApiError.notFound('Item not in cart');
    }

    await prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity },
    });

    return this.getCart(userId);
  }

  static async removeCartItem(userId: string, productId: string) {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      throw ApiError.notFound('Cart not found');
    }

    const item = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (item) {
      await prisma.cartItem.delete({ where: { id: item.id } });
    }

    return this.getCart(userId);
  }

  static async clearCart(userId: string) {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
    return { message: 'Cart cleared successfully' };
  }
}
