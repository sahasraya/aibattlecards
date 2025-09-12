import { Component, HostListener } from '@angular/core';
import { SmallerProductCardComponent } from '../../widgets/smaller-product-card/smaller-product-card.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';



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


@Component({
  selector: 'app-battle-card',
  standalone: true,
  imports: [ CommonModule,FormsModule],
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
  /** --- Search --- */


onCategoryChange() {
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

  /** --- Popup --- */
  openReview(tool: Tool) {
    this.popupSelected = [tool];
  }

  closePopup() {
    this.popupSelected = [];
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
