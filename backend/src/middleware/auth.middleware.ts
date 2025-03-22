import { NextFunction, Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';

// Create a new OAuth client using your Google Client ID
const CLIENT_ID = process.env.CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

interface AuthRequest extends Request {
  user?: {
    uid: string;
    email: string;
  };
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res
        .status(401)
        .json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: 'Unauthorized: No token provided' });
    }

    try {
      // Verify Google token
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.sub) {
        throw new Error('Invalid token payload');
      }

      // Set user from Google payload
      req.user = {
        uid: payload.sub,
        email: payload.email || '',
      };
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
  } catch (error) {
    next(error);
  }
};
