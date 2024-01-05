import { Component } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { ErrorMessages, requestLogin } from '../login.component';
import { AuthService, SignUpRequest } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.scss'],
})
export class SignupFormComponent {
  public emailRegistrationFormControl = new FormControl('', [Validators.required, Validators.email]);
  public firstNameFormControl = new FormControl('', [Validators.required]);
  public firstPasswordFormControl = new FormControl('', [Validators.required]);
  public lastNameFormControl = new FormControl('', [Validators.required]);
  public secondPasswordFormControl = new FormControl('', [Validators.required]);
  public signUpFormGroup: FormGroup = this._formBuilder.group({
    email: this.emailRegistrationFormControl,
    firstName: this.firstNameFormControl,
    lastName: this.lastNameFormControl,
    firstPassword: this.firstPasswordFormControl,
    secondPassword: this.secondPasswordFormControl
  });

  public signUpErrorMessages: ErrorMessages = new ErrorMessages();

  constructor (private authService: AuthService, private router: Router, private _formBuilder: FormBuilder) {}

  /**
   * Attempts a user signup and login based on the information provided in the form. Navigates to home page if successful.
   */
  signUp() {
    if (!this.emailRegistrationFormControl.value || 
      !this.firstNameFormControl.value || 
      !this.lastNameFormControl.value || 
      !this.firstPasswordFormControl.value || 
      !this.secondPasswordFormControl.value) { 
        return; 
    }

    this.signUpErrorMessages.reset();

    const signUpRequest: SignUpRequest = {
      email: this.emailRegistrationFormControl.value,
      firstName: this.firstNameFormControl.value,
      lastName: this.lastNameFormControl.value,
      password: this.firstPasswordFormControl.value
    };

    this.authService.signup(signUpRequest)
      .then(() => {
        requestLogin({email: signUpRequest.email, password: signUpRequest.password}, this.authService)
          .then(() => {
            this.signUpFormGroup.reset();
            this.router.navigate(['']);
          })
          .catch(error => {
            this.signUpErrorMessages.setMessage(error.message);
          });
      })
      .catch((error) => {
        if (error.status === 401) {
          this.signUpErrorMessages.setMessage(this.signUpErrorMessages.emailAlreadyExistsError);
          this.emailRegistrationFormControl.setErrors({'email': true});
        } else {
          this.signUpErrorMessages.setMessage(this.signUpErrorMessages.genericError);
        }
      })
  }

  /**
   * Compares first and second password values to ensure they match
   */
  comparePasswords() {
    (this.firstPasswordFormControl.value !== this.secondPasswordFormControl.value) ? this.secondPasswordFormControl.setErrors({'mismatch': true}) : this.secondPasswordFormControl.setErrors(null);
  }
}
