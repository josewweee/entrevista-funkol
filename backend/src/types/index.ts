import { Request } from 'express';

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  lastLogin: Date;
  createdAt: Date;
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
    quantity: number;
  }[];
  totalAmount: number;
  createdAt: Date;
  status: 'pending' | 'completed' | 'cancelled';
}

export interface AuthRequest extends Request {
  user?: {
    uid: string;
    email: string;
  };
}
