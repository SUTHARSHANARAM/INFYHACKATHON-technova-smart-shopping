import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/admin.service';
import { ApiResponse } from '../utils/apiResponse';

export class AdminController {
  static async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const metrics = await AdminService.getDashboardMetrics();
      return ApiResponse.success(res, metrics, 'Admin dashboard metrics retrieved');
    } catch (error) {
      next(error);
    }
  }

  // Admin Products
  static async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await AdminService.getAdminProducts(req.query);
      return ApiResponse.success(res, products, 'Admin products list retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await AdminService.createProduct(req.body);
      return ApiResponse.created(res, product, 'Product created successfully');
    } catch (error) {
      next(error);
    }
  }

  static async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const updated = await AdminService.updateProduct(id, req.body);
      return ApiResponse.success(res, updated, 'Product updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const result = await AdminService.deleteProduct(id);
      return ApiResponse.success(res, result, 'Product deactivated successfully');
    } catch (error) {
      next(error);
    }
  }

  // Admin Categories
  static async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await AdminService.createCategory(req.body);
      return ApiResponse.created(res, category, 'Category created successfully');
    } catch (error) {
      next(error);
    }
  }

  static async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const category = await AdminService.updateCategory(id, req.body);
      return ApiResponse.success(res, category, 'Category updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const result = await AdminService.deleteCategory(id);
      return ApiResponse.success(res, result, 'Category deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  // Admin Orders
  static async getOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const orders = await AdminService.getAdminOrders(req.query);
      return ApiResponse.success(res, orders, 'Admin orders list retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async getOrderById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const order = await AdminService.getOrderById(id);
      return ApiResponse.success(res, order, 'Admin order details retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async updateOrderStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { status } = req.body;
      const updated = await AdminService.updateOrderStatus(id, status);
      return ApiResponse.success(res, updated, 'Order status updated successfully');
    } catch (error) {
      next(error);
    }
  }

  // Admin Users
  static async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await AdminService.getAdminUsers(req.query);
      return ApiResponse.success(res, users, 'Admin user list retrieved');
    } catch (error) {
      next(error);
    }
  }
}
