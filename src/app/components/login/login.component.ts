import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";
import { MatIconRegistry } from "@angular/material/icon";
import { Router } from '@angular/router';
import { AuthService, LoginRequest, SignUpRequest } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public emailInput?: string;
  public passwordInput?: string;
  public firstNameRegistrationInput?: string;
  public lastNameRegistrationInput?: string;
  public emailRegistrationInput?: string;
  public passwordRegistrationInput1?: string;
  public passwordRegistrationInput2?: string;

  public hidePassword: boolean = true;

  constructor (
    private authService: AuthService,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry,
    private router: Router
  ) {
    this.matIconRegistry.addSvgIcon(
      'google',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/google-icon.svg')
    );
  }

  ngOnInit(): void {
  }

  login() {
    if (!this.emailInput || !this.passwordInput) return;

    const loginRequest: LoginRequest = {
      email: this.emailInput,
      password: this.passwordInput
    };

    this.authService.login(loginRequest)
      .subscribe(() => this.router.navigate(['/', 'hub']));
  }

  signUp() {
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
  }
}
