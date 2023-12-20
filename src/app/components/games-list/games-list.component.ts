import { Component, Input, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';

import { AuthService } from 'src/app/services/auth/auth.service';
import { PoolData, PoolService } from 'src/app/services/pool/pool.service';

@Component({
  selector: 'app-games-list',
  templateUrl: './games-list.component.html',
  styleUrls: ['./games-list.component.scss'],
})
export class GamesListComponent implements OnInit {
  @Input() activeGames: boolean = true;

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
    this.poolService.getPoolsByUserID(this.authService.getCurrentUser()?.id, this.itemOffset, this.itemsPerPage, this.activeGames)
      .subscribe(pools => {
        this.pools = this.pools ? [...this.pools.concat(pools)] : pools;
        this.itemOffset += pools.length;
        if (!pools.length) {
          this.noNewData = true;
        }
        if (event) {
          event.target.complete();
        }
      });
  }
}
