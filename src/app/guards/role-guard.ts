// src/app/guards/role.guard.ts
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { LoginAuthService } from '../services/login-auth';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private auth: LoginAuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
  const expectedRole = route.data['role'];
  const userRole = this.auth.getUserRole();

  if (userRole && userRole === expectedRole) {
    return true;
  } else {
    this.router.navigate(['/']); // redirect if role doesn't match
    return false;
  }
}

}
