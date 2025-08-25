import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-smaller-product-card',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './smaller-product-card.component.html',
  styleUrl: './smaller-product-card.component.css'
})
export class SmallerProductCardComponent {
  @Input() product: any;
  @Input() showDropdown: boolean = false;

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.product.showDropdown = !this.product.showDropdown;
  }

}
