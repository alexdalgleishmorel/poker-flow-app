import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from "@angular/platform-browser";
import { MatIconRegistry } from "@angular/material/icon";
import { Router } from '@angular/router';
import { AuthService, LoginRequest, SignUpRequest } from 'src/app/services/auth/auth.service';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  public passwordFormControl = new FormControl('', [Validators.required]);
  public firstNameFormControl = new FormControl('', [Validators.required]);
  public lastNameFormControl = new FormControl('', [Validators.required]);
  public emailRegistrationFormControl = new FormControl('', [Validators.required, Validators.email]);
  public firstPasswordFormControl = new FormControl('', [Validators.required]);
  public secondPasswordFormControl = new FormControl('', [Validators.required]);

  public loginFormGroup: FormGroup = this._formBuilder.group({
    email: this.emailFormControl,
    password: this.passwordFormControl
  });
  public signUpFormGroup: FormGroup = this._formBuilder.group({
    email: this.emailRegistrationFormControl,
    firstName: this.firstNameFormControl,
    lastName: this.lastNameFormControl,
    firstPassword: this.firstPasswordFormControl,
    secondPassword: this.secondPasswordFormControl
  });

  public loginErrorMessages: ErrorMessages = new ErrorMessages();
  public signUpErrorMessages: ErrorMessages = new ErrorMessages();
  public hidePassword: boolean = true;

  constructor (
    private authService: AuthService,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry,
    private router: Router,
    private _formBuilder: FormBuilder
  ) {
    this.matIconRegistry.addSvgIcon(
      'google',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/google-icon.svg')
    );
  }

  ngOnInit(): void {
  }

  login() {
    this.loginErrorMessages.reset();

    const loginRequest: LoginRequest = {
      email: this.emailFormControl.value!,
      password: this.passwordFormControl.value!
    };

    this.requestLogin(loginRequest);
  }

  signUp() {
    this.signUpErrorMessages.reset();

    const signUpRequest: SignUpRequest = {
      email: this.emailRegistrationFormControl.value!,
      firstName: this.firstNameFormControl.value!,
      lastName: this.lastNameFormControl.value!,
      password: this.firstPasswordFormControl.value!
    };

    this.authService.signup(signUpRequest)
      .pipe(
        catchError((error) => {
          if (error.status === 401) {
            this.signUpErrorMessages.setMessage(LoginErrorType.emailAlreadyExistsError);
            this.emailRegistrationFormControl.setErrors({'email': true});
          } else {
            this.signUpErrorMessages.setMessage(LoginErrorType.genericError);
          }
          return throwError(() => new Error(error));
        })
      )
      .subscribe(() => {
        this.requestLogin(
          {
            email: signUpRequest.email,
            password: signUpRequest.password
          }
        );
      });
  }

  requestLogin(loginRequest: LoginRequest) {
    this.authService.login(loginRequest)
      .pipe(
        catchError((error) => {
          if (error.status === 404) {
            this.loginErrorMessages.setMessage(LoginErrorType.emailNotFoundError);
          }
          else if (error.status === 401) {
            this.loginErrorMessages.setMessage(LoginErrorType.invalidCredentialError);
          } else {
            this.loginErrorMessages.setMessage(LoginErrorType.genericError);
          }
          return throwError(() => new Error(error));
        })
      )
      .subscribe(() => {
        this.router.navigate(['/', 'hub']);
      });
  }

  comparePasswords() {
    (this.firstPasswordFormControl.value !== this.secondPasswordFormControl.value) ? this.secondPasswordFormControl.setErrors({'mismatch': true}) : this.secondPasswordFormControl.setErrors(null);
  }
}

class ErrorMessages {
  private currentMessage: string = '';

  private emailAlreadyExistsError: string = 'The email you provided is already connected to an account.';
  private emailNotFoundError: string = 'The email you provided is not connected to an account. Sign-up with this email first to continue.';
  private genericError: string = 'Something went wrong when trying to complete your request. Please try again.';
  private invalidCredentialError: string = 'The credentials you provided are invalid. Please try again.';

  setMessage(errorType: LoginErrorType) {
    if (errorType === LoginErrorType.emailAlreadyExistsError) this.currentMessage = this.emailAlreadyExistsError;
    if (errorType === LoginErrorType.emailNotFoundError) this.currentMessage = this.emailNotFoundError;
    if (errorType === LoginErrorType.genericError) this.currentMessage = this.genericError;
    if (errorType === LoginErrorType.invalidCredentialError) this.currentMessage = this.invalidCredentialError;
  }

  getMessage() {
    return this.currentMessage;
  }

  reset() {
    this.currentMessage = '';
  }
}

enum LoginErrorType {
  emailAlreadyExistsError = 'emailAlreadyExistsError',
  emailNotFoundError = 'emailNotFoundError',
  genericError = 'genericError',
  invalidCredentialError = 'invalidCredentialError'
}
