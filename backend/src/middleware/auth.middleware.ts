import { NextFunction, Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { getUserByGoogleId } from '../services/user.service';

// Create a new OAuth client using your Google Client ID
const CLIENT_ID = process.env.CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

interface AuthRequest extends Request {
  user?: {
    uid: string; // This will be the Google ID for backward compatibility
    dbUid?: string; // This will be the Firebase UID from the database
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
        .json({ success: false, message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: 'Unauthorized: No token provided' });
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
      const googleId = payload.sub;

      // Look up the user by Google ID
      const user = await getUserByGoogleId(googleId);

      // Set user with Google ID for backward compatibility
      req.user = {
        uid: googleId, // Keep using Google ID for backward compatibility
        email: payload.email || '',
      };

      // If user exists in database, add the database UID as well
      if (user) {
        req.user.dbUid = user.uid; // Add Firebase UID as additional property
      }

      // Continue processing the request
      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res
        .status(401)
        .json({ success: false, message: 'Unauthorized: Invalid token' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    next(error);
  }
};
