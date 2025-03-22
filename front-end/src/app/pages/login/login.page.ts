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
  // User information
  firstName = '';
  lastName = '';

  // UI state
  isLoading = false;
  isLoggedIn = false;

  // Private state management
  private authSubscription: Subscription | null = null;
  private isFetchingUser = false;

  constructor(private authService: AuthService, private router: Router) {}

  //-------------------------------
  // Lifecycle Hooks
  //-------------------------------

  ngOnInit() {
    this.checkAuthenticationState();
    this.subscribeToAuthChanges();
    this.loadGoogleAuthAPI();
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  //-------------------------------
  // Authentication State Management
  //-------------------------------

  private subscribeToAuthChanges() {
    this.authSubscription = this.authService.isAuthenticated$.subscribe(
      (isAuthenticated) => {
        this.isLoggedIn = isAuthenticated;
      }
    );
  }

  private checkAuthenticationState() {
    const isAuthenticated = this.authService.isAuthenticated();
    this.isLoggedIn = isAuthenticated;

    if (isAuthenticated && !this.isFetchingUser) {
      this.fetchUserData();
    }
  }

  private fetchUserData() {
    this.isFetchingUser = true;

    this.authService.fetchCurrentUser().subscribe({
      next: (userData) => {
        this.isFetchingUser = false;
        this.updateUserNameFromProfile(userData);
      },
      error: (error) => {
        console.error('Error fetching user from database:', error);
        this.isFetchingUser = false;

        // Fallback to cached user
        const cachedUser = this.authService.getCurrentUser();
        console.log('Falling back to cached user:', cachedUser);
        this.updateUserNameFromProfile(cachedUser);
      },
    });
  }

  private updateUserNameFromProfile(userProfile: any) {
    if (userProfile && userProfile.displayName) {
      const nameParts = userProfile.displayName.split(' ');
      this.firstName = nameParts[0] || '';
      this.lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
    }
  }

  //-------------------------------
  // Google Authentication
  //-------------------------------

  private loadGoogleAuthAPI() {
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

    this.authenticateWithGoogleToken(idToken, fullName);
  }

  private authenticateWithGoogleToken(idToken: string, fullName?: string) {
    this.authService.loginWithGoogle(idToken, fullName).subscribe({
      next: (user) => {
        if (!this.isFetchingUser) {
          this.isFetchingUser = true;

          this.authService.fetchCurrentUser().subscribe({
            next: (databaseUser) => {
              this.isFetchingUser = false;
              this.updateUserNameFromProfile(databaseUser);
              this.navigateToProductList();
            },
            error: (error) => {
              console.error(
                'Error fetching user data from database after login:',
                error
              );
              this.isFetchingUser = false;
              this.navigateToProductList();
            },
          });
        } else {
          this.navigateToProductList();
        }
      },
      error: (err) => {
        console.error('Google login error:', err);
        this.isLoading = false;
      },
    });
  }

  private clearGoogleStateCookie() {
    document.cookie = 'g_state=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT';
  }

  //-------------------------------
  // Public UI Actions
  //-------------------------------

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
    this.navigateToProductList();
  }

  private navigateToProductList() {
    this.router.navigateByUrl('/product-list', { replaceUrl: true });
  }
}
