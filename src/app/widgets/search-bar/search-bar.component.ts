import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';
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
  isSearchFocused: boolean = false;
  
  private searchSubject = new Subject<string>();
  private searchSubscription: any;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    // Setup debounced search
    this.searchSubscription = this.searchSubject
      .pipe(
        debounceTime(300), // Wait 300ms after user stops typing
        distinctUntilChanged(), // Only emit if value changed
        switchMap(searchTerm => {
          if (searchTerm.trim().length >= 2) { // Only search if 2+ characters
            this.isLoading = true;
            this.showDropdown = true; // Show dropdown immediately when loading
            return this.searchProducts(searchTerm);
          } else {
            this.searchResults = [];
            this.showDropdown = false;
            this.isLoading = false;
            return of([]);
          }
        })
      )
      .subscribe({
        next: (results: Product[]) => {
          this.searchResults = results;
          this.isLoading = false;
          
          // Keep dropdown open even if no results (to show "no results" message)
          if (this.searchText.trim().length >= 2) {
            this.showDropdown = true;
          }
        },
        error: (error) => {
          console.error('Search error:', error);
          this.isLoading = false;
          this.showDropdown = true; // Keep dropdown open to show error/no results
        }
      });
  }

  onEnterPress() {
    if (this.searchText.trim().length >= 2) {
      // Navigate to search results page with search text as route parameter
      this.router.navigate(['/home/search-result', this.searchText.trim()]);
      this.closeSearch();
    }
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
    // Clean up body scroll state if needed
    if (this.isMobileView()) {
      this.restoreBodyScroll();
    }
  }

  onSearchInput(event: any) {
    const value = event.target.value;
    this.searchText = value;
    this.searchSubject.next(value);
  }

  onSearchFocus() {
    // Only apply focus state on mobile
    if (this.isMobileView()) {
      this.isSearchFocused = true;
      this.preventBodyScroll();
    }
    
    // Show dropdown if there's existing search text (results or no results message)
    if (this.searchText.length >= 2) {
      this.showDropdown = true;
    }
  }

  onSearchBlur() {
    // Delay to allow click events on results and backdrop
    setTimeout(() => {
      // Only close if not clicking on results
      if (!this.showDropdown) {
        if (this.isMobileView()) {
          this.isSearchFocused = false;
          this.restoreBodyScroll();
        }
      }
    }, 200);
  }

  onProductSelect(product: Product) {
    this.searchText = product.productname;
    this.closeSearch();

    // Navigate to product details
    this.router.navigate(
      ['/home/product-item'],
      { queryParams: { productid: product.productid } }
    );
  }

  closeSearch() {
    // Only apply mobile-specific behavior on mobile
    if (this.isMobileView()) {
      this.isSearchFocused = false;
      this.restoreBodyScroll();
    }
    
    this.showDropdown = false;
    this.searchResults = [];
    this.isLoading = false;
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
            // Return empty array for "no results" case
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

  // Helper method to check if mobile view (768px and below)
  private isMobileView(): boolean {
    return window.innerWidth <= 768;
  }

  // Prevent body scroll on mobile only
  private preventBodyScroll(): void {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = `-${window.scrollY}px`;
  }

  // Restore body scroll on mobile only
  private restoreBodyScroll(): void {
    const scrollY = document.body.style.top;
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.top = '';
    
    // Restore scroll position
    if (scrollY) {
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
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