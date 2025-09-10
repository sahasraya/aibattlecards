import { Component, HostListener } from '@angular/core';
import { SmallerProductCardComponent } from '../../widgets/smaller-product-card/smaller-product-card.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';



interface Tool {
  icon: string;
  name: string;
  type: string;
  tags: string[];
  showDropdown?: boolean; 
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

toolsArray: Tool[] = [
    { icon: '../../../assets/images/12.png', name: 'ChatGPT', type: 'Agent', tags: ['AI', 'Productivity'] },
    { icon: '../../../assets/images/12.png', name: 'Tool Two', type: 'Utility', tags: ['Marketing', 'Analytics'] },
    { icon: '../../../assets/images/12.png', name: 'Tool Three', type: 'Agent', tags: ['AI', 'Automation'] },
    { icon: '../../../assets/images/12.png', name: 'Tool Four', type: 'Agent', tags: ['AI', 'Automation'] },
    { icon: '../../../assets/images/12.png', name: 'Tool Five', type: 'Agent', tags: ['AI', 'Automation'] }
  ];

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
  /** --- Search --- */


onCategoryChange() {
  const category = this.selectedCategory.toLowerCase();
  this.iscategoryselected = true;

  // Base filter by category
  this.filteredTools = this.toolsArray.filter(
    tool => tool.type.toLowerCase() === category
  );

  // Initialize both arrays so search works
  this.selectedTypeTools = [...this.filteredTools];
  this.displayedTypeTools = [...this.filteredTools];

  if (this.selectedTools.length > 0) {
    this.isSearchingAnythingElseProduct = true;
  }
}

/** Filter search */
onFilterChange() {
  const term = this.filterTerm.toLowerCase();

  // Filter the category tools by name
  this.displayedTypeTools = this.selectedTypeTools.filter(tool =>
    tool.name.toLowerCase().includes(term)
  );
}

toggleSelect(tool: Tool) {
  const index = this.selectedTools.findIndex(t => t.name === tool.name);

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
      tool.name.toLowerCase().includes(term)
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
