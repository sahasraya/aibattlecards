import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductCardHolderComponent } from '../../widgets/product-card-holder/product-card-holder.component';
import { CommonModule } from '@angular/common';
import { SmallerProductCardComponent } from '../../widgets/smaller-product-card/smaller-product-card.component';
import { LoadingComponent } from '../../widgets/loading/loading.component';

@Component({
  selector: 'app-get-more-result',
  standalone: true,
  imports: [SmallerProductCardComponent,  CommonModule,RouterModule,LoadingComponent],
  templateUrl: './get-more-result.component.html',
  styleUrl: './get-more-result.component.css'
})
export class GetMoreResultComponent implements OnInit{

 APIURL = environment.APIURL;

  featuredArrayDetails: any[] = [];
  NewArrayDetails: any[] = [];
  MostViewedArrayDetails: any[] = [];

  lookingfortext: string = '';
  
  // Pagination properties
  currentPage: number = 1;
  pageSize: number = 10;
  hasMoreData: boolean = true;
  isLoading: boolean = false;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  onProductDeleted(productId: string) {
    console.log("🗑 Product deleted:", productId);

    if (this.lookingfortext === 'featured') {
      this.featuredArrayDetails = this.featuredArrayDetails.filter(p => p.productid !== productId);
    } else if (this.lookingfortext === 'new') {
      this.NewArrayDetails = this.NewArrayDetails.filter(p => p.productid !== productId);
    } else if (this.lookingfortext === 'mostviewed') {
      this.MostViewedArrayDetails = this.MostViewedArrayDetails.filter(p => p.productid !== productId);
    }
  }

  ngOnInit() {
    // Get search text from route parameters
    this.route.params.subscribe(params => {
      this.lookingfortext = params['lookingtext'];
      
      // Reset pagination when route changes
      this.currentPage = 1;
      this.hasMoreData = true;
      this.clearCurrentData();

      this.loadInitialData();
    });
  }

  clearCurrentData() {
    this.featuredArrayDetails = [];
    this.NewArrayDetails = [];
    this.MostViewedArrayDetails = [];
  }

  loadInitialData() {
    if (this.lookingfortext === 'featured') {
      this.getAllProductDetailsFeaturedProducts();
    } else if (this.lookingfortext === 'new') {
      this.getAllProductDetailsNewProducts();
    } else if (this.lookingfortext === 'mostviewed') {
      this.getAllProductDetailsMostViewedProducts();
    }
  }

  onLoadMore() {
    if (this.hasMoreData && !this.isLoading) {
      this.currentPage++;
      this.loadInitialData();
    }
  }

  async getAllProductDetailsFeaturedProducts(): Promise<void> {
    this.isLoading = true;
    
    const requestBody = {
      page: this.currentPage,
      limit: this.pageSize
    };

    this.http.post(this.APIURL + 'get_all_product_details_all_featured', requestBody).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        
        if (response.message === "yes" && response.products?.length) {
          const newProducts = response.products.map((prod: any) => ({
            productname: prod.productname,
            productcategory: prod.productcategory,
            productimage: prod.productimage
              ? `data:image/jpeg;base64,${prod.productimage}`
              : '../../../assets/images/12.png',
            productusecase: prod.usecasenames && prod.usecasenames.length ? prod.usecasenames : [],
            productid: prod.productid,
            productusecaseid: prod.productusecaseid,
            showDropdown: false
          }));

          // Append new products to existing array
          this.featuredArrayDetails = [...this.featuredArrayDetails, ...newProducts];
          
          // Check if there are more products to load
          this.hasMoreData = response.products.length === this.pageSize;
        } else {
          this.hasMoreData = false;
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.hasMoreData = false;
        console.error('❌ Error fetching featured products:', error);
      }
    });
  }

  async getAllProductDetailsNewProducts(): Promise<void> {
    this.isLoading = true;
    
    const requestBody = {
      page: this.currentPage,
      limit: this.pageSize
    };

    this.http.post(this.APIURL + 'get_all_product_details_all_new', requestBody).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        
        if (response.message === "yes" && response.products?.length) {
          const newProducts = response.products.map((prod: any) => ({
            productname: prod.productname,
            productcategory: prod.productcategory,
            productimage: prod.productimage
              ? `data:image/jpeg;base64,${prod.productimage}`
              : '../../../assets/images/12.png',
            productusecase: prod.usecasenames && prod.usecasenames.length ? prod.usecasenames : [],
            productid: prod.productid,
            productusecaseid: prod.productusecaseid,
            showDropdown: false
          }));

          // Append new products to existing array
          this.NewArrayDetails = [...this.NewArrayDetails, ...newProducts];
          
          // Check if there are more products to load
          this.hasMoreData = response.products.length === this.pageSize;
        } else {
          this.hasMoreData = false;
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.hasMoreData = false;
        console.error('❌ Error fetching new products:', error);
      }
    });
  }

  async getAllProductDetailsMostViewedProducts(): Promise<void> {
    this.isLoading = true;
    
    const requestBody = {
      page: this.currentPage,
      limit: this.pageSize
    };

    this.http.post(this.APIURL + 'get_all_product_details_all_most_viewed', requestBody).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        
        if (response.message === "yes" && response.products?.length) {
          const newProducts = response.products.map((prod: any) => ({
            productname: prod.productname,
            productcategory: prod.productcategory,
            productimage: prod.productimage
              ? `data:image/jpeg;base64,${prod.productimage}`
              : '../../../assets/images/12.png',
            productusecase: prod.usecasenames && prod.usecasenames.length ? prod.usecasenames : [],
            productid: prod.productid,
            productusecaseid: prod.productusecaseid,
            showDropdown: false
          }));

          // Append new products to existing array
          this.MostViewedArrayDetails = [...this.MostViewedArrayDetails, ...newProducts];
          
          // Check if there are more products to load
          this.hasMoreData = response.products.length === this.pageSize;
        } else {
          this.hasMoreData = false;
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.hasMoreData = false;
        console.error('❌ Error fetching most viewed products:', error);
      }
    });
  }

}
