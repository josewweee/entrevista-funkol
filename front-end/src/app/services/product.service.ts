import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay, tap } from 'rxjs/operators';
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

  // In-memory cache for products
  private productsCache: {
    [key: string]: { data: Product[]; timestamp: number };
  } = {};
  private productCache: { [id: string]: { data: Product; timestamp: number } } =
    {};

  private cacheExpiration = 5 * 60 * 1000;

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
    // Check if we have a valid cache
    const cacheKey = 'all';
    const cachedData = this.productsCache[cacheKey];

    if (
      cachedData &&
      Date.now() - cachedData.timestamp < this.cacheExpiration
    ) {
      return of(cachedData.data);
    }

    return this.http.get<ApiResponse<Product[]>>(this.apiUrl).pipe(
      map((response) => response.data),
      tap((products) => {
        // Store in cache
        this.productsCache[cacheKey] = {
          data: products,
          timestamp: Date.now(),
        };

        // Preload first few product images
        this.preloadImages(products.slice(0, 4));
      }),
      shareReplay(1),
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

    const cacheKey = `brand_${brand}`;
    const cachedData = this.productsCache[cacheKey];

    if (
      cachedData &&
      Date.now() - cachedData.timestamp < this.cacheExpiration
    ) {
      console.log(`Using cached ${brand} products data`);
      return of(cachedData.data);
    }

    const url = `${this.apiUrl}?brand=${brand}`;
    return this.http.get<ApiResponse<Product[]>>(url).pipe(
      map((response) => response.data),
      tap((products) => {
        this.productsCache[cacheKey] = {
          data: products,
          timestamp: Date.now(),
        };

        // Preload first few product images
        this.preloadImages(products.slice(0, 4));
      }),
      shareReplay(1),
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
    // Check if we have a valid cache for this product
    const cachedData = this.productCache[id];

    if (
      cachedData &&
      Date.now() - cachedData.timestamp < this.cacheExpiration
    ) {
      console.log(`Using cached product data for ${id}`);
      return of(cachedData.data);
    }

    const url = `${this.apiUrl}/${id}`;
    return this.http.get<ApiResponse<Product>>(url).pipe(
      map((response) => response.data),
      tap((product) => {
        if (product) {
          this.productCache[id] = {
            data: product,
            timestamp: Date.now(),
          };

          // Preload product image
          if (product.imageUrl) {
            this.preloadImage(product.imageUrl);
          }
        }
      }),
      shareReplay(1),
      catchError(() => {
        console.warn(
          `Error fetching product with id: ${id}, using fallback data`
        );
        return of(this.fallbackProducts.find((product) => product.id === id));
      })
    );
  }

  /**
   * Preloads images for a list of products
   * @param products Array of products to preload images for
   */
  private preloadImages(products: Product[]): void {
    for (const product of products) {
      if (product.imageUrl) {
        this.preloadImage(product.imageUrl);
      }
    }
  }

  /**
   * Preloads a single image
   * @param imageUrl URL of the image to preload
   */
  private preloadImage(imageUrl: string): void {
    const img = new Image();
    img.src = imageUrl;
  }
}
