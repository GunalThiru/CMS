// app.routes.ts
import { Routes } from '@angular/router';
import { SignupComponent } from './signup/signup';
import { LoginComponent } from './login/login';
import { HomeComponent } from './home/home';
import { UserAdminComponent } from './user-admin/user-admin';
import { UserStaffComponent } from './user-staff/user-staff';
import { UserCustomerComponent } from './user-customer/user-customer';
import { RoleGuard } from './guards/role-guard';
import { ProfileComponent } from './profile/profile';
import { CustomerComplaintsListComponent } from './customer-complaints-list/customer-complaints-list';
import { HistoryComponent } from './history/history';
import { AdminUsersComponent } from './user-admin/view-users/view-users';
import { AuthGuard } from './guards/auth-guard';

export const routes: Routes = [

  // --------------------
  // Public routes
  // --------------------
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },

  // --------------------
  // Protected routes (global guard)
  // --------------------
  {
    path: '',
    canActivate: [AuthGuard],          // must be logged in
    canActivateChild: [RoleGuard],     // role check for all children
    children: [
      { path: '', component: HomeComponent, data: { roles: ['admin','sub_admin','staff','customer'] }}, 
      { path: 'admin', component: UserAdminComponent, data: { roles: ['admin','sub_admin'] }},
    

      { path: 'staff', component: UserStaffComponent, data: { roles: ['staff'] }},

      { path: 'customer', component: UserCustomerComponent, data: { roles: ['customer'] }},
      { path: 'admin/view-users', component: AdminUsersComponent, data: { roles: ['admin','sub_admin'] }},
      { path: 'customer/complaints', component: CustomerComplaintsListComponent, data: { roles: ['customer'] }},

      { path: 'history', component: HistoryComponent, data: { roles: ['customer'] }},
      { path: 'profile/:id', component: ProfileComponent, data: { roles: ['admin','sub_admin','staff','customer'] }},
    ]
  },

  // --------------------
  // Fallback
  // --------------------
  { path: '**', redirectTo: '' }
];
