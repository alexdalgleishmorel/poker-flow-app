import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-password-modal',
  templateUrl: './password-modal.component.html',
  styleUrls: ['./password-modal.component.scss']
})
export class PasswordModalComponent {
  @Input() retry: boolean = false;
  public form: FormGroup;
  public hidePassword: boolean = true;
  public passwordFormControl: FormControl = new FormControl('', [Validators.required]);

  constructor(
    private _formBuilder: FormBuilder,
    private modalControl: ModalController
  ) {
    this.form = this._formBuilder.group({
      password: this.passwordFormControl
    });
  }

  confirmPassword() {
    this.modalControl.dismiss(this.passwordFormControl.value);
  }

  cancel() {
    this.modalControl.dismiss(null);
  }
}
