import { NextFunction, Request, Response } from 'express';
import { verifyGoogleToken } from '../services/auth.service';

export const googleSignIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idToken, fullName } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'ID token is required',
      });
    }

    console.log('Received Google Sign-In request with token');

    const user = await verifyGoogleToken(idToken, fullName);

    console.log('Google Sign-In successful, user:', user.uid);

    res.status(200).json({
      success: true,
      message: 'Authentication successful',
      data: user,
    });
  } catch (error) {
    console.error('Google Sign-In error:', error);
    next(error);
  }
};
