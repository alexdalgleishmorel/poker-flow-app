import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {}

export interface DeviceWithdrawalRequest {
  amount: number;
  denominations: number[];
}
