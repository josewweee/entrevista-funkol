import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { of } from 'rxjs';
import { HistoryPage } from './history.page';
import { Order } from '../../models';
import { OrderService } from '../../services/order.service';

describe('HistoryPage', () => {
  let component: HistoryPage;
  let fixture: ComponentFixture<HistoryPage>;
  let orderServiceSpy: jasmine.SpyObj<OrderService>;

  const mockOrders: Order[] = [
    {
      id: '1',
      userId: 'user1',
      products: [
        {
          productId: '101',
          name: 'iPhone',
          price: 999,
        },
      ],
      totalAmount: 999,
      createdAt: '2023-01-01T00:00:00.000Z',
      status: 'completed',
    },
    {
      id: '2',
      userId: 'user1',
      products: [
        {
          productId: '102',
          name: 'Pixel',
          price: 799,
        },
      ],
      totalAmount: 799,
      createdAt: '2023-01-02T00:00:00.000Z',
      status: 'pending',
    },
  ];

  beforeEach(async () => {
    const mockOrderService = jasmine.createSpyObj('OrderService', [
      'getOrders',
    ]);
    mockOrderService.getOrders.and.returnValue(of(mockOrders));

    await TestBed.configureTestingModule({
      imports: [
        IonicModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule,
        HistoryPage,
      ],
      providers: [{ provide: OrderService, useValue: mockOrderService }],
    }).compileComponents();

    orderServiceSpy = TestBed.inject(
      OrderService
    ) as jasmine.SpyObj<OrderService>;

    fixture = TestBed.createComponent(HistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load order history on init', () => {
    expect(orderServiceSpy.getOrders).toHaveBeenCalled();
    expect(component.orders.length).toBe(2);
  });
});
