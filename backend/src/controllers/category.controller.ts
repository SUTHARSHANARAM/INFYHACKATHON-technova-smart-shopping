import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/category.service';
import { ApiResponse } from '../utils/apiResponse';

export class CategoryController {
  static async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await CategoryService.getCategories();
      return ApiResponse.success(res, categories, 'Categories retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getCategoryById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const category = await CategoryService.getCategoryById(id);
      return ApiResponse.success(res, category, 'Category details retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}
