import { NextFunction, Request, Response } from 'express';
import { getUserByGoogleId, getUserById } from '../services/user.service';
import { AuthRequest } from '../types';

export const getCurrentUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    let user;

    // First try to get user by database UID if available
    if (req.user.dbUid) {
      user = await getUserById(req.user.dbUid);
    }

    // If no dbUid or user not found, try with Google ID
    if (!user && req.user.uid) {
      user = await getUserByGoogleId(req.user.uid);
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
