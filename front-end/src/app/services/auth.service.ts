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

  loginWithGoogle(idToken: string, fullName?: string): Observable<User> {
    return this.http
      .post<ApiResponse<User>>(`${this.apiUrl}/google`, { idToken, fullName })
      .pipe(
        map((response) => {
          if (!response.success) {
            throw new Error(response.message || 'Authentication failed');
          }

          const user: User = {
            ...response.data,
            // Use displayName from database if available, otherwise use fullName from Google
            displayName: response.data.displayName || fullName,
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

        // Only clear session on 401 Unauthorized
        if (error.status === 401) {
          this.clearUserSession();
        }

        return throwError(() => error);
      })
    );
  }

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

        // Validate token by fetching current user - but don't block the UI
        this.fetchCurrentUser().subscribe({
          next: () => {},
          error: (error) => {
            console.error('Error validating user session:', error);

            // Only clear session on 401 Unauthorized
            if (error.status === 401) {
              this.clearUserSession();
            }
          },
        });
      } catch (e) {
        console.error('Failed to parse saved session', e);
        this.clearUserSession();
      }
    } else {
      console.log('No saved session found');
      this.clearUserSession();
    }
  }

  private setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }

  private saveUserToLocalStorage(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  private storeToken(token: string): void {
    localStorage.setItem('auth_token', token);
    this.tokenSubject.next(token);
  }

  private clearUserSession(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('auth_token');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.tokenSubject.next(null);
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}
