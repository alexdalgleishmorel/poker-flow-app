import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from '../api/api.service';
import { AuthService, Profile } from '../auth/auth.service';

export interface PoolData {
  name: string;
  date_created: string;
  id: string;
  device_id: string;
  total: number;
  contributors: PoolMember[];
  transactions: PoolTransaction[];
  admin: Profile;
  settings: PoolSettings;
}

export interface PoolMember {
  profile: Profile;
  contribution: number;
}

export enum TransactionType {
  BUY_IN = 'BUY-IN',
  CASH_OUT = 'CASH-OUT'
}

export interface PoolTransaction {
  id: string;
  profile: Profile;
  date: string;
  type: TransactionType;
  amount: number;
}

export interface PoolSettings {
  hasPassword: boolean;
  minBuyIn: number;
  maxBuyIn: number;
  denominations: number[];
}

export interface PoolCreationRequest {
  name: string;
  device_id: string;
  settings: PoolSettings;
}

@Injectable({
  providedIn: 'root'
})
export class PoolService {

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  getPoolsByUserID(userID: string | undefined): Observable<any> {
    return this.apiService.get(`/pool/user/${userID}`);
  }

  getPoolsByDeviceID(deviceID: string): Observable<any> {
    return this.apiService.get(`/pool/device/${deviceID}`);
  }

  getPoolByID(poolID: string): Observable<any> {
    return this.apiService.get(`/pool/${poolID}`);
  }

  createPool(name: string, deviceID: string, settings: PoolSettings): Observable<any> {
    const poolCreationRequest: PoolCreationRequest = {
      name: name,
      device_id: deviceID,
      settings: settings
    };
    return this.apiService.post(`/pool/create`, poolCreationRequest);
  }

  postTransaction(transaction: PoolTransaction) {
    return of({});
  }
}
