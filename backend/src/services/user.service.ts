import { db } from '../config/firebase.config';
import { User } from '../types';
import { toISOString } from '../utils/date-utils';

// Firebase collection reference
const usersCollection = db.collection('users');

//-------------------------------
// User Retrieval Operations
//-------------------------------

/**
 * Retrieves a user by their Firebase UID
 *
 * @param uid - The Firebase user ID
 * @returns The user document or null if not found
 */
export const getUserById = async (uid: string): Promise<User | null> => {
  try {
    const userDoc = await usersCollection.doc(uid).get();

    if (!userDoc.exists) {
      return null;
    }

    return { uid, ...userDoc.data() } as User;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

/**
 * Retrieves a user by their Google ID
 *
 * @param googleId - The Google account ID
 * @returns The user document or null if not found
 */
export const getUserByGoogleId = async (
  googleId: string
): Promise<User | null> => {
  try {
    const snapshot = await usersCollection
      .where('googleId', '==', googleId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return { uid: doc.id, ...doc.data() } as User;
  } catch (error) {
    console.error('Error getting user by Google ID:', error);
    throw error;
  }
};

//-------------------------------
// User Management Operations
//-------------------------------

/**
 * Creates a new user in the database
 *
 * @param userData - Partial user data to create the user with
 * @returns The newly created user document
 */
export const createUser = async (userData: Partial<User>): Promise<User> => {
  try {
    // Create a document with a generated ID if uid is not provided
    if (!userData.uid) {
      const docRef = usersCollection.doc();
      userData.uid = docRef.id;
    }

    const now = new Date();
    const newUser: User = {
      uid: userData.uid,
      email: userData.email || '',
      googleId: userData.googleId,
      displayName: userData.displayName || '',
      photoURL: userData.photoURL || '',
      lastLogin: toISOString(now),
      createdAt: toISOString(now),
    };

    await usersCollection.doc(userData.uid).set(newUser);
    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

/**
 * Updates a user's last login timestamp
 *
 * @param uid - The Firebase user ID to update
 */
export const updateUserLastLogin = async (uid: string): Promise<void> => {
  try {
    await usersCollection.doc(uid).update({
      lastLogin: toISOString(new Date()),
    });
  } catch (error) {
    console.error('Error updating user last login:', error);
    throw error;
  }
};
