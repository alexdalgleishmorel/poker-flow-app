import { Injectable } from '@angular/core';
import { BLE } from '@awesome-cordova-plugins/ble/ngx';
import { 
  DEPOSIT_SERVICE_ID, 
  DEPOSIT_SERVICE_PUBLISH_ID, 
  DEPOSIT_SERVICE_SUBSCRIBE_ID, 
  DEVICE_STATUS_SERVICE_ID, 
  DEVICE_STATUS_SERVICE_PUBLISH_ID, 
  DEVICE_STATUS_SERVICE_SUBSCRIBE_ID, 
  OPTIONAL_DEVICE_SERVICES, 
  WITHDRAWAL_SERVICE_ID, 
  WITHDRAWAL_SERVICE_PUBLISH_ID, 
  WITHDRAWAL_SERVICE_SUBSCRIBE_ID } from '@constants';
import { BehaviorSubject, Observable, Subject, firstValueFrom, lastValueFrom, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  public depositRequestStatus: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
  public withdrawalRequestStatus: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);

  public deviceStatus: BehaviorSubject<DeviceStatus> = new BehaviorSubject<DeviceStatus>(
    {id: 0, inventory: [], slots: 0}
  );

  private deviceUUID: string = '';

  constructor(private ble: BLE) { 
    ble.isEnabled().then(() => {}); 
  }

  async withdrawChips(deviceWithdrawalRequest: DeviceWithdrawalRequest) {
    let deviceFound: boolean = false;
    this.ble.startScan([DEVICE_STATUS_SERVICE_ID]).subscribe({
      next: (device) => {
        if (deviceFound) { return; }
        deviceFound = true;
        this.ble.stopScan();
        this.ble.connect(device.id).subscribe({
          next: (device) => {
            this.deviceUUID = device.id;

            this.ble.startNotification(device.id, WITHDRAWAL_SERVICE_ID, WITHDRAWAL_SERVICE_SUBSCRIBE_ID).subscribe({
              next: (data) => this.handleWithdrawalUpdate(data),
              error: () => {}
            });
            this.ble.write(device.id, WITHDRAWAL_SERVICE_ID, WITHDRAWAL_SERVICE_PUBLISH_ID, jsonToBluetooth(deviceWithdrawalRequest));
          },
          error: () => { /* Disconnected from pokerflow device */ }
        });
      },
      error: () => {}
    });
  }

  async startChipDeposit() {
  }

  async completeChipDeposit() {
  }

  public updateDeviceStatus() {
    let deviceFound: boolean = false;
    this.ble.startScan([DEVICE_STATUS_SERVICE_ID]).subscribe({
      next: (device) => {
        if (deviceFound) { return; }
        deviceFound = true;
        this.ble.stopScan();
        this.ble.connect(device.id).subscribe({
          next: (device) => {
            this.deviceUUID = device.id;

            this.ble.startNotification(device.id, DEVICE_STATUS_SERVICE_ID, DEVICE_STATUS_SERVICE_SUBSCRIBE_ID).subscribe({
              next: (data) => this.handleDeviceStatus(data),
              error: () => {}
            });
            this.ble.write(device.id, DEVICE_STATUS_SERVICE_ID, DEVICE_STATUS_SERVICE_PUBLISH_ID, Uint8Array.of(1).buffer);
          },
          error: () => {
            this.ble.stopNotification(this.deviceUUID, DEVICE_STATUS_SERVICE_ID, DEVICE_STATUS_SERVICE_SUBSCRIBE_ID);
            this.ble.stopNotification(this.deviceUUID, WITHDRAWAL_SERVICE_ID, WITHDRAWAL_SERVICE_SUBSCRIBE_ID);
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

  private handleDepositUpdate = (data: any) => {
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
