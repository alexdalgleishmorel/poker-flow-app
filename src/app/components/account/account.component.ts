import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { catchError, map, debounceTime, of } from 'rxjs';

import { getPrefersDark, toggleDarkTheme } from 'src/app/app.component';
import { AuthService, Profile } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  public profile?: Profile;
  public darkModeFormControl: FormControl;
  public emailValidationInFlight: boolean = false;

  public firstNameFormControl: FormControl = new FormControl('', [Validators.required]);
  public lastNameFormControl: FormControl = new FormControl('', [Validators.required]);
  public emailFormControl: FormControl = new FormControl('', [Validators.required, Validators.email]);
  public canEditProfileInformation: boolean = false;

  public formGroup: FormGroup = new FormGroup({
    firstNameFormControl: this.firstNameFormControl,
    lastNameFormControl: this.lastNameFormControl,
    emailFormControl: this.emailFormControl
  });

  constructor(private authService: AuthService, private toastController: ToastController) {
    this.darkModeFormControl = new FormControl(getPrefersDark());
    this.darkModeFormControl.valueChanges.subscribe(prefersDark => {
      toggleDarkTheme(!!prefersDark);
    });
  }

  ngOnInit() {
    if (!this.profile) {
      this.initProfileInformation();
    }
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

  ionViewWillEnter() {
    this.initProfileInformation();
  }

  logout() {
    this.authService.logoutAndRedirectToLogin();
  }

  initProfileInformation() {
    this.profile = this.authService.getCurrentUser();
    this.firstNameFormControl.setValue(this.profile?.firstName);
    this.lastNameFormControl.setValue(this.profile?.lastName);
    this.emailFormControl.setValue(this.profile?.email);
    this.formGroup.markAsPristine();
    this.formGroup.disable();
    this.canEditProfileInformation = false;
  }

  canSaveProfileInformation(): boolean {
    const newValues = (this.firstNameFormControl.value !== this.profile?.firstName) ||
      (this.lastNameFormControl.value !== this.profile?.lastName) ||
      (this.emailFormControl.value !== this.profile?.email);
    return this.formGroup.valid && !this.formGroup.pristine && !this.emailValidationInFlight && newValues;
  }

  saveProfileInformation() {
    this.authService.updateProfileInformation({
      firstName: this.firstNameFormControl.value,
      lastName: this.lastNameFormControl.value,
      email: this.emailFormControl.value
    }).subscribe({
      next: async () => {
        this.initProfileInformation();
        const toast = await this.toastController.create({
          message: `Profile Updated`,
          cssClass: 'centered-text',
          duration: 1000,
          position: 'top',
          color: 'success'
        });
        await toast.present();
      },
      error: ()  => {
        this.initProfileInformation();
      }
    });
  }

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

  verifyEmailUniqueness(email: string) {
    if (email === this.profile?.email) {
      this.emailFormControl.setErrors(null);
      this.emailValidationInFlight = false;
      return;
    }

    this.authService.verifyEmailUniqueness(email).pipe(
      map(unique => {
        this.emailValidationInFlight = false;
        unique ? this.emailFormControl.setErrors(null) : this.emailFormControl.setErrors({ 'duplicate': true });
      }),
      catchError(() => {
        this.emailFormControl.setErrors({ 'failed': true })
        return of();
      })
    ).subscribe(() => {
      this.emailValidationInFlight = false;
    });
  }

  enableEdit() {
    this.canEditProfileInformation = true;
    this.formGroup.enable();
  }

  cancelEdit() {
    this.initProfileInformation();
  }
}
