import { inject } from '@angular/core';
import { CanActivateChildFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { LoginAuthService } from '../services/login-auth';

// 🔹 Functional child guard (used for all children routes)
export const RoleGuard: CanActivateChildFn = (route: ActivatedRouteSnapshot) => {

  const auth = inject(LoginAuthService);
  const router = inject(Router);

  const allowedRoles = route.data['roles'];          // roles allowed for this route
  const userRole = auth.getUserRole();               // logged-in user's role

  // -----------------------------
  // Role array validation
  // -----------------------------
  if (!allowedRoles || !Array.isArray(allowedRoles)) {
    console.error('❌ RoleGuard Error: "roles" array missing in route.data');
    router.navigate(['/']);
    return false;
  }

  // -----------------------------
  // User not logged in
  // -----------------------------
  if (!userRole) {
    router.navigate(['/login']);
    return false;
  }

  // -----------------------------
  // User exists → Check role
  // -----------------------------
  if (allowedRoles.includes(userRole)) {
    return true;
  }

  // User role NOT allowed → deny access
  router.navigate(['/']);
  return false;
};
