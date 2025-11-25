import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'customer';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:5000';

  // ---- USER STATE ----
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  // ---------------------------------------------------------
  // LOAD USER ON REFRESH
  // ---------------------------------------------------------
  loadUserFromStorage() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.currentUserSubject.next(JSON.parse(userJson));
    }
  }

  // ---------------------------------------------------------
  // SIGNUP
  // ---------------------------------------------------------
  signup(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/signup`, data);
  }

  // ---------------------------------------------------------
  // LOGIN
  // ---------------------------------------------------------
  login(data: any): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/auth/login`, data).pipe(
      tap((user) => {
        // store user in localStorage
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  // ---------------------------------------------------------
  // LOGOUT
  // ---------------------------------------------------------
  logout() {
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  // ---------------------------------------------------------
  // GET USER INFO
  // ---------------------------------------------------------
  getUser(): User | null {
    return this.currentUserSubject.value;
  }

  getRole(): string | null {
    return this.currentUserSubject.value?.role || null;
  }

  getUserId(): number | null {
    return this.currentUserSubject.value?.id || null;
  }

  getUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/users`);
  }
}
