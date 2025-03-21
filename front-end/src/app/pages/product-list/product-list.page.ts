import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AppFooterComponent } from '../../components/app-footer/app-footer.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import {
  IonChip,
  IonContent,
  IonHeader,
  IonLabel,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

import {
  Product,
  ProductBrand,
  ProductService,
} from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonChip,
    IonLabel,
    ProductCardComponent,
    AppFooterComponent,
  ],
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
})
export class ProductListPage implements OnInit {
  products: Product[] = [];
  allProducts: Product[] = [];
  selectedBrand: ProductBrand | null = null;
  brands: ProductBrand[] = ['Apple', 'Google', 'Samsung'];

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe((products) => {
      this.allProducts = products;
      this.products = products;
    });
  }

  filterByBrand(brand: ProductBrand | null) {
    if (this.selectedBrand === brand) {
      // If clicking the same brand again, clear the filter
      this.selectedBrand = null;
      this.products = this.allProducts;
    } else {
      this.selectedBrand = brand;
      if (brand) {
        this.productService.getProductsByBrand(brand).subscribe((products) => {
          this.products = products;
        });
      } else {
        this.products = this.allProducts;
      }
    }
  }

  isBrandSelected(brand: ProductBrand): boolean {
    return this.selectedBrand === brand;
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }
}
