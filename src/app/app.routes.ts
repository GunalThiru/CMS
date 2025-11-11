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


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
    { path: 'admin', component: UserAdminComponent, canActivate: [RoleGuard], data: { role: 'admin' }},
  { path: 'staff', component: UserStaffComponent, canActivate: [RoleGuard], data: { role: 'staff' } },
  { path: 'customer', component: UserCustomerComponent, canActivate: [RoleGuard], data: { role: 'customer' } },
  { path: 'profile/:id', component: ProfileComponent },
  { path: 'customer/complaints', component: CustomerComplaintsListComponent },
  
  { path: '**', redirectTo: '' }
  


];
