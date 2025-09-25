import { Component, OnInit } from '@angular/core';
import { SmallerProductCardComponent } from '../smaller-product-card/smaller-product-card.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

interface Tool {
  productimage: string;
  productname: string;
  productid: string;
  productcategory: string;
  productusecase: string[];
  showDropdown?: boolean; // optional property for dropdown toggle
}

@Component({
  selector: 'app-common-product-list',
  standalone: true,
  imports: [SmallerProductCardComponent, RouterModule, CommonModule],
  templateUrl: './common-product-list.component.html',
  styleUrl: './common-product-list.component.css'
})
export class CommonProductListComponent implements OnInit {
  
  APIURL = environment.APIURL;
  toolsArray: Tool[] = [];
  NewArrayDetails: any[] = [];

  // Pagination properties
  currentPage: number = 1;
  pageSize: number = 10;
  hasMoreData: boolean = true;
  isLoading: boolean = false;

  constructor(
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.getAllProductDetails();
  }

  async getAllProductDetails(): Promise<void> {
    if (this.isLoading || !this.hasMoreData) {
      return; // Prevent multiple simultaneous calls
    }

    this.isLoading = true;

    const requestBody = {
      page: this.currentPage,
      limit: this.pageSize
    };

    this.http.post(this.APIURL + 'get_all_product_details_all', requestBody).subscribe({
      next: (response: any) => {
        this.isLoading = false;

        if (response.message === "yes" && response.products?.length) {
          const newProducts = response.products.map((prod: any) => ({
            productname: prod.productname,
            productcategory: prod.productcategory,
            productimage: prod.productimage
              ? `data:image/jpeg;base64,${prod.productimage}`
              : '../../../assets/images/12.png',
            // ✅ use 'usecasenames' array instead of singular 'usecasename'
            productusecase: prod.usecasenames && prod.usecasenames.length ? prod.usecasenames : [],
            productid: prod.productid,
            userid: prod.userid,
            productusecaseid: prod.productusecaseid,
            showDropdown: false
          }));

          // Append to existing array
          this.toolsArray = [...this.toolsArray, ...newProducts];

          // Check if we have more data
          if (newProducts.length < this.pageSize) {
            this.hasMoreData = false; // No more data available
          }

          // Increment page for next request
          this.currentPage++;

        } else {
          console.warn("⚠️ No more products found");
          this.hasMoreData = false; // No more data available
        }
      },
      error: (error) => {
        console.error('❌ Error fetching product details:', error);
        this.isLoading = false;
      }
    });
  }

  // Method to load more data
  loadMore(): void {
    if (!this.isLoading && this.hasMoreData) {
      this.getAllProductDetails();
    }
  }

  // Optional: Method to reset pagination (useful for refresh)
  resetPagination(): void {
    this.currentPage = 1;
    this.hasMoreData = true;
    this.toolsArray = [];
    this.getAllProductDetails();
  }
}