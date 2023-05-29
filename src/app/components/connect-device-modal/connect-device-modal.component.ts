import { Component, Inject, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DeviceService, PokerFlowDevice } from 'src/app/services/device/device.service';

@Component({
  selector: 'app-connect-device-modal',
  templateUrl: './connect-device-modal.component.html',
  styleUrls: ['./connect-device-modal.component.scss']
})
export class ConnectDeviceModalComponent implements OnInit {
  public cancelEnabled: boolean;
  public searchMessage: string;
  public spinnerColor: ThemePalette = 'accent';
  private device: PokerFlowDevice;
  
  constructor(
    public dialogRef: MatDialogRef<ConnectDeviceModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private deviceService: DeviceService,
  ) {
    this.device = data.device;
    this.searchMessage  = data.searchMessage;
    this.cancelEnabled = data.cancelEnabled;
  }

  ngOnInit(): void {
    this.dialogRef.afterOpened().subscribe(() => {
      this.searchForDevices();
    });
  }

  searchForDevices() {
    this.deviceService.connectToDevice(this.device).then((connection) => {
      this.dialogRef.close(connection);
    });
  }

  cancelSearch() {
    this.dialogRef.close(null);
  }
}
