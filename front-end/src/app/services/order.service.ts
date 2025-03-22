import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { Product } from './product.service';
import { parseDate, toISOString } from '../utils/date-utils';

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

export interface OrderItem {
  product: Product;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  orders$ = this.ordersSubject.asObservable();

  // Fallback data for offline mode or errors
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

  getOrders(): Observable<Order[]> {
    // If not authenticated, return empty array
    if (!this.authService.isAuthenticated()) {
      return of([]);
    }

    return this.orders$;
  }

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

  private generateOrderId(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }
}
