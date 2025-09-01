import { Component } from '@angular/core';
import { SmallerProductCardComponent } from '../smaller-product-card/smaller-product-card.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Tool {
  icon: string;
  name: string;
  type: string;
  tags: string[];
  showDropdown?: boolean; 
  selected?: number;

}

@Component({
  selector: 'app-common-product-list',
  standalone: true,
  imports: [SmallerProductCardComponent,RouterModule,CommonModule],
  templateUrl: './common-product-list.component.html',
  styleUrl: './common-product-list.component.css'
})
export class CommonProductListComponent {
toolsArray: Tool[] = [
    { icon: '../../../assets/images/12.png', name: 'ChatGPT', type: 'Agent', tags: ['AI', 'Productivity'] },
    { icon: '../../../assets/images/12.png', name: 'Tool Two', type: 'Utility', tags: ['Marketing', 'Analytics'] },
    { icon: '../../../assets/images/12.png', name: 'Tool Three', type: 'Agent', tags: ['AI', 'Automation'] },
    { icon: '../../../assets/images/12.png', name: 'Tool Four', type: 'Agent', tags: ['AI', 'Automation'] },
  { icon: '../../../assets/images/12.png', name: 'Tool Four', type: 'Agent', tags: ['AI', 'Automation'] },
    { icon: '../../../assets/images/12.png', name: 'Tool Two', type: 'Utility', tags: ['Marketing', 'Analytics'] },
    { icon: '../../../assets/images/12.png', name: 'Tool Three', type: 'Agent', tags: ['AI', 'Automation'] },
    { icon: '../../../assets/images/12.png', name: 'Tool Four', type: 'Agent', tags: ['AI', 'Automation'] },
    { icon: '../../../assets/images/12.png', name: 'Tool Five', type: 'Agent', tags: ['AI', 'Automation'] }
  ];
}
