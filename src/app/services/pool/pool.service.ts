import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
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
  public updateNotification: Subject<number> = new Subject<number>();
  public currentPoolSubject: BehaviorSubject<PoolData> = new BehaviorSubject<PoolData>(EMPTY_POOL_DATA);
  public colorThemeSubject: Subject<number> = new Subject<number>();

  constructor(private apiService: ApiService, private authService: AuthService, private socket: Socket) {
    this.socket.on('pool_updated', () => this.updateNotification.next(1));
  }

  getPoolsByUserID(userID: number | undefined, itemOffset: number, itemsPerPage: number, active: boolean): Promise<any> {
    if (!userID) {
      return Promise.resolve();
    }
    return this.apiService.get(`/pool/${active ? 'active' : 'expired'}/user/${userID}`, itemOffset, itemsPerPage);
  }

  getPoolByID(poolID: string): Promise<any> {
    if (!poolID) {
      return Promise.resolve();
    };
    
    return this.apiService.get(`/pool/${poolID}`);
  }

  createPool(name: string, settings: PoolSettings): Promise<any> {
    const poolCreationRequest: PoolCreationRequest = {
      pool_name: name,
      settings: settings,
      admin_id: this.authService.getCurrentUser()?.id
    };

    return this.apiService.post('/pool/create', poolCreationRequest);
  }

  updatePoolSettings(poolID: string, updateRequests: PoolUpdateRequest[]): Promise<any> {
    return this.apiService.post('/pool/settings/update', {
      pool_id: poolID,
      update_requests: updateRequests
    });
  }

  joinPool(poolID: string): Promise<any> {
    const poolJoinRequest: PoolJoinRequest = {
      pool_id: poolID,
      profile_id: this.authService.getCurrentUser()?.id!
    };

    return this.apiService.post('/pool/join', poolJoinRequest);
  }

  postTransaction(poolTransactionRequest: PoolTransactionRequest): Promise<any> {
    return this.apiService.post(`/pool/transaction/create`, poolTransactionRequest);
  }
}
