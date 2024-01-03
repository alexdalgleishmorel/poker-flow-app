import { Component } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { ErrorMessages, requestLogin } from '../login.component';
import { AuthService, LoginRequest } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent {
  public emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  public passwordFormControl = new FormControl('', [Validators.required]);
  public loginFormGroup: FormGroup = this._formBuilder.group({
    email: this.emailFormControl,
    password: this.passwordFormControl
  });

  public hidePassword: boolean = true;
  public loginErrorMessages: ErrorMessages = new ErrorMessages();

  constructor (private authService: AuthService, private router: Router, private _formBuilder: FormBuilder) {}

  /**
   * Attempts a user login based on the username and password contained in the form
   */
  login() {
    if (!this.emailFormControl.value || !this.passwordFormControl.value) {
      return;
    }

    this.loginErrorMessages.reset();

    const loginRequest: LoginRequest = {
      email: this.emailFormControl.value,
      password: this.passwordFormControl.value
    };

    requestLogin(loginRequest, this.authService)
      .pipe(
        catchError((error) => {
          this.loginErrorMessages.setMessage(error.message);
          return throwError(() => new Error(error.message));
        })
      )
      .subscribe(() => {
        this.router.navigate(['']);
      });
  }
}
