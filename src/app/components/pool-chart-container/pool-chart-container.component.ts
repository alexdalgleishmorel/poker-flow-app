import { Component, OnInit } from '@angular/core';
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
    this.poolService.poolByID.subscribe((poolData) => {
      this.poolData = {...poolData};
      this.poolTotal = 0;
      this.poolData.contributors.forEach((contributor: PoolMember) => {
        this.poolTotal += contributor.contribution;
      });
    })
  }
}
