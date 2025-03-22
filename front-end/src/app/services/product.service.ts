import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiResponse, Product, ProductBrand } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  //-------------------------------
  // Service Properties
  //-------------------------------

  // API endpoint
  private apiUrl = `${environment.apiUrl}/products`;

  /**
   * Fallback products for offline mode or error cases
   * Used when API calls fail
   */
  private fallbackProducts: Product[] = [
    {
      id: '1',
      name: 'Apple AirPods Pro',
      description: 'Active noise cancellation for immersive sound',
      price: 199,
      brand: 'Apple',
      imageUrl: '',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    },
    {
      id: '2',
      name: 'Google Home Mini',
      description: 'Smart speaker with Google Assistant',
      price: 49,
      brand: 'Google',
      imageUrl: '',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    },
    {
      id: '3',
      name: 'Samsung Galaxy Buds Live',
      description: 'Wireless earbuds with active noise cancellation',
      price: 169,
      brand: 'Samsung',
      imageUrl: '',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    },
    {
      id: '4',
      name: 'Apple Watch Series 7',
      description: 'Always-on Retina display, GPS and cellular',
      price: 399,
      brand: 'Apple',
      imageUrl: '',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    },
    {
      id: '5',
      name: 'Apple AirTag',
      description: 'Keep track of your items in the Find My app',
      price: 29,
      brand: 'Apple',
      imageUrl: '',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    },
    {
      id: '6',
      name: 'Samsung SmartThings Motion Sensor',
      description: 'Detects movement in your home',
      price: 19,
      brand: 'Samsung',
      imageUrl: '',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    },
  ];

  constructor(private http: HttpClient) {}

  //-------------------------------
  // Product Retrieval Methods
  //-------------------------------

  /**
   * Gets all available products
   *
   * @returns Observable of all products
   */
  getProducts(): Observable<Product[]> {
    return this.http.get<ApiResponse<Product[]>>(this.apiUrl).pipe(
      map((response) => response.data),
      catchError(() => {
        console.warn('Error fetching products, using fallback data');
        return of(this.fallbackProducts);
      })
    );
  }

  /**
   * Gets products filtered by brand
   *
   * @param brand - Optional brand to filter by
   * @returns Observable of filtered products
   */
  getProductsByBrand(brand?: ProductBrand): Observable<Product[]> {
    if (!brand) {
      return this.getProducts();
    }

    const url = `${this.apiUrl}?brand=${brand}`;
    return this.http.get<ApiResponse<Product[]>>(url).pipe(
      map((response) => response.data),
      catchError(() => {
        console.warn(
          `Error fetching products by brand: ${brand}, using fallback data`
        );
        return of(
          this.fallbackProducts.filter((product) => product.brand === brand)
        );
      })
    );
  }

  /**
   * Gets a specific product by ID
   *
   * @param id - Product ID to retrieve
   * @returns Observable of the product or undefined if not found
   */
  getProduct(id: string): Observable<Product | undefined> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<ApiResponse<Product>>(url).pipe(
      map((response) => response.data),
      catchError(() => {
        console.warn(
          `Error fetching product with id: ${id}, using fallback data`
        );
        return of(this.fallbackProducts.find((product) => product.id === id));
      })
    );
  }
}
