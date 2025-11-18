import { Component, OnInit } from '@angular/core';
import { ComplaintService } from '../services/complaint';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { LoginAuthService } from '../services/login-auth';

@Component({
  selector: 'app-history',
  templateUrl: './history.html',
  styleUrls: ['./history.css'],
  imports: [CommonModule, DatePipe],
})
export class HistoryComponent implements OnInit {

  closedComplaints: any[] = [];
  userId!: number;

  constructor(
    private complaintService: ComplaintService,
    private auth: LoginAuthService
  ) {}

  ngOnInit() {


    // 🔥 Load user immediately from sessionStorage (SSR FIX)
    this.auth.loadUserFromSession();

    
    // 🔥 Subscribe so user loads even after SSR delay
    this.auth.currentUser$.subscribe(user => {
      if (!user) {
        console.warn("⛔ User not loaded yet...");
        return; // Wait until user is available
      }

      this.userId = user.id;
      this.loadClosedComplaints();
    });
  }

  loadClosedComplaints() {
    if (!this.userId) return;

    this.complaintService.getClosedComplaints(this.userId).subscribe({
      next: (data) => {
        this.closedComplaints = data;
      },
      error: () => {
        console.error('Failed to load closed complaints');
      }
    });
  }

}
