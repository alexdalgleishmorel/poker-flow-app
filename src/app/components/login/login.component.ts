import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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

  public emailNotFoundError: boolean = false;
  public invalidCredentialError: boolean = false;
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
    if (this.signUpFormGroup.invalid) {
      return;
    }

    const loginRequest: LoginRequest = {
      email: 'something',
      password: 'something'
    };

    this.authService.login(loginRequest)
      .pipe(
        catchError((error) => {
          if (error.status === 404) {
            this.emailNotFoundError = true;
          }
          if (error.status === 401) {
            this.invalidCredentialError = true;
          }
          return throwError(() => new Error(error));
        })
      )
      .subscribe(() => {
        this.emailNotFoundError, this.invalidCredentialError = false, false;
        this.router.navigate(['/', 'hub'])
      });
  }

  signUp() {
    /*
    if (!this.emailRegistrationInput) return;
    if (!this.firstNameRegistrationInput) return;
    if (!this.lastNameRegistrationInput) return;
    if (!this.passwordRegistrationInput1) return;

    if (this.passwordRegistrationInput1 !== this.passwordRegistrationInput2) return;

    const signUpRequest: SignUpRequest = {
      email: this.emailRegistrationInput,
      firstName: this.firstNameRegistrationInput,
      lastName: this.lastNameRegistrationInput,
      password: this.passwordRegistrationInput1
    };

    this.authService.signup(signUpRequest)
      .subscribe(() => this.router.navigate(['/', 'hub']));
      */
  }
}
