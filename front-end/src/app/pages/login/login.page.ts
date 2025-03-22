import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonButton, IonContent, IonSpinner } from '@ionic/angular/standalone';
import { Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CustomInputComponent } from '../../components/custom-input/custom-input.component';
import { AuthService } from '../../services/auth.service';

declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonButton,
    IonSpinner,
    CustomInputComponent,
  ],
})
export class LoginPage implements OnInit, OnDestroy {
  firstName = '';
  lastName = '';
  isLoading = false;
  isLoggedIn = false;
  private authSubscription: Subscription | null = null;
  private isFetchingUser = false; // Flag to prevent multiple fetches

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Check authentication state immediately
    this.checkAuthenticationState();

    // Subscribe to future authentication state changes
    // but don't trigger checkAuthenticationState again if we're already checking
    this.authSubscription = this.authService.isAuthenticated$.subscribe(
      (isAuthenticated) => {
        // Update the UI state without triggering another fetch
        this.isLoggedIn = isAuthenticated;
      }
    );

    // Load Google authentication script
    this.loadGoogleAuthAPI();
  }

  ngOnDestroy() {
    // Clean up subscription to prevent memory leaks
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  private checkAuthenticationState() {
    const isAuthenticated = this.authService.isAuthenticated();
    this.isLoggedIn = isAuthenticated;

    if (isAuthenticated && !this.isFetchingUser) {
      this.isFetchingUser = true; // Set flag to prevent multiple fetches

      // Fetch the latest user data from the database
      this.authService.fetchCurrentUser().subscribe({
        next: (userData) => {
          this.isFetchingUser = false; // Reset flag

          if (userData && userData.displayName) {
            const nameParts = userData.displayName.split(' ');
            this.firstName = nameParts[0] || '';
            this.lastName =
              nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
          }
        },
        error: (error) => {
          console.error('Error fetching user from database:', error);
          this.isFetchingUser = false; // Reset flag even on error

          // Fallback to cached user if fetch fails
          const cachedUser = this.authService.getCurrentUser();
          console.log('Falling back to cached user:', cachedUser);

          if (cachedUser && cachedUser.displayName) {
            const nameParts = cachedUser.displayName.split(' ');
            this.firstName = nameParts[0] || '';
            this.lastName =
              nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
          }
        },
      });
    }
  }

  private loadGoogleAuthAPI() {
    // Load the Google Sign-In API
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      this.initGoogleAuth();
    };
  }

  private initGoogleAuth() {
    // Initialize Google Sign-In with proper configuration
    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: this.handleCredentialResponse.bind(this),
      auto_select: false,
      cancel_on_tap_outside: true,
      context: 'signin',
    });
  }

  private handleCredentialResponse(response: any) {
    this.isLoading = false;

    if (!response.credential) {
      console.error('Google authentication failed: No credential returned');
      return;
    }

    const idToken = response.credential;
    const fullName =
      this.firstName || this.lastName
        ? this.firstName + ' ' + this.lastName
        : undefined;

    this.authService.loginWithGoogle(idToken, fullName).subscribe({
      next: (user) => {
        // Ensure we're not already fetching user data
        if (!this.isFetchingUser) {
          this.isFetchingUser = true;

          // Fetch the latest user data from the database
          this.authService.fetchCurrentUser().subscribe({
            next: (databaseUser) => {
              this.isFetchingUser = false;

              // Set firstName and lastName from database user's displayName
              if (databaseUser && databaseUser.displayName) {
                const nameParts = databaseUser.displayName.split(' ');
                this.firstName = nameParts[0] || '';
                this.lastName =
                  nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
              }

              // Navigate to product list page
              this.router.navigateByUrl('/product-list', { replaceUrl: true });
            },
            error: (error) => {
              console.error(
                'Error fetching user data from database after login:',
                error
              );
              this.isFetchingUser = false;

              // Still navigate even if we couldn't fetch the updated user
              this.router.navigateByUrl('/product-list', { replaceUrl: true });
            },
          });
        } else {
          // Skip fetching if already in progress and just navigate
          this.router.navigateByUrl('/product-list', { replaceUrl: true });
        }
      },
      error: (err) => {
        console.error('Google login error:', err);
        this.isLoading = false;
      },
    });
  }

  // Delete the g_state cookie that Google uses to implement cooldown
  private clearGoogleStateCookie() {
    document.cookie = 'g_state=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT';
  }

  loginWithGoogle() {
    this.isLoading = true;

    google.accounts.id.cancel();

    this.clearGoogleStateCookie();

    this.initGoogleAuth();

    google.accounts.id.prompt((notification: any) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        console.log(
          'Google prompt was suppressed, clearing cookie and retrying'
        );
        this.isLoading = false;
        this.clearGoogleStateCookie();
      }
    });
  }

  goToProducts() {
    this.router.navigateByUrl('/product-list', { replaceUrl: true });
  }
}
