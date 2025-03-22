import { Request } from 'express';

export interface User {
  uid: string;
  email: string;
  googleId?: string;
  displayName?: string;
  photoURL?: string;
  lastLogin: Date | string;
  createdAt: Date | string;
}

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

export interface AuthRequest extends Request {
  user?: {
    uid: string;
    email: string;
  };
}
