/**
 * User information model
 * Represents a user in the application
 */
export interface User {
  uid: string;
  email: string;
  googleId?: string;
  displayName?: string;
  photoURL?: string;
  lastLogin: Date | string;
  createdAt: Date | string;
}
