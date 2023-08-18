import { Injectable } from '@angular/core';
import { BLE } from '@awesome-cordova-plugins/ble/ngx';
import { 
  DEPOSIT_SERVICE_ID, 
  DEPOSIT_SERVICE_PUBLISH_ID, 
  DEPOSIT_SERVICE_SUBSCRIBE_ID, 
  DEVICE_STATUS_SERVICE_ID, 
  DEVICE_STATUS_SERVICE_PUBLISH_ID, 
  DEVICE_STATUS_SERVICE_SUBSCRIBE_ID, 
  WITHDRAWAL_SERVICE_ID, 
  WITHDRAWAL_SERVICE_PUBLISH_ID, 
  WITHDRAWAL_SERVICE_SUBSCRIBE_ID } from '@constants';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { DeviceConnectModalComponent } from 'src/app/components/common/device-connect-modal/device-connect-modal.component';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  public isConnected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public depositRequestStatus: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
  public withdrawalRequestStatus: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);

  public deviceStatus: BehaviorSubject<DeviceStatus> = new BehaviorSubject<DeviceStatus>(
    {id: 0, inventory: [], slots: 0}
  );

  private deviceUUID: string = '';

  constructor(
    private ble: BLE,
    private modalCtrl: ModalController
  ) { 
    ble.isEnabled().then(() => {}); 
  }

  async withdrawChips(deviceWithdrawalRequest: DeviceWithdrawalRequest) {
    this.beforeDeviceConnection();

    this.ble.startScan([DEVICE_STATUS_SERVICE_ID]).subscribe({
      next: (device) => {
        this.ble.stopScan();
        this.ble.connect(device.id).subscribe({
          next: (device) => {
            this.afterDeviceConnected(device);

            this.ble.startNotification(device.id, WITHDRAWAL_SERVICE_ID, WITHDRAWAL_SERVICE_SUBSCRIBE_ID).subscribe({
              next: (data) => this.handleWithdrawalUpdate(data),
              error: () => {}
            });
            this.ble.write(device.id, WITHDRAWAL_SERVICE_ID, WITHDRAWAL_SERVICE_PUBLISH_ID, jsonToBluetooth(deviceWithdrawalRequest));
          },
          error: () => {
            this.ble.stopNotification(this.deviceUUID, WITHDRAWAL_SERVICE_ID, WITHDRAWAL_SERVICE_SUBSCRIBE_ID);
            this.onWithdrawalComplete();
            this.isConnected.next(false);
          }
        });
      },
      error: () => {}
    });
  }

  async startChipDeposit() {
    this.beforeDeviceConnection();

    this.ble.startScan([DEVICE_STATUS_SERVICE_ID]).subscribe({
      next: (device) => {
        this.ble.stopScan();
        this.ble.connect(device.id).subscribe({
          next: (device) => {
            this.afterDeviceConnected(device);

            this.ble.startNotification(device.id, DEPOSIT_SERVICE_ID, DEPOSIT_SERVICE_SUBSCRIBE_ID).subscribe({
              next: (data) => this.handleDepositUpdate(data),
              error: () => {}
            });
            this.ble.write(device.id, DEPOSIT_SERVICE_ID, DEPOSIT_SERVICE_PUBLISH_ID, Uint8Array.of(1).buffer);
          },
          error: () => {
            this.ble.stopNotification(this.deviceUUID, DEPOSIT_SERVICE_ID, DEPOSIT_SERVICE_SUBSCRIBE_ID);
            this.onDepositComplete();
            this.isConnected.next(false);
          }
        });
      },
      error: () => {}
    });
  }

  async completeChipDeposit() {
    this.ble.write(this.deviceUUID, DEPOSIT_SERVICE_ID, DEPOSIT_SERVICE_PUBLISH_ID, Uint8Array.of(1).buffer);
  }

  async updateDeviceStatus() {
    this.beforeDeviceConnection();

    this.ble.startScan([DEVICE_STATUS_SERVICE_ID]).subscribe({
      next: (device) => {
        this.ble.stopScan();
        this.ble.connect(device.id).subscribe({
          next: (device) => {
            this.afterDeviceConnected(device);

            this.ble.startNotification(device.id, DEVICE_STATUS_SERVICE_ID, DEVICE_STATUS_SERVICE_SUBSCRIBE_ID).subscribe({
              next: (data) => this.handleDeviceStatus(data),
              error: () => {}
            });
            this.ble.write(device.id, DEVICE_STATUS_SERVICE_ID, DEVICE_STATUS_SERVICE_PUBLISH_ID, Uint8Array.of(1).buffer);
          },
          error: () => {
            this.ble.stopNotification(this.deviceUUID, DEVICE_STATUS_SERVICE_ID, DEVICE_STATUS_SERVICE_SUBSCRIBE_ID);
            this.isConnected.next(false);
          }
        });
      },
      error: () => {}
    });
  }

  private handleDeviceStatus = (buffer: any) => {
    var data = bluetoothToJson(new Uint8Array(buffer[0]));
    this.deviceStatus.next({
      id: data.id,
      slots: data.inventory.length,
      inventory: data.inventory
    });
  }

  private handleWithdrawalUpdate = (buffer: any) => {
    var data = bluetoothToJson(new Uint8Array(buffer[0]));
    this.withdrawalRequestStatus.next(data);
  }

  private handleDepositUpdate = (buffer: any) => {
    var data = bluetoothToJson(new Uint8Array(buffer[0]));
    this.depositRequestStatus.next(data);
  }

  private onWithdrawalComplete() {
    this.withdrawalRequestStatus.next([]);
  }

  private onDepositComplete() {
    this.depositRequestStatus.next([]);
  }

  private async beforeDeviceConnection() {
    let modal = await this.modalCtrl.create({ component: DeviceConnectModalComponent });
    modal.present();
    this.isConnected.subscribe(connected => {
      if (connected) { modal.dismiss(); }
    });
  }

  private async afterDeviceConnected(device: any) {
    this.deviceUUID = device.id;
    this.isConnected.next(true);
  }
}

function jsonToBluetooth(data: any): ArrayBuffer {
  return new TextEncoder().encode(JSON.stringify(data)).buffer;
}

function bluetoothToJson(data: Uint8Array) {
  const numberArray = Array.from(data);
  const jsonString = String.fromCharCode.apply(null, numberArray);
  return JSON.parse(jsonString);
}

export interface DeviceWithdrawalRequest {
  amount: number;
  denominations: number[];
}

export interface DeviceStatus {
  id: number;
  slots: number;
  inventory: number[];
}
