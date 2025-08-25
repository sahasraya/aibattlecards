import { Component } from '@angular/core';
import { ProductCardHolderComponent } from '../../widgets/product-card-holder/product-card-holder.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ProductCardHolderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
featuredArrayDetails = [
  { name: "Product name", type: "Agent", icon: "../../../assets/images/12.png", tags: ["sells", "Productivity"] },
  { name: "Mithila dilshan wickramaarachchi", type: "Agent", icon: "../../../assets/images/12.png", tags: ["sells", "Productivity"] },
  { name: "Another product", type: "Agent", icon: "../../../assets/images/12.png", tags: ["sells", "Productivity"] },
  { name: "Another product", type: "Agent", icon: "../../../assets/images/12.png", tags: ["sells", "Productivity"] },
  { name: "Another product", type: "Agent", icon: "../../../assets/images/12.png", tags: ["sells", "Productivity"] },
  { name: "Another product", type: "Agent", icon: "../../../assets/images/12.png", tags: ["sells", "Productivity"] },
  { name: "Another product", type: "Agent", icon: "../../../assets/images/12.png", tags: ["sells", "Productivity"] },
  { name: "Another product", type: "Agent", icon: "../../../assets/images/12.png", tags: ["sells", "Productivity"] },
  { name: "Another product", type: "Agent", icon: "../../../assets/images/12.png", tags: ["sells", "Productivity"] },
  { name: "Another product", type: "Agent", icon: "../../../assets/images/12.png", tags: ["sells", "Productivity"] },
];

}
