import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { requireAdmin } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createProductSchema, updateProductSchema } from '../schemas/product.schema';
import { createCategorySchema, updateCategorySchema } from '../schemas/category.schema';
import { updateOrderStatusSchema } from '../schemas/order.schema';

const router = Router();

// Require Admin Role for ALL admin endpoints
router.use(requireAdmin);

// Dashboard
router.get('/dashboard', AdminController.getDashboard);

// Admin Product Management
router.get('/products', AdminController.getProducts);
router.post('/products', validate(createProductSchema), AdminController.createProduct);
router.patch('/products/:id', validate(updateProductSchema), AdminController.updateProduct);
router.delete('/products/:id', AdminController.deleteProduct);

// Admin Category Management
router.post('/categories', validate(createCategorySchema), AdminController.createCategory);
router.patch('/categories/:id', validate(updateCategorySchema), AdminController.updateCategory);
router.delete('/categories/:id', AdminController.deleteCategory);

// Admin Order Management
router.get('/orders', AdminController.getOrders);
router.get('/orders/:id', AdminController.getOrderById);
router.patch('/orders/:id/status', validate(updateOrderStatusSchema), AdminController.updateOrderStatus);

// Admin User Management
router.get('/users', AdminController.getUsers);

export default router;
