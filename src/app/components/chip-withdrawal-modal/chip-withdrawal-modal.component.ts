import { Component, Inject, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeviceService, DeviceWithdrawalRequest, PokerFlowDevice } from 'src/app/services/device/device.service';

@Component({
  selector: 'app-chip-withdrawal-modal',
  templateUrl: './chip-withdrawal-modal.component.html',
  styleUrls: ['./chip-withdrawal-modal.component.scss']
})
export class ChipWithdrawalModalComponent implements OnInit {
  public withdrawalInProgress: boolean;
  public withdrawalRequest: DeviceWithdrawalRequest;
  public spinnerColor: ThemePalette = 'accent';
  private device: PokerFlowDevice;

  constructor(
    public dialogRef: MatDialogRef<ChipWithdrawalModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private deviceService: DeviceService
  ) {
    this.device = data.device_connection;
    this.withdrawalRequest = data.withdrawal_request;
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
}
