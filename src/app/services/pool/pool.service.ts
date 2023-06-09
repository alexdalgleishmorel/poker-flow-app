import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
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

const MOCK_POOL_DATA: PoolData = {
  name: 'mock_pool_name',
  date_created: '01/01/2023 15:21 MDT',
  id: 'mock_id',
  device_id: 'mock_device_id',
  total: 123.45,
  contributors: [
    {
      profile: {
        email: 'alex@local.com',
        firstName: 'Alex',
        lastName: 'Dalgleish-Morel'
      },
      contribution: 83.45
    },
    {
      profile: {
        email: 'landan@local.com',
        firstName: 'Landan',
        lastName: 'Butt'
      },
      contribution: 20.55
    },
    {
      profile: {
        email: 'kian@local.com',
        firstName: 'Kian',
        lastName: 'Reilly'
      },
      contribution: 20.45
    }
  ],
  transactions: [
    {
      id: 'mock_transaction_id',
      profile: {
        email: 'alex@local.com',
        firstName: 'Alex',
        lastName: 'Dalgleish-Morel'
      },
      date: '01/01/2023 15:21 MDT',
      type: TransactionType.BUY_IN,
      amount: 50.51
    },
    {
      id: 'mock_transaction_id',
      profile: {
        email: 'alex@local.com',
        firstName: 'Alex',
        lastName: 'Dalgleish-Morel'
      },
      date: '01/01/2023 16:21 MDT',
      type: TransactionType.CASH_OUT,
      amount: 40.44
    }
  ],
  admin: {
    email: 'alex@local.com',
    firstName: 'Alex',
    lastName: 'Dalgleish-Morel'
  },
  settings: {
    hasPassword: false,
    minBuyIn: 5,
    maxBuyIn: 100,
    denominations: []
  }
};

@Injectable({
  providedIn: 'root'
})
export class PoolService {

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  getPoolsByUserID(userID: string | undefined): Observable<PoolData[]> {
    return this.apiService.getPoolsByUserID(userID).pipe(
      map(
        (response) => {
          console.log(response);
          return [MOCK_POOL_DATA];
        }
      )
    )
  }

  getPoolsByDeviceID(deviceID: string): Observable<PoolData[]> {
    return of([MOCK_POOL_DATA]);
  }

  getPoolByID(poolID: string): Observable<PoolData> {
    return of(MOCK_POOL_DATA);
  }

  createPool(
    name: string,
    deviceID: string,
    settings: PoolSettings,
  ): Observable<PoolData> {
    const profile: Profile | undefined = this.authService.getCurrentUser();

    if (!profile) return of();

    const poolData: PoolData = {
      name: name,
      id: 'mock_id',
      date_created: 'mock_date',
      device_id: deviceID,
      total: 0,
      contributors: [
        {
          profile: profile,
          contribution: 0
        }
      ],
      transactions: [],
      admin: profile,
      settings: settings
    }
    return of(poolData);
  }

  postTransaction(transaction: PoolTransaction) {
    return of({});
  }
}
