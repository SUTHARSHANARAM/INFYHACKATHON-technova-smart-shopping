import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../services/order.service';
import { ApiResponse } from '../utils/apiResponse';

export class OrderController {
  static async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { addressId } = req.body;
      const order = await OrderService.createOrder(userId, addressId);
      return ApiResponse.created(res, order, 'Order placed successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getCustomerOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const orders = await OrderService.getCustomerOrders(userId);
      return ApiResponse.success(res, orders, 'Order history retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getCustomerOrderById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const id = req.params.id as string;
      const order = await OrderService.getCustomerOrderById(userId, id);
      return ApiResponse.success(res, order, 'Order details retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}
