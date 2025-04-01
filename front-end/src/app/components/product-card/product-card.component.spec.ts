import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { IonCard, IonCardContent } from '@ionic/angular/standalone';
import { ProductCardComponent } from './product-card.component';
import { Product } from '../../models';

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;
  let router: jasmine.SpyObj<Router>;

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

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [IonCard, IonCardContent, ProductCardComponent],
      providers: [{ provide: Router, useValue: routerSpy }],
    }).compileComponents();

    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    component.product = mockProduct;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to checkout with correct product ID when goToCheckout is called', () => {
    component.goToCheckout();
    expect(router.navigate).toHaveBeenCalledWith(['/checkout'], {
      queryParams: { productId: mockProduct.id },
    });
  });
});
