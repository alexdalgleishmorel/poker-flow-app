import { Component } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { catchError, throwError } from 'rxjs';
import { AuthService, SignUpRequest } from 'src/app/services/auth/auth.service';
import { ErrorMessages, LoginErrorType, requestLogin } from '../login/login.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.scss'],
})
export class SignupFormComponent {

  public firstNameFormControl = new FormControl('', [Validators.required]);
  public lastNameFormControl = new FormControl('', [Validators.required]);
  public emailRegistrationFormControl = new FormControl('', [Validators.required, Validators.email]);
  public firstPasswordFormControl = new FormControl('', [Validators.required]);
  public secondPasswordFormControl = new FormControl('', [Validators.required]);

  public signUpFormGroup: FormGroup = this._formBuilder.group({
    email: this.emailRegistrationFormControl,
    firstName: this.firstNameFormControl,
    lastName: this.lastNameFormControl,
    firstPassword: this.firstPasswordFormControl,
    secondPassword: this.secondPasswordFormControl
  });

  public signUpErrorMessages: ErrorMessages = new ErrorMessages();

  constructor (
    private authService: AuthService,
    private router: Router,
    private _formBuilder: FormBuilder
  ) {}

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
        requestLogin(
          {
            email: signUpRequest.email,
            password: signUpRequest.password
          },
          this.authService
        )
          .pipe(
            catchError((error) => {
              this.signUpErrorMessages.setMessage(error.message);
              return throwError(() => new Error(error.message));
            })
          )
          .subscribe(() => {
            this.router.navigate(['']);
          });
      });
  }

  comparePasswords() {
    (this.firstPasswordFormControl.value !== this.secondPasswordFormControl.value) ? this.secondPasswordFormControl.setErrors({'mismatch': true}) : this.secondPasswordFormControl.setErrors(null);
  }
}
