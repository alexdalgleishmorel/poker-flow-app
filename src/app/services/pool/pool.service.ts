import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Profile } from '../profile/profile.service';

@Injectable({
  providedIn: 'root'
})
export class PoolService {

  constructor() {}

  getUserPools(userID: string): Observable<PoolData[]> {
    return of([
      {
        name: 'mock_pool_name',
        date_created: '01/01/2023 15:21 MDT',
        id: 'mock_id',
        total: 123.45,
        members: [
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
        ]
      }
    ]);
  }

  getDevicePools(deviceID: string): Observable<PoolData[]> {
    return of([
      {
        name: 'mock_pool_name',
        date_created: '01/01/2023 15:21 MDT',
        id: 'mock_id',
        total: 123.45,
        members: [
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
        ]
      }
    ]);
  }

  getPoolData(poolID: string): Observable<PoolData> {
    return of({
      name: 'mock_pool_name',
      date_created: '01/01/2023 15:21 MDT',
      id: 'mock_id',
      total: 123.45,
      members: [
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
      ]
    });
  }

  createGame() {
    return of({id: 'mock_pool_id'});
  }
}

export interface PoolData {
  name: string;
  date_created: string;
  id: string;
  total: number;
  members: PoolMember[];
  transactions: PoolTransaction[]
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
