import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { User } from '../models';

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

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/auth`;

  // Use a fixed date string for consistent testing
  const dateString = '2023-01-01T00:00:00.000Z';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: 'environment', useValue: environment },
      ],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login user with Google and store token', () => {
    const mockIdToken = 'google-id-token-123';
    const mockUser: User = {
      uid: '123',
      email: 'test@example.com',
      displayName: 'Test User',
      googleId: '123456',
      lastLogin: dateString,
      createdAt: dateString,
    };

    const mockResponse = {
      success: true,
      data: {
        user: mockUser,
        token: 'mock-token-12345',
      },
    };

    // Need to use the actual spy instead of a regular mock
    spyOn(localStorage, 'setItem').and.callFake((key, value) => {
      // Don't need to do anything
    });

    spyOn(service, 'getToken').and.returnValue('mock-token-12345');

    service.loginWithGoogle(mockIdToken).subscribe((user: User) => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${apiUrl}/google`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ idToken: mockIdToken });
    req.flush(mockResponse);

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'auth_token',
      'mock-token-12345'
    );
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'user',
      JSON.stringify(mockUser)
    );
  });

  it('should logout user and clear token', () => {
    // Set up initial authenticated state
    localStorage.setItem('auth_token', 'test-token');
    localStorage.setItem(
      'user',
      JSON.stringify({ uid: '123', email: 'test@example.com' })
    );

    // Spy on methods
    spyOn(localStorage, 'removeItem').and.callFake((key) => {
      // Don't need to do anything
    });

    const mockResponse = { success: true, data: null };

    service.logout().subscribe((success: boolean) => {
      expect(success).toBeTrue();
    });

    const req = httpMock.expectOne(`${apiUrl}/logout`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    expect(localStorage.removeItem).toHaveBeenCalledWith('auth_token');
    expect(localStorage.removeItem).toHaveBeenCalledWith('user');
  });

  it('should fetch current user', () => {
    const mockUser: User = {
      uid: '123',
      email: 'test@example.com',
      displayName: 'Test User',
      lastLogin: dateString,
      createdAt: dateString,
    };

    const mockResponse = {
      success: true,
      data: mockUser,
    };

    service.fetchCurrentUser().subscribe((user: User) => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/users/me`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get current user from local storage', () => {
    const mockUser: User = {
      uid: '123',
      email: 'test@example.com',
      displayName: 'Test User',
      lastLogin: dateString,
      createdAt: dateString,
    };

    // Set the mock user
    localStorage.setItem('user', JSON.stringify(mockUser));

    // Spy on localStorage.getItem to return our mockUser
    spyOn(localStorage, 'getItem').and.callFake((key) => {
      if (key === 'user') {
        return JSON.stringify(mockUser);
      }
      return null;
    });

    const user = service.getCurrentUser();
    expect(user).toEqual(mockUser);
  });

  it('should return null for getCurrentUser when not logged in', () => {
    localStorage.removeItem('user');

    // Ensure localStorage.getItem returns null for 'user'
    spyOn(localStorage, 'getItem').and.returnValue(null);

    const user = service.getCurrentUser();
    expect(user).toBeNull();
  });
});
