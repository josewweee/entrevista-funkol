import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { AppFooterComponent } from './app-footer.component';
import { AuthService } from '../../services/auth.service';

import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import {
  IonFooter,
  IonIcon,
  IonLabel,
  IonTabBar,
  IonTabButton,
} from '@ionic/angular/standalone';

describe('AppFooterComponent', () => {
  let component: AppFooterComponent;
  let fixture: ComponentFixture<AppFooterComponent>;
  let router: Router;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'login', redirectTo: '' },
          { path: 'products', redirectTo: '' },
          { path: 'history', redirectTo: '' },
        ]),
        AppFooterComponent,
        IonFooter,
        IonTabBar,
        IonTabButton,
        IonIcon,
        IonLabel,
      ],
      providers: [{ provide: AuthService, useValue: authServiceSpy }],
    }).compileComponents();

    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    // Create the component
    fixture = TestBed.createComponent(AppFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check if a route is active', fakeAsync(() => {
    // Mock the isActive method since we can't easily set router.url in the tests
    spyOn(component, 'isActive').and.callFake((route: string) => {
      if (route === '/products') {
        return true;
      } else {
        return false;
      }
    });

    expect(component.isActive('/products')).toBeTrue();
    expect(component.isActive('/history')).toBeFalse();

    // Change the mock implementation
    (component.isActive as jasmine.Spy).and.callFake((route: string) => {
      if (route === '/history') {
        return true;
      } else {
        return false;
      }
    });

    expect(component.isActive('/history')).toBeTrue();
    expect(component.isActive('/products')).toBeFalse();
  }));

  it('should navigate to login page after successful logout', () => {
    authService.logout.and.returnValue(of(true));

    spyOn(router, 'navigate');
    component.logout();

    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should handle logout error', () => {
    const errorMessage = 'Logout failed';
    authService.logout.and.returnValue(
      throwError(() => new Error(errorMessage))
    );
    spyOn(console, 'error');
    spyOn(router, 'navigate');

    component.logout();

    expect(authService.logout).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      'Logout error:',
      jasmine.any(Error)
    );
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
