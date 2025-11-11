import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ComplaintService, Complaint } from '../services/complaint';
import { LoginAuthService } from '../services/login-auth';
import { CommonModule } from '@angular/common';

export interface EditableComplaint extends Complaint {
  editMode?: boolean;
  editTitle?: string;
  editDescription?: string;
}

@Component({
  selector: 'app-user-customer',
  templateUrl: './user-customer.html',
  styleUrls: ['./user-customer.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class UserCustomerComponent implements OnInit {
  newComplaint: Partial<Complaint> = { title: '', description: '' };
  successMessage = '';
  errorMessage = '';
  complaints: EditableComplaint[] = [];
  currentlyEditingId: number | null = null; // ✅ track which complaint is being edited

  private complaintService = inject(ComplaintService);
  private loginService = inject(LoginAuthService);

  ngOnInit(): void {
  
  }

  submitComplaint(form: NgForm) {
    const userId = this.loginService.currentUser?.id;
    if (!userId || !this.newComplaint.title || !this.newComplaint.description) {
      this.errorMessage = 'Title and description are required!';
      this.successMessage = '';
      return;
    }

    this.complaintService.submitComplaint({ ...this.newComplaint, user_id: userId } as Complaint)
      .subscribe({
        next: (res: any) => {
          this.successMessage = res.message;
          this.errorMessage = '';
          this.newComplaint = { title: '', description: '' };
          form.resetForm();
         
        },
        error: () => {
          this.errorMessage = 'Failed to submit complaint';
          this.successMessage = '';
        }
      });
  }

 
}
