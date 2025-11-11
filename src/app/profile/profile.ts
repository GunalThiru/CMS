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
  editable = false;           // tracks if user can *edit*
  editMode = false;           // tracks if currently *editing*
  originalUser: any = null;   // store backup before editing

  private loginService = inject(LoginAuthService);
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    const loggedInUser = this.loginService.currentUser;
    const userId = Number(this.route.snapshot.paramMap.get('id'));

    this.http.get<User>(`http://localhost:5000/profile/${userId}`).subscribe({
      next: (data) => {
        // Format DOB for date input
        if (data.dob) {
          const date = new Date(data.dob);
          data.dob = date.toISOString().split('T')[0];
        }
        this.user = data;

        // Allow editing if same user or admin
        this.editable = loggedInUser?.id === userId || loggedInUser?.role === 'admin';
      },
      error: (err) => console.error('Failed to load profile', err)
    });
  }

  toggleEdit(): void {
    if (!this.user) return;
    this.editMode = true;
    this.originalUser = { ...this.user }; // keep a copy before editing
  }

  cancelEdit(): void {
    if (this.originalUser) {
      this.user = { ...this.originalUser };
    }
    this.editMode = false;
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
          alert('Profile updated successfully!');
          this.user = res.user || this.user; // update local state
          this.editMode = false;
        },
        error: (err) => console.error('Update failed', err)
      });
  }
}
