import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import routes from './routes';
import { errorHandler } from './middleware/error.middleware';
import { apiRateLimiter } from './middleware/rateLimiter.middleware';
import { ApiResponse } from './utils/apiResponse';

const app: Application = express();

// Security headers
app.use(helmet());

// CORS configuration for Customer and Admin applications
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [env.CLIENT_URL, env.ADMIN_CLIENT_URL, 'http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173', 'http://localhost:5174'];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Allow during development testing
      }
    },
    credentials: true,
  })
);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Global rate limiting
app.use('/api', apiRateLimiter);

// System Health Check
app.get('/health', (req: Request, res: Response) => {
  return ApiResponse.success(
    res,
    {
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'TechNova E-Commerce Backend API',
      environment: env.NODE_ENV,
    },
    'Health check passed'
  );
});

// API Routes
app.use('/api', routes);

// 404 Not Found Handler
app.use((req: Request, res: Response) => {
  return ApiResponse.error(res, `Route ${req.originalUrl} not found`, 404);
});

// Centralized Error Handling Middleware
app.use(errorHandler);

export default app;
