import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SmallerProductCardComponent } from '../../widgets/smaller-product-card/smaller-product-card.component';
interface Tool {
  icon: string;
  name: string;
  type: string;
  tags: string[];
  showDropdown?: boolean; // optional property for dropdown toggle
}
interface Review {
  profileImg: string;
  username: string;
  date: Date;
  comment: string;
  showDropdown?: boolean;
}
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule,SmallerProductCardComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  activeTab: string = 'Profile';
  profileForm!: FormGroup;

  toolsArray: Tool[] = [
    {
      icon: '../../../assets/images/12.png',
      name: 'Tool One',
      type: 'Agent',
      tags: ['Sales', 'Productivity']
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

  reviewsArray: Review[] = [
  {
    profileImg: '../../../assets/images/12.png',
    username: 'John Doe',
    date: new Date('2025-08-01'),
    comment: 'Great product, really helped me improve my workflow!',
  },
  {
    profileImg: '../../../assets/images/12.png',
    username: 'Jane Smith',
    date: new Date('2025-08-05'),
    comment: 'Excellent support and features.',
  }
];

  

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      linkedin: ['', Validators.required],
      facebook: ['', Validators.required],
      designation: ['', Validators.required],
      about: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });

    // Check query param for active tab
    this.route.queryParams.subscribe((params: any) => {
      const tab = params['tab'];
      if (tab) {
        this.activeTab = tab;
      }
    });
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab },
      queryParamsHandling: 'merge'
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      console.log(this.profileForm.value);
      alert('Profile submitted successfully!');
    }
  }

  onAddProduct() {
    alert('Add Product clicked!');
  }

  toggleDropdown(tool: Tool, event: Event) {
    event.stopPropagation();
    this.toolsArray.forEach(t => {
      if (t !== tool) t.showDropdown = false;
    });
    tool.showDropdown = !tool.showDropdown;
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    this.toolsArray.forEach(t => t.showDropdown = false);
      this.reviewsArray.forEach(r => r.showDropdown = false);
  }

  onEditProduct(tool: Tool) {
    alert(`Edit ${tool.name}`);
  }

  onDeleteProduct(tool: Tool) {
    alert(`Delete ${tool.name}`);
  }

  toggleReviewDropdown(review: Review, event: Event) {
  event.stopPropagation();
  this.reviewsArray.forEach(r => {
    if (r !== review) r.showDropdown = false;
  });
  review.showDropdown = !review.showDropdown;
}

 
// Delete review
onDeleteReview(review: Review) {
  this.reviewsArray = this.reviewsArray.filter(r => r !== review);
  alert(`Deleted review from ${review.username}`);
  }
  
}
