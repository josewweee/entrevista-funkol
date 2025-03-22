/**
 * Product brand types
 * Supported product brands in the application
 */
export type ProductBrand = 'Apple' | 'Google' | 'Samsung';

/**
 * Product information model
 * Represents a product in the store
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  brand: ProductBrand;
  imageUrl: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
