import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IonCard, IonCardContent } from '@ionic/angular/standalone';
import { Product } from '../../models';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, IonCard, IonCardContent],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent {
  @Input() product!: Product;

  constructor(private router: Router) {}

  goToCheckout() {
    this.router.navigate(['/checkout'], {
      queryParams: { productId: this.product.id },
    });
  }
}
