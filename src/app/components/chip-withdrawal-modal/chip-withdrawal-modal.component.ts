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
  public withdrawalRequest: DeviceWithdrawalRequest;
  private device: PokerFlowDevice;
  private totalChipsRequested: number = 0;

  constructor(
    public dialogRef: MatDialogRef<ChipWithdrawalModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private deviceService: DeviceService
  ) {
    this.device = data.device;
    this.withdrawalRequest = data.withdrawal_request;
    this.withdrawalRequest.denominations.forEach((requestedChips: number) => this.totalChipsRequested += requestedChips);
    this.withdrawalInProgress = true;
  }

  ngOnInit(): void {
    this.deviceService.withdrawChips(this.device, this.withdrawalRequest);
    this.device.withdrawalRequestStatus?.subscribe((withdrawalRequestStatus: number[]) => {
      console.log(withdrawalRequestStatus);
      if (JSON.stringify(withdrawalRequestStatus) === JSON.stringify(this.withdrawalRequest.denominations)) {
        this.withdrawalInProgress = false;
        this.dialogRef.close();
      }
    });
  }

  getChipWithdrawalProgress() {
    let totalChipsWithdrawn: number = 0;
    /*
    this.device.withdrawalRequestStatus?.getValue().forEach(
      (chipsWithdrawnFromSlot: number) => totalChipsWithdrawn += chipsWithdrawnFromSlot
    );
    return (totalChipsWithdrawn/this.totalChipsRequested)*100;
    */
   return 50;
  }
}
