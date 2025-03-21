import { Router } from 'express';
import { getCurrentUser } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';


const router = Router();

// GET /api/users/me - Get current user
router.get('/me', authMiddleware as any, getCurrentUser as any);

export const userRoutes = router;
