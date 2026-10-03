import { Request, Response, NextFunction } from 'express';
import { WishlistService } from '../services/wishlist.service';
import { ApiResponse } from '../utils/apiResponse';

export class WishlistController {
  static async getWishlist(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const wishlist = await WishlistService.getWishlist(userId);
      return ApiResponse.success(res, wishlist, 'Wishlist retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async addToWishlist(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { productId } = req.body;
      const item = await WishlistService.addToWishlist(userId, productId);
      return ApiResponse.created(res, item, 'Item added to wishlist');
    } catch (error) {
      next(error);
    }
  }

  static async removeFromWishlist(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const productId = req.params.productId as string;
      const result = await WishlistService.removeFromWishlist(userId, productId);
      return ApiResponse.success(res, result, 'Item removed from wishlist');
    } catch (error) {
      next(error);
    }
  }
}
