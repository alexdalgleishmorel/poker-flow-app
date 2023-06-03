import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DeviceService, DeviceWithdrawalRequest, PokerFlowDevice } from 'src/app/services/device/device.service';

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
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<BuyInModalComponent>,
    private deviceService: DeviceService,
    private formBuilder: FormBuilder
  ) {
    this.deviceConnection = data;
    this.form = this.formBuilder.group({
      formField: ['', this.buyInValidator.bind(this)]
  });
  }

  private buyInValidator(control: FormControl): void {
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
    const withdrawalRequest: DeviceWithdrawalRequest = {
      amount: this.buyInValue,
      denominations: []
    };
    this.dialogRef.close(withdrawalRequest);
  }

  cancelBuyIn() {
    this.dialogRef.close(null);
  }
}
