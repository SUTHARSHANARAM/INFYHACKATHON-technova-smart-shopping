import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';
import { JwtUtil } from '../utils/jwt';
import { Role } from '@prisma/client';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Authentication token required');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw ApiError.unauthorized('Authentication token required');
    }

    const payload = JwtUtil.verifyToken(token);
    req.user = payload;
    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(ApiError.unauthorized('Invalid or expired authentication token'));
    }
    next(error);
  }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  requireAuth(req, res, (err) => {
    if (err) return next(err);
    if (!req.user || req.user.role !== Role.ADMIN) {
      return next(ApiError.forbidden('Admin permissions required to perform this action'));
    }
    next();
  });
};
