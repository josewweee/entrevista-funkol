import { Product } from './product.model';

/**
 * Order status types
 */
export type OrderStatus = 'pending' | 'completed' | 'cancelled';

/**
 * Order information model
 * Represents a complete order in the system
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
  status: OrderStatus;
}

/**
 * Order item used in shopping cart
 */
export interface OrderItem {
  product: Product;
}
