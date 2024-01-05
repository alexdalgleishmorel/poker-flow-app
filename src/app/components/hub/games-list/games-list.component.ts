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

  /**
   * Initializes the list data, subscribes to data updates and re-initializes the list in those cases
   */
  ngOnInit() {
    this.initializeData();
    this.poolService.updateNotification.subscribe(() => this.initializeData());
  }

  /**
   * Removes existing data and resets the item offset, then requests new data
   */
  initializeData() {
    this.pools = undefined;
    this.itemOffset = 0;
    this.getData();
  }

  /**
   * Gets data to populate the list
   * 
   * @param {any} event An optional infinite scroll event, if it is the source of the data request 
   */
  public getData(event?: InfiniteScrollCustomEvent) {
    const userID = this.authService.getCurrentUser()?.id;
    if (!userID) {
      return;
    }
    this.poolService.getPoolsByUserID(userID, this.itemOffset, this.itemsPerPage, this.activeGames)
      .then(pools => {
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
