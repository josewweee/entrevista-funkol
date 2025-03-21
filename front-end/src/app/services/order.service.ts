import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Product } from './product.service';



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

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  orders$ = this.ordersSubject.asObservable();

  // Sample data
  private sampleOrders: Order[] = [
    {
      id: '1001',
      userId: 'user123',
      products: [
        {
          productId: 'prod1',
          name: 'Funko Pop Marvel',
          price: 19.99,
          quantity: 2,
        },
        {
          productId: 'prod2',
          name: 'Funko Pop Star Wars',
          price: 19.99,
          quantity: 2,
        },
      ],
      totalAmount: 79.97,
      createdAt: new Date('2023-10-15'),
      status: 'completed',
    },
    {
      id: '1002',
      userId: 'user123',
      products: [
        {
          productId: 'prod3',
          name: 'Funko Pop DC Comics',
          price: 24.99,
          quantity: 3,
        },
        {
          productId: 'prod4',
          name: 'Funko Pop Disney',
          price: 18.99,
          quantity: 3,
        },
      ],
      totalAmount: 129.99,
      createdAt: new Date('2023-11-05'),
      status: 'completed',
    },
  ];

  constructor() {
    this.ordersSubject.next(this.sampleOrders);
  }

  getOrders(): Observable<Order[]> {
    return this.orders$;
  }

  addOrder(order: Omit<Order, 'id' | 'createdAt' | 'status'>): void {
    const newOrder: Order = {
      ...order,
      id: this.generateOrderId(),
      createdAt: new Date(),
      status: 'pending',
    };

    const currentOrders = this.ordersSubject.value;
    this.ordersSubject.next([...currentOrders, newOrder]);
  }

  private generateOrderId(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }
}
