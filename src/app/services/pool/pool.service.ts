import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Profile } from '../profile/profile.service';

@Injectable({
  providedIn: 'root'
})
export class PoolService {

  constructor() {}

  getPoolData(): Observable<PoolData> {
    return of({
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
      ]
    });
  }

  createGame() {
    return of({id: 'mock_pool_id'});
  }
}

export interface PoolData {
  id: string;
  total: number;
  members: PoolMember[];
}

export interface PoolMember {
  profile: Profile;
  contribution: number;
}
