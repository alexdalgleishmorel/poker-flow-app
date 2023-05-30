import { Component, Input, OnInit } from '@angular/core';
import { PoolData, PoolService } from 'src/app/services/pool/pool.service';

@Component({
  selector: 'app-pool-activity-table',
  templateUrl: './pool-activity-table.component.html',
  styleUrls: ['./pool-activity-table.component.scss']
})
export class PoolActivityTableComponent implements OnInit {
  public dataSource: any;
  public displayedColumns: string[] = ['name', 'type', 'amount'];

  @Input() poolID: string = '';

  constructor(
    private poolService: PoolService,
  ) {}

  ngOnInit(): void {
    this.poolService.getPoolData(this.poolID).subscribe((data: PoolData) => {
      this.dataSource = data.transactions;
    });
  }
}
