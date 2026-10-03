import { prisma } from '../config/prisma';
import { ApiError } from '../utils/apiError';
import { PasswordUtil } from '../utils/password';
import { JwtUtil } from '../utils/jwt';
import { Role } from '@prisma/client';

export class AuthService {
  static async register(name: string, email: string, password: string): Promise<{ user: any; token: string }> {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw ApiError.conflict('Email address is already registered');
    }

    const passwordHash = await PasswordUtil.hash(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: Role.CUSTOMER, // Always default to CUSTOMER for public register
      },
    });

    const token = JwtUtil.signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Create empty Cart and Wishlist for user
    await prisma.cart.create({ data: { userId: user.id } });
    await prisma.wishlist.create({ data: { userId: user.id } });

    const { passwordHash: _, ...safeUser } = user;
    return { user: safeUser, token };
  }

  static async login(email: string, password: string): Promise<{ user: any; token: string }> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const isMatch = await PasswordUtil.compare(password, user.passwordHash);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const token = JwtUtil.signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const { passwordHash: _, ...safeUser } = user;
    return { user: safeUser, token };
  }

  static async getUserProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        addresses: true,
      },
    });

    if (!user) {
      throw ApiError.notFound('User profile not found');
    }

    return user;
  }
}
