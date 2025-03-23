/**
 * User information model
 * Represents a user in the application
 */
export interface User {
  uid: string; // Primary identifier - Firebase document ID
  email: string;
  googleId?: string; // Optional Google auth ID, for reference only
  displayName?: string;
  photoURL?: string;
  lastLogin: Date | string;
  createdAt: Date | string;
}
