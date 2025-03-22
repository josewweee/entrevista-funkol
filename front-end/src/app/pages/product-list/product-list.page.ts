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

/**
 * Product List Page
 *
 * Displays a filterable list of products that can be browsed by brand
 */
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
  //-------------------------------
  // Component Properties
  //-------------------------------

  // Product data
  products: Product[] = [];
  allProducts: Product[] = [];

  // Filter state
  selectedBrand: ProductBrand | null = null;
  brands: ProductBrand[] = ['Apple', 'Google', 'Samsung'];

  constructor(private productService: ProductService, private router: Router) {}

  //-------------------------------
  // Lifecycle Hooks
  //-------------------------------

  /**
   * Initialize component and load product data
   */
  ngOnInit() {
    this.loadProducts();
  }

  //-------------------------------
  // Data Loading Methods
  //-------------------------------

  /**
   * Fetch all products from the service
   */
  loadProducts() {
    this.productService.getProducts().subscribe((products) => {
      this.allProducts = products;
      this.products = products;
    });
  }

  //-------------------------------
  // Filter Methods
  //-------------------------------

  /**
   * Filter products by brand
   *
   * @param brand - The brand to filter by or null to clear filter
   */
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

  /**
   * Check if a brand is currently selected
   *
   * @param brand - The brand to check
   * @returns true if the brand is selected
   */
  isBrandSelected(brand: ProductBrand): boolean {
    return this.selectedBrand === brand;
  }

  /**
   * Check if a route is active
   *
   * @param route - The route to check
   * @returns true if the route is currently active
   */
  isActive(route: string): boolean {
    return this.router.url === route;
  }
}
