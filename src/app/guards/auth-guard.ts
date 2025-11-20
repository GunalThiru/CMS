import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginAuthService } from '../services/login-auth';
import { isPlatformBrowser } from '@angular/common';




@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private auth: LoginAuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  canActivate(): boolean {

    if (!isPlatformBrowser(this.platformId)) {
      return false;  // SSR safety
    }

    const user = sessionStorage.getItem('user');

    if (user) {
      return true;   // Logged in
    }

     
    this.router.navigate(['/login']);

    return false;    // Not logged in → redirect
  }
}
