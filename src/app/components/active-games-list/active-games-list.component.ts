import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Input() registerUser: boolean = false;
  @Output() onPoolSelect: EventEmitter<PoolData> = new EventEmitter<PoolData>();
  public pools?: PoolData[];

  private itemOffset: number = 0;
  private itemsPerPage: number = 15;

  public noNewData: boolean = false;

  constructor(
    private authService: AuthService,
    private poolService: PoolService
  ) { }

  ngOnInit() {
    if (this.registerUser) {
      this.getDeviceData();
      return;
    }
    this.getData();
  }

  poolSelect(poolData: PoolData) {
    this.onPoolSelect.emit(poolData);
  }

  onGetMoreData(event: InfiniteScrollCustomEvent) {
    !this.registerUser ? this.getData(event) : this.getDeviceData(event);
  }

  onRefreshData(event: InfiniteScrollCustomEvent) {
    this.itemOffset = 0;
    this.pools = undefined;
    this.noNewData = false;
    !this.registerUser ? this.getData(event) : this.getDeviceData(event);
  }

  private getData(event?: InfiniteScrollCustomEvent) {
    this.poolService.getPoolsByUserID(this.authService.getCurrentUser()?.id, this.itemOffset, this.itemsPerPage)
    .pipe(
      map(pools => {
        return pools.filter((pool: PoolData) => !pool.settings.expired);
      })
    ).subscribe(pools => {
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

  private getDeviceData(event?: InfiniteScrollCustomEvent) {
    this.poolService.getPoolsByDeviceID(this.authService.getCurrentUser()?.id, this.itemOffset, this.itemsPerPage)
    .pipe(
      map(pools => {
        return pools.filter((pool: PoolData) => !pool.settings.expired);
      })
    ).subscribe(pools => {
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
