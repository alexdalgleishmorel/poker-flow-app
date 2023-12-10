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
  @Input() noNewData: boolean = false;
  @Input() disabled: boolean = false;
  @Input() history: boolean = false;
  @Input() dataSource: PoolData[] = [];
  @Input() registerUser: boolean = false;
  @Output() onPoolSelect: EventEmitter<PoolData> = new EventEmitter<PoolData>();
  @Output() getMoreData: EventEmitter<InfiniteScrollCustomEvent> = new EventEmitter<InfiniteScrollCustomEvent>();
  @Output() refreshData: EventEmitter<InfiniteScrollCustomEvent> = new EventEmitter<InfiniteScrollCustomEvent>();
  public displayedColumns: string[] = [];

  public unfilteredData: PoolData[] = [];
  private filteredData: PoolData[] = [];

  constructor(
    private router: Router
  ) {}

  ngOnInit() {
    this.unfilteredData = this.dataSource;
  }

  openGame(poolData: PoolData) {
    this.onPoolSelect.emit(poolData);
    if (!this.registerUser) {
      this.router.navigate(['/', `pool`, poolData.id]);
    }
  }

  onInfiniteScroll(event: any) {
    this.getMoreData.emit(event as InfiniteScrollCustomEvent);
  }

  handleRefresh(event: any) {
    this.refreshData.emit(event as InfiniteScrollCustomEvent);
  }

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
