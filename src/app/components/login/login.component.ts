import { Component } from '@angular/core';

import { AuthService, LoginRequest, Profile } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public currentForm: FormType = FormType.LOGIN;
  
  constructor() {}

  readonly LOGIN: FormType = FormType.LOGIN;
  readonly SIGNUP: FormType = FormType.SIGNUP;

  /**
   * Updates the form to the given formType
   * 
   * @param {FormType} formType The form type to update to
   */
  updateForm(formType: FormType) {
    this.currentForm = formType;
  }
}

/**
 * Performs a login requet based on the given data, using the given authService
 * 
 * @param {LoginRequest} loginRequest The login request data
 * @param {AuthService} authService The authService to use for the request
 * @returns {Observable<Profile>} A profile observable
 */
export async function requestLogin(loginRequest: LoginRequest, authService: AuthService): Promise<Profile> {
  const loginErrorMessages: ErrorMessages = new ErrorMessages();
  try {
    return await authService.login(loginRequest);
  } catch (error: any) {
    if (error.status === 404) {
      error.message = loginErrorMessages.emailNotFoundError;
    }
    else if (error.status === 401) {
      error.message = loginErrorMessages.invalidCredentialError;
    } else {
      error.message = loginErrorMessages.genericError;
    }
    return Promise.reject(error);
  }
}

/**
 * Handles error message logic for the login and signup form
 */
export class ErrorMessages {
  public emailAlreadyExistsError: string = 'Invalid email/password';
  public emailNotFoundError: string = 'Invalid email/password';
  public genericError: string = 'Something went wrong, please try again later';
  public invalidCredentialError: string = 'Invalid email/password';

  private currentMessage: string = '';

  /**
   * Sets the current error message to the given string
   * 
   * @param {string} errorMessage The error message to update to
   */
  setMessage(errorMessage: string) {
    this.currentMessage = errorMessage;
  }

  /**
   * @returns {string} The current error message
   */
  getMessage(): string {
    return this.currentMessage;
  }

  /**
   * Sets the current error message to an empty string
   */
  reset() {
    this.currentMessage = '';
  }
}

export enum FormType {
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP'
}
