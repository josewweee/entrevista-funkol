import { NextFunction, Request, Response } from 'express';
import { getUserByGoogleId, getUserById } from '../services/user.service';
import { AuthRequest } from '../types';

/**
 * Get the current authenticated user's profile
 *
 * Retrieves user information using either database UID or Google ID,
 * prioritizing database UID if available
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

    let user = null;

    // Prioritize database UID for lookup if available
    if (req.user.dbUid) {
      user = await getUserById(req.user.dbUid);
    }

    // Fall back to Google ID if database UID lookup fails or is unavailable
    if (!user && req.user.uid) {
      user = await getUserByGoogleId(req.user.uid);
    }

    // Return 404 if user not found in either lookup attempt
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
