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
  imports: [SmallerProductCardComponent,RouterModule,CommonModule],
  templateUrl: './common-product-list.component.html',
  styleUrl: './common-product-list.component.css'
})
export class CommonProductListComponent implements OnInit {


  APIURL = environment.APIURL;
  toolsArray: Tool[] = [];

  NewArrayDetails: any[] = [];

  
    constructor(
      private http: HttpClient,
  ) { }
  


  
 

  ngOnInit(): void {
    this.getAllProductDetails();
  }

    
 

  
  async getAllProductDetails(): Promise<void> {
  this.http.post(this.APIURL + 'get_all_product_details_all', {}).subscribe({
    next: (response: any) => {
      if (response.message === "yes" && response.products?.length) {
        const newProducts = response.products.map((prod: any) => ({
          productname: prod.productname, // match template
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
