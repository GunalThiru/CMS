import { Component, OnInit } from '@angular/core';
import { ComplaintService } from '../services/complaint';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-history',
  templateUrl: './history.html',
  styleUrls: ['./history.css'],
  imports: [CommonModule, DatePipe],
})
export class HistoryComponent implements OnInit {

  closedComplaints: any[] = [];
  userId!: number;

  constructor(private complaintService: ComplaintService) {}

  ngOnInit() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.userId = JSON.parse(userData).id;
    }

    this.loadClosedComplaints();
  }

 loadClosedComplaints() {
  this.complaintService.getClosedComplaints(this.userId).subscribe({
    next: (data) => {
      this.closedComplaints = data.filter((c: any) => c.status === 'closed');
    },
    error: () => {
      console.error('Failed to load closed complaints');
    }
  });
}

}
