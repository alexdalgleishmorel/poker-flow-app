import { Component, Inject, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DeviceService } from 'src/app/services/device/device.service';

@Component({
  selector: 'app-connect-device-modal',
  templateUrl: './connect-device-modal.component.html',
  styleUrls: ['./connect-device-modal.component.scss']
})
export class ConnectDeviceModalComponent implements OnInit {
  public spinnerColor: ThemePalette = 'accent';
  public searchingForDevices: boolean = true;
  public devicesFound: boolean = false;
  public results: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<ConnectDeviceModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private deviceService: DeviceService,
  ) {}

  ngOnInit(): void {
    this.dialogRef.afterOpened().subscribe(() => {
      this.searchForDevices();
    });
  }

  cancelSearch() {
    this.dialogRef.close(null);
  }

  searchForDevices() {
    this.searchingForDevices = true;
      this.devicesFound = false;
      this.deviceService.findDevices().then((searchResult) => {
        this.searchingForDevices = false;
        if (searchResult.length === 0) {
          this.devicesFound = false;
        } else {
          this.devicesFound = true;
          this.results = searchResult;
        }
      });
  }

  selectDevice(device: any) {
    this.dialogRef.close(device);
  }
}
