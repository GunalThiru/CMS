import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComplaintService, Complaint } from '../services/complaint';
import { FeedbackService, Feedback } from '../services/feedback';
import { LoginAuthService } from '../services/login-auth';
import { HttpClient } from '@angular/common/http';


export interface EditableComplaint extends Complaint {
  editMode?: boolean;
  editTitle?: string;
  editDescription?: string;
  assigned_staff_id?: number | null;  // keep only this
  }

@Component({
  selector: 'app-customer-complaints-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-complaints-list.html',
  styleUrls: ['./customer-complaints-list.css']
})
export class CustomerComplaintsListComponent implements OnInit {

   private http = inject(HttpClient);
   private autoClearTimeout: any;


  complaints: EditableComplaint[] = [];
  successMessage = '';
  errorMessage = '';
  currentlyEditingId: number | null = null;

  // ---------------------------
  // CLOSE COMPLAINT MODAL
  // ---------------------------
  showCloseModal = false;
  modalComplaint: EditableComplaint | null = null;

  // ---------------------------
  // FEEDBACK MODAL
  // ---------------------------
  showFeedbackModal = false;
  feedbackComplaint: EditableComplaint | null = null;
  feedbackRating = 0;
  feedbackText = '';

  private complaintService = inject(ComplaintService);
  private feedbackService = inject(FeedbackService);
  private loginService = inject(LoginAuthService);

  ngOnInit(): void {
    this.loadComplaints();
  }

   private autoClearMessages() {
    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
    }, 3000);
  }

  // Call to clear immediately
clearMessages() {
  if (this.autoClearTimeout) clearTimeout(this.autoClearTimeout);
  this.successMessage = '';
  this.errorMessage = '';
}
  // ---------------------------------------------------
  // Load complaints with latest assigned staff
  // ---------------------------------------------------
  loadComplaints() {
    const userId = this.loginService.currentUser?.id;
    if (!userId) return;

    this.complaintService.getComplaints(userId).subscribe({
      next: (res: Complaint[]) => {
        this.complaints = res.map(c => {
          // Determine latest assigned staff if assignments exist
          let staffId: number | null = null;
          if ((c as any).assignments && (c as any).assignments.length > 0) {
            const latestAssignment = (c as any).assignments
              .sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0];
            staffId = latestAssignment.assigned_to;
          }

          return {
            ...c,
            editMode: false,
            editTitle: c.title,
            editDescription: c.description,
            staff_id: staffId
          };
        });
        this.currentlyEditingId = null;
      },
      error: () => {
        this.errorMessage = 'Failed to load complaints';
      }
    });
  }

  // ---------------------------------------------------
  // Editing
  // ---------------------------------------------------
  enableEdit(complaint: EditableComplaint) {
    if (complaint.status !== 'open') {
      this.errorMessage = 'Only open complaints can be edited.';
      return;
    }

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
        this.autoClearMessages(); 

        complaint.title = complaint.editTitle!;
        complaint.description = complaint.editDescription!;
        complaint.editMode = false;
        this.currentlyEditingId = null;
      },
      error: () => {
        this.errorMessage = 'Failed to update complaint';
        this.autoClearMessages(); 
      }
    });
  }

  // ---------------------------------------------------
  // Delete complaint
  // ---------------------------------------------------
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
        this.autoClearMessages(); 
        this.loadComplaints();
      },
      error: () => {
        this.errorMessage = 'Failed to delete complaint';
        this.autoClearMessages(); 
      }
    });
  }

  // ---------------------------------------------------
  // Close complaint modal
  // ---------------------------------------------------
  openCloseModal(complaint: EditableComplaint) {
    if (complaint.status !== 'resolved') {
      this.errorMessage = 'Only resolved complaints can be closed.';
      return;
    }

    this.modalComplaint = complaint;
    this.showCloseModal = true;
    this.errorMessage = '';
  }

  cancelClose() {
    this.modalComplaint = null;
    this.showCloseModal = false;
  }

  // ---------------------------------------------------
  // Confirm close -> open feedback modal
  // ---------------------------------------------------
  confirmClose() {
    if (!this.modalComplaint) return;

    this.complaintService.closeComplaint(this.modalComplaint.id!).subscribe({
      next: (res: any) => {
        this.successMessage = res.message || 'Complaint closed';
        this.errorMessage = '';
        this.autoClearMessages(); 

        this.showCloseModal = false;

        // Open feedback modal
        this.feedbackComplaint = this.modalComplaint;
        this.showFeedbackModal = true;

        this.modalComplaint = null;
        this.loadComplaints();
      },
      error: () => {
        this.errorMessage = 'Failed to close complaint';
        this.autoClearMessages(); 
        this.showCloseModal = false;
        this.modalComplaint = null;
      }
    });
  }

  // ---------------------------------------------------
  // Submit feedback
  // ---------------------------------------------------
 submitFeedback() {
  if (!this.feedbackComplaint) return;
  if (this.feedbackRating === 0) {
    this.errorMessage = 'Please select a star rating.';
     this.autoClearMessages();  

    return;
  }
  if (!this.feedbackComplaint.assigned_staff_id) {
    this.errorMessage = 'No staff assigned to this complaint.';
      this.autoClearMessages();  
    return;
  }

  const payload: Feedback = {
    complaint_id: this.feedbackComplaint.id!,
    staff_id: this.feedbackComplaint.assigned_staff_id!,
    rating: this.feedbackRating,
    description: this.feedbackText,
    customer_id: this.loginService.currentUser!.id
  };

  this.http.post("http://localhost:5000/feedback", payload).subscribe({
    next: (res: any) => {
      this.successMessage = res.message || 'Thank you for your feedback!';
      this.errorMessage = '';
      this.autoClearMessages();

      this.showFeedbackModal = false;
      

      // Reset feedback form
      this.feedbackComplaint = null;
      this.feedbackRating = 0;
      this.feedbackText = '';

      // Optionally refresh complaints list to show updated status
      this.loadComplaints();
    },
    error: (err: any) => {
      console.error("Feedback submission error:", err);
      this.errorMessage = 'Failed to submit feedback';
      this.autoClearMessages();
    }
  });
}



    
  cancelFeedback() {
    this.showFeedbackModal = false;
    this.feedbackComplaint = null;
    this.feedbackRating = 0;
    this.feedbackText = '';
  }

  // ---------------------------------------------------
  // Lists
  // ---------------------------------------------------
  get openComplaints() {
    return this.complaints.filter(c => c.status !== 'closed');
  }

  get historyComplaints() {
    return this.complaints.filter(c => c.status === 'closed');
  }
}
