import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';

interface Product {
  productid: string;
  productimage: string;
  productname: string;
  productcategory: string;
  productdescription: string;
  userid: string;
  useCases: string[];
}

@Component({
  selector: 'app-search-enter-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-enter-result.component.html',
  styleUrl: './search-enter-result.component.css'
})
export class SearchEnterResultComponent implements OnInit {
  APIURL = environment.APIURL;
  searchText: string = '';
  searchResults: Product[] = [];
  isLoading: boolean = false;
  noResultsFound: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router:Router
  ) {}

  ngOnInit() {
    // Get search text from route parameters
    this.route.params.subscribe(params => {
      this.searchText = params['searchtext'];
      if (this.searchText) {
        this.searchProducts();
      }
    });
  }

  searchProducts() {
    if (!this.searchText || this.searchText.trim().length < 2) {
      return;
    }

    this.isLoading = true;
    this.noResultsFound = false;
    
    const payload = { typpingtext: this.searchText.trim() };

    this.http.post(this.APIURL + 'get_products_using_search_enter', payload).subscribe({
      next: (response: any) => {
        console.log('Search Results:', response);
        
        this.isLoading = false;
        
        if (response.message === "yes" && response.products?.length) {
          this.searchResults = response.products.map((prod: any) => ({
            productid: prod.productid,
            productimage: prod.productimage 
              ? `data:image/jpeg;base64,${prod.productimage}`
              : '../../../assets/images/12.png',
            productname: prod.productname,
            productcategory: prod.productcategory,
            productdescription: prod.productdescription || '',
            userid: prod.userid,
            useCases: prod.useCases || []
          }));
          
          this.noResultsFound = false;
          console.log('Processed Search Results:', this.searchResults);
        } else {
          this.searchResults = [];
          this.noResultsFound = true;
          console.log('No products found for search term:', this.searchText);
        }
      },
      error: (error) => {
        console.error('❌ Error searching products:', error);
        this.isLoading = false;
        this.noResultsFound = true;
        this.searchResults = [];
      }
    });
  }

onProductClick(product: Product) {
  console.log('Product clicked:', product.productid);

  this.router.navigate(
    ['/home/product-item'],
    { queryParams: { productid: product.productid } }
  );
}
}