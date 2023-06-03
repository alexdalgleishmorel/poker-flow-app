import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor() {}

  findDevices(filter?: string[]) {
    return new Promise<any[]>(resolve => {
      setTimeout(() => resolve([
        {id: 'mock_device_id_1'},
        {id: 'mock_device_id_2'}
      ]), 3000);
    });
  }

  connectToDevice(deviceID: string) {
    return new Promise<any>(resolve => {
      setTimeout(() => resolve({}), 3000);
    });
  }

  withdrawChips(deviceConnection: any, withdrawalRequest: DeviceWithdrawalRequest) {
    return new Promise<any>(resolve => {
      setTimeout(() => resolve({}), 3000);
    });
  }
}

export interface PokerFlowDevice {
  name: string;
}

export interface DeviceWithdrawalRequest {
  amount: number;
  denominations: number[];
}
