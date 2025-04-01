import { Router } from 'express';
import { getCurrentUser } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';


/**
 * User API routes
 * Base path: /api/users
 */
const router = Router();

//-------------------------------
// Swagger Documentation
//-------------------------------

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - uid
 *         - email
 *         - lastLogin
 *         - createdAt
 *       properties:
 *         uid:
 *           type: string
 *           description: The unique ID of the user
 *         email:
 *           type: string
 *           description: User email
 *         googleId:
 *           type: string
 *           description: Google ID for social login (optional)
 *         displayName:
 *           type: string
 *           description: User display name (optional)
 *         photoURL:
 *           type: string
 *           description: URL to user's profile picture (optional)
 *         lastLogin:
 *           type: string
 *           format: date-time
 *           description: Last login timestamp
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Account creation timestamp
 */

//-------------------------------
// User Profile Routes
//-------------------------------

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/me', authMiddleware as any, getCurrentUser as any);

// Export the router
export const userRoutes = router;
