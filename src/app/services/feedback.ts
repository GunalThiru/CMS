import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Feedback {
  complaint_id: number;
  staff_id: number;
  customer_id: number;     // FIXED (Flask expects "customer_id")
  rating: number;          // 1–5
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/feedback';

  // Submit feedback
  submitFeedback(feedback: Feedback): Observable<any> {
    return this.http.post(this.apiUrl, feedback);
  }

  // Get feedback by complaint ID
  getFeedbackByComplaint(complaintId: number): Observable<Feedback | any> {
    return this.http.get(`${this.apiUrl}/${complaintId}`);
  }

  // Get all feedbacks for a customer
  getUserFeedback(userId: number): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(`${this.apiUrl}/user/${userId}`);
  }
}
