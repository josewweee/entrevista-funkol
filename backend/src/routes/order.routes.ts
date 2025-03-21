import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';

import {
  createNewOrder,
  getOrderDetails,
  getUserOrders,
} from '../controllers/order.controller';

const router = Router();

// All order routes require authentication
router.use(authMiddleware as any);

// POST /api/orders - Create a new order
router.post('/', createNewOrder as any);

// GET /api/orders - Get user's orders
router.get('/', getUserOrders as any);

// GET /api/orders/:id - Get a specific order
router.get('/:id', getOrderDetails as any);

export const orderRoutes = router;
