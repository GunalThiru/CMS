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
  role: 'admin' | 'staff' | 'customer';
}

@Injectable({ providedIn: 'root' })
export class LoginAuthService {
  private isBrowser: boolean;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private router: Router, private http: HttpClient, @Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);

    // Initialize from localStorage if in browser
    if (this.isBrowser) {
      const stored = localStorage.getItem('user');
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
    map(res => res.user),  // <-- extract only the user
    tap(user => {
      this.currentUserSubject.next(user);
      if (this.isBrowser) localStorage.setItem('user', JSON.stringify(user));
    })
  );
}


    


   
  
  logout() {
    this.currentUserSubject.next(null);
    if (this.isBrowser) localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  setCurrentUser(user: User | null) {
    this.currentUserSubject.next(user);
    if (this.isBrowser) {
      if (user) localStorage.setItem('user', JSON.stringify(user));
      else localStorage.removeItem('user');
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
