import { Component, OnInit } from '@angular/core';

import { currencyFormatter } from 'src/app/app.component';
import { PoolData, PoolMember, PoolService } from 'src/app/services/pool/pool.service';

@Component({
  selector: 'app-pool-chart-container',
  templateUrl: './pool-chart-container.component.html',
  styleUrls: ['./pool-chart-container.component.scss'],
})
export class PoolChartContainerComponent implements OnInit {
  public poolData?: PoolData;
  public poolTotal: number = 0;

  constructor(private poolService: PoolService) {}

  ngOnInit() {
    this.poolService.currentPoolSubject.subscribe(poolData => {
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
  }

  getTotalPotRepresentation() {
    return currencyFormatter.format(this.poolTotal);
  }

  getAvailablePotRepresentation() {
    return currencyFormatter.format(this.poolData?.available_pot || 0);
  }
}
