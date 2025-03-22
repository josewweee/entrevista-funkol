import { Router } from 'express';
import { getProduct, getProducts } from '../controllers/product.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// All order routes require authentication
router.use(authMiddleware as any);

// GET /api/products - Get all products with optional brand filter
router.get('/', getProducts as any);

// GET /api/products/:id - Get a specific product
router.get('/:id', getProduct as any);

export const productRoutes = router;
