import { TestBed } from '@angular/core/testing';
import { OrderService } from './order.service';
import { Order, Product } from '../models';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

// Mock environment
const environment = {
  apiUrl: 'http://localhost:3000/api',
  googleClientId: 'test-client-id',
  production: false,
};

describe('OrderService', () => {
  let service: OrderService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/orders`;

  const mockProduct: Product = {
    id: '1',
    name: 'Test Product',
    brand: 'Apple',
    price: 99.99,
    description: 'Test description',
    imageUrl: 'test-image.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Use a fixed date string for consistent testing
  const dateString = '2023-01-01T00:00:00.000Z';

  const mockOrder: Order = {
    id: '123',
    userId: 'user1',
    products: [
      {
        productId: mockProduct.id,
        name: mockProduct.name,
        price: mockProduct.price,
      },
    ],
    totalAmount: 99.99,
    createdAt: dateString,
    status: 'pending',
  };

  beforeEach(() => {
    // Provide environment in the test module
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        OrderService,
        { provide: 'environment', useValue: environment },
      ],
    });

    service = TestBed.inject(OrderService);
    httpMock = TestBed.inject(HttpTestingController);

    // Spy on methods to isolate tests
    spyOn(service, 'getOrders').and.callThrough();
    spyOn(service, 'getOrder').and.callThrough();
    spyOn(service, 'createOrder').and.callThrough();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get user orders', () => {
    const mockOrders: Order[] = [mockOrder];
    const mockResponse = { data: mockOrders, success: true };

    // Reset the spy to allow the real method to be called
    (service.getOrders as jasmine.Spy).and.callThrough();

    service.getOrders().subscribe({
      next: (orders: Order[]) => {
        expect(orders).toEqual(mockOrders);
        expect(orders.length).toBe(1);
      },
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get an order by id', () => {
    const orderId = '123';
    const mockResponse = { data: mockOrder, success: true };

    // Reset the spy to allow the real method to be called
    (service.getOrder as jasmine.Spy).and.callThrough();

    service.getOrder(orderId).subscribe({
      next: (order) => {
        expect(order).toEqual(mockOrder);
      },
    });

    const req = httpMock.expectOne(`${apiUrl}/${orderId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should create a new order', () => {
    const orderProducts = [
      {
        productId: mockProduct.id,
        name: mockProduct.name,
        price: mockProduct.price,
      },
    ];

    const orderData = {
      products: orderProducts,
      totalAmount: 99.99,
    };

    // Clone mockOrder but ensure the createdAt is a string to match response
    const responseMockOrder = {
      ...mockOrder,
      createdAt: dateString,
    };

    const mockResponse = { data: responseMockOrder, success: true };

    // Reset the spy to allow the real method to be called
    (service.createOrder as jasmine.Spy).and.callThrough();

    service.createOrder(orderData).subscribe({
      next: (order) => {
        expect(order).toEqual(responseMockOrder);
      },
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(orderData);
    req.flush(mockResponse);
  });

  it('should handle error when fetching orders fails', () => {
    // Reset the spy to allow the real method to be called
    (service.getOrders as jasmine.Spy).and.callThrough();

    let errorResponse: any;

    service.getOrders().subscribe({
      next: () => fail('expected an error, not orders'),
      error: (error) => {
        errorResponse = error;
        expect(error.status).toBe(404);
      },
    });

    const req = httpMock.expectOne(apiUrl);
    req.flush('Not found', { status: 404, statusText: 'Not Found' });

    expect(errorResponse).toBeTruthy();
  });
});
