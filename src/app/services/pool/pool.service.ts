import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, lastValueFrom, map, of } from 'rxjs';
import { ApiService } from '../api/api.service';
import { AuthService, Profile } from '../auth/auth.service';

export interface PoolData {
  name: string;
  date_created: string;
  id: string;
  device_id: number;
  available_pot: number;
  member_ids: number[];
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
  pool_id: string;
  profile_id?: number;
  type: TransactionType;
  amount: number;
}

export interface PoolSettings {
  min_buy_in: number;
  max_buy_in: number;
  denominations: number[];
  password?: string;
  buy_in_enabled?: boolean;
  expired?: boolean;
}

export interface PoolCreationRequest {
  pool_name: string;
  settings: PoolSettings;
  admin_id?: number;
}

export interface PoolUpdateRequest {
  attribute: string;
  value: any;
}

export interface PoolJoinRequest {
  pool_id: string;
  profile_id: number;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class PoolService {

  public poolByID: Subject<PoolData> = new Subject<PoolData>();
  public poolViewActive: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public poolChartViewActive: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public newDataRequest: Subject<boolean> = new Subject<boolean>();

  public currentPoolID: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  getPoolsByUserID(userID: number | undefined, itemOffset: number, itemsPerPage: number): Observable<any> {
    if (!userID) {
      return of([]);
    }
    return this.apiService.get(`/pool/user/${userID}`, itemOffset, itemsPerPage).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getPoolByID(poolID: string): Observable<any> {
    if (!poolID) return of();
    
    return this.apiService.get(`/pool/${poolID}`).pipe(
      map((response: any) => {
        this.poolByID.next(response);
        return response;
      })
    );
  }

  createPool(name: string, settings: PoolSettings) {
    const poolCreationRequest: PoolCreationRequest = {
      pool_name: name,
      settings: settings,
      admin_id: this.authService.getCurrentUser()?.id
    };

    return lastValueFrom(this.apiService.post('/pool/create', poolCreationRequest));
  }

  updatePoolSettings(poolID: string, updateRequests: PoolUpdateRequest[]) {
    return lastValueFrom(this.apiService.post('/pool/settings/update', {
      pool_id: poolID,
      update_requests: updateRequests
    }));
  }

  joinPool(poolID: string, password?: string) {
    const poolJoinRequest: PoolJoinRequest = {
      pool_id: poolID,
      profile_id: this.authService.getCurrentUser()?.id!,
      password: password ? password : ''
    };

    return this.apiService.post('/pool/join', poolJoinRequest);
  }

  postTransaction(poolTransactionRequest: PoolTransactionRequest) {
    return this.apiService.post(`/pool/transaction/create`, poolTransactionRequest);
  }
}
