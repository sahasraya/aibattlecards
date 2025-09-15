import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { Router } from '@angular/router';

interface Product {
  productid: string;
  productimage: string;
  productname: string;
  productcategory: string;
  userid: string;
  useCases: string[];
}

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent implements OnInit, OnDestroy {
  APIURL = environment.APIURL;
  
  searchText: string = '';
  searchResults: Product[] = [];
  showDropdown: boolean = false;
  isLoading: boolean = false;
  
  private searchSubject = new Subject<string>();
  private searchSubscription: any;

  constructor(private http: HttpClient,private router:Router) {}

  ngOnInit() {
    // Setup debounced search
    this.searchSubscription = this.searchSubject
      .pipe(
        debounceTime(300), // Wait 300ms after user stops typing
        distinctUntilChanged(), // Only emit if value changed
        switchMap(searchTerm => {
          if (searchTerm.trim().length >= 2) { // Only search if 2+ characters
            this.isLoading = true;
            return this.searchProducts(searchTerm);
          } else {
            this.searchResults = [];
            this.showDropdown = false;
            this.isLoading = false;
            return [];
          }
        })
      )
      .subscribe({
        next: (results: Product[]) => {
          this.searchResults = results;
          this.showDropdown = results.length > 0;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Search error:', error);
          this.isLoading = false;
          this.showDropdown = false;
        }
      });
  }

   onEnterPress() {
     if (this.searchText.trim().length >= 2) {
      // Navigate to search results page with search text as route parameter
      this.router.navigate(['/home/search-result', this.searchText.trim()]);
      this.showDropdown = false; // Hide dropdown when navigating
    }
  }


  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  onSearchInput(event: any) {
    const value = event.target.value;
    this.searchText = value;
    this.searchSubject.next(value);
  }

  onSearchFocus() {
    if (this.searchText.length >= 2) {
      this.showDropdown = true;
    }
  }

  onSearchBlur() {
    // Delay hiding dropdown to allow clicks on results
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }

  onProductSelect(product: Product) {
    this.searchText = product.productname;
    this.showDropdown = false;

    // ✅ Navigate to product details
    this.router.navigate(
      ['/home/product-item'],
      { queryParams: { productid: product.productid } }
    );
  }

  private searchProducts(searchTerm: string): Promise<Product[]> {
    const payload = { typpingtext: searchTerm };
    
    return new Promise((resolve, reject) => {
      this.http.post(this.APIURL + 'search_filter', payload).subscribe({
        next: (response: any) => {
          if (response.message === "yes" && response.products?.length) {
            const products = response.products.map((prod: any) => ({
              productid: prod.productid,
              productimage: prod.productimage 
                ? `data:image/jpeg;base64,${prod.productimage}`
                : '../../../assets/images/12.png',
              productname: prod.productname,
              productcategory: prod.productcategory,
              userid: prod.userid,
              useCases: prod.useCases || []
            }));
            resolve(products);
          } else {
            resolve([]);
          }
        },
        error: (error) => {
          console.error('❌ Error searching products:', error);
          reject(error);
        }
      });
    });
  }

  // Keep your existing method for getting all products
  async getProductDetails(userid: string): Promise<void> {
    const payload = { userid };
   
    this.http.post(this.APIURL + 'get_all_product_details', payload).subscribe({
      next: (response: any) => {
        if (response.message === "yes" && response.products?.length) {
          // Handle all products logic here
        } else {
          console.warn("No product found");
        }
      },
      error: (error) => {
        console.error('❌ Error fetching product details:', error);
      }
    });
  }
}