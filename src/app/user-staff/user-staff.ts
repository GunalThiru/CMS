import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StaffComplaintService } from '../services/staff';

@Component({
  selector: 'app-user-staff',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-staff.html',
  styleUrls: ['./user-staff.css']
})
export class UserStaffComponent implements OnInit {

  staffId: number = 0;
  complaints: any[] = [];
  loading = false;

  constructor(private staffService: StaffComplaintService) {}

  ngOnInit(): void {
    const stored = sessionStorage.getItem('user');

    if (!stored) {
      console.error("❌ No user found in sessionStorage.");
      return;
    }

    const user = JSON.parse(stored);
    this.staffId = user.id;

    console.log("Logged-in staff ID =", this.staffId);

    this.loadComplaints();
  }

  loadComplaints(): void {
    this.loading = true;

    this.staffService.getAssignedComplaints(this.staffId).subscribe({
      next: (res: any[]) => {
        this.complaints = res.map(c => ({ ...c, remarks: c.remarks || '' }));
        this.loading = false;
      },
      error: err => {
        console.error("❌ Error loading complaints:", err);
        this.loading = false;
      }
    });
  }

  updateComplaint(c: any): void {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');

    const data = {
      complaint_id: c.id,
      remarks: c.remarks,
      status: c.status,
      staff_id: user.id  // ✅ REQUIRED
    };

    this.staffService.updateComplaint(data).subscribe({
      next: () => {
        alert("Complaint updated successfully!");
        this.loadComplaints();
      },
      error: err => console.error("❌ Error updating complaint:", err)
    });
  }

  trackByComplaintId(index: number, item: any): number {
    return item.id;
  }
}
