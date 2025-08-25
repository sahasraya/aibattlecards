import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-card-holder',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './product-card-holder.component.html',
  styleUrl: './product-card-holder.component.css'
})
export class ProductCardHolderComponent {
 @Input() featuredArrayDetails: any[] = [];

 scrollLeft(container: HTMLElement) {
  container.scrollBy({ left: -250, behavior: 'smooth' }); // move left
}

scrollRight(container: HTMLElement) {
  container.scrollBy({ left: 250, behavior: 'smooth' }); // move right
}

}
