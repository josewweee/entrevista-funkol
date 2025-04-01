import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { IonButton, IonContent, IonSpinner } from '@ionic/angular/standalone';
import { of } from 'rxjs';
import { LoginPage } from './login.page';
import { CustomInputComponent } from '../../components/custom-input/custom-input.component';
import { AuthService } from '../../services/auth.service';

// Augment window with google property
declare global {
  interface Window {
    google: any;
  }
}

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    // Create spy for AuthService
    const authSpy = jasmine.createSpyObj(
      'AuthService',
      [
        'isAuthenticated',
        'getCurrentUser',
        'fetchCurrentUser',
        'loginWithGoogle',
      ],
      {
        isAuthenticated$: of(false),
      }
    );

    // Mock implementation
    authSpy.isAuthenticated.and.returnValue(false);
    authSpy.getCurrentUser.and.returnValue(null);
    authSpy.fetchCurrentUser.and.returnValue(of(null));

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule,
        LoginPage,
        IonContent,
        IonButton,
        IonSpinner,
        CustomInputComponent,
      ],
      providers: [{ provide: AuthService, useValue: authSpy }],
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    // Mock global google object
    window.google = {
      accounts: {
        id: {
          initialize: jasmine.createSpy('initialize'),
          prompt: jasmine.createSpy('prompt'),
          cancel: jasmine.createSpy('cancel'),
        },
      },
    };

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should try to check authentication on init', () => {
    expect(authServiceSpy.isAuthenticated).toHaveBeenCalled();
  });

  afterAll(() => {
    // Clean up mock
    delete window.google;
  });
});
