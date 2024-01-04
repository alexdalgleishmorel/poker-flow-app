import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';

import { BASE_API_URL } from '../api/api.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = this.addToken(request, this.authService.getToken());
    return next.handle(request).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string | null) {
    return request.clone({
      setHeaders: { 'Authorization': `Bearer ${token}` }
    });
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private loggedIn$ = new BehaviorSubject<boolean>(!!localStorage.getItem(this.JWT_TOKEN));

  public isLoggedIn$ = this.loggedIn$.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  recordLogin(token: any): void {
    this.loggedIn$.next(true);
    localStorage.setItem(this.JWT_TOKEN, token.jwt);
  }

  recordLogout(): void {
    this.loggedIn$.next(false);
    localStorage.removeItem(this.JWT_TOKEN);
  }

  getCurrentUser(): Profile | undefined {
    const token = this.getToken();
    if (token) {
      const payload: any = jwt_decode(token);
      this.loggedIn$.next(true);
      return payload.profile;
    } else {
      this.loggedIn$.next(false);
      return undefined;
    }
  }

  getToken() {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  signup(user: SignUpRequest): Observable<void> {
    return this.http.post<any>(`${BASE_API_URL}/signup`, user);
  }

  login(loginRequest: LoginRequest): Observable<Profile> {
    return this.http.post<any>(`${BASE_API_URL}/login`, loginRequest).pipe(tap(data => this.recordLogin(data)));
  }

  logout() {
    return this.http.get<any>(`${BASE_API_URL}/logout`).pipe(tap(() => this.recordLogout()));
  }

  logoutAndRedirectToLogin() {
    this.logout().subscribe(() => this.router.navigate(['/', 'login']));
  }

  verifyEmailUniqueness(email: string): Observable<boolean> {
    return this.http.post<any>(`${BASE_API_URL}/verifyUniqueEmail`, { email: email });
  }

  updateProfileInformation(profile: Profile) {
    return this.http.post<any>(`${BASE_API_URL}/updateUser`, {...profile, id: this.getCurrentUser()?.id}).pipe(
      tap(data => this.recordLogin(data))
    );
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
  id?: number;
  email?: string;
  firstName?: string;
  lastName?: string;
}
