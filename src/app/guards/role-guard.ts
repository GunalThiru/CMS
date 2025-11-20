// src/app/guards/role.guard.ts
import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { LoginAuthService } from '../services/login-auth';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate, CanActivateChild {

  constructor(private auth: LoginAuthService, private router: Router) {}

  // ---- For direct route activation ----
  canActivate(route: ActivatedRouteSnapshot): boolean {
    return this.checkRole(route);
  }

  // ---- For child routes (your case) ----
  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkRole(route);
  }

  // ---- Common check function ----
  private checkRole(route: ActivatedRouteSnapshot): boolean {
    const allowedRoles = route.data['roles'];  
    const userRole = this.auth.getUserRole();  

    if (!allowedRoles || !Array.isArray(allowedRoles)) {
      console.error('❌ RoleGuard Error: "roles" array missing in route config');
      this.router.navigate(['/']);
      return false;
    }

    if (userRole && allowedRoles.includes(userRole)) {
      return true;
    }

    // Role not allowed → redirect
    this.router.navigate(['/']);
    return false;
  }
}
