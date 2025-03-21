import { Router } from 'express';
import { getProduct, getProducts } from '../controllers/product.controller';


const router = Router();

// GET /api/products - Get all products with optional brand filter
router.get('/', getProducts as any);

// GET /api/products/:id - Get a specific product
router.get('/:id', getProduct as any);

export const productRoutes = router;
