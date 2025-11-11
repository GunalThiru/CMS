import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminComplaintService } from '../services/admin';

@Component({
  selector: 'app-user-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-admin.html',
  styleUrls: ['./user-admin.css']
})
export class UserAdminComponent implements OnInit {
  complaints: any[] = [];
  loading = false;
  errorMessage = '';

  constructor(private adminService: AdminComplaintService) {}

  ngOnInit(): void {
    this.loadComplaints();
  }

  loadComplaints(): void {
    this.loading = true;
    this.adminService.getAllComplaints().subscribe({
      next: (res: any[]) => {
        this.complaints = res.map(c => ({ ...c, staff_id: '', remarks: '' }));
        this.loading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.errorMessage = 'Failed to load complaints.';
        this.loading = false;
      }
    });
  }

  assignComplaint(c: any): void {
    if (!c.staff_id) {
      alert('Please enter a Staff ID');
      return;
    }

    const payload = {
      complaint_id: c.id,
      staff_id: Number(c.staff_id),
      remarks: c.remarks || ''
    };

    this.adminService.assignComplaint(payload).subscribe({
      next: () => {
        alert('Complaint assigned successfully');
        this.loadComplaints();
      },
      error: (err: any) => {
        console.error(err);
        alert('Failed to assign complaint');
      }
    });
  }
}
