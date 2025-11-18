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
      this.complaints = res.map(c => ({
        ...c,
        staff_id: c.staff_id || c.assigned_staff_id || '',
        remarks: c.remarks || ''
      }));
      this.loading = false;
    },
    error: (err: any) => {
      console.error(err);
      this.errorMessage = 'Failed to load complaints.';
      this.loading = false;
    }
  });
}


 assignComplaint(c: any) {
  if (!c.staff_id || !c.remarks) {
    alert("Please enter staff ID and remarks");
    return;
  }

  const payload = {
    complaint_id: c.id,
    staff_id: c.staff_id,
    remarks: c.remarks
  };

  this.adminService.assignComplaint(payload).subscribe({
    next: (res) => {
      c.status = 'assigned';

      // UPDATE UI IMMEDIATELY
      c.staff_id = payload.staff_id;       // <--- REQUIRED
      c.remarks = payload.remarks;         // <--- To show remarks
      // or if backend returns data: 
      // c.staff_id = res.staff_id;

      alert("Complaint assigned successfully");
    },
    error: (err) => {
      console.error(err);
      alert("Error assigning complaint");
    }
  });
}

}
