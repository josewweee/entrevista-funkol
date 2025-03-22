import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';

/**
 * Authentication Interceptor
 *
 * Intercepts all HTTP requests to add the authentication token
 * from local storage to the Authorization header
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() {}

  /**
   * Intercepts HTTP requests to add authentication headers
   *
   * @param request - The original HTTP request
   * @param next - The next handler in the chain
   * @returns An observable of the HTTP event stream
   */
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Add authentication token if available
    request = this.addAuthHeader(request);

    // Continue with the request chain
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Log the error for debugging
        console.error(`HTTP error occurred for ${request.url}:`, error);

        // Don't handle errors here - let the services handle them
        return throwError(() => error);
      })
    );
  }

  /**
   * Adds authorization header to the request if token exists
   *
   * @param request - The original HTTP request
   * @returns The modified request with auth header
   */
  private addAuthHeader(request: HttpRequest<unknown>): HttpRequest<unknown> {
    // Get the token directly from localStorage to avoid circular dependency
    const token = localStorage.getItem('auth_token');

    // If we have a token, add it to the request header
    if (token) {
      return request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return request;
  }
}
