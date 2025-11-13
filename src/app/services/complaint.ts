import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Complaint {
  id?: number;
  user_id: number;
  title: string;
  description: string;
  status?: 'open' | 'in_progress' | 'resolved' | 'closed';
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/complaints';

  submitComplaint(complaint: Complaint): Observable<any> {
    return this.http.post(this.apiUrl, complaint);
  }

  getComplaints(userId: number): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(`${this.apiUrl}/${userId}`);
  }

  updateComplaint(complaintId: number, complaint: Partial<Complaint>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${complaintId}`, complaint);
  }

  deleteComplaint(complaintId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${complaintId}`);
  }

  // services/complaint.ts
closeComplaint(id: number) {
  return this.http.put(`${this.apiUrl}/complaints/close/${id}`, {});
}

}
