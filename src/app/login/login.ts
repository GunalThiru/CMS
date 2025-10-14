import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; // <-- Add this import


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  template: `
    <div class="login-container">
      <div class="card">
        <h2>Login</h2>
        <form (ngSubmit)="onLogin()" >
          <input type="text" placeholder="Username" [(ngModel)]="username" name="username" required />
          <input type="password" placeholder="Password" [(ngModel)]="password" name="password" required />
          <button type="button">Login</button>
        </form>
        <a routerLink="/" class="back-link">⬅ Back to Home</a>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background: linear-gradient(to right, #5563DE, #74ABE2);
    }
    .card {
      background: white;
      padding: 2rem;
      border-radius: 15px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      width: 300px;
      text-align: center;
    }
    h2 {
      margin-bottom: 1.5rem;
      color: #5563DE;
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
    .back-link {
      cursor:pointer;
      display: inline-block;
      margin-top: 1rem;
      color: #5563DE;
      text-decoration: none;
      font-size: 0.9rem;
    }
    .back-link:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  email="";


  onLogin() {
    if (!this.username || !this.email || !this.password) {
      alert('Please fill in all fields ❌');
      return;
    }
    this.login();
  }

  login() {
    alert(`Welcome ${this.username || 'Guest'}!`);
  }
}

