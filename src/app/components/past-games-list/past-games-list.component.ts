import { Component, OnInit } from '@angular/core';
import { PoolData, PoolService } from 'src/app/services/pool/pool.service';

@Component({
  selector: 'app-past-games-list',
  templateUrl: './past-games-list.component.html',
  styleUrls: ['./past-games-list.component.scss'],
})
export class PastGamesListComponent  implements OnInit {

  public pools: PoolData[] = [];

  constructor(
    private poolService: PoolService
  ) {}

  ngOnInit() {
    this.poolService.poolsByUserID.subscribe((pools) => {
      this.pools = [...pools];
    })
  }
}
