import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DeviceService, DeviceWithdrawalRequest, PokerFlowDevice } from 'src/app/services/device/device.service';
import { PoolService, PoolTransaction, TransactionType } from 'src/app/services/pool/pool.service';

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
    private authService: AuthService,
    private dialogRef: MatDialogRef<BuyInModalComponent>,
    private deviceService: DeviceService,
    private formBuilder: FormBuilder,
    private poolService: PoolService
  ) {
    this.deviceConnection = data;
    this.form = this.formBuilder.group({
      formField: ['0', this.buyInValidator.bind(this)]
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
    const deviceWithdrawalRequest: DeviceWithdrawalRequest = {
      amount: this.buyInValue,
      denominations: []
    };
    this.dialogRef.close(deviceWithdrawalRequest);
  }

  cancelBuyIn() {
    this.dialogRef.close(null);
  }
}
