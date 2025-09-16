import { Component, OnInit } from '@angular/core';
import { ProductCardHolderComponent } from '../../widgets/product-card-holder/product-card-holder.component';
import { CommonProductListComponent } from '../../widgets/common-product-list/common-product-list.component';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ProductCardHolderComponent,CommonProductListComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{

featuredArrayDetails = [
  { name: "Product name", type: "Agent", icon: "../../../assets/images/12.png", tags: ["sells", "Productivity"] },
  { name: "Mithila dilshan wickramaarachchi", type: "Agent", icon: "../../../assets/images/12.png", tags: ["sells", "Productivity"] },
  { name: "Another product", type: "Agent", icon: "../../../assets/images/12.png", tags: ["sells", "Productivity"] },
  { name: "Another product", type: "Agent", icon: "../../../assets/images/12.png", tags: ["sells", "Productivity"] },
  { name: "Another product", type: "Agent", icon: "../../../assets/images/12.png", tags: ["sells", "Productivity"] },
  { name: "Another product", type: "Agent", icon: "../../../assets/images/12.png", tags: ["sells", "Productivity"] },
  { name: "Another product", type: "Agent", icon: "../../../assets/images/12.png", tags: ["sells", "Productivity"] },
  { name: "Another product", type: "Agent", icon: "../../../assets/images/12.png", tags: ["sells", "Productivity"] },
  { name: "Another product", type: "Agent", icon: "../../../assets/images/12.png", tags: ["sells", "Productivity"] },
  { name: "Another product", type: "Agent", icon: "../../../assets/images/12.png", tags: ["sells", "Productivity"] },
  ];

  

  currentPage: number = 1;
  pageSize: number = 10;
  NewArrayDetails: any[] = [];
  MostViewedArrayDetails: any[] = [];



  APIURL = environment.APIURL;


    constructor(
      private http: HttpClient,
      private router:Router
    ) { }
    
  
  ngOnInit(): void {
  this.getAllProductDetailsNewProducts();
  this.getAllProductDetailsMostViewedProducts();
  }
  

  getmoreresult(getmoretext: string) {
    this.router.navigate(['/home/get-more-result/' + getmoretext]);
}




  async getAllProductDetailsMostViewedProducts(): Promise<void> {
     const requestBody = {
      page: this.currentPage,
      limit: this.pageSize
    };
  this.http.post(this.APIURL + 'get_all_product_details_all_most_viewed', requestBody).subscribe({
    next: (response: any) => {
      if (response.message === "yes" && response.products?.length) {
        const newProducts = response.products.map((prod: any) => ({
          name: prod.productname, // match template
          type: prod.productcategory,
          icon: prod.productimage
            ? `data:image/jpeg;base64,${prod.productimage}`
            : '../../../assets/images/12.png',
          // ✅ use 'usecasenames' array instead of singular 'usecasename'
          tags: prod.usecasenames && prod.usecasenames.length ? prod.usecasenames : [],
          productid: prod.productid,
          productusecaseid: prod.productusecaseid,
          showDropdown: false
        }));

        // Append to existing array
        this.MostViewedArrayDetails = [...this.MostViewedArrayDetails, ...newProducts];
 

      } else {
        console.warn("⚠️ No product found");
      }
    },
    error: (error) => {
      console.error('❌ Error fetching product details:', error);
    }
  });
  }
  








  async getAllProductDetailsNewProducts(): Promise<void> {
  
     const requestBody = {
      page: this.currentPage,
      limit: this.pageSize
    };

  this.http.post(this.APIURL + 'get_all_product_details_all_new', requestBody).subscribe({
    next: (response: any) => {
      if (response.message === "yes" && response.products?.length) {
        const newProducts = response.products.map((prod: any) => ({
          name: prod.productname, // match template
          type: prod.productcategory,
          icon: prod.productimage
            ? `data:image/jpeg;base64,${prod.productimage}`
            : '../../../assets/images/12.png',
          // ✅ use 'usecasenames' array instead of singular 'usecasename'
          tags: prod.usecasenames && prod.usecasenames.length ? prod.usecasenames : [],
          productid: prod.productid,
          productusecaseid: prod.productusecaseid,
          showDropdown: false
        }));

        // Append to existing array
        this.NewArrayDetails = [...this.NewArrayDetails, ...newProducts];
 

      } else {
        console.warn("⚠️ No product found");
      }
    },
    error: (error) => {
      console.error('❌ Error fetching product details:', error);
    }
  });
}



}
