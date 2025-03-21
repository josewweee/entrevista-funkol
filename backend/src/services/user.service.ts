import { db } from '../config/firebase.config';
import { User } from '../types';

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

export const createUser = async (userData: Partial<User>): Promise<User> => {
  try {
    const { uid } = userData;

    if (!uid) {
      throw new Error('User ID is required');
    }

    const now = new Date();
    const newUser: User = {
      uid,
      email: userData.email || '',
      displayName: userData.displayName || '',
      photoURL: userData.photoURL || '',
      lastLogin: now,
      createdAt: now,
    };

    await usersCollection.doc(uid).set(newUser);
    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUserLastLogin = async (uid: string): Promise<void> => {
  try {
    await usersCollection.doc(uid).update({
      lastLogin: new Date(),
    });
  } catch (error) {
    console.error('Error updating user last login:', error);
    throw error;
  }
};
