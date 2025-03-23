import { NextFunction, Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { getUserByGoogleId } from '../services/user.service';
import { AuthRequest } from '../types';

// Constants
const CLIENT_ID = process.env.CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

/**
 * Authentication middleware that verifies Google ID tokens
 * and attaches user information to the request object
 */
export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract token from authorization header
    const token = extractTokenFromHeader(req);
    if (!token) {
      return unauthorizedResponse(res, 'No token provided');
    }

    try {
      // Process and verify the token
      await processToken(token, req);
      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return unauthorizedResponse(res, 'Invalid token');
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    next(error);
  }
};

/**
 * Extracts the token from the Authorization header
 */
function extractTokenFromHeader(req: Request): string | null {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  return token || null;
}

/**
 * Returns a standardized unauthorized response
 */
function unauthorizedResponse(res: Response, message: string) {
  return res
    .status(401)
    .json({ success: false, message: `Unauthorized: ${message}` });
}

/**
 * Processes and verifies the token, then attaches user info to the request
 */
async function processToken(token: string, req: AuthRequest) {
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

  // If user doesn't exist in our system, we can't authenticate
  if (!user) {
    throw new Error('User not found in database');
  }

  // Set user with Firebase document ID as the primary identifier
  req.user = {
    uid: user.uid, // Firebase document ID
    email: payload.email || '',
    googleId: googleId, // Store Google ID for reference
  };
}
