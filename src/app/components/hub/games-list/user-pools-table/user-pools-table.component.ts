import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { InfiniteScrollCustomEvent } from '@ionic/angular';

import { PoolData } from 'src/app/services/pool/pool.service';

@Component({
  selector: 'app-user-pools-table',
  templateUrl: './user-pools-table.component.html',
  styleUrls: ['./user-pools-table.component.scss']
})
export class UserPoolsTableComponent implements OnInit {
  @Input() dataSource: PoolData[] = [];
  @Input() disabled: boolean = false;
  @Input() noNewData: boolean = false;
  @Output() getMoreData: EventEmitter<InfiniteScrollCustomEvent> = new EventEmitter<InfiniteScrollCustomEvent>();

  public displayedColumns: string[] = [];
  public unfilteredData: PoolData[] = [];
  private filteredData: PoolData[] = [];

  constructor(private router: Router) {}

  /**
   * Initializes the unfiltered data to be the provided data source
   */
  ngOnInit() {
    this.unfilteredData = this.dataSource;
  }

  /**
   * Navigates the user to the selected game
   * 
   * @param {PoolData} poolData The pool data associated with the selected game
   */
  openGame(poolData: PoolData) {
    this.router.navigate(['/', `pool`, poolData.id]);
  }

  /**
   * Handles infinite scroll events
   * 
   * @param {any} event The infinite scroll event
   */
  onInfiniteScroll(event: any) {
    this.getMoreData.emit(event as InfiniteScrollCustomEvent);
  }

  /**
   * Handles search events
   * 
   * @param {any} event The input event, containing the search value
   */
  handleSearch(event: any) {
    const searchValue = event.target.value.toLowerCase();
    this.dataSource = this.unfilteredData;

    if (!searchValue) {
      return;
    }

    this.filteredData = this.dataSource.filter(
      (poolData: PoolData) => poolData.name.toLowerCase().includes(searchValue)
    );
    this.dataSource = this.filteredData;
  }
}
