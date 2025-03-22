import { Request } from 'express';

//-------------------------------
// User & Authentication Types
//-------------------------------

/**
 * User information model
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

/**
 * Extended Express Request with authentication data
 */
export interface AuthRequest extends Request {
  user?: {
    uid: string; // Google ID for backward compatibility
    dbUid?: string; // Firebase UID from the database
    email: string;
  };
}

//-------------------------------
// Product Types
//-------------------------------

/**
 * Product information model
 */
export interface Product {
  id: string;
  name: string;
  brand: 'Google' | 'Apple' | 'Samsung';
  price: number;
  description: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

//-------------------------------
// Order Types
//-------------------------------

/**
 * Order information model
 */
export interface Order {
  id: string;
  userId: string;
  products: {
    productId: string;
    name: string;
    price: number;
  }[];
  totalAmount: number;
  createdAt: Date | string;
  status: 'pending' | 'completed' | 'cancelled';
}
