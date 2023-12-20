import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AuthService, LoginRequest } from 'src/app/services/auth/auth.service';
import { ErrorMessages, requestLogin } from '../login.component';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent  implements OnInit {

  public emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  public passwordFormControl = new FormControl('', [Validators.required]);

  public loginFormGroup: FormGroup = this._formBuilder.group({
    email: this.emailFormControl,
    password: this.passwordFormControl
  });

  public loginErrorMessages: ErrorMessages = new ErrorMessages();
  public hidePassword: boolean = true;

  constructor (
    private authService: AuthService,
    private router: Router,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
  }

  login() {
    this.loginErrorMessages.reset();

    const loginRequest: LoginRequest = {
      email: this.emailFormControl.value!,
      password: this.passwordFormControl.value!
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
