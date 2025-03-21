import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'product-list',
    loadComponent: () =>
      import('./pages/product-list/product-list.page').then(
        (m) => m.ProductListPage
      ),
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./pages/checkout/checkout.page').then((m) => m.CheckoutPage),
  },
  {
    path: 'history',
    loadComponent: () =>
      import('./pages/history/history.page').then((m) => m.HistoryPage),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
