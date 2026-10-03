import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service';
import { ApiResponse } from '../utils/apiResponse';

export class ProductController {
  static async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ProductService.getProducts(req.query);
      return ApiResponse.success(res, result, 'Products retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const product = await ProductService.getProductById(id);
      return ApiResponse.success(res, product, 'Product details retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getFeaturedProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = Number(req.query.limit) || 8;
      const products = await ProductService.getFeaturedProducts(limit);
      return ApiResponse.success(res, products, 'Featured products retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async searchProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const query = {
        ...req.query,
        search: (req.query.q as string) || (req.query.search as string),
      };
      const result = await ProductService.getProducts(query);
      return ApiResponse.success(res, result, 'Search results retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async getBrands(req: Request, res: Response, next: NextFunction) {
    try {
      const brands = await ProductService.getBrands();
      return ApiResponse.success(res, brands, 'Brands list retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}
