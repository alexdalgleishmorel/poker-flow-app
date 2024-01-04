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

  /**
   * Subscribes to pool data and any updates it may receive
   */
  ngOnInit() {
    this.subscribeToPoolData();
  }

  /**
   * Subscribes to the current pool data being displayed, adjusting the pool total and available cashout accordingly
   */
  subscribeToPoolData() {
    this.poolService.currentPoolSubject.subscribe(poolData => {
      this.poolData = poolData ? {...poolData} : this.poolData;
      this.poolTotal = 0;
      this.poolData?.contributors.forEach((contributor: PoolMember) => {
        this.poolTotal += contributor.contribution;
      });
    });
  }

  /**
   * @returns {string} A currency representation of the total pot
   */
  getTotalPotRepresentation(): string {
    return currencyFormatter.format(this.poolTotal);
  }

  /**
   * @returns {string} A currency representation of the available cashout
   */
  getAvailableCashoutRepresentation(): string {
    return currencyFormatter.format(this.poolData?.available_pot || 0);
  }
}
