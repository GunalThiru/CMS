// app.routes.ts
import { Routes } from '@angular/router';
import { inject } from '@angular/core';

import { SignupComponent } from './signup/signup';
import { LoginComponent } from './login/login';
import { HomeComponent } from './home/home';
import { UserAdminComponent } from './user-admin/user-admin';
import { UserStaffComponent } from './user-staff/user-staff';
import { UserCustomerComponent } from './user-customer/user-customer';
import { ProfileComponent } from './profile/profile';
import { CustomerComplaintsListComponent } from './customer-complaints-list/customer-complaints-list';
import { HistoryComponent } from './history/history';
import { AdminUsersComponent } from './user-admin/view-users/view-users';

import { AuthGuard } from './guards/auth-guard';
import { RoleGuard } from './guards/role-guard';   // functional guard

export const routes: Routes = [

  // --------------------
  // PUBLIC ROUTES
  // --------------------
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },

  // --------------------
  // PROTECTED ROUTES
  // --------------------
  {
    path: '',
    canActivate: [
      () => inject(AuthGuard).canActivate()   // 🔒 user must be logged in
    ],
    canActivateChild: [
      RoleGuard                                  // 🔒 role-based guard for children
    ],
    children: [
      // Home
      {
        path: '',
        component: HomeComponent,
        data: { roles: ['admin', 'sub_admin', 'staff', 'customer'] }
      },

      // Admin Dashboard
      {
        path: 'admin',
        component: UserAdminComponent,
        data: { roles: ['admin', 'sub_admin'] }
      },

      // Staff Dashboard
      {
        path: 'staff',
        component: UserStaffComponent,
        data: { roles: ['staff'] }
      },

      // Customer Dashboard
      {
        path: 'customer',
        component: UserCustomerComponent,
        data: { roles: ['customer'] }
      },

      // Admin → View Users
      {
        path: 'admin/view-users',
        component: AdminUsersComponent,
        data: { roles: ['admin', 'sub_admin'] }
      },

      // Customer Complaints
      {
        path: 'customer/complaints',
        component: CustomerComplaintsListComponent,
        data: { roles: ['customer'] }
      },

      // Customer History
      {
        path: 'history',
        component: HistoryComponent,
        data: { roles: ['customer'] }
      },

      // Profile (everyone can view their own)
      {
        path: 'profile/:id',
        component: ProfileComponent,
        data: { roles: ['admin', 'sub_admin', 'staff', 'customer'] }
      },
    ]
  },

  // --------------------
  // FALLBACK
  // --------------------
  { path: '**', redirectTo: '' }
];
