import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonButton, IonContent, IonInput } from '@ionic/angular/standalone';
import { CustomInputComponent } from '../../components/custom-input/custom-input.component';


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
    CustomInputComponent,
  ],
})
export class LoginPage {
  firstName = '';
  lastName = '';

  constructor() {}

  register() {
    console.log('Register clicked:', this.firstName, this.lastName);
    // Implement registration logic
  }

  loginWithGoogle() {
    console.log('Login with Google clicked');
    // Implement Google login logic
  }
}
