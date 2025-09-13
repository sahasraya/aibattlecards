import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule,RouterModule,ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  signupForm: FormGroup;
  APIURL = environment.APIURL;
  isforauth_without_userloggedin = environment.isforauth_without_userloggedin;
  message: string = '';
  messageClass: string = '';
  messageVisible: boolean = false;

  constructor(private fb: FormBuilder,private http:HttpClient,private router:Router) {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      reenterPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
async onSubmit(): Promise<void> {
  const password = this.signupForm.get("password")?.value;
  const reenterPassword = this.signupForm.get("reenterPassword")?.value;

  if (password !== reenterPassword) {
    this.showMessage('Passwords do not match.','error');
    this.signupForm.get("password")?.reset();
    this.signupForm.get("reenterPassword")?.reset();
    return;
  }

  const formData = new FormData();
  formData.append("username", this.signupForm.get("username")?.value);
  formData.append("emailaddress", this.signupForm.get("email")?.value);
  formData.append("password", password);
  formData.append("reenterpassword", reenterPassword);

  this.http.post(this.APIURL + 'sign_up', formData).subscribe({
    next: (response: any) => {
      console.log('Signup response:', response);
      if (response.message === "registered") {
        this.showMessage('Sign-up successful. Please confirm your email.','success');
        this.signupForm.reset();
      } else if (response.message === "Email already registered") {
        this.showMessage('Email already registered.','error');
        this.signupForm.reset();
      } else {
        alert("Error: " + response.message);
      }
    },
    error: (error) => {
      console.error('Signup failed:', error);
      alert("Server error. Please try again.");
    }
  });
}






showMessage(msg: string, type: 'success' | 'error') {
  this.message = msg;
  this.messageClass = type === 'success' ? 'green-good' : 'red-bad';
  this.messageVisible = true;

  // hide message after 3 seconds
  setTimeout(() => {
    this.messageVisible = false;
  }, 3000);
  }
  


  gotoforgetpassword() {
  this.router.navigate(['/auth/reset', this.isforauth_without_userloggedin]);
}

}
