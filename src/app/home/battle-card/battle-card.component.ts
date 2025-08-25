import { Component } from '@angular/core';
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
  displayedTools: Tool[] = [...this.toolsArray];
  selectedTypeTools: Tool[] = [];
  searchTerm: string = '';
  filteredTools: Tool[] = [...this.toolsArray];
  selectedTools: Tool[] = [];
  isproductisselectedfromsearch: boolean = true;
  popupSelected: any[] = [];



  openReview(tool: any) {
  this.popupSelected = [tool]; // store clicked product
}

closePopup() {
  this.popupSelected = [];
  }
  


  

  onSearchChange() {
    const term = this.searchTerm.toLowerCase();
    this.filteredTools = this.toolsArray.filter(tool => tool.name.toLowerCase().includes(term));
  }

 

  makeBattle() {
    console.log('Selected Tools for Battle:', this.selectedTools);
    // Here you can show a table of selected tools
  }

 onSelectSearchTool(tool: Tool) {
  // Filter tools by selected tool's type
  this.selectedTypeTools = this.toolsArray.filter(t => t.type === tool.type);
  this.searchTerm = '';
   this.filteredTools = [];
   this.isproductisselectedfromsearch = false;
}

toggleSelect(tool: Tool) {
  if (tool.selected) {
    this.selectedTools = this.selectedTools.filter(t => t !== tool);
    this.selectedTools.forEach((t, idx) => t.selected = idx + 1);
    tool.selected = undefined;
  } else if (this.selectedTools.length < 3) {
    this.selectedTools.push(tool);
    tool.selected = this.selectedTools.length;
  }
}
  
}
