import { Router } from 'express';
import { googleSignIn } from '../controllers/auth.controller';


const router = Router();

/**
 * @swagger
 * /api/auth/google:
 *   post:
 *     summary: Authenticate user with Google
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idToken
 *             properties:
 *               idToken:
 *                 type: string
 *                 description: Google authentication ID token
 *               fullName:
 *                 type: string
 *                 description: Optional full name of the user
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *                 user:
 *                   type: object
 *                   properties:
 *                     uid:
 *                       type: string
 *                       description: User ID
 *                     email:
 *                       type: string
 *                       description: User email
 *                     displayName:
 *                       type: string
 *                       description: User display name
 *                     photoURL:
 *                       type: string
 *                       description: User profile picture URL
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post('/google', googleSignIn as any);

export const authRoutes = router;
