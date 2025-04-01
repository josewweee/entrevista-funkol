import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { ProductService } from './product.service';
import { Product, ProductBrand } from '../models';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/products`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all products', () => {
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Test Product 1',
        brand: 'Apple',
        price: 99.99,
        description: 'Test description 1',
        imageUrl: 'test-image1.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        name: 'Test Product 2',
        brand: 'Google',
        price: 149.99,
        description: 'Test description 2',
        imageUrl: 'test-image2.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const mockResponse = { data: mockProducts, success: true };

    service.getProducts().subscribe((products) => {
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get products by brand', () => {
    const brand: ProductBrand = 'Apple';
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Test Apple Product',
        brand: 'Apple',
        price: 99.99,
        description: 'Test description',
        imageUrl: 'test-image.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const mockResponse = { data: mockProducts, success: true };

    service.getProductsByBrand(brand).subscribe((products) => {
      expect(products).toEqual(mockProducts);
      expect(products[0].brand).toBe(brand);
    });

    const req = httpMock.expectOne(`${apiUrl}?brand=${brand}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get a product by id', () => {
    const productId = '1';
    const mockProduct: Product = {
      id: productId,
      name: 'Test Product',
      brand: 'Apple',
      price: 99.99,
      description: 'Test description',
      imageUrl: 'test-image.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockResponse = { data: mockProduct, success: true };

    service.getProduct(productId).subscribe((product) => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(`${apiUrl}/${productId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should use fallback data when API call fails', () => {
    service.getProducts().subscribe((products) => {
      expect(products.length).toBeGreaterThan(0);
    });

    const req = httpMock.expectOne(apiUrl);
    req.error(new ErrorEvent('Network error'));
  });

  it('should cache products', () => {
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Test Product',
        brand: 'Apple',
        price: 99.99,
        description: 'Test description',
        imageUrl: 'test-image.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const mockResponse = { data: mockProducts, success: true };

    // First call
    service.getProducts().subscribe();
    const req1 = httpMock.expectOne(apiUrl);
    req1.flush(mockResponse);

    // Second call should use cache
    service.getProducts().subscribe();
    httpMock.expectNone(apiUrl);
  });
});
