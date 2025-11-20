import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { LoginAuthService, User } from '../services/login-auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  email = '';
  password = '';
  successMessage = '';
  errorMessage = '';

  constructor(private router: Router, private loginAuthService: LoginAuthService) {
    const state = this.router.getCurrentNavigation()?.extras?.state as any;
    if (state?.['message']) {
      this.successMessage = state['message']; // Show signup success message
    }
  }

onLogin() {



  this.loginAuthService.login({ email: this.email, password: this.password }).subscribe({
    next: (user) => {
      console.log('Login response:', user);

      // 🔹 Set reactive user
        // ❌ REMOVE THIS — causes early SSR write
      // this.loginAuthService.setCurrentUser(user);
     // this.loginAuthService.setCurrentUser(user);

      // Redirect based on role
      if (user.role === 'admin') this.router.navigate(['/admin']);
      else if (user.role === 'sub_admin') this.router.navigate(['/admin']);   // route for admin and subadmin is same

      else if (user.role === 'staff') this.router.navigate(['/staff']);
      else this.router.navigate(['/customer']);
    },
    error: (err) => {
      console.error('Login failed:', err);
      this.errorMessage = err.error?.message || 'Login failed!';
    }
  });
}


}
