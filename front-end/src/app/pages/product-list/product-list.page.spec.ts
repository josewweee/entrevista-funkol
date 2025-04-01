import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { of } from 'rxjs';
import { ProductListPage } from './product-list.page';
import { Product } from '../../models';
import { ProductService } from '../../services/product.service';

describe('ProductListPage', () => {
  let component: ProductListPage;
  let fixture: ComponentFixture<ProductListPage>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;

  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Test Product 1',
      brand: 'Apple',
      price: 99.99,
      description: 'Test Description 1',
      imageUrl: 'test-image1.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      name: 'Test Product 2',
      brand: 'Google',
      price: 149.99,
      description: 'Test Description 2',
      imageUrl: 'test-image2.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(async () => {
    const mockProductService = jasmine.createSpyObj('ProductService', [
      'getProducts',
      'getProductsByBrand',
    ]);

    // Mock implementations
    mockProductService.getProducts.and.returnValue(of(mockProducts));
    mockProductService.getProductsByBrand.and.returnValue(
      of(mockProducts.filter((p) => p.brand === 'Apple'))
    );

    await TestBed.configureTestingModule({
      imports: [
        IonicModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule,
        ProductListPage,
      ],
      providers: [{ provide: ProductService, useValue: mockProductService }],
    }).compileComponents();

    productServiceSpy = TestBed.inject(
      ProductService
    ) as jasmine.SpyObj<ProductService>;

    fixture = TestBed.createComponent(ProductListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    expect(productServiceSpy.getProducts).toHaveBeenCalled();
    expect(component.products.length).toBeGreaterThan(0);
  });
});
