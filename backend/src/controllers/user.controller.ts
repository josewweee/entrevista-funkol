import { NextFunction, Request, Response } from 'express';
import { getUserByGoogleId, getUserById } from '../services/user.service';
import { AuthRequest } from '../types';

/**
 * Get the current authenticated user's profile
 *
 * Retrieves user information using Firebase document UID
 *
 * @route GET /api/users/me
 * @middleware authMiddleware - Ensures request is authenticated
 *
 * @param req - Express request object with auth user
 * @param res - Express response object
 * @param next - Express next function
 *
 * @returns User object if found or 401/404 error responses
 */
export const getCurrentUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Verify authentication
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    // Get user by Firebase document ID
    const user = await getUserById(req.user.uid);

    // Return 404 if user not found
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Return user data
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
