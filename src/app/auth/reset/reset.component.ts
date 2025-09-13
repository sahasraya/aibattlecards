import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './reset.component.html',
  styleUrl: './reset.component.css'
})
export class ResetComponent implements OnInit {
 routerid: string = '';
  auth_emailaddress: string = '';
  message: string = '';
  messageClass: string = '';
  APIURL = environment.APIURL;

  otp: string[] = ['', '', '', ''];
  showOtp: boolean = false;
  counter: number = 60;
  interval: any;
  progress: number = 0;
  resetId: string = '';
  code: string = '';
  confirmPassword: string = '';

  idforauthafteruserloggedin = environment.idforauthafteruserloggedin;
  isforauth_without_userloggedin = environment.isforauth_without_userloggedin;
  isuserloggedin: boolean = false;
  showBackArrow: boolean = false;
  otpiscoorectwithoutlogin: boolean = false;
  newPassword: string = '';
  confirmNewPassword: string = '';


  constructor(private route: ActivatedRoute, private http: HttpClient,private router:Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.routerid = params.get('c')!;
      this.auth_emailaddress = sessionStorage.getItem('emailforauthafteruserloggedin') || '';
      if (this.routerid == this.idforauthafteruserloggedin) {
        this.isuserloggedin = true;
        this.sendingemailtoresetpassword(this.auth_emailaddress);
        this.showBackArrow = false;
      } else if (this.routerid == this.isforauth_without_userloggedin) {
        this.isuserloggedin = false;
        this.showBackArrow = true;
      }

    });
  }
  goBack() {
     this.router.navigate(['/auth/sign-up']);
  }


  async sendingemailtoresetpassword(emailaddress: string): Promise<void> {
    const payload = { emailaddress };
    this.http.post(this.APIURL + 'send_code_reset_password', payload).subscribe({
      next: (response: any) => {
        if (response.message === 'sent') {
          this.resetId = response.resetid;
          this.code = response.code; // store code to check locally
          this.showMessage('We have sent a 4-digit code to your email address', 'success');
          this.startTimeCircle();
        } else if (response.message === 'no email') {
          this.showMessage('No email found', 'error');
        }
      },
      error: (error) => {
        console.error('❌ Error:', error);
        this.showMessage('Server error. Try again later', 'error');
      }
    });
  }

  startTimeCircle() {
    this.showOtp = true;
    this.counter = 60;
    this.progress = 0;
    if(this.interval) clearInterval(this.interval);

    this.interval = setInterval(() => {
      this.counter--;
      this.progress = ((60 - this.counter)/60) * 100;

      if(this.counter <= 0) {
        clearInterval(this.interval);
        this.showOtp = false;

        if(this.resetId) {
          this.http.post(this.APIURL + 'delete_email_otp', { resetid: this.resetId })
            .subscribe({
              next: (res: any) => console.log('OTP deleted', res),
              error: (err) => console.error('Error deleting OTP', err)
            });
        }
      }
    }, 1000);
  }

  onOtpInput(index: number, event: any) {
    const input = event.target;

    // move focus automatically
    if(this.otp[index].length > 0 && index < 3) {
      const nextInput = input.nextElementSibling as HTMLInputElement;
      if(nextInput) nextInput.focus();
    }

    // backspace to previous
    if(this.otp[index].length === 0 && index > 0 && event.inputType === 'deleteContentBackward') {
      const prevInput = input.previousElementSibling as HTMLInputElement;
      if(prevInput) prevInput.focus();
    }

    // check OTP automatically when all 4 digits entered
    if(this.otp.every(d => d !== '')) {
      this.checkEnteredOtp();
    }
  }



async checkEnteredOtp(): Promise<void> {
  const enteredCode = this.otp.join('');

  if (enteredCode === this.code) {
    // Stop the timer
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }

    if (this.isuserloggedin) {
      this.showOtp = false; // hide OTP inputs
      this.showMessage('OTP verified successfully!', 'success');

      const confirmPassword = sessionStorage.getItem('confirmPassword') || '';
      const payload = { confirmPassword, emailaddress: this.auth_emailaddress };

      // ✅ Call separate method
      this.updatePassword(payload, true);

    } else {
      this.showOtp = false;
      this.otpiscoorectwithoutlogin = true; // show password input fields
      this.showMessage('OTP verified successfully! Please reset your password.', 'success');
    }
  } else {
    this.showMessage('Incorrect OTP. Please try again.', 'error');
  }
}

async updatePasswordWithoutLogin(): Promise<void> {
  if (!this.newPassword || !this.confirmNewPassword) {
    this.showMessage('Please fill in all fields', 'error');
    return;
  }

  if (this.newPassword !== this.confirmNewPassword) {
    this.showMessage('Passwords do not match', 'error');
    return;
  }

  const payload = {
    confirmPassword: this.newPassword,
    emailaddress: this.auth_emailaddress
  };

  // ✅ Call separate method
  this.updatePassword(payload, false);
}

 
private updatePassword(payload: any, isLoggedIn: boolean): void {
  this.http.post(this.APIURL + 'update_password', payload).subscribe({
    next: (response: any) => {
      if (response.message === 'updated') {
        this.showMessage('Password updated successfully!', 'success');

        // delete OTP from backend
        this.http.post(this.APIURL + 'delete_email_otp', { resetid: this.resetId }).subscribe({
          next: (res: any) => console.log('OTP deleted', res),
          error: (err) => console.error('Error deleting OTP', err),
        });

        // clear session data
        sessionStorage.removeItem('emailforauthafteruserloggedin');
        sessionStorage.removeItem('confirmPassword');

        // redirect
        if (isLoggedIn) {
          this.router.navigateByUrl('/home/user-profile?tab=Access');
        } else {
          this.router.navigateByUrl('/auth/log-in'); // redirect for not-logged-in users
        }
      } else if (response.message === 'no email') {
        this.showMessage('No email found', 'error');
      }
    },
    error: (error) => {
      console.error('❌ Error:', error);
      this.showMessage('Server error. Try again later', 'error');
    },
  });
}

  


  resendCode() {
    this.otp = ['', '', '', ''];
    this.sendingemailtoresetpassword(this.auth_emailaddress);
  }

  showMessage(msg: string, type: 'success' | 'error') {
    this.message = msg;
    this.messageClass = type === 'success' ? 'green-good' : 'red-bad';
    setTimeout(() => this.message = '', 5000);
  }

  getMaskedEmail(email: string): string {
  if (!email) return '';
  const [username, domain] = email.split('@');
  const visible = username.slice(0, 5);
  const masked = username.length > 5 ? '**' : '';
  return `${visible}${masked}@${domain}`;
  }
  

}

 
