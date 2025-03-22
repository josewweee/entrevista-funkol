import { Routes } from '@angular/router';
import { AuthRedirectGuard } from './guards/auth-redirect.guard';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
    canActivate: [AuthRedirectGuard],
  },
  {
    path: 'product-list',
    loadComponent: () =>
      import('./pages/product-list/product-list.page').then(
        (m) => m.ProductListPage
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./pages/checkout/checkout.page').then((m) => m.CheckoutPage),
    canActivate: [AuthGuard],
  },
  {
    path: 'history',
    loadComponent: () =>
      import('./pages/history/history.page').then((m) => m.HistoryPage),
    canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
