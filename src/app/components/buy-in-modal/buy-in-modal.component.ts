import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DeviceService, PokerFlowDevice } from 'src/app/services/device/device.service';

@Component({
  selector: 'app-buy-in-modal',
  templateUrl: './buy-in-modal.component.html',
  styleUrls: ['./buy-in-modal.component.scss']
})
export class BuyInModalComponent {
  private deviceConnection: any;
  
  constructor(
    public dialogRef: MatDialogRef<BuyInModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PokerFlowDevice,
    private deviceService: DeviceService,
  ) {
    this.deviceConnection = data;
  }
}
