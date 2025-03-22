import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router, RouterLink } from '@angular/router';
import { Product } from 'src/app/models';
import { AppFooterComponent } from '../../components/app-footer/app-footer.component';
import { CustomInputComponent } from '../../components/custom-input/custom-input.component';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { ProductService } from '../../services/product.service';
import { toISOString } from '../../utils/date-utils';

import {
  IonButton,
  IonContent,
  IonIcon,
  LoadingController,
  ToastController,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
    IonContent,
    IonButton,
    IonIcon,
    CustomInputComponent,
    AppFooterComponent,
  ],
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {
  product: Product | undefined;
  couponCode: string = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private loadingController: LoadingController,
    private orderService: OrderService,
    private authService: AuthService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const productId = params['productId'];
      if (productId) {
        this.productService.getProduct(productId).subscribe((product) => {
          this.product = product;
        });
      }
    });
  }

  async buyNow() {
    if (!this.product) return;

    // Check if user is authenticated
    if (!this.authService.isAuthenticated()) {
      this.presentToast('Please log in to complete your purchase', 'danger');
      this.router.navigate(['/login']);
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.presentToast('User information not available', 'danger');
      return;
    }

    // Show loading indicator
    const loading = await this.loadingController.create({
      message: 'Processing payment...',
      spinner: 'circular',
    });
    await loading.present();

    // Create order data
    const orderData = {
      products: [
        {
          productId: this.product.id,
          name: this.product.name,
          price: this.product.price,
        },
      ],
      totalAmount: this.product.price,
      // Use the utility function for consistent date formatting
      createdAt: toISOString(new Date()),
    };

    // Create order using token-based auth
    this.orderService.createOrder(orderData).subscribe({
      next: (order) => {
        loading.dismiss();
        this.presentToast('Order placed successfully!', 'success');
        this.router.navigate(['/history']);
      },
      error: (error) => {
        loading.dismiss();
        console.error('Order creation failed:', error);

        if (error.status === 401) {
          // Authentication error
          this.presentToast(
            'Your session has expired. Please log in again.',
            'danger'
          );
          this.router.navigate(['/login']);
          return;
        }

        // Fallback to local order for network errors
        this.orderService.addOrder({
          userId: currentUser.uid,
          products: orderData.products,
          totalAmount: orderData.totalAmount,
        });
        this.presentToast('Order placed in offline mode', 'warning');
        this.router.navigate(['/history']);
      },
    });
  }

  async presentToast(
    message: string,
    color: 'success' | 'danger' | 'warning' = 'success'
  ) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'bottom',
    });
    toast.present();
  }
}
