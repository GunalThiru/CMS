import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StaffComplaintService {
  private baseUrl = 'http://127.0.0.1:5000'; // Flask backend

  constructor(private http: HttpClient) {}

  // Get complaints assigned to a specific staff
  getAssignedComplaints(staffId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/staff/complaints/${staffId}`);
  }

  // Update complaint remarks or status
  updateComplaint(data: { complaint_id: number; remarks?: string; status?: string }): Observable<any> {
    return this.http.put(`${this.baseUrl}/staff/update`, data);
  }
}
