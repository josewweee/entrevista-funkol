import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { CustomInputComponent } from '../../components/custom-input/custom-input.component';
import { AuthService } from '../../services/auth.service';
import {
  IonButton,
  IonContent,
  IonInput,
  IonSpinner,
} from '@ionic/angular/standalone';

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
    IonInput,
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

    this.authService.loginWithGoogle(idToken).subscribe({
      next: (user) => {
        console.log('Successfully logged in with Google', user);
        this.router.navigate(['/product-list']);
      },
      error: (err) => {
        console.error('Google login error:', err);
      },
    });
  }

  register() {
    console.log('Register clicked:', this.firstName, this.lastName);
    // Implement registration logic
  }

  loginWithGoogle() {
    this.isLoading = true;
    // Trigger Google authentication prompt
    google.accounts.id.prompt((notification: any) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        // Google Sign In notification is not displayed or was skipped
        this.isLoading = false;
      }
    });
  }
}
