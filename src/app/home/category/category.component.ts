import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SmallerProductCardComponent } from '../../widgets/smaller-product-card/smaller-product-card.component';
import { CommonModule } from '@angular/common';
interface Tool {
  icon: string;
  name: string;
  type: string;
  tags: string[];
  showDropdown?: boolean; // optional property for dropdown toggle
}
@Component({
  selector: 'app-category',
  standalone: true,
  imports: [SmallerProductCardComponent,CommonModule,RouterModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent {
  categoryName: string | null = null;
  toolsArray: Tool[] = [
    {
      icon: '../../../assets/images/12.png',
      name: 'Tool One',
      type: 'Agent',
      tags: ['Sales', 'Productivity']
    },
  
    {
      icon: '../../../assets/images/12.png',
      name: 'Tool Three',
      type: 'Agent',
      tags: ['AI', 'Automation']
    },
    {
      icon: '../../../assets/images/12.png',
      name: 'Tool Two',
      type: 'Utility',
      tags: ['Marketing', 'Analytics']
    },
 
    {
      icon: '../../../assets/images/12.png',
      name: 'Tool Three',
      type: 'Agent',
      tags: ['AI', 'Automation']
    },
    {
      icon: '../../../assets/images/12.png',
      name: 'Tool Three',
      type: 'Agent',
      tags: ['AI', 'Automation']
    }
    ,
    {
      icon: '../../../assets/images/12.png',
      name: 'Tool Three',
      type: 'Agent',
      tags: ['AI', 'Automation']
    }
    ,
    {
      icon: '../../../assets/images/12.png',
      name: 'Tool Three',
      type: 'Agent',
      tags: ['AI', 'Automation']
    }
    ,
    {
      icon: '../../../assets/images/12.png',
      name: 'Tool Three',
      type: 'Agent',
      tags: ['AI', 'Automation']
    }
  ];



  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Subscribe to route param changes
    this.route.paramMap.subscribe(params => {
      const newCategory = params.get('categoryName');
      if (newCategory && newCategory !== this.categoryName) {
        this.categoryName = newCategory;
      
      }
    });
  }
}
