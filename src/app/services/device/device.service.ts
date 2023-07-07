import { Injectable } from '@angular/core';
import { 
  DEPOSIT_SERVICE_ID, 
  DEPOSIT_SERVICE_PUBLISH_ID, 
  DEPOSIT_SERVICE_SUBSCRIBE_ID, 
  DEVICE_STATUS_SERVICE_ID, 
  DEVICE_STATUS_SERVICE_SUBSCRIBE_ID, 
  WITHDRAWAL_SERVICE_ID, 
  WITHDRAWAL_SERVICE_PUBLISH_ID, 
  WITHDRAWAL_SERVICE_SUBSCRIBE_ID } from '@constants';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor() {}

  async connectToDevice(deviceID?: number): Promise<PokerFlowDevice|null> {
    const pokerFlowDevice = new PokerFlowDevice();
    return deviceID ? pokerFlowDevice.findDeviceByID(deviceID) : pokerFlowDevice.findDevice();
  }

  withdrawChips(device: PokerFlowDevice, withdrawalRequest: DeviceWithdrawalRequest) {
    device.withdrawChips(withdrawalRequest);
  }
}

export interface DeviceWithdrawalRequest {
  amount: number;
  denominations: number[];
}

export class PokerFlowDevice {

  private bluetooth?: BluetoothDevice;
  public id?: number;
  public slots?: number;
  public inventory?: number[];
  public withdrawalRequestStatus?: BehaviorSubject<number[]>;
  public depositRequestStatus?: BehaviorSubject<number[]>;

  async findDevice(): Promise<PokerFlowDevice|null> {
    return window.navigator.bluetooth.requestDevice({ filters: [{ services: [DEVICE_STATUS_SERVICE_ID] }] })
      .catch(() => null)
      .then((selectedDevice: BluetoothDevice | null) => {
        if (!selectedDevice) return null;
        this.bluetooth = selectedDevice;
        this.assignDeviceStatus();
        return this;
      });
  }

  async findDeviceByID(deviceID: number): Promise<PokerFlowDevice|null> {
    return window.navigator.bluetooth.requestDevice({ filters: [{ services: [DEVICE_STATUS_SERVICE_ID] }] })
      .catch(() => null)
      .then((selectedDevice: BluetoothDevice | null) => {
        if (!selectedDevice) return null;
        this.bluetooth = selectedDevice;
        this.assignDeviceStatus();
        return this;
      })
  }

  async assignDeviceStatus() {
    this.bluetooth!.gatt!.connect()
      .then((gattServer: BluetoothRemoteGATTServer) => {
        return gattServer.getPrimaryService(DEVICE_STATUS_SERVICE_ID);
      })
      .then((deviceStatusService: BluetoothRemoteGATTService) => {
        return deviceStatusService.getCharacteristic(DEVICE_STATUS_SERVICE_SUBSCRIBE_ID);
      })
      .then((deviceStatusServiceSubscription: BluetoothRemoteGATTCharacteristic) => {
        return deviceStatusServiceSubscription.readValue();
      })
      .then((data: DataView) => {
        const deviceStatus = bluetoothToJson(data);
        this.id = deviceStatus.id;
        this.inventory = deviceStatus.inventory;
        this.slots = deviceStatus.inventory.length;
      });
  }

  withdrawChips(deviceWithdrawalRequest: DeviceWithdrawalRequest) {
    this.bluetooth!.gatt!.connect()
      .then((gattServer: BluetoothRemoteGATTServer) => {
        return gattServer.getPrimaryService(WITHDRAWAL_SERVICE_ID);
      })
      .then((withdrawalService: BluetoothRemoteGATTService) => {
        withdrawalService.getCharacteristic(WITHDRAWAL_SERVICE_SUBSCRIBE_ID)
          .then((withdrawalServiceSubscribeChannel: BluetoothRemoteGATTCharacteristic) => {
            withdrawalServiceSubscribeChannel.addEventListener('characteristicvaluechanged', this.handleWithdrawalUpdate);
          });
        return withdrawalService.getCharacteristic(WITHDRAWAL_SERVICE_PUBLISH_ID);
      })
      .then((withdrawalServicePublishChannel: BluetoothRemoteGATTCharacteristic) => {
        return withdrawalServicePublishChannel.writeValue(jsonToBluetooth(deviceWithdrawalRequest));
      });
  }

  startChipDeposit() {
    this.bluetooth!.gatt!.connect()
      .then((gattServer: BluetoothRemoteGATTServer) => {
        return gattServer.getPrimaryService(DEPOSIT_SERVICE_ID);
      })
      .then((depositService: BluetoothRemoteGATTService) => {
        depositService.getCharacteristic(DEPOSIT_SERVICE_SUBSCRIBE_ID)
          .then((depositServiceSubscribeChannel: BluetoothRemoteGATTCharacteristic) => {
            depositServiceSubscribeChannel.addEventListener('characteristicvaluechanged', this.handleDepositUpdate);
          });
        return depositService.getCharacteristic(DEPOSIT_SERVICE_PUBLISH_ID);
      })
      .then((depositServicePublishChannel: BluetoothRemoteGATTCharacteristic) => {
        return depositServicePublishChannel.writeValue(Uint8Array.of(1));
      });
  }

  completeChipDeposit() {
    this.bluetooth!.gatt!.connect()
      .then((gattServer: BluetoothRemoteGATTServer) => {
        return gattServer.getPrimaryService(DEPOSIT_SERVICE_ID);
      })
      .then((depositService: BluetoothRemoteGATTService) => {
        depositService.getCharacteristic(DEPOSIT_SERVICE_SUBSCRIBE_ID)
        return depositService.getCharacteristic(DEPOSIT_SERVICE_PUBLISH_ID);
      })
      .then((depositServicePublishChannel: BluetoothRemoteGATTCharacteristic) => {
        return depositServicePublishChannel.writeValue(Uint8Array.of(2));
      });
  }

  private handleWithdrawalUpdate(event: any) {
    const data: DataView = event.target.value;
    this.withdrawalRequestStatus?.next(this.parseInventory(data));
  }

  private handleDepositUpdate(event: any) {
    const data: DataView = event.target.value;
    this.depositRequestStatus?.next(this.parseInventory(data));
  }

  private parseInventory(data: DataView) {
    const uint8Array = new Uint8Array(data.buffer);
    return Array.from(uint8Array);
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
