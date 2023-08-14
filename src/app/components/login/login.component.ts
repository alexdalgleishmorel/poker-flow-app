import { Component, OnInit } from '@angular/core';
import { AuthService, LoginRequest, SignUpRequest } from 'src/app/services/auth/auth.service';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {}

export function requestLogin(loginRequest: LoginRequest, authService: AuthService) {
  const loginErrorMessages: ErrorMessages = new ErrorMessages();
  return authService.login(loginRequest)
    .pipe(
      catchError((error) => {
        if (error.status === 404) {
          loginErrorMessages.setMessage(loginErrorMessages.emailNotFoundError);
        }
        else if (error.status === 401) {
          loginErrorMessages.setMessage(loginErrorMessages.invalidCredentialError);
        } else {
          loginErrorMessages.setMessage(loginErrorMessages.genericError);
        }
        return throwError(() => new Error(loginErrorMessages.getMessage()));
      })
    );
}

export class ErrorMessages {
  private currentMessage: string = '';

  public emailAlreadyExistsError: string = 'Invalid email/password.';
  public emailNotFoundError: string = 'Invalid email/password.';
  public genericError: string = 'Something went wrong, please try again later.';
  public invalidCredentialError: string = 'Invalid email/password.';

  setMessage(errorMessage: string) {
    this.currentMessage = errorMessage;
  }

  getMessage() {
    return this.currentMessage;
  }

  reset() {
    this.currentMessage = '';
  }
}

export enum LoginErrorType {
  emailAlreadyExistsError = 'emailAlreadyExistsError',
  emailNotFoundError = 'emailNotFoundError',
  genericError = 'genericError',
  invalidCredentialError = 'invalidCredentialError'
}
