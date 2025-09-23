import { Component, HostListener } from '@angular/core';
import { SmallerProductCardComponent } from '../../widgets/smaller-product-card/smaller-product-card.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ReviewCardComponent } from '../../widgets/review-card/review-card.component';



interface Tool {
  productimage: string;
  productname: string;
  productid: string;
  productcategory: string;

  productdescription: string;
  productfundingstage: string;
  productlicense: string;
  rating: string;
  producttechnology: string;
  productwebsite: string;
  productlinkedin: string;
  productfacebook: string;

  productusecase: string[];
  showDropdown?: boolean; // optional property for dropdown toggle
  selected?: number;

}
interface Review {
  id: number;
  reviewid: string;
  userid: string;
  productid: string;
  commercialorpersonal: string;
  howlong: string;
  experiencerate: string;
  comment: string;
  efficiencyrate: string;
  documentationrate: string;
  paidornot: string;
  paidrate?: string;
  colorcode: string;
  username: string;
  createddate: string;
  email?: string;
}

@Component({
  selector: 'app-battle-card',
  standalone: true,
  imports: [ CommonModule,FormsModule,ReviewCardComponent],
  templateUrl: './battle-card.component.html',
  styleUrl: './battle-card.component.css'
})
  
  
  
export class BattleCardComponent {


  constructor(  private http: HttpClient,) { }
  
  
toolsArray: Tool[] = [];

  searchTerm: string = '';
  filteredTools: Tool[] = [];
   selectedCategory: string = '';

  selectedTypeTools: Tool[] = [];
  displayedTypeTools: Tool[] = []; // filtered subset
  filterTerm: string = '';

  selectedTools: Tool[] = [];
  displayedSelectedTools: Tool[] = []; // filtered selected subset
  selectedFilterTerm: string = '';

  popupSelected: Tool[] = [];
  isproductisselectedfromsearch: boolean = true;
  isSearchingAnythingElseProduct: boolean = false;
  iscategoryselected: boolean = false;
  APIURL = environment.APIURL;
  noData: boolean = false;

  

  isLoading: boolean = false;
  isSubmittingReview: boolean = false;
  messageClass: string = ''; 
  
  // Pagination properties
  totalReviews: number = 0;
  currentOffset: number = 0;
  reviewsLimit: number = 5;
  hasMoreReviews: boolean = false;
  isLoadingMoreReviews: boolean = false;
  reviews: Review[] = [];
  currentProductId: string | null = null;


openReview(tool: Tool) {
  this.popupSelected = [tool];
  this.reviews = [];              
  this.totalReviews = 0;
  this.currentOffset = 0;
  this.currentProductId = tool.productid; // store productid

  // call getReviews with reset = true
  this.getReviews(this.currentProductId, 0, true);
}

loadMoreReviews(): void {
  if (this.hasMoreReviews && !this.isLoadingMoreReviews && this.currentProductId) {
    this.getReviews(this.currentProductId, this.currentOffset, false);
  }
}

 async getReviews(productid: string, offset: number = 0, reset: boolean = false): Promise<void> {
    if (reset) {
      this.isLoading = true;
    } else {
      this.isLoadingMoreReviews = true;
    }

    const payload = { 
      productid,
      offset,
      limit: this.reviewsLimit
    };

    this.http.post<any>(this.APIURL + 'get_reviews', payload).subscribe({
      next: (response) => {
        if (response.message === "found") {
          if (reset) {
            this.reviews = response.reviews || [];
            this.currentOffset = response.limit || this.reviewsLimit;
          } else {
            this.reviews = [...this.reviews, ...(response.reviews || [])];
            this.currentOffset += (response.reviews || []).length;
          }
          
          this.totalReviews = response.total_reviews || 0;
          this.hasMoreReviews = response.has_more || false;
        } else {
          // Handle case when no reviews found
          if (reset) {
            this.reviews = [];
            this.totalReviews = 0;
            this.hasMoreReviews = false;
            this.currentOffset = 0;
          }
        }
        
        if (reset) {
          this.isLoading = false;
        } else {
          this.isLoadingMoreReviews = false;
        }
      },
      error: (error) => {
        console.error('❌ Error fetching reviews:', error);
        if (reset) {
          this.isLoading = false;
          this.reviews = [];
          this.totalReviews = 0;
          this.hasMoreReviews = false;
        } else {
          this.isLoadingMoreReviews = false;
        }
      }
    });
  }


async onCategoryChange():Promise<void> {
  const newCategory = this.selectedCategory;
  this.iscategoryselected = true;

  const payload = { newCategory };

  this.http.post(this.APIURL + 'get_product_details_basedon_categoryname', payload).subscribe({
    next: (response: any) => {
    
      if (response.message === "yes" && response.products?.length > 0) {
        this.toolsArray = response.products.map((prod: any) => ({
          productimage: prod.productimage
            ? `data:image/jpeg;base64,${prod.productimage}`
            : '../../../assets/images/12.png',
          productname: prod.productname,
          productid: prod.productid,
          productdescription: prod.productdescription,
          productfundingstage: prod.productfundingstage,
          productlicense: prod.productlicense,
          rating: prod.rating,
          productwebsite: prod.productwebsite,
          producttechnology: prod.producttechnology,
          productfacebook: prod.productfacebook,
          productlinkedin: prod.productlinkedin,
          productcategory: prod.productcategory,
          productusecase: prod.useCases || [],
          showDropdown: false
        }));

        // Apply filtering by category
        this.filteredTools = this.toolsArray.filter(
          tool => tool.productcategory.toLowerCase() === newCategory.toLowerCase()
        );

        // Setup for searching + displaying
        this.selectedTypeTools = [...this.filteredTools];
        this.displayedTypeTools = [...this.filteredTools];
        this.noData = false;

      } else {
        this.toolsArray = [];
        this.filteredTools = [];
        this.displayedTypeTools = [];
        this.noData = true;
      }
    },
    error: (error) => {
      console.error('❌ Error fetching product details:', error);
      this.toolsArray = [];
      this.filteredTools = [];
      this.displayedTypeTools = [];
      this.noData = true;
    }
  });
}


/** Filter search */
onFilterChange() {
  const term = this.filterTerm.toLowerCase();

  // Filter the category tools by name
  this.displayedTypeTools = this.selectedTypeTools.filter(tool =>
    tool.productname.toLowerCase().includes(term)
  );
}

toggleSelect(tool: Tool) {
  const index = this.selectedTools.findIndex(t => t.productname === tool.productname);

  if (index > -1) {
    // Remove the tool
    this.selectedTools.splice(index, 1);
  } else {
    // Add tool if less than 3
    if (this.selectedTools.length < 3) {
      this.selectedTools.push(tool);
    }
  }

  // Reassign numbers based on current selected order
  this.selectedTools.forEach((t, i) => t.selected = i + 1);

  // Also reset 'selected' for unselected tools
  this.displayedTypeTools.forEach(t => {
    if (!this.selectedTools.includes(t)) {
      t.selected = undefined;
    }
  });
}
 

/** Reset selected tools and filters */
resetSelections() {
  this.selectedTools = [];
  this.displayedSelectedTools = [];
  this.selectedTypeTools.forEach(t => t.selected = undefined);
  this.filterTerm = '';
  this.selectedFilterTerm = '';
}

/** User clicks Yes/No in modal */

  /** --- Filter Type Tools --- */
 

  /** --- Select/Deselect Tools --- */


  /** --- Selected Models Filter --- */
  onSelectedFilterChange() {
    const term = this.selectedFilterTerm.toLowerCase();
    this.displayedSelectedTools = this.selectedTools.filter(tool =>
      tool.productname.toLowerCase().includes(term)
    );
  }

  private updateDisplayedSelectedTools() {
    this.displayedSelectedTools = [...this.selectedTools];
    this.onSelectedFilterChange();
  }






  closePopup() {
    this.popupSelected = [];
     this.popupSelected = [];
  this.reviews = [];
  this.totalReviews = 0;
  this.currentOffset = 0;
  }

  


   @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    // Check if click is outside the search-bar-wrapper
    if (!target.closest('.search-bar-wrapper')) {
      // this.filteredTools = [];
    }
  }
}
