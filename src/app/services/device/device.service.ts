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
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  public depositRequestStatus: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
  public withdrawalRequestStatus: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);

  constructor(
    private ble: BLE,
  ) {}

  async withdrawChips(deviceWithdrawalRequest: DeviceWithdrawalRequest) {
  }

  async startChipDeposit() {
  }

  async completeChipDeposit() {
  }

  async getDeviceStatus(): Promise<DeviceStatus> {
    return Promise.resolve({ id: 1, slots: 1, inventory: [] });
  }

  private handleDeviceStatus = (event: any) => {
  }

  private handleWithdrawalUpdate = (event: any) => {
  }

  private handleDepositUpdate = (event: any) => {
  }

  public connect() {
    this.ble.scan([], 5).subscribe((response) => {
      console.log(response);
    });
  }
}

function jsonToBluetooth(data: any): Uint8Array {
  return new TextEncoder().encode(JSON.stringify(data));
}

function bluetoothToJson(data: DataView) {
  const uint8Array = new Uint8Array(data.buffer);
  const numberArray = Array.from(uint8Array);
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
