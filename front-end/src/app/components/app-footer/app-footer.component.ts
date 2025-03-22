import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { AuthService } from '../../services/auth.service';
import {
  home,
  homeOutline,
  logOut,
  logOutOutline,
  person,
  personOutline,
  time,
  timeOutline,
} from 'ionicons/icons';

import {
  IonFooter,
  IonIcon,
  IonLabel,
  IonTabBar,
  IonTabButton,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonFooter,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel,
  ],
  templateUrl: './app-footer.component.html',
  styleUrls: ['./app-footer.component.scss'],
})
export class AppFooterComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService) {
    addIcons({
      homeOutline,
      home,
      personOutline,
      person,
      timeOutline,
      time,
      logOutOutline,
      logOut,
    });
  }

  ngOnInit() {}

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout error:', error);
      },
    });
  }
}
