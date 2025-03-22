import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

/**
 * Application Routes Configuration
 *
 * Defines all routes for the application, including:
 * - Authentication routes (login)
 * - Protected routes that require authentication
 * - Default route redirects
 */
export const routes: Routes = [
  //-------------------------------
  // Public Routes
  //-------------------------------

  /**
   * Login page - entry point for unauthenticated users
   */
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
  },

  //-------------------------------
  // Protected Routes
  //-------------------------------

  /**
   * Product list - main product browsing page
   * Requires authentication
   */
  {
    path: 'product-list',
    loadComponent: () =>
      import('./pages/product-list/product-list.page').then(
        (m) => m.ProductListPage
      ),
    canActivate: [AuthGuard],
  },

  /**
   * Checkout - order completion page
   * Requires authentication
   */
  {
    path: 'checkout',
    loadComponent: () =>
      import('./pages/checkout/checkout.page').then((m) => m.CheckoutPage),
    canActivate: [AuthGuard],
  },

  /**
   * Order history - view past orders
   * Requires authentication
   */
  {
    path: 'history',
    loadComponent: () =>
      import('./pages/history/history.page').then((m) => m.HistoryPage),
    canActivate: [AuthGuard],
  },

  //-------------------------------
  // Default Routes
  //-------------------------------

  /**
   * Default redirect to login page
   */
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
