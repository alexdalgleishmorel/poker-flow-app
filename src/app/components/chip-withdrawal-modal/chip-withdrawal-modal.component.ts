import { Component, Inject, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeviceService, DeviceWithdrawalRequest } from 'src/app/services/device/device.service';

@Component({
  selector: 'app-chip-withdrawal-modal',
  templateUrl: './chip-withdrawal-modal.component.html',
  styleUrls: ['./chip-withdrawal-modal.component.scss']
})
export class ChipWithdrawalModalComponent implements OnInit {
  public withdrawalInProgress: boolean;
  public withdrawalRequest: DeviceWithdrawalRequest;
  public spinnerColor: ThemePalette = 'accent';
  private deviceConnection: any;

  constructor(
    public dialogRef: MatDialogRef<ChipWithdrawalModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private deviceService: DeviceService
  ) {
    this.deviceConnection = data.device_connection;
    this.withdrawalRequest = data.withdrawal_request;
    this.withdrawalInProgress = true;
  }

  ngOnInit(): void {
    this.deviceService.withdrawChips(this.deviceConnection, this.withdrawalRequest).then((response: any) => {
      if (response) {
        this.withdrawalInProgress = false;
        this.dialogRef.close();
      }
    });
  }
}
