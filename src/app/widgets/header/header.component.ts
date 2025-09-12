import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/getuserid.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink,CommonModule,SearchBarComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  dropdownOpen:boolean = false;
  showLogoutConfirm: boolean = false;
  userid: string = '';
  userInitials: string = '';
  isuserloggedin: boolean = false;
  APIURL = environment.APIURL;
  
  constructor(private http: HttpClient, private authService: AuthService,private router:Router) { }
  
  ngOnInit(): void {
    this.userid = this.authService.getUserid()!;
    
    if (this.userid) { 
      this.isuserloggedin = true;
      this.getUserDetails(this.userid);
    }else{
       this.isuserloggedin = false ;
    }
   
  }

  

  async getUserDetails(userid: string): Promise<void> {
  const payload = { userid };

  this.http.post(this.APIURL + 'get_user_details', payload).subscribe({
    next: (response: any) => {
      if (response.message === 'yes') {
        console.log("✅ User details:", response.user);
        const user = response.user;

         
        this.userInitials = this.generateInitials(user.username || '');
         
      } else {
        console.warn("No user found");
      }
    },
    error: (error) => {
      console.error('❌ Error fetching user details:', error);
    }
  });
}

  
private generateInitials(name: string): string {
  if (!name) return "";
  const words = name.trim().split(" ");
  const initials = words
    .slice(0, 2) // Take at most 2 words
    .map(w => w[0]?.toUpperCase() || "")
    .join("");
  return initials;
}
  
  
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
    sessionStorage.removeItem('userid');
    this.router.navigate(['/home/dashboard']);
    this.isuserloggedin = false;
    this.dropdownOpen = false;


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
