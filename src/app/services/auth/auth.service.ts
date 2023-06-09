import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { BehaviorSubject, Observable, catchError, map, of, tap, throwError } from 'rxjs';

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
  private loggedIn$ = new BehaviorSubject<boolean>(!!localStorage.getItem(this.JWT_TOKEN));

  public isLoggedIn$ = this.loggedIn$.asObservable();

  doLoginUser(token: any): void {
    this.loggedIn$.next(true);
    localStorage.setItem(this.JWT_TOKEN, token.jwt);
  }

  doLogoutUser(): void {
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

  doLogoutAndRedirectToLogin() {
    this.logout();
    this.router.navigate(['/', 'login']);
  }
}

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (this.authService.getToken()) {
      request = this.addToken(request, this.authService.getToken());
    }

    return next.handle(request).pipe(
      catchError(error => {
        if (error.status === 401) {
          this.authService.doLogoutAndRedirectToLogin();
        }
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
