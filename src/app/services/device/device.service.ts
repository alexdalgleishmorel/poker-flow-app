import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor() {}

  findDevices(filter?: string[]) {
    return new Promise<PokerFlowDevice[]>(resolve => {
      setTimeout(() => resolve([
        {id: 1, slots: 5}
      ]), 500);
    });
  }

  connectToDevice(deviceID: number) {
    return new Promise<PokerFlowDevice>(resolve => {
      setTimeout(() => resolve({id: 1, slots: 5, connection: new DeviceConnection(deviceID)}), 1000);
    });
  }

  withdrawChips(deviceConnection: any, withdrawalRequest: DeviceWithdrawalRequest) {
    return new Promise<any>(resolve => {
      setTimeout(() => resolve({}), 3000);
    });
  }
}

export interface PokerFlowDevice {
  id: number;
  slots: number;
  connection?: DeviceConnection;
}

export interface DeviceWithdrawalRequest {
  amount: number;
  denominations: number[];
}

export class DeviceConnection {

  private connection: any;

  constructor(id: number) {
    // TODO: CONNECT TO A POKERFLOW DEVICE WITH THIS ID VIA BLUETOOTH
    this.connection = this.connect();
  }

  private connect() {}

  getInventory(): number[] {
    return [30, 30, 30, 30, 30];
  }

  withdrawChips(request: DeviceWithdrawalRequest) {}

  startChipDeposit() {}

  completeChipDeposit() {}
}
