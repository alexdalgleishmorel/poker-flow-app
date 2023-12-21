import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, lastValueFrom, map, of } from 'rxjs';
import { Socket } from 'ngx-socket-io';

import { ApiService } from '../api/api.service';
import { AuthService, Profile } from '../auth/auth.service';
import { EMPTY_POOL_DATA } from '@constants';

export interface PoolData {
  name: string;
  date_created: string;
  id: string;
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
}

@Injectable({
  providedIn: 'root'
})
export class PoolService {
  public updateNotification: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public currentPoolSubject: BehaviorSubject<PoolData> = new BehaviorSubject<PoolData>(EMPTY_POOL_DATA);

  public currentPoolID: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private apiService: ApiService, private authService: AuthService, private socket: Socket) {
    this.socket.on('pool_updated', () => {
      this.getPoolByID(this.currentPoolID.getValue()).subscribe(poolData => this.currentPoolSubject.next(poolData));
      this.updateNotification.next(this.updateNotification.getValue()+1);
    });
  }

  getPoolsByUserID(userID: number | undefined, itemOffset: number, itemsPerPage: number, active: boolean): Observable<any> {
    if (!userID) {
      return of([]);
    }
    return this.apiService.get(`/pool/${active ? 'active' : 'expired'}/user/${userID}`, itemOffset, itemsPerPage).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getPoolByID(poolID: string): Observable<any> {
    if (!poolID) return of();
    
    return this.apiService.get(`/pool/${poolID}`).pipe(
      map((response: any) => {
        this.currentPoolSubject.next(response);
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

  joinPool(poolID: string) {
    const poolJoinRequest: PoolJoinRequest = {
      pool_id: poolID,
      profile_id: this.authService.getCurrentUser()?.id!
    };

    return this.apiService.post('/pool/join', poolJoinRequest);
  }

  postTransaction(poolTransactionRequest: PoolTransactionRequest) {
    return this.apiService.post(`/pool/transaction/create`, poolTransactionRequest);
  }
}
