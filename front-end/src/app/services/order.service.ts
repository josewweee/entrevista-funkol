import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { ApiResponse, Order, OrderItem } from '../models';
import { parseDate, toISOString } from '../utils/date-utils';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  //-------------------------------
  // Service Properties
  //-------------------------------

  // API endpoint
  private apiUrl = `${environment.apiUrl}/orders`;

  // Orders state
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  orders$ = this.ordersSubject.asObservable();

  /**
   * Fallback data for offline mode or errors
   */
  private fallbackOrders: Order[] = [
    {
      id: '1001',
      userId: 'user123',
      products: [
        {
          productId: 'prod1',
          name: 'Funko Pop Marvel',
          price: 19.99,
        },
      ],
      totalAmount: 19.99,
      createdAt: toISOString(new Date('2023-10-15')),
      status: 'completed',
    },
  ];

  constructor(private http: HttpClient, private authService: AuthService) {
    // Load user orders when service is initialized
    this.loadUserOrders();
  }

  //-------------------------------
  // Order Management Methods
  //-------------------------------

  /**
   * Loads all orders for the current user
   */
  loadUserOrders(): void {
    if (!this.authService.isAuthenticated()) {
      this.ordersSubject.next([]);
      return;
    }

    this.http
      .get<ApiResponse<Order[]>>(this.apiUrl)
      .pipe(
        map((response) => {
          if (!response.success) {
            throw new Error(response.message || 'Failed to fetch orders');
          }

          return response.data.map((order) => ({
            ...order,
            createdAt: parseDate(order.createdAt),
          }));
        }),
        catchError((error) => {
          console.error('Error fetching orders:', error);

          // Use fallback data only if user is authenticated
          if (this.authService.isAuthenticated()) {
            return of(this.fallbackOrders);
          }
          return of([]);
        })
      )
      .subscribe((orders) => {
        this.ordersSubject.next(orders);
      });
  }

  /**
   * Gets all orders for the current user
   *
   * @returns Observable of user orders
   */
  getOrders(): Observable<Order[]> {
    // If not authenticated, return empty array
    if (!this.authService.isAuthenticated()) {
      return of([]);
    }

    return this.orders$;
  }

  /**
   * Gets a specific order by ID
   *
   * @param orderId - ID of the order to retrieve
   * @returns Observable of the order or null if not found
   */
  getOrder(orderId: string): Observable<Order | null> {
    if (!this.authService.isAuthenticated()) {
      return of(null);
    }

    return this.http.get<ApiResponse<Order>>(`${this.apiUrl}/${orderId}`).pipe(
      map((response) => {
        if (!response.success) {
          throw new Error(response.message || 'Order not found');
        }

        return {
          ...response.data,
          createdAt: parseDate(response.data.createdAt),
        };
      }),
      catchError((error) => {
        console.error(`Error fetching order ${orderId}:`, error);
        return of(null);
      })
    );
  }

  /**
   * Creates a new order
   *
   * @param orderData - Order data without system-generated fields
   * @returns Observable of the created order
   */
  createOrder(
    orderData: Omit<Order, 'id' | 'createdAt' | 'status' | 'userId'>
  ): Observable<Order> {
    return this.http.post<ApiResponse<Order>>(this.apiUrl, orderData).pipe(
      map((response) => {
        if (!response.success) {
          throw new Error(response.message || 'Failed to create order');
        }

        const newOrder = {
          ...response.data,
          createdAt: parseDate(response.data.createdAt),
        };

        // Update local orders cache
        const currentOrders = this.ordersSubject.value;
        this.ordersSubject.next([...currentOrders, newOrder]);

        return newOrder;
      }),
      catchError((error) => {
        console.error('Error creating order:', error);
        return throwError(
          () => new Error('Failed to create order. Please try again.')
        );
      })
    );
  }

  /**
   * Add order to local state only
   * This is a fallback for when the backend is not available
   *
   * @param order - Order data without system-generated fields
   */
  addOrder(order: Omit<Order, 'id' | 'createdAt' | 'status'>): void {
    const newOrder: Order = {
      ...order,
      id: this.generateOrderId(),
      createdAt: toISOString(new Date()),
      status: 'pending',
    };

    const currentOrders = this.ordersSubject.value;
    this.ordersSubject.next([...currentOrders, newOrder]);
  }

  /**
   * Generates a random order ID for local orders
   *
   * @returns A random order ID string
   */
  private generateOrderId(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }
}
