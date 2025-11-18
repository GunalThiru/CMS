import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminUsersService {
  private baseUrl = 'http://127.0.0.1:5000/admin/users';

  constructor(private http: HttpClient) {}

  getStaff(page: number, pageSize: number, q: string): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/staff?page=${page}&page_size=${pageSize}&q=${q}`
    );
  }

  getCustomers(page: number, pageSize: number, q: string): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/customers?page=${page}&page_size=${pageSize}&q=${q}`
    );
  }
}
