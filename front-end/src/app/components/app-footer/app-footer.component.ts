import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  home,
  homeOutline,
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
  constructor(private router: Router) {
    addIcons({ homeOutline, home, personOutline, person, timeOutline, time });
  }

  ngOnInit() {}

  isActive(route: string): boolean {
    return this.router.url === route;
  }
}
