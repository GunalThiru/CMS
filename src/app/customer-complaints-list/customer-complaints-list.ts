import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComplaintService, Complaint } from '../services/complaint';
import { LoginAuthService } from '../services/login-auth';

export interface EditableComplaint extends Complaint {
  editMode?: boolean;
  editTitle?: string;
  editDescription?: string;
}

@Component({
  selector: 'app-customer-complaints-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-complaints-list.html',
  styleUrls: ['./customer-complaints-list.css']
})
export class CustomerComplaintsListComponent implements OnInit {
  complaints: EditableComplaint[] = [];
  successMessage = '';
  errorMessage = '';
 
   currentlyEditingId: number | null = null; // ✅ track which complaint is being edited

  private complaintService = inject(ComplaintService);
  private loginService = inject(LoginAuthService);
  ngOnInit(): void {
    this.loadComplaints();
  }

 loadComplaints() {
    const userId = this.loginService.currentUser?.id;
    if (!userId) return;

    this.complaintService.getComplaints(userId).subscribe({
      next: (res: Complaint[]) => {
        this.complaints = res.map(c => ({
          ...c,
          editMode: false,
          editTitle: c.title,
          editDescription: c.description
        }));
        this.currentlyEditingId = null;
      },
      error: () => {
        this.errorMessage = 'Failed to load complaints';
      }
    });
  }

 enableEdit(complaint: EditableComplaint) {
     if (complaint.status !== 'open') {
       this.errorMessage = 'Only open complaints can be edited.';
       return;
     }
      // ✅ Disable edit on all other complaints
    this.complaints.forEach(c => c.editMode = false);
    this.currentlyEditingId = complaint.id!;
    complaint.editMode = true;
    this.errorMessage = '';
  }

 cancelEdit(complaint: EditableComplaint) {
    complaint.editMode = false;
    this.currentlyEditingId = null;
    complaint.editTitle = complaint.title;
    complaint.editDescription = complaint.description;
  }
    saveEdit(complaint: EditableComplaint) {
      if (!complaint.editTitle || !complaint.editDescription) {
        this.errorMessage = 'Title and description cannot be empty';
        return;
      }
  
      this.complaintService.updateComplaint(complaint.id!, {
        title: complaint.editTitle,
        description: complaint.editDescription
      }).subscribe({
        next: (res: any) => {
          this.successMessage = res.message;
          this.errorMessage = '';
          complaint.title = complaint.editTitle!;
          complaint.description = complaint.editDescription!;
          complaint.editMode = false;
          this.currentlyEditingId = null;
        },
        error: () => {
          this.errorMessage = 'Failed to update complaint';
        }
      });
    }

  deleteComplaint(id: number, status?: string) {
    if (status !== 'open') {
      this.errorMessage = 'Only open complaints can be deleted.';
      return;
    }

    if (!confirm('Are you sure you want to delete this complaint?')) return;

    this.complaintService.deleteComplaint(id).subscribe({
      next: (res: any) => {
        this.successMessage = res.message;
        this.errorMessage = '';
        this.loadComplaints();
      },
      error: () => {
        this.errorMessage = 'Failed to delete complaint';
      }
    });
  }
}
