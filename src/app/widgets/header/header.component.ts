import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  dropdownOpen:boolean = false;
  showLogoutConfirm:boolean = false;
  


  
toggleDropdown() {
  this.dropdownOpen = !this.dropdownOpen;
  }
  showlogoutpopup(e: Event) {
    e.preventDefault(); // Prevent default anchor behavior
    e.stopPropagation
    this.showLogoutConfirm = true;
  }
  onLogout(){
    this.showLogoutConfirm = false;
  }

// Optional: close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-wrapper')) {
      this.dropdownOpen = false;
    }

  }
}
