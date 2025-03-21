import { NextFunction, Request, Response } from 'express';
import { getUserById } from '../services/user.service';
import { AuthRequest } from '../types';


export const getCurrentUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user || !req.user.uid) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const user = await getUserById(req.user.uid);

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
