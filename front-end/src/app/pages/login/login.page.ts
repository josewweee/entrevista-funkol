import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonButton, IonContent, IonSpinner } from '@ionic/angular/standalone';
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
export class LoginPage implements OnInit {
  firstName = '';
  lastName = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Check if user is already authenticated
    this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.router.navigate(['/products']);
      }
    });

    // Load Google authentication script
    this.loadGoogleAuthAPI();
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

    // Process the ID token
    const idToken = response.credential;
    // Only create fullName if both firstName and lastName are available
    const fullName =
      this.firstName || this.lastName
        ? this.firstName + ' ' + this.lastName
        : undefined;

    this.authService.loginWithGoogle(idToken, fullName).subscribe({
      next: (user) => {
        console.log('Successfully logged in with Google', user);

        // Set firstName and lastName from user's displayName
        if (user && user.displayName) {
          const nameParts = user.displayName.split(' ');
          this.firstName = nameParts[0] || '';
          this.lastName =
            nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
        }

        this.router.navigate(['/product-list']);
      },
      error: (err) => {
        console.error('Google login error:', err);
      },
    });
  }

  /**
   * Clear Google's g_state cookie which controls the cooldown period
   */
  private clearGoogleStateCookie() {
    // Delete the g_state cookie that Google uses to implement cooldown
    document.cookie = 'g_state=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT';
  }

  loginWithGoogle() {
    this.isLoading = true;

    // Cancel any existing prompt
    google.accounts.id.cancel();

    // Clear the Google state cookie to bypass the cooldown
    this.clearGoogleStateCookie();

    // Re-initialize to force a fresh context with updated settings
    this.initGoogleAuth();

    // Try to prompt for Google sign-in
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
}
