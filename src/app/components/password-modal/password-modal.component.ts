import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-password-modal',
  templateUrl: './password-modal.component.html',
  styleUrls: ['./password-modal.component.scss']
})
export class PasswordModalComponent {
  public form: FormGroup;
  public hidePassword: boolean = true;
  public passwordFormControl: FormControl = new FormControl('', [Validators.required]);

  constructor(
    public dialogRef: MatDialogRef<PasswordModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder
  ) {
    this.form = this._formBuilder.group({
      password: this.passwordFormControl
    });
  }

  confirmPassword() {
    this.dialogRef.close(this.passwordFormControl.value);
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
