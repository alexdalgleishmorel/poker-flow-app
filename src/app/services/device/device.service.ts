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

  constructor(
    private ble: BLE,
  ) {
    ble.isEnabled().then(() => {});
  }

  async withdrawChips(deviceWithdrawalRequest: DeviceWithdrawalRequest) {
  }

  async startChipDeposit() {
  }

  async completeChipDeposit() {
  }

  public updateDeviceStatus() {

    this.ble.scan([DEVICE_STATUS_SERVICE_ID], 10).subscribe({
      next: (device) => {
        this.ble.connect(device.id).subscribe({
          next: (device) => {
            this.ble.startNotification(device.id, DEVICE_STATUS_SERVICE_ID, DEVICE_STATUS_SERVICE_SUBSCRIBE_ID).subscribe({
              next: (data) => {
                this.handleDeviceStatus(data);
              },
              error: () => {
                console.log('device status notification subscribe failed');
              }
            });
            this.ble.write(device.id, DEVICE_STATUS_SERVICE_ID, DEVICE_STATUS_SERVICE_PUBLISH_ID, Uint8Array.of(1).buffer);
          },
          error: () => {
            console.log('connection to poker flow device failed');
          }
        });
      },
      error: () => {
        console.log('scan for poker flow device failed');
      }
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

  private handleWithdrawalUpdate = (data: any) => {
  }

  private handleDepositUpdate = (data: any) => {
  }
}

function jsonToBluetooth(data: any): Uint8Array {
  return new TextEncoder().encode(JSON.stringify(data));
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
