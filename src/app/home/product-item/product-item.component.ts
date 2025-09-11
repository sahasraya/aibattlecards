import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';
import { AuthService } from '../../services/getuserid.service';

interface ProductDetails {
  productimage: string;
  productname: string;
  productcategory: string;
  productlicense: string;
  producttechnology: string[];
  productwebsite: string;
  productfundingstage: string;
  productdescription: string;
  rating: number;
  productfb: string;
  productlinkedin: string;
  useCases: string[];
  founders: string[];
  baseModels: string[];
  deployments: string[];
  mediaPreviews: string[];
}



@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.css'
})
export class ProductItemComponent {
 showReviewForm: boolean = false;
  showPaidRating: boolean = false;

  reviewForm!: FormGroup;
  APIURL = environment.APIURL;
  productid: string = '';
  userid: string = '';
  ratings: number[] = [1, 2, 3, 4, 5];
  productDetails: ProductDetails | null = null;
  

  
  constructor(private fb: FormBuilder,private route:ActivatedRoute,private http:HttpClient,private authService:AuthService) {}

  ngOnInit(): void {
    this.reviewForm = this.fb.group({
      isPaid: ['', Validators.required],
      ispaidtogglecommercialorpersonal: ['', Validators.required],
      usageDuration: ['', Validators.required],
      experienceRating: [1, Validators.required],
      efficiencyRating: [1, Validators.required],
      documentationRating: [1, Validators.required],
      paidVersionRating: [1],
      paidtogglecommercialorpersonal: [3],
      additionalComments: ['']
    });

    this.route.queryParams.subscribe(params => {
      this.productid = params['productid'];
      this.userid=this.authService.getUserid()!;
       if (this.userid) { 
      this.getProductDetails(this.productid,this.userid);
      }
      
    });


  }

 async getProductDetails(productid: string, userid: string): Promise<void> {
    const payload = { productid, userid };

    this.http.post(this.APIURL + 'get_product_details', payload).subscribe({
      next: (response: any) => {
        console.log("🔍 Response from get_product_details:", response);
        if (response.message === "yes") {
          const prod = response.product;
          this.productDetails = {
            productimage: prod.productimage ? `data:image/jpeg;base64,${prod.productimage}` : '../../../assets/images/12.png',
            productname: prod.productname,
            productcategory: prod.productcategory,
            productdescription: prod.productdescription,
            rating: prod.rating,
            productlicense: prod.productlicense,
            producttechnology: [prod.producttechnology], // can be array if needed
            productwebsite: prod.productwebsite,
            productfundingstage: prod.productfundingstage,
            productfb: prod.productfacebook,
            productlinkedin: prod.productlinkedin,
            useCases: response.useCases || [],
            founders: response.founders || [],
            baseModels: response.baseModels || [],
            deployments: response.deployments || [],
            mediaPreviews: response.mediaPreviews || []
          };

        } else {
          console.warn("No product found");
        }
      },
      error: (error) => {
        console.error('❌ Error fetching product details:', error);
      }
    });
  }












 togglePaidRating(show: boolean) {
    this.showPaidRating = show;
    if (!show) {
      this.reviewForm.get('paidVersionRating')?.setValue(null);
    }
  }

  
 togglecommercialorpersonal(show: boolean) {
   this.reviewForm.get('paidtogglecommercialorpersonal')?.setValue(null);
  }


  setRating(controlName: string, value: number) {
    this.reviewForm.get(controlName)?.setValue(value);
  }

  submitReview() {
    if (this.reviewForm.valid) {
      console.log('Review Submitted:', this.reviewForm.value);
      this.reviewForm.reset({ experienceRating: 5, efficiencyRating: 5, documentationRating: 5 });
      this.showReviewForm = false;
      this.showPaidRating = false;
    }
  }
 toggleReviewForm() {
    this.showReviewForm = !this.showReviewForm;
  }
}
