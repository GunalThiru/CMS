import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:5000';  // Flask server URL

  // 🔹 Role state for reactive navbar
  private roleSubject = new BehaviorSubject<string | null>(null);
  role$ = this.roleSubject.asObservable();

  constructor(private http: HttpClient) {
    // Load role from localStorage if present
    if (typeof localStorage !== 'undefined') {
      const savedRole = localStorage.getItem('role');
      this.roleSubject.next(savedRole);
    }
  }

  // ===================== HTTP Methods =====================
  signup(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/signup`, userData);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, data);
  }

  getUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/users`);
  }

  // ===================== Role Methods =====================
  setRole(role: string | null) {
    if (typeof localStorage !== 'undefined') {
      if (role) localStorage.setItem('role', role);
      else localStorage.removeItem('role');
    }
    this.roleSubject.next(role);
  }

  getRole(): string | null {
    return this.roleSubject.value;
  }
}
