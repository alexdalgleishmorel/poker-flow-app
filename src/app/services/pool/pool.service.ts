import { Injectable } from '@angular/core';
import { Observable, lastValueFrom, map, of } from 'rxjs';
import { ApiService } from '../api/api.service';
import { AuthService, Profile } from '../auth/auth.service';

export interface PoolData {
  name: string;
  date_created: string;
  id: number;
  device_id: number;
  available_pot: number;
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
  BUY_IN = 'BUY_IN',
  CASH_OUT = 'CASH_OUT'
}

export interface PoolTransaction {
  id: number;
  profile: Profile;
  date: string;
  type: TransactionType;
  amount: number;
}

export interface PoolTransactionRequest {
  pool_id: number;
  profile_id?: number;
  type: TransactionType;
  amount: number;
}

export interface PoolSettings {
  has_password: boolean;
  min_buy_in: number;
  max_buy_in: number;
  denominations: number[];
  password?: string;
}

export interface PoolCreationRequest {
  pool_name: string;
  device_id: number;
  settings: PoolSettings;
  admin_id?: number;
}

export interface PoolJoinRequest {
  pool_id: number;
  profile_id: number;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class PoolService {

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  getPoolsByUserID(userID: number | undefined): Observable<any> {
    return this.apiService.get(`/pool/user/${userID}`);
  }

  getPoolsByDeviceID(deviceID: number): Observable<any> {
    return this.apiService.get(`/pool/device/${deviceID}`);
  }

  getPoolByID(poolID: number): Observable<any> {
    return this.apiService.get(`/pool/${poolID}`);
  }

  createPool(name: string, deviceID: number, settings: PoolSettings) {
    if (!settings.has_password) settings.password = '';

    const poolCreationRequest: PoolCreationRequest = {
      pool_name: name,
      device_id: deviceID,
      settings: settings,
      admin_id: this.authService.getCurrentUser()?.id
    };

    return lastValueFrom(this.apiService.post('/pool/create', poolCreationRequest));
  }

  joinPool(pool: PoolData, password?: string) {

    const poolJoinRequest: PoolJoinRequest = {
      pool_id: pool.id,
      profile_id: this.authService.getCurrentUser()?.id!,
      password: password ? password : ''
    };

    return this.apiService.post('/pool/join', poolJoinRequest).pipe(
      map(() => pool.id)
    );
  }

  postTransaction(poolTransactionRequest: PoolTransactionRequest) {
    return this.apiService.post(`/pool/transaction/create`, poolTransactionRequest);
  }
}
