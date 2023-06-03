import { Component, Inject } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeviceService } from 'src/app/services/device/device.service';

@Component({
  selector: 'app-chip-deposit-modal',
  templateUrl: './chip-deposit-modal.component.html',
  styleUrls: ['./chip-deposit-modal.component.scss']
})
export class ChipDepositModalComponent {
  public depositInProgress: boolean;
  public receipt: number = 0;
  public spinnerColor: ThemePalette = 'accent';
  private deviceConnection: any;

  constructor(
    public dialogRef: MatDialogRef<ChipDepositModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private deviceService: DeviceService
  ) {
    this.deviceConnection = data;
    this.depositInProgress = true;
  }

  completeDeposit() {
    this.depositInProgress = false;
    this.receipt = 150;
  }

  receiptConfirmed() {
    this.dialogRef.close(this.receipt);
  }

  cancelDeposit() {
    this.dialogRef.close(null);
  }
}
