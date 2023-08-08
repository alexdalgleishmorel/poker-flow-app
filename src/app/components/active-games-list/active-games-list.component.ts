import { Component, OnInit } from '@angular/core';
import { PoolData, PoolService } from 'src/app/services/pool/pool.service';

@Component({
  selector: 'app-active-games-list',
  templateUrl: './active-games-list.component.html',
  styleUrls: ['./active-games-list.component.scss'],
})
export class ActiveGamesListComponent implements OnInit {

  public pools: PoolData[] = [];

  constructor(
    private poolService: PoolService
  ) { }

  ngOnInit() {
    this.poolService.poolsByUserID.subscribe((pools) => {
      this.pools = [...pools];
    })
  }

}
