import { db } from '../config/firebase.config';
import { User } from '../types';
import { toISOString } from '../utils/date-utils';

const usersCollection = db.collection('users');

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
      googleId: userData.googleId, // Include googleId if present
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
