import { NextFunction, Request, Response } from 'express';
import { verifyGoogleToken } from '../services/auth.service';


export const googleSignIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'ID token is required',
      });
    }

    const user = await verifyGoogleToken(idToken);

    res.status(200).json({
      success: true,
      message: 'Authentication successful',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
