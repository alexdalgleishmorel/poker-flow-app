import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DeviceService } from 'src/app/services/device/device.service';

@Component({
  selector: 'app-device-connect-modal',
  templateUrl: './device-connect-modal.component.html',
  styleUrls: ['./device-connect-modal.component.scss'],
})
export class DeviceConnectModalComponent {

  constructor(private deviceService: DeviceService, private modalCtrl: ModalController) {}

  cancel() {
    this.modalCtrl.dismiss();
    this.deviceService.cancelDeviceScan();
  }
}
