import { Router } from 'express';
import { googleSignIn } from '../controllers/auth.controller';


const router = Router();

// POST /api/auth/google - Google Sign-In
router.post('/google', googleSignIn as any);

export const authRoutes = router;
