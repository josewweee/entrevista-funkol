import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { parseDate } from '../utils/date-utils';

// Declare Google global variable
declare const google: any;

export interface User {
  uid: string;
  email: string;
  googleId?: string;
  displayName?: string;
  photoURL?: string;
  lastLogin: Date | string;
  createdAt: Date | string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private userApiUrl = `${environment.apiUrl}/users`;

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Track authentication state
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  // Store the token
  private tokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {
    // Check for existing session on service initialization
    this.checkExistingSession();
  }

  /**
   * Login with Google
   * Sends the ID token to the backend for verification
   */
  loginWithGoogle(idToken: string): Observable<User> {
    console.log('Sending Google ID token to backend for verification');

    return this.http
      .post<ApiResponse<User>>(`${this.apiUrl}/google`, { idToken })
      .pipe(
        map((response) => {
          console.log('Backend response:', response);

          if (!response.success) {
            throw new Error(response.message || 'Authentication failed');
          }

          const user = {
            ...response.data,
            lastLogin: parseDate(response.data.lastLogin),
            createdAt: parseDate(response.data.createdAt),
          };

          // Store token
          this.storeToken(idToken);

          this.setCurrentUser(user);
          this.saveUserToLocalStorage(user);
          return user;
        }),
        catchError((error) => {
          console.error('Google login error:', error);

          // Log more detailed error information
          if (error.error) {
            console.error('Error details:', error.error);
          }

          return throwError(
            () => new Error('Authentication failed. Please try again.')
          );
        })
      );
  }

  /**
   * Get current user profile from backend
   */
  fetchCurrentUser(): Observable<User> {
    return this.http.get<ApiResponse<User>>(`${this.userApiUrl}/me`).pipe(
      map((response) => {
        if (!response.success) {
          throw new Error(response.message || 'Failed to fetch user profile');
        }

        const user = {
          ...response.data,
          lastLogin: parseDate(response.data.lastLogin),
          createdAt: parseDate(response.data.createdAt),
        };

        this.setCurrentUser(user);
        this.saveUserToLocalStorage(user);
        return user;
      }),
      catchError((error) => {
        console.error('Error fetching user profile:', error);
        // If 401, clear user and token
        if (error.status === 401) {
          this.clearUserSession();
        }
        return throwError(() => new Error('Failed to fetch user profile'));
      })
    );
  }

  /**
   * Log out the current user
   */
  logout(): Observable<boolean> {
    // Sign out from Google if available
    try {
      if (typeof google !== 'undefined' && google.accounts) {
        google.accounts.id.disableAutoSelect();
      }
    } catch (e) {
      console.error('Error signing out from Google:', e);
    }

    // Clear user data and token
    this.clearUserSession();

    return of(true);
  }

  /**
   * Check if there's an existing session stored in localStorage
   */
  private checkExistingSession(): void {
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('currentUser');

    if (savedToken && savedUser) {
      try {
        const token = savedToken;
        const user = JSON.parse(savedUser) as User;

        // Set token in service
        this.tokenSubject.next(token);

        // Update last login time
        user.lastLogin = new Date();
        this.setCurrentUser(user);

        // Validate token by fetching current user
        this.fetchCurrentUser().subscribe({
          error: () => this.clearUserSession(),
        });
      } catch (e) {
        console.error('Failed to parse saved session', e);
        this.clearUserSession();
      }
    }
  }

  /**
   * Update the current user and authentication state
   */
  private setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }

  /**
   * Save user to localStorage for session persistence
   */
  private saveUserToLocalStorage(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  /**
   * Store authentication token
   */
  private storeToken(token: string): void {
    localStorage.setItem('auth_token', token);
    this.tokenSubject.next(token);
  }

  /**
   * Clear all user session data
   */
  private clearUserSession(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('auth_token');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.tokenSubject.next(null);
  }

  /**
   * Get authentication token for API requests
   */
  getToken(): string | null {
    return this.tokenSubject.value;
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}
