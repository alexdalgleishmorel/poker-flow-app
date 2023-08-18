import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, lastValueFrom, map, of } from 'rxjs';
import { ApiService } from '../api/api.service';
import { AuthService, Profile } from '../auth/auth.service';
import { POOLS_BY_USER, POOL_BY_ID } from '@constants';

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
  buy_in_enabled?: boolean;
  buy_in_expiry_time?: string;
  expired?: boolean;
}

export interface PoolCreationRequest {
  pool_name: string;
  device_id: number;
  settings: PoolSettings;
  admin_id?: number;
}

export interface PoolUpdateRequest {
  attribute: string;
  value: any;
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

  public poolsByUserID: Subject<PoolData[]> = new Subject<PoolData[]>();
  public poolsByDeviceID: Subject<PoolData[]> = new Subject<PoolData[]>();
  public poolByID: Subject<PoolData> = new Subject<PoolData>();
  public poolViewActive: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public poolChartViewActive: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  getPoolsByUserID(userID: number | undefined): Observable<any> {
    /*
    return this.apiService.get(`/pool/user/${userID}`).pipe(
      map((response: any) => {
        this.poolsByUserID.next(response);
        return response;
      })
    );
    */
   this.poolsByUserID.next(POOLS_BY_USER);
   return of(POOLS_BY_USER);
  }

  getPoolsByDeviceID(deviceID: number): Observable<any> {
    /*
    return this.apiService.get(`/pool/device/${deviceID}`).pipe(
      map((response: any) => {
        this.poolsByDeviceID.next(response);
        return response;
      })
    );
    */
  this.poolsByDeviceID.next(POOLS_BY_USER);
   return of(POOLS_BY_USER);
  }

  getPoolByID(poolID: number | undefined): Observable<any> {
    if (!poolID) return of();

    /*
    
    return this.apiService.get(`/pool/${poolID}`).pipe(
      map((response: any) => {
        this.poolByID.next(response);
        return response;
      })
    );

    */
   this.poolByID.next(POOL_BY_ID);
    return of(POOL_BY_ID);
  }

  createPool(name: string, deviceID: number, settings: PoolSettings) {
    /*
    if (!settings.has_password) settings.password = '';

    const poolCreationRequest: PoolCreationRequest = {
      pool_name: name,
      device_id: deviceID,
      settings: settings,
      admin_id: this.authService.getCurrentUser()?.id
    };

    return lastValueFrom(this.apiService.post('/pool/create', poolCreationRequest));
    */
   return Promise.resolve(POOL_BY_ID);
  }

  updatePoolSettings(poolID: number, updateRequests: PoolUpdateRequest[]) {
    /*
    return lastValueFrom(this.apiService.post('/pool/settings/update', {
      pool_id: poolID,
      update_requests: updateRequests
    }));
    */
   return Promise.resolve(POOL_BY_ID);
  }

  joinPool(poolID: number, password?: string) {
    /*
    const poolJoinRequest: PoolJoinRequest = {
      pool_id: poolID,
      profile_id: this.authService.getCurrentUser()?.id!,
      password: password ? password : ''
    };

    return this.apiService.post('/pool/join', poolJoinRequest);
    */
   return of("");
  }

  postTransaction(poolTransactionRequest: PoolTransactionRequest) {
    return of(
      {
        amount: poolTransactionRequest.amount,
        type: poolTransactionRequest.type
      }
    );
    /*
    return this.apiService.post(`/pool/transaction/create`, poolTransactionRequest);
    */
  }
}
