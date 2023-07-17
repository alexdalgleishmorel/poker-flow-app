import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeviceService, DeviceWithdrawalRequest, PokerFlowDevice } from 'src/app/services/device/device.service';

@Component({
  selector: 'app-chip-withdrawal-modal',
  templateUrl: './chip-withdrawal-modal.component.html',
  styleUrls: ['./chip-withdrawal-modal.component.scss']
})
export class ChipWithdrawalModalComponent implements OnInit {
  public denominations: number[] = this.data.denominations;
  public withdrawalInProgress: boolean;
  public withdrawalRequestStatus: number[];

  private device: PokerFlowDevice;
  private totalChipsRequested: number = 0;
  private originalRequestDenominations: number[] = [...this.data.withdrawal_request.denominations];

  constructor(
    public dialogRef: MatDialogRef<ChipWithdrawalModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private deviceService: DeviceService
  ) {
    this.device = data.device;
    this.withdrawalRequestStatus = data.withdrawal_request.denominations;
    this.originalRequestDenominations.forEach((requestedChips: number) => this.totalChipsRequested += requestedChips);
    this.withdrawalInProgress = true;
  }

  ngOnInit(): void {
    this.deviceService.withdrawChips(this.device, this.data.withdrawal_request);
    this.device.withdrawalRequestStatus?.subscribe((withdrawalRequestStatus: number[]) => {
      if (!withdrawalRequestStatus.length) return;
      for (let i = 0; i < this.originalRequestDenominations.length; i ++) {
        this.withdrawalRequestStatus[i] = this.originalRequestDenominations[i] - withdrawalRequestStatus[i];
      }
      if (JSON.stringify(this.withdrawalRequestStatus) === JSON.stringify(this.originalRequestDenominations)) {
        this.withdrawalInProgress = false;
        this.dialogRef.close();
      }
    });
  }

  getChipWithdrawalProgress() {
    if (!this.withdrawalRequestStatus.length || !this.device.withdrawalRequestStatus?.getValue().length) return 0;

    let totalChipsRemainingToWithdraw: number = 0;
    this.device.withdrawalRequestStatus?.getValue().forEach(
      (chipsRemainingToWithdrawFromSlot: number) => totalChipsRemainingToWithdraw += chipsRemainingToWithdrawFromSlot
    );
    const totalChipsWithdrawn = this.totalChipsRequested - totalChipsRemainingToWithdraw;
    return (totalChipsWithdrawn/this.totalChipsRequested)*100;
  }
}
