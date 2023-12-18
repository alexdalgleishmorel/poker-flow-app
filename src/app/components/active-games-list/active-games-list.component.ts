import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { map } from 'rxjs';

import { AuthService } from 'src/app/services/auth/auth.service';
import { PoolData, PoolService } from 'src/app/services/pool/pool.service';

@Component({
  selector: 'app-active-games-list',
  templateUrl: './active-games-list.component.html',
  styleUrls: ['./active-games-list.component.scss'],
})
export class ActiveGamesListComponent implements OnInit {
  public pools?: PoolData[];
  public noNewData: boolean = false;

  private itemOffset: number = 0;
  private itemsPerPage: number = 15;

  constructor(private authService: AuthService, private poolService: PoolService) {}

  ngOnInit() {
    this.poolService.updateNotification.subscribe(() => {
      this.pools = undefined;
      this.itemOffset = 0;
      this.getData();
    });
  }

  public getData(event?: InfiniteScrollCustomEvent) {
    this.poolService.getPoolsByUserID(this.authService.getCurrentUser()?.id, this.itemOffset, this.itemsPerPage)
    .pipe(
      map(pools => {
        this.itemOffset += pools.length;
        return pools.filter((pool: PoolData) => !pool.settings.expired);
      })
    ).subscribe(pools => {
      this.pools = this.pools ? [...this.pools.concat(pools)] : pools;
      if (!pools.length) {
        this.noNewData = true;
      }
      if (event) {
        event.target.complete();
      }
    });
  }
}
