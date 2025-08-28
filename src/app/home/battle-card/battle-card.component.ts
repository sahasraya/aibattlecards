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
  imports: [SmallerProductCardComponent,CommonModule,FormsModule],
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
  filteredTools: Tool[] = [...this.toolsArray];

  selectedTypeTools: Tool[] = [];
  displayedTypeTools: Tool[] = []; // filtered subset
  filterTerm: string = '';

  selectedTools: Tool[] = [];
  displayedSelectedTools: Tool[] = []; // filtered selected subset
  selectedFilterTerm: string = '';

  popupSelected: Tool[] = [];
  isproductisselectedfromsearch: boolean = true;
  isSearchingAnythingElseProduct: boolean = false;
  /** --- Search --- */



  onSearchChange() {
  const term = this.searchTerm.toLowerCase();
  this.filteredTools = this.toolsArray.filter(tool =>
    tool.name.toLowerCase().includes(term)
  );

  // Check if there are already selected tools
  if (this.selectedTools.length > 0) {
    // Open modal to ask if user wants to reset selections
    this.isSearchingAnythingElseProduct = true;
  }
}

/** User clicks Yes/No in modal */
onSearchSomethingElse(choice: boolean) {
  this.isSearchingAnythingElseProduct = false;

  if (choice) {
    // User chose Yes: reset all selections and displayedTypeTools
    this.resetSelections();
    this.displayedTypeTools = [];
    this.selectedTypeTools = [];
    this.isproductisselectedfromsearch = true;
  } else {
    // User chose No: keep previous selections and search input as is
    this.isproductisselectedfromsearch = false;
  }
}

/** Selecting a tool from dropdown */
onSelectSearchTool(tool: Tool) {
  // If modal is open, don't immediately select, wait for user choice
  if (this.selectedTools.length > 0) {
    this.isSearchingAnythingElseProduct = true;
    return;
  }

  // Filter tools by selected tool's type
  this.selectedTypeTools = this.toolsArray.filter(t => t.type === tool.type);
  this.displayedTypeTools = [...this.selectedTypeTools]; // update displayedTypeTools
  this.searchTerm = '';
  this.filteredTools = [];
  this.isproductisselectedfromsearch = false;
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
  onFilterChange() {
    const term = this.filterTerm.toLowerCase();
    this.displayedTypeTools = this.selectedTypeTools.filter(tool =>
      tool.name.toLowerCase().includes(term)
    );
  }

  /** --- Select/Deselect Tools --- */
  toggleSelect(tool: Tool) {
    if (tool.selected) {
      // remove from selected
      this.selectedTools = this.selectedTools.filter(t => t !== tool);
      this.selectedTools.forEach((t, idx) => t.selected = idx + 1);
      tool.selected = undefined;
    } else if (this.selectedTools.length < 3) {
      // add to selected
      this.selectedTools.push(tool);
      tool.selected = this.selectedTools.length;
    }

    this.updateDisplayedSelectedTools();
  }

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
      this.filteredTools = [];
    }
  }
}
