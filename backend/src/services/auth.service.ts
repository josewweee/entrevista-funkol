import { createUser, getUserById, updateUserLastLogin } from './user.service';
import { auth } from '../config/firebase.config';
import { User } from '../types';

export const verifyGoogleToken = async (idToken: string): Promise<User> => {
  try {
    // Verify the ID token
    const decodedToken = await auth.verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    // Check if user exists
    const existingUser = await getUserById(uid);

    if (existingUser) {
      // User exists, update last login time
      await updateUserLastLogin(uid);
      return { ...existingUser, lastLogin: new Date() };
    }

    // User doesn't exist, create a new one
    const newUser = await createUser({
      uid,
      email: email || '',
      displayName: name || '',
      photoURL: picture || '',
    });

    return newUser;
  } catch (error) {
    console.error('Error verifying Google token:', error);
    throw error;
  }
};
