import { Request, Response, NextFunction } from 'express';
import { CartService } from '../services/cart.service';
import { ApiResponse } from '../utils/apiResponse';

export class CartController {
  static async getCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const cart = await CartService.getCart(userId);
      return ApiResponse.success(res, cart, 'Cart retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async addToCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { productId, quantity } = req.body;
      const updatedCart = await CartService.addToCart(userId, productId, quantity || 1);
      return ApiResponse.success(res, updatedCart, 'Item added to cart');
    } catch (error) {
      next(error);
    }
  }

  static async updateCartItem(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const productId = req.params.productId as string;
      const { quantity } = req.body;
      const updatedCart = await CartService.updateCartItem(userId, productId, quantity);
      return ApiResponse.success(res, updatedCart, 'Cart quantity updated');
    } catch (error) {
      next(error);
    }
  }

  static async removeCartItem(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const productId = req.params.productId as string;
      const updatedCart = await CartService.removeCartItem(userId, productId);
      return ApiResponse.success(res, updatedCart, 'Item removed from cart');
    } catch (error) {
      next(error);
    }
  }

  static async clearCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const result = await CartService.clearCart(userId);
      return ApiResponse.success(res, result, 'Cart cleared successfully');
    } catch (error) {
      next(error);
    }
  }
}
