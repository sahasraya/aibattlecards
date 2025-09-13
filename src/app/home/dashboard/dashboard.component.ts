import { Component, OnInit } from '@angular/core';
import { ProductCardHolderComponent } from '../../widgets/product-card-holder/product-card-holder.component';
import { CommonProductListComponent } from '../../widgets/common-product-list/common-product-list.component';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

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

  


  NewArrayDetails: any[] = [];



  APIURL = environment.APIURL;


    constructor(
        private http: HttpClient,
    ) { }
    
  
  ngOnInit(): void {
  this.getAllProductDetailsNewProducts();
  }
  
async getAllProductDetailsNewProducts(): Promise<void> {
  this.http.post(this.APIURL + 'get_all_product_details_all_new', {}).subscribe({
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
