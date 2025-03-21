import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';


export type ProductBrand = 'Apple' | 'Google' | 'Samsung';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  brand: ProductBrand;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private products: Product[] = [
    {
      id: 1,
      name: 'Apple AirPods Pro',
      description: 'Active noise cancellation for immersive sound',
      price: 199,
      brand: 'Apple',
      imageUrl: 'assets/products/placeholder-image.png',
    },
    {
      id: 2,
      name: 'Google Home Mini',
      description: 'Smart speaker with Google Assistant',
      price: 49,
      brand: 'Google',
      imageUrl: 'assets/products/placeholder-image.png',
    },
    {
      id: 3,
      name: 'Samsung Galaxy Buds Live',
      description: 'Wireless earbuds with active noise cancellation',
      price: 169,
      brand: 'Samsung',
      imageUrl: 'assets/products/placeholder-image.png',
    },
    {
      id: 4,
      name: 'Apple Watch Series 7',
      description: 'Always-on Retina display, GPS and cellular',
      price: 399,
      brand: 'Apple',
      imageUrl: 'assets/products/placeholder-image.png',
    },
    {
      id: 5,
      name: 'Apple AirTag',
      description: 'Keep track of your items in the Find My app',
      price: 29,
      brand: 'Apple',
      imageUrl: 'assets/products/placeholder-image.png',
    },
    {
      id: 6,
      name: 'Samsung SmartThings Motion Sensor',
      description: 'Detects movement in your home',
      price: 19,
      brand: 'Samsung',
      imageUrl: 'assets/products/placeholder-image.png',
    },
  ];

  constructor() {}

  getProducts(): Observable<Product[]> {
    return of(this.products);
  }

  getProductsByBrand(brand?: ProductBrand): Observable<Product[]> {
    if (!brand) {
      return this.getProducts();
    }
    return of(this.products.filter((product) => product.brand === brand));
  }

  getProduct(id: number): Observable<Product | undefined> {
    return of(this.products.find((product) => product.id === id));
  }
}
