import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  dob: string;
  age: number;
  role: 'admin' | 'sub_admin' | 'staff' | 'customer';
  is_online: boolean;
  last_seen: string;
}

@Injectable({ providedIn: 'root' })
export class LoginAuthService {
  private isBrowser: boolean;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private router: Router, private http: HttpClient, @Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);

    // Initialize from sessionStorage if in browser
    if (this.isBrowser) {
      const stored = sessionStorage.getItem('user'); // ✅ use sessionStorage
      if (stored) {
        this.currentUserSubject.next(JSON.parse(stored));
      }
    }
  }

  login(credentials: { email: string; password: string }): Observable<User> {
    return this.http.post<{ message: string; user: User }>(
      'http://localhost:5000/auth/login',
      credentials
    ).pipe(
      map(res => res.user),
      tap(user => {
        this.currentUserSubject.next(user);
        if (this.isBrowser) sessionStorage.setItem('user', JSON.stringify(user)); // ✅ use sessionStorage
      })
    );
  }
  // Load user from session (if any)
  loadUserFromSession(): User | null {
  if (this.isBrowser) {
    const stored = sessionStorage.getItem('user');
    if (stored) {
      const user = JSON.parse(stored);
      this.currentUserSubject.next(user);
      return user;
    }
  }
  return null;
  }

  logout() {
    this.currentUserSubject.next(null);
    if (this.isBrowser) sessionStorage.removeItem('user'); // ✅ use sessionStorage
    this.router.navigate(['/login']);
  }

  setCurrentUser(user: User | null) {
    this.currentUserSubject.next(user);
    if (this.isBrowser) {
      if (user) sessionStorage.setItem('user', JSON.stringify(user)); // ✅ use sessionStorage
      else sessionStorage.removeItem('user'); // ✅ use sessionStorage
    }
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getUserRole(): string | null {
    return this.currentUserSubject.value?.role || null;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }
}
