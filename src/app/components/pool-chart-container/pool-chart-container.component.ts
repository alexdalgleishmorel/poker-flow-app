import { Component, OnInit } from '@angular/core';
import { PoolData, PoolService } from 'src/app/services/pool/pool.service';

@Component({
  selector: 'app-pool-chart-container',
  templateUrl: './pool-chart-container.component.html',
  styleUrls: ['./pool-chart-container.component.scss'],
})
export class PoolChartContainerComponent implements OnInit {

  public poolData?: PoolData;

  constructor(
    private poolService: PoolService
  ) { }

  ngOnInit() {
    this.poolService.poolByID.subscribe((poolData) => {
      this.poolData = {...poolData};
    })
  }
}
