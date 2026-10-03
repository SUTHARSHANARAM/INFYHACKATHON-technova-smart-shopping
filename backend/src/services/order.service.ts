import { prisma } from '../config/prisma';
import { ApiError } from '../utils/apiError';
import { OrderStatus } from '@prisma/client';

export class OrderService {
  static async createOrder(userId: string, addressId: string) {
    // Validate address belongs to user
    const address = await prisma.address.findUnique({ where: { id: addressId } });
    if (!address || address.userId !== userId) {
      throw ApiError.badRequest('Invalid shipping address');
    }

    // Load user cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw ApiError.badRequest('Your shopping cart is empty');
    }

    // Execute atomic transaction for checkout
    return await prisma.$transaction(async (tx) => {
      let subtotal = 0;
      const orderItemDataList: any[] = [];

      for (const item of cart.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product || !product.active) {
          throw ApiError.badRequest(`Product "${item.product.name}" is no longer available.`);
        }

        if (product.stock < item.quantity) {
          throw ApiError.badRequest(
            `Insufficient stock for "${product.name}". Required: ${item.quantity}, Available: ${product.stock}`
          );
        }

        const itemTotal = product.price * item.quantity;
        subtotal += itemTotal;

        const images = product.images as string[];

        orderItemDataList.push({
          productId: product.id,
          productName: product.name,
          SKU: product.SKU,
          unitPrice: product.price,
          quantity: item.quantity,
          totalPrice: itemTotal,
          image: images[0] || '',
        });

        // Deduct product stock
        await tx.product.update({
          where: { id: product.id },
          data: {
            stock: { decrement: item.quantity },
          },
        });
      }

      const total = subtotal; // Can extend to calculate taxes/discounts dynamically if needed
      const orderNumber = 'TN-' + Date.now().toString().slice(-6) + Math.floor(100 + Math.random() * 900);

      const addressSnapshot = {
        fullName: address.fullName,
        phone: address.phone,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        country: address.country,
      };

      // Create Order & Items
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          addressId: address.id,
          addressSnapshot,
          subtotal,
          discount: 0,
          total,
          status: OrderStatus.PENDING,
          items: {
            create: orderItemDataList,
          },
        },
        include: {
          items: true,
        },
      });

      // Clear user cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return createdOrder;
    });
  }

  static async getCustomerOrders(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getCustomerOrderById(userId: string, orderId: string) {
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
      include: { items: true },
    });

    if (!order) {
      throw ApiError.notFound('Order not found');
    }

    return order;
  }
}
