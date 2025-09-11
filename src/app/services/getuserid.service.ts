// auth.service.ts
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  getUserid(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return sessionStorage.getItem('userid');
    }
    return null;
  }
}