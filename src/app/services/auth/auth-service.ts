import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthServiceResponse } from '../../interfaces/auth/auth-service-response';
import { LoginRequest } from '../../interfaces/auth/Login/login-request';
import { RegisterRequest } from '../../interfaces/auth/Register/register-request';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '../../interfaces/auth/JwtPayload';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authUser = signal<boolean>(false);
  username = signal<string | null>(null);
  logOut = signal<string>('Log out');
  userId = signal<number | null>(0);

  constructor(private httpClient: HttpClient, private router: Router) {
    this.loadUserFromToken();
  }

  getUserToken(): string {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return '';

    return localStorage.getItem('authToken') != undefined ? localStorage.getItem('authToken')! : '';
  }

  loadUserFromToken() {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;

    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (decoded.expires && decoded.expires * 1000 < Date.now()) {
        this.clearUser();
        return;
      }

      this.authUser.set(true);
      this.username.set(decoded.unique_name);
      this.userId.set(decoded.sub);
    } catch (error) {
      this.clearUser();
    }
  }

  setUserData(token: string) {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;

    if (token === '') {
      this.username.set(null);
      this.authUser.set(false);
      return;
    }
    const decoded = jwtDecode<JwtPayload>(token);
    localStorage.setItem('authToken', token);
    this.username.set(decoded.unique_name);
    this.authUser.set(true);
  }

  clearUser() {
    localStorage.removeItem('authToken');
    this.logOut.set('Logging out...');
    setTimeout(() => {
      this.logOut.set('Log out');
      this.authUser.set(false);
      this.username.set(null);
      this.router.navigate(['/login']);
    }, 4000);
  }

  private baseUrl = 'https://localhost:7198/api/auth';

  LogIn(request: LoginRequest): Observable<AuthServiceResponse> {
    return this.httpClient.post<AuthServiceResponse>(`${this.baseUrl}/login`, request);
  }

  RegisterUser(request: RegisterRequest): Observable<AuthServiceResponse> {
    return this.httpClient.post<AuthServiceResponse>(`${this.baseUrl}/register`, request);
  }
}
