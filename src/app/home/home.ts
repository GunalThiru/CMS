import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; // <-- Add this import
import { AuthService } from '../services/auth'; 

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  template: `
    <div class="container">
      <div class="card">
        <h1>Sign Up 📝</h1>
        <form (ngSubmit)="onSignup()">
          <input 
            type="text" 
            placeholder="Full Name" 
            [(ngModel)]="name" 
            name="name" 
            required
          />
          <input 
            type="email" 
            placeholder="Email" 
            [(ngModel)]="email" 
            name="email" 
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            [(ngModel)]="password" 
            name="password" 
            required
          />
          <button type="submit">Sign Up</button>
        </form>
        <p class="login-text">
          Already have an account?
          <a routerLink="/login">Login here</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background: linear-gradient(to right, #74ABE2, #5563DE);
    }
    .card {
      background: white;
      padding: 2rem;
      border-radius: 15px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      width: 320px;
      text-align: center;
    }
    h1 {
      color: #5563DE;
      margin-bottom: 1.5rem;
    }
    input {
      width: 100%;
      padding: 10px;
      margin-bottom: 1rem;
      border: 1px solid #ccc;
      border-radius: 8px;
      outline: none;
      font-size: 1rem;
      transition: 0.2s;
    }
    input:focus {
      border-color: #5563DE;
      box-shadow: 0 0 5px rgba(85, 99, 222, 0.4);
    }
    button {
      width: 100%;
      background: #5563DE;
      color: white;
      padding: 10px;
      font-size: 1rem;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.3s ease;
    }
    button:hover {
      background: #3848b1;
    }
    .login-text {
      margin-top: 1rem;
      font-size: 0.9rem;
    }
    .login-text a {

      cursor:pointer;
      color: #5563DE;
      text-decoration: none;
      font-weight: 600;
    }
    .login-text a:hover {
      text-decoration: underline;
    }
  `]
})
export class HomeComponent {
  name = '';
  email = '';
  password = '';

   constructor(private authService: AuthService) {}

  onSignup() {
    this.authService.signup({ name: this.name, email: this.email, password: this.password })
      .subscribe({
        next: (response) => {
          // handle success, e.g. show a message or redirect
          console.log('Signup successful:', response);
        },
        error: (err) => {
          // handle error, e.g. show an error message
          console.error('Signup failed:', err);
        }
      });
  }
}
