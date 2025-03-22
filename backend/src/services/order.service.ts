import { db } from '../config/firebase.config';
import { Order } from '../types';
import { toISOString } from '../utils/date-utils';

const ordersCollection = db.collection('orders');

export const createOrder = async (
  orderData: Omit<Order, 'id' | 'createdAt'>
): Promise<Order> => {
  try {
    const now = new Date();
    const newOrder = {
      ...orderData,
      createdAt: toISOString(now),
    };

    const docRef = await ordersCollection.add(newOrder);
    return { id: docRef.id, ...newOrder } as Order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getOrdersByUserId = async (userId: string): Promise<Order[]> => {
  try {
    const snapshot = await ordersCollection
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Order)
    );
  } catch (error) {
    console.error('Error getting orders for user:', error);
    throw error;
  }
};

export const getOrderById = async (id: string): Promise<Order | null> => {
  try {
    const doc = await ordersCollection.doc(id).get();

    if (!doc.exists) {
      return null;
    }

    return { id, ...doc.data() } as Order;
  } catch (error) {
    console.error('Error getting order:', error);
    throw error;
  }
};
