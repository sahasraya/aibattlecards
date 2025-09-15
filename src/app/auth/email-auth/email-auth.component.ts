import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-email-auth',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './email-auth.component.html',
  styleUrl: './email-auth.component.css'
})
export class EmailAuthComponent implements OnInit{
  userid: string = '';
  APIURL = environment.APIURL;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get userid from route param
    this.userid = this.route.snapshot.paramMap.get('userid') || '';

    if (this.userid) {
      this.authenticateUser(this.userid);
    } else {
      alert("Invalid authentication link.");
    }
  }

 async authenticateUser(userid: string): Promise<void> {
    const formData = new FormData();
    formData.append("userid", userid);

    this.http.post(this.APIURL + 'update_email_auth', formData).subscribe({
      next: (response: any) => {
        if (response.message === "updated") {
        setTimeout(() => {
                  this.router.navigate(['/auth/log-in']);
        }, 4000);
        } else {
          alert("⚠️ Error: " + response.message);
        }
      },
      error: (error) => {
        console.error('❌ Server error:', error);
        alert("Server error. Please try again.");
      }
    });
  }

}
