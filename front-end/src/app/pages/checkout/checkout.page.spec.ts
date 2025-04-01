import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { of } from 'rxjs';
import { CheckoutPage } from './checkout.page';
import { OrderService } from '../../services/order.service';
import { ProductService } from '../../services/product.service';

describe('CheckoutPage', () => {
  let component: CheckoutPage;
  let fixture: ComponentFixture<CheckoutPage>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let orderServiceSpy: jasmine.SpyObj<OrderService>;

  beforeEach(async () => {
    const mockProductSpy = jasmine.createSpyObj('ProductService', [
      'getProduct',
    ]);
    const mockOrderSpy = jasmine.createSpyObj('OrderService', ['createOrder']);

    // Mock implementations
    mockProductSpy.getProduct.and.returnValue(
      of({
        id: '1',
        name: 'Test Product',
        brand: 'Apple',
        price: 99.99,
        description: 'Test Description',
        imageUrl: 'test-image.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    );

    mockOrderSpy.createOrder.and.returnValue(
      of({
        id: '1',
        userId: 'user-1',
        products: [{ productId: '1', name: 'Test Product', price: 99.99 }],
        totalAmount: 99.99,
        createdAt: new Date().toISOString(),
        status: 'pending',
      })
    );

    await TestBed.configureTestingModule({
      imports: [
        IonicModule.forRoot(),
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterModule.forRoot([]),
        CheckoutPage,
      ],
      providers: [
        { provide: ProductService, useValue: mockProductSpy },
        { provide: OrderService, useValue: mockOrderSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ productId: '1' }),
          },
        },
      ],
    }).compileComponents();

    productServiceSpy = TestBed.inject(
      ProductService
    ) as jasmine.SpyObj<ProductService>;
    orderServiceSpy = TestBed.inject(
      OrderService
    ) as jasmine.SpyObj<OrderService>;

    fixture = TestBed.createComponent(CheckoutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load product from route query params', () => {
    expect(productServiceSpy.getProduct).toHaveBeenCalledWith('1');
  });
});
