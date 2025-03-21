import { db } from '../config/firebase.config';
import { Product } from '../types';

const productsCollection = db.collection('products');

export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const snapshot = await productsCollection.orderBy('name').get();
    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Product)
    );
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
};

export const getProductsByBrand = async (brand: string): Promise<Product[]> => {
  try {
    const snapshot = await productsCollection
      .where('brand', '==', brand)
      .orderBy('name')
      .get();

    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Product)
    );
  } catch (error) {
    console.error(`Error getting ${brand} products:`, error);
    throw error;
  }
};

export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const doc = await productsCollection.doc(id).get();

    if (!doc.exists) {
      return null;
    }

    return { id, ...doc.data() } as Product;
  } catch (error) {
    console.error('Error getting product:', error);
    throw error;
  }
};
