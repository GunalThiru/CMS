import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { LoginAuthService, User } from './services/login-auth';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit {
  userRole: string | null = null;
   userId: number | null = null;

  constructor(
    private loginAuthService: LoginAuthService,
    private router: Router
  ) {}

  ngOnInit(): void {


    // 🔥 Restore user before subscribing
    this.loginAuthService.loadUserFromSession();


    this.loginAuthService.currentUser$.subscribe((user: User | null) => {
      this.userRole = user?.role || null;
      this.userId = user?.id || null;
    });
  }
  logout(): void {
    this.loginAuthService.logout();
  }
}
