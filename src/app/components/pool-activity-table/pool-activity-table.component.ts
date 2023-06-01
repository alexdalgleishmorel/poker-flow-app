import { Component, Input, OnChanges } from '@angular/core';
import { PoolData } from 'src/app/services/pool/pool.service';

@Component({
  selector: 'app-pool-activity-table',
  templateUrl: './pool-activity-table.component.html',
  styleUrls: ['./pool-activity-table.component.scss']
})
export class PoolActivityTableComponent implements OnChanges {
  public dataSource: any;
  public displayedColumns: string[] = ['name', 'type', 'amount'];

  @Input() poolData?: PoolData;

  ngOnChanges(): void {
    this.dataSource = this.poolData?.transactions;
  }
}
