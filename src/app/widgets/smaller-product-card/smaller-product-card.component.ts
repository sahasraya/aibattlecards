import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/getuserid.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-smaller-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './smaller-product-card.component.html',
  styleUrl: './smaller-product-card.component.css'
})
export class SmallerProductCardComponent implements OnInit{
  @Input() product: any;
  @Input() showDropdown: boolean = false;
  @Output() productDeleted = new EventEmitter<string>();

  showDeleteConfirm: boolean = false;
  productToDelete: any = null;
  productToUpdate: any = null;
  APIURL = environment.APIURL;
  userid: string = '';


   constructor( 
      private http: HttpClient,
     private router: Router,
      private authService:AuthService
  ) { }

  
  ngOnInit(): void {
    this.userid = this.authService.getUserid()!;
  
  }
  

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.product.showDropdown = !this.product.showDropdown;
  }

  confirmDelete(product: any, event: Event) {
    event.stopPropagation();
    this.productToDelete = product;
    this.showDeleteConfirm = true;
  }

UpdateProduct(product: any, event: Event) {
  event.stopPropagation();
  this.productToUpdate = product;
  const productId = this.productToUpdate.productid;

  // Navigate to home/user-profile with query parameters
  this.router.navigate(['/home/user-profile'], {
    queryParams: { 
      tab: 'Your Tools', 
      action: 'add_product', 
      productid: productId 
    }
  });
}


  cancelDelete() {
    this.showDeleteConfirm = false;
    this.productToDelete = null;
  }



async onDeleteProduct(): Promise<void> {
  if (this.productToDelete) {
    const productId = this.productToDelete.productid;  
    this.showDeleteConfirm = false;
    this.productToDelete = null;

    const payload = { productid: productId };

    this.http.post(this.APIURL + 'delete_product', payload).subscribe({
      next: (response: any) => {
        if (response.message === 'deleted') {
          this.productDeleted.emit(productId);
           
        } else {
          console.warn('⚠️ Delete failed:', response.message);
        }
      },
      error: (error) => {
        console.error('❌ Error deleting product:', error);
      }
    });
  }
}
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    // Hide dropdown when clicking outside
    if (this.product && this.product.showDropdown) {
      this.product.showDropdown = false;
    }
  }

}
