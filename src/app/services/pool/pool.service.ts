import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Socket } from 'ngx-socket-io';

import { ApiService } from '../api/api.service';
import { AuthService, Profile } from '../auth/auth.service';
import { EMPTY_POOL_DATA } from '@constants';

@Injectable({
  providedIn: 'root'
})
export class PoolService {
  public colorThemeSubject: Subject<number> = new Subject<number>();
  public currentPoolSubject: BehaviorSubject<PoolData> = new BehaviorSubject<PoolData>(EMPTY_POOL_DATA);
  public updateNotification: Subject<number> = new Subject<number>();

  constructor(private apiService: ApiService, private authService: AuthService, private socket: Socket) {
    this.socket.on('pool_updated', () => this.updateNotification.next(1));
  }

  /**
   * @param {number} userID The user ID used to search for games
   * @param {number} itemOffset The starting index to retrieve found games from
   * @param {number} itemsPerPage The maximum number of games to retrieve at once
   * @param {boolean} active Whether to retrieve active games or expired games
   * 
   * @returns {Promise<any>} Promise containing a list of games
   */
  getPoolsByUserID(userID: number, itemOffset: number, itemsPerPage: number, active: boolean): Promise<any> {
    if (!userID) {
      return Promise.resolve();
    }
    return this.apiService.get(`/pool/${active ? 'active' : 'expired'}/user/${userID}`, {
      params: { itemOffset: itemOffset, itemsPerPage: itemsPerPage }
    });
  }

  /**
   * @param {string} poolID The ID of the game data to retrieve
   * 
   * @returns {Promise<any>} Promise containing game data
   */
  getPoolByID(poolID: string): Promise<any> {
    if (!poolID) {
      return Promise.resolve();
    };
    
    return this.apiService.get(`/pool/${poolID}`);
  }

  /**
   * Creates a new game based on the provided configurations
   * 
   * @param {string} name The name of the game to create 
   * @param {PoolSettings} settings The settings associated with the game
   *  
   * @returns {Promise<any>} Promise containing the game data
   */
  createPool(name: string, settings: PoolSettings): Promise<any> {
    const poolCreationRequest: PoolCreationRequest = {
      pool_name: name,
      settings: settings,
      admin_id: this.authService.getCurrentUser()?.id
    };

    return this.apiService.post('/pool/create', poolCreationRequest);
  }

  /**
   * Updates the game data based on the provided key-pair values, using the provided game ID
   * 
   * @param {string} poolID The ID of the game being updated
   * @param {PoolUpdateRequest[]} updateRequests An array of key-pair values of game attributes to update
   * 
   * @returns {Promise<any>}
   */
  updatePoolSettings(poolID: string, updateRequests: PoolUpdateRequest[]): Promise<any> {
    return this.apiService.post('/pool/settings/update', {
      pool_id: poolID,
      update_requests: updateRequests
    });
  }

  /**
   * Adds the provided user to the provided game
   * 
   * @param {string} poolID The ID of the game being joined
   * @param {number} userID The ID of the user
   *  
   * @returns {Promise<any>}
   */
  joinPool(poolID: string, userID: number): Promise<any> {
    const poolJoinRequest: PoolJoinRequest = {
      pool_id: poolID,
      profile_id: userID
    };
    return this.apiService.post('/pool/join', poolJoinRequest);
  }

  /**
   * Posts the provided transaction
   * 
   * @param {PoolTransactionRequest} poolTransactionRequest The game transaction data
   * 
   * @returns {Promise<any>}
   */
  postTransaction(poolTransactionRequest: PoolTransactionRequest): Promise<any> {
    return this.apiService.post(`/pool/transaction/create`, poolTransactionRequest);
  }
}

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
