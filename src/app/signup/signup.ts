import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class SignupComponent {
  name = '';
  email = '';
  phone = '';
  dob = '';
  password = '';
  age = 0; // new property

  successMessage = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  // 🔹 New function to auto-calculate age
  calculateAge(): void {
    if (!this.dob) {
      this.age = 0;
      return;
    }

    const today = new Date();
    const birthDate = new Date(this.dob);
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }

    this.age = calculatedAge;
  }

  onSignup() {
    const userData = {
      name: this.name,
      email: this.email,
      phone: this.phone,
      dob: this.dob,
      age: this.age, // include age in payload
      password: this.password
    };

    this.authService.signup(userData).subscribe({
      next: (response) => {
        // Signup success
        this.successMessage = 'Signup successful! Redirecting to login...';
        this.errorMessage = '';

        // After 2 seconds, redirect to login
        setTimeout(() => {
        console.log('Redirecting to login...');
        this.router.navigate(['/login']).then(success => console.log('Navigation success:', success));
        }, 2000);

      },
      error: (err) => {
        // Signup failed
        this.errorMessage = err.error?.message || 'Signup failed! Try again.';
        this.successMessage = '';
      }
    });
  }
}
