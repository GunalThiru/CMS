import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoginAuthService, User } from '../services/login-auth';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  editable = false;           
  editMode = false;           
  originalUser: any = null;   

  // ✅ Messages
  successMessage: string = '';
  errorMessage: string = '';

  private loginService = inject(LoginAuthService);
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    const loggedInUser = this.loginService.currentUser;
    const userId = Number(this.route.snapshot.paramMap.get('id'));

    this.http.get<User>(`http://localhost:5000/profile/${userId}`).subscribe({
      next: (data) => {
        if (data.dob) {
          const date = new Date(data.dob);
          data.dob = date.toISOString().split('T')[0];
        }
        this.user = data;
        this.editable = loggedInUser?.id === userId || loggedInUser?.role === 'admin';
      },
      error: (err) => {
        console.error('Failed to load profile', err);
        this.errorMessage = 'Failed to load profile.';
        this.autoClearMessage();
      }
    });
  }

  toggleEdit(): void {
    if (!this.user) return;
    this.editMode = true;
    this.originalUser = { ...this.user };
    this.clearMessages();
  }

  cancelEdit(): void {
    if (this.originalUser) {
      this.user = { ...this.originalUser };
    }
    this.editMode = false;
    this.clearMessages();
  }

  saveProfile(): void {
    if (!this.user) return;

    const payload = {
      name: this.user.name,
      phone: this.user.phone,
      dob: this.user.dob
    };

    this.http.put(`http://localhost:5000/profile/${this.user.id}`, payload)
      .subscribe({
        next: (res: any) => {
          this.successMessage = 'Profile updated successfully!';
          this.errorMessage = '';
          this.user = res.user || this.user;
          this.editMode = false;
          this.autoClearMessage();
        },
        error: (err) => {
          console.error('Update failed', err);
          this.errorMessage = 'Failed to update profile.';
          this.successMessage = '';
          this.autoClearMessage();
        }
      });
  }

  // ✅ Helpers
  private autoClearMessage(timeout: number = 3000) {
    setTimeout(() => this.clearMessages(), timeout);
  }

  private clearMessages() {
    this.successMessage = '';
    this.errorMessage = '';
  }
}
