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
  staffId = 2; // Example: logged-in staff ID (replace with actual)
  complaints: any[] = [];
  loading = false;

  constructor(private staffService: StaffComplaintService) {}

  ngOnInit(): void {
    this.loadComplaints();
  }

  /** Load all complaints assigned to this staff */
  loadComplaints(): void {
    this.loading = true;
    this.staffService.getAssignedComplaints(this.staffId).subscribe({
      next: (res: any[]) => {
        this.complaints = res.map(c => ({ ...c, remarks: c.remarks || '' }));
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading complaints:', err);
        this.loading = false;
      }
    });
  }

  /** Update complaint details (remarks/status) */
  updateComplaint(c: any): void {
    const data = {
      complaint_id: c.id,
      remarks: c.remarks,
      status: c.status
    };

    this.staffService.updateComplaint(data).subscribe({
      next: () => {
        alert('Complaint updated successfully!');
        this.loadComplaints();
      },
      error: (err: any) => console.error('Error updating complaint:', err)
    });
  }

  /** Track complaints efficiently in ngFor */
  trackByComplaintId(index: number, item: any): number {
    return item.id;
  }
}
