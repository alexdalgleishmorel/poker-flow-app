import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { catchError, map, debounceTime, of } from 'rxjs';

import { getPrefersDark, toggleDarkTheme } from 'src/app/app.component';
import { AuthService, Profile } from 'src/app/services/auth/auth.service';
import { PoolService } from 'src/app/services/pool/pool.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  public canEditProfileInformation: boolean = false;
  public darkModeFormControl: FormControl;
  public emailValidationInFlight: boolean = false;
  public profile?: Profile;

  public firstNameFormControl: FormControl = new FormControl('', [Validators.required]);
  public lastNameFormControl: FormControl = new FormControl('', [Validators.required]);
  public emailFormControl: FormControl = new FormControl('', [Validators.required, Validators.email]);
  public formGroup: FormGroup = new FormGroup({
    firstNameFormControl: this.firstNameFormControl,
    lastNameFormControl: this.lastNameFormControl,
    emailFormControl: this.emailFormControl
  });

  constructor(private authService: AuthService, private poolService: PoolService, private toastController: ToastController) {
    this.darkModeFormControl = new FormControl(getPrefersDark());
    this.subscribeToThemeChanges();
  }

  /**
   * Initializes profile information, subscribes to email changes
   */
  ngOnInit() {
    this.initProfileInformation();
    this.subscribeToEmailChanges();
  }

  /**
   * Toggles theme, updates theme subject to notify other components
   */
  subscribeToThemeChanges() {
    this.darkModeFormControl.valueChanges.subscribe(prefersDark => {
      toggleDarkTheme(!!prefersDark);
      this.poolService.colorThemeSubject.next(1);
    });
  }

  /**
   * Subscribes to email changes, validating the new email
   */
  subscribeToEmailChanges() {
    this.emailFormControl.valueChanges.subscribe(() => {
      if (this.emailFormControl.value !== this.profile?.email) {
        this.emailValidationInFlight = true;
      }
    });
    this.emailFormControl.valueChanges.pipe(debounceTime(2000)).subscribe(email => {
      if (email && !this.emailFormControl.hasError('email')) {
        this.verifyEmailUniqueness(email);
      }
    });
  }

  /**
   * Profile information is re-initialized when returning to the account page
   */
  ionViewWillEnter() {
    this.initProfileInformation();
  }

  /**
   * Logs the user out, and redirects them to the login page
   */
  logout() {
    this.authService.logoutAndRedirectToLogin();
  }

  /**
   * Initializes the profile information in a view-only mode
   */
  initProfileInformation() {
    this.profile = this.authService.getCurrentUser();
    this.firstNameFormControl.setValue(this.profile?.firstName);
    this.lastNameFormControl.setValue(this.profile?.lastName);
    this.emailFormControl.setValue(this.profile?.email);
    this.formGroup.markAsPristine();
    this.formGroup.disable();
    this.canEditProfileInformation = false;
  }

  /**
   * @returns {boolean} Whether the current profile information is new and is allowed to be saved
   */
  canSaveProfileInformation(): boolean {
    const newValues = (this.firstNameFormControl.value !== this.profile?.firstName) ||
      (this.lastNameFormControl.value !== this.profile?.lastName) ||
      (this.emailFormControl.value !== this.profile?.email);
    return this.formGroup.valid && !this.formGroup.pristine && !this.emailValidationInFlight && newValues;
  }

  /**
   * Saves the profile information, showing a success toast if successful. Resets account page to a view-only state.
   */
  saveProfileInformation() {
    const userID = this.authService.getCurrentUser()?.id;
    if (!userID) {
      return;
    }

    this.authService.updateProfileInformation({
      id: userID,
      firstName: this.firstNameFormControl.value,
      lastName: this.lastNameFormControl.value,
      email: this.emailFormControl.value
    }).then(async () => {
      const toast = await this.toastController.create({
        message: `Profile Updated`,
        cssClass: 'centered-text',
        duration: 1000,
        position: 'top',
        color: 'success'
      });
      await toast.present();
    }).finally(() => this.initProfileInformation());
  }

  /**
   * @returns {string} An error message corresponding to the most recent email validation
   */
  getEmailErrorMessage(): string {
    if (this.emailFormControl.getError('email')) {
      return 'Invalid email';
    }
    if (this.emailFormControl.getError('duplicate')) {
      return 'Email is already registered';
    }
    if (this.emailFormControl.getError('required')) {
      return 'Required';
    }
    return '';
  }

  /**
   * Verifies whether the given email is eligible for the user to use for their account
   * 
   * @param {string} email The email to verify
   */
  verifyEmailUniqueness(email: string) {
    if (email === this.profile?.email) {
      this.emailFormControl.setErrors(null);
      this.emailValidationInFlight = false;
      return;
    }

    this.authService.verifyEmailUniqueness(email)
      .catch(() => {
        this.emailFormControl.setErrors({ 'failed': true });
        return of();
      })
      .then(unique => {
        this.emailValidationInFlight = false;
        unique ? this.emailFormControl.setErrors(null) : this.emailFormControl.setErrors({ 'duplicate': true });
      })
      .finally(() => this.emailValidationInFlight = false);
  }

  /**
   * Allows the account information to be editable
   */
  enableEdit() {
    this.canEditProfileInformation = true;
    this.formGroup.enable();
  }

  /**
   * Returns the account information to a view-only state
   */
  cancelEdit() {
    this.initProfileInformation();
  }
}
