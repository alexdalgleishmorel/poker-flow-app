import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DeviceService, PokerFlowDevice } from 'src/app/services/device/device.service';

@Component({
  selector: 'app-buy-in-modal',
  templateUrl: './buy-in-modal.component.html',
  styleUrls: ['./buy-in-modal.component.scss']
})
export class BuyInModalComponent {
  public form: FormGroup;
  public validBuyIn: boolean = false;
  public customError: boolean = false;

  private buyInValue: number = 0;
  private deviceConnection: any;
  
  constructor(
    public dialogRef: MatDialogRef<BuyInModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PokerFlowDevice,
    private deviceService: DeviceService,
    private formBuilder: FormBuilder
  ) {
    this.deviceConnection = data;
    this.form = this.formBuilder.group({
      formField: ['', this.customValidator.bind(this)]
  });
  }

  private customValidator(control: FormControl): void {
    if (control.value === 69) {
      this.validBuyIn = true;
      this.customError = false;
    } else {
      this.validBuyIn = false;
      this.customError = true;
    }

    if (this.validBuyIn) {
      this.buyInValue = control.value;
    }
  }

  confirmBuyIn() {
    this.dialogRef.close(this.buyInValue);
  }

  cancelBuyIn() {
    this.dialogRef.close(0);
  }
}
