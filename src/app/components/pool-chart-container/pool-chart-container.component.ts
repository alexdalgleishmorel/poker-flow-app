import { Component, OnInit } from '@angular/core';
import { API_TIMEOUT_CONSTRAINT } from '@constants';
import { PoolData, PoolMember, PoolService } from 'src/app/services/pool/pool.service';

@Component({
  selector: 'app-pool-chart-container',
  templateUrl: './pool-chart-container.component.html',
  styleUrls: ['./pool-chart-container.component.scss'],
})
export class PoolChartContainerComponent implements OnInit {

  public poolData?: PoolData;
  public poolTotal: number = 0;

  constructor(
    private poolService: PoolService
  ) { }

  ngOnInit() {
    this.poolService.poolByID.subscribe(poolData => {
      if (poolData) {
        this.poolData = {...poolData};
        if (!this.poolService.poolViewActive.getValue()) {
          this.poolService.poolViewActive.next(poolData.id);
        }
      }
      this.poolTotal = 0;
      this.poolData?.contributors.forEach((contributor: PoolMember) => {
        this.poolTotal += contributor.contribution;
      });
    });

    this.getChartData();
  }

  handleRefresh(event?: any) {
    this.getChartData(event);
  }

  getChartData(event?: any) {
    this.poolService.getPoolByID(this.poolService.currentPoolID.getValue()).subscribe(() => {
      if (event) {
        event.target.complete();
      }
    });
    setTimeout(() => {
      if (event) {
        event.target.complete();
      }
    }, API_TIMEOUT_CONSTRAINT);
  }
}
