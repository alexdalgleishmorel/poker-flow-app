import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';

import { ApiService } from '../api/api.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  /**
   * Intercepts outgoing HTTP requests and adds an authorization token to the headers
   * 
   * @param {HttpRequest<any>} request The outgoing HTTP request
   * @param {HttpHandler} next The handler to pass the request onto when done
   * 
   * @returns {Observable<HttpEvent<any>>}
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = this.addToken(request, this.authService.getToken());
    return next.handle(request).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  /**
   * Adds the provided token to the given HTTP request
   * 
   * @param {HttpRequest<any>} request The outgoing HTTP request
   * @param {string} token The token to add to the request headers
   * 
   * @returns {HttpRequest<any>}
   */
  private addToken(request: HttpRequest<any>, token: string | null): HttpRequest<any> {
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

  constructor(private apiService: ApiService, private router: Router) {}

  /**
   * Updates the loggedIn observable, and adds the jwt value provided in the token to local storage
   * 
   * @param {any} token The token containing the jwt value
   */
  recordLogin(token: any): void {
    this.loggedIn$.next(true);
    localStorage.setItem(this.JWT_TOKEN, token.jwt);
  }

  /**
   * Updates the loggedIn observable, and removes the jwt value from local storage
   */
  recordLogout(): void {
    this.loggedIn$.next(false);
    localStorage.removeItem(this.JWT_TOKEN);
  }

  /**
   * @returns {Profile|undefined} The current user profile if it exists, otherwise undefined
   */
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

  /**
   * @returns {string} The JWT token stored in memory
   */
  getToken = (): string => localStorage.getItem(this.JWT_TOKEN) || '';

  /**
   * Attempts to register a profile given the provided user information
   * 
   * @param {SignUpRequest} user The user data to use for profile creation
   * 
   * @returns {Profile<void>}
   */
  signup = (user: SignUpRequest): Promise<void> => this.apiService.post(`/signup`, user);

  /**
   * Attempts to login the user given the provided credentials
   * 
   * @param {LoginRequest} loginRequest The user credentials for the login attempt
   * 
   * @returns {Promise<Profile>}
   */
  async login(loginRequest: LoginRequest): Promise<Profile> {
    const data = await this.apiService.post(`/login`, loginRequest);
    this.recordLogin(data);
    return data;
  }

  /**
   * Logs the user out, then redirects them to the login page
   */
  logoutAndRedirectToLogin = () => {
    this.recordLogout();
    this.router.navigate(['/login']);
  };

  /**
   * Determines whether the given email is already registered or not
   * 
   * @param {string} email The email to verify 
   * 
   * @returns {boolean} Whether the email is already registered
   */
  verifyEmailUniqueness = (email: string): Promise<boolean> => this.apiService.post(`/verifyUniqueEmail`, { email: email });

  /**
   * Updates the user profile with the given profile information
   * 
   * @param {Profile} profile The profile information to use for the update
   * 
   * @returns {Promise<any>}
   */
  async updateProfileInformation(profile: Profile): Promise<any> {
    const id = this.getCurrentUser()?.id;

    if (!id) { return Promise.reject(); }

    const data = await this.apiService.post(`/updateUser`, profile);
    this.recordLogin(data);
    return data;
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
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}
