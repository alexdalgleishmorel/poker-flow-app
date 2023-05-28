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

  connectToDevice(device: any) {
    return new Promise<any>(resolve => {
      setTimeout(() => resolve({}), 3000);
    });
  }
}

export interface PokerFlowDevice {
  name: string;
}
