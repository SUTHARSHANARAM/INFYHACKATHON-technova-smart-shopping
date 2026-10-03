import { prisma } from '../config/prisma';
import { ApiError } from '../utils/apiError';

export class AddressService {
  static async getAddresses(userId: string) {
    return prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  static async createAddress(userId: string, data: any) {
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    // If it's the first address, make it default automatically
    const existingCount = await prisma.address.count({ where: { userId } });
    const isDefault = existingCount === 0 ? true : data.isDefault || false;

    return prisma.address.create({
      data: {
        ...data,
        userId,
        isDefault,
      },
    });
  }

  static async updateAddress(userId: string, addressId: string, data: any) {
    const address = await prisma.address.findUnique({ where: { id: addressId } });
    if (!address || address.userId !== userId) {
      throw ApiError.notFound('Address not found');
    }

    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    return prisma.address.update({
      where: { id: addressId },
      data,
    });
  }

  static async deleteAddress(userId: string, addressId: string) {
    const address = await prisma.address.findUnique({ where: { id: addressId } });
    if (!address || address.userId !== userId) {
      throw ApiError.notFound('Address not found');
    }

    await prisma.address.delete({ where: { id: addressId } });
    return { message: 'Address deleted successfully' };
  }
}
