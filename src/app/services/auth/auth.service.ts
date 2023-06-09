import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { Observable, catchError, map, of, tap } from 'rxjs';

import { BASE_URL } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  private readonly JWT_TOKEN = 'JWT_TOKEN';

  doLoginUser(token: any): void {
    localStorage.setItem(this.JWT_TOKEN, token.jwt);
  }

  doLogoutUser(): void {
    localStorage.removeItem(this.JWT_TOKEN);
  }

  getCurrentUser(): Profile | undefined {
    const token = this.getToken();
    if (token) {
      const payload: any = jwt_decode(token);
      return payload.profile;
    } else {
      return undefined;
    }
  }

  getToken() {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  signup(user: SignUpRequest): Observable<void> {
    return this.http.post<any>(`${BASE_URL}/signup`, user);
  }

  confirm(email: string, code: string): Observable<void> {
    return this.http.post<any>(`${BASE_URL}/confirm?`, {email, code});
  }

  login(loginRequest: LoginRequest): Observable<Profile> {
    return this.http.post<any>(`${BASE_URL}/login`, loginRequest)
      .pipe(tap(data => this.doLoginUser(data)));
  }

  logout() {
    return this.http.get<any>(`${BASE_URL}/logout`)
      .pipe(tap(() => this.doLogoutUser()));
  }

  isLoggedIn$(): boolean {
    return !!this.getCurrentUser();
  }
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface Profile {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}
