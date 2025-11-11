import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminComplaintService {
  private baseUrl = 'http://127.0.0.1:5000'; // Flask backend

  constructor(private http: HttpClient) {}

  // Get all complaints
  getAllComplaints(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/admin/complaints`);
  }

  // Assign complaint to staff
  assignComplaint(data: {
    complaint_id: number;
    staff_id: number;
    remarks?: string;
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/assign`, data);
  }
}
