import { Component, OnInit } from '@angular/core';

import { PoolService, PoolTransaction } from 'src/app/services/pool/pool.service';

@Component({
  selector: 'app-activity-container',
  templateUrl: './activity-container.component.html',
  styleUrls: ['./activity-container.component.scss'],
})
export class ActivityContainerComponent  implements OnInit {
  public transactions?: PoolTransaction[];

  constructor(private poolService: PoolService) {}

  /**
   * Subscribes to the currently displayed pool as a data source for the pool activity list
   */
  ngOnInit() {
    this.poolService.currentPoolSubject.subscribe(poolData => {
      this.transactions = [...poolData.transactions].reverse();
    });
  }
}
