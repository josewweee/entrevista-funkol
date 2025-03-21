import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router, RouterLink } from '@angular/router';
import { CustomInputComponent } from '../../components/custom-input/custom-input.component';
import { OrderService } from '../../services/order.service';
import { Product, ProductService } from '../../services/product.service';
import {
  IonButton,
  IonContent,
  IonIcon,
  LoadingController,
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
    private orderService: OrderService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const productId = params['productId'];
      if (productId) {
        this.productService.getProduct(+productId).subscribe((product) => {
          this.product = product;
        });
      }
    });
  }

  async buyNow() {
    if (!this.product) return;

    // Show loading indicator
    const loading = await this.loadingController.create({
      message: 'Processing payment...',
      spinner: 'circular',
    });
    await loading.present();

    // Simulate payment processing delay
    setTimeout(() => {
      // Create a new order
      this.orderService.addOrder({
        userId: 'user123',
        products: [
          {
            productId: this.product!.id.toString(),
            name: this.product!.name,
            price: this.product!.price,
            quantity: 1,
          },
        ],
        totalAmount: this.product!.price,
      });

      // Dismiss loading and navigate to history page
      loading.dismiss();
      this.router.navigate(['/history']);
    }, 2000); // 2 second delay
  }
}
