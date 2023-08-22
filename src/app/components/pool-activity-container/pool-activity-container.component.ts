import { Component, OnInit } from '@angular/core';
import { PoolData, PoolService, PoolTransaction } from 'src/app/services/pool/pool.service';

@Component({
  selector: 'app-pool-activity-container',
  templateUrl: './pool-activity-container.component.html',
  styleUrls: ['./pool-activity-container.component.scss'],
})
export class PoolActivityContainerComponent  implements OnInit {

  public transactions?: PoolTransaction[];

  constructor(
    private poolService: PoolService
  ) { }

  ngOnInit() {
    this.poolService.poolByID.subscribe((poolData) => {
      this.transactions = [...poolData.transactions].reverse();
    });

    this.getData();
  }

  getData(event?: any) {
    this.poolService.getPoolByID(this.poolService.currentPoolID.getValue()).subscribe(() => {
      if (event) {
        event.target.complete();
      }
    });
  }

  handleRefresh(event?: any) {
    this.transactions = undefined;
    this.getData(event);
  }
}
