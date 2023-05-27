import { Component, Inject } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DeviceService } from 'src/app/services/device/device.service';

@Component({
  selector: 'app-connect-device-modal',
  templateUrl: './connect-device-modal.component.html',
  styleUrls: ['./connect-device-modal.component.scss']
})
export class ConnectDeviceModalComponent {
  public spinnerColor: ThemePalette = 'accent';
  private device: any;
  
  constructor(
    public dialogRef: MatDialogRef<ConnectDeviceModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private deviceService: DeviceService,
  ) {}

  cancelSearch() {
    this.dialogRef.close(null);
  }
}
