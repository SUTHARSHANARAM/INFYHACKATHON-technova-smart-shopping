import { Request, Response, NextFunction } from 'express';
import { AddressService } from '../services/address.service';
import { ApiResponse } from '../utils/apiResponse';

export class AddressController {
  static async getAddresses(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const addresses = await AddressService.getAddresses(userId);
      return ApiResponse.success(res, addresses, 'Addresses retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async createAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const address = await AddressService.createAddress(userId, req.body);
      return ApiResponse.created(res, address, 'Address added successfully');
    } catch (error) {
      next(error);
    }
  }

  static async updateAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const id = req.params.id as string;
      const updated = await AddressService.updateAddress(userId, id, req.body);
      return ApiResponse.success(res, updated, 'Address updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async deleteAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const id = req.params.id as string;
      const result = await AddressService.deleteAddress(userId, id);
      return ApiResponse.success(res, result, 'Address deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}
