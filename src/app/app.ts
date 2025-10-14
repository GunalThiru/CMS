import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  template: `
    <nav>
      <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
     
    </nav>
    <router-outlet></router-outlet>
  `,
  styles: [`
    nav {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      display: flex;
      justify-content: center;
      gap: 20px;
      background: white;
      padding: 15px 0;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      z-index: 100;
    }
    a {
      color: #5563DE;
      text-decoration: none;
      font-weight: 600;
      transition: 0.3s;
      cursor:pointer;
    }
    a:hover {
      color: #3848b1;
    }
    .active {
      border-bottom: 2px solid #5563DE;
      padding-bottom: 4px;
    }
  `]
})
export class AppComponent {
  title = 'CMS';
}
