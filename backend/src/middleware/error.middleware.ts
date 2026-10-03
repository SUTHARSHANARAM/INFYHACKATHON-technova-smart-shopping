import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';
import { ApiResponse } from '../utils/apiResponse';
import { env } from '../config/env';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errors: any = undefined;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else if (err.code === 'P2002') {
    // Prisma unique constraint error
    statusCode = 409;
    const target = err.meta?.target ? (Array.isArray(err.meta.target) ? err.meta.target.join(', ') : err.meta.target) : 'Field';
    message = `A record with this ${target} already exists.`;
  } else if (err.code === 'P2025') {
    // Prisma record not found
    statusCode = 404;
    message = 'Requested record not found.';
  } else if (err instanceof Error) {
    message = err.message;
  }

  if (env.NODE_ENV === 'development' && statusCode === 500) {
    console.error('💥 Unhandled Backend Error:', err);
  }

  return ApiResponse.error(res, message, statusCode, errors);
};
