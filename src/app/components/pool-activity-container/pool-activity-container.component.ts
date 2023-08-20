import { Component, OnInit } from '@angular/core';
import { PoolData, PoolService } from 'src/app/services/pool/pool.service';

@Component({
  selector: 'app-pool-activity-container',
  templateUrl: './pool-activity-container.component.html',
  styleUrls: ['./pool-activity-container.component.scss'],
})
export class PoolActivityContainerComponent  implements OnInit {

  public poolData?: PoolData;

  constructor(
    private poolService: PoolService
  ) { }

  ngOnInit() {
    this.poolService.poolByID.subscribe((poolData) => {
      this.poolData = {...poolData};
    });

    this.getData();
  }

  getData() {
    this.poolService.getPoolByID(this.poolService.currentPoolID.getValue()).subscribe(() => {});
  }

  handleRefresh(event: any) {
    this.getData();
    event.target.complete();
  }
}
