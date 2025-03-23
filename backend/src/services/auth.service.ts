import { OAuth2Client } from 'google-auth-library';
import { auth } from '../config/firebase.config';
import { User } from '../types';
import { toISOString } from '../utils/date-utils';

import {
  createUser,
  getUserByGoogleId,
  updateUserLastLogin,
} from './user.service';

// Create a new OAuth client using your Google Client ID
const CLIENT_ID = process.env.CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

export const verifyGoogleToken = async (
  idToken: string,
  fullName?: string
): Promise<User> => {
  try {
    // First, verify the Google token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error('Invalid Google token payload');
    }

    const { sub, name, email, picture } = payload;

    // Use the Google user ID (sub) to check or create the user
    const googleUserId = sub;

    // Check if user exists by Google ID
    const existingUser = await getUserByGoogleId(googleUserId);

    if (existingUser) {
      // User exists, update last login time
      await updateUserLastLogin(existingUser.uid);
      return {
        ...existingUser,
        lastLogin: toISOString(new Date()),
      };
    }

    // User doesn't exist, create a new one with a generated Firebase ID
    // Note: uid (Firebase document ID) is the primary identifier in our system
    const newUser = await createUser({
      googleId: googleUserId, // Store Google ID as reference
      email: email || '',
      displayName: fullName || name || '',
      photoURL: picture || '',
    });

    return newUser;
  } catch (error) {
    console.error('Error verifying Google token:', error);
    throw error;
  }
};
