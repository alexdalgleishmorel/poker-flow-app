import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PokerFlowDevice } from 'src/app/services/device/device.service';

@Component({
  selector: 'app-chip-deposit-modal',
  templateUrl: './chip-deposit-modal.component.html',
  styleUrls: ['./chip-deposit-modal.component.scss']
})
export class ChipDepositModalComponent {
  public denominations = this.data.denominations;
  public depositInProgress: boolean;
  private device: PokerFlowDevice = this.data.device;
  
  public receipt: number = 0;

  constructor(
    public dialogRef: MatDialogRef<ChipDepositModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.depositInProgress = true;
    this.device.startChipDeposit();
  }

  completeDeposit() {
    this.depositInProgress = false;
    this.device.completeChipDeposit();
    this.dialogRef.close(50);
  }

  cancelDeposit() {
    this.dialogRef.close(null);
  }
}
