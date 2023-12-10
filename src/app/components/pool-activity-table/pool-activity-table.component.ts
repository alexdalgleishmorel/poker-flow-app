import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { PoolTransaction, TransactionType } from 'src/app/services/pool/pool.service';

@Component({
  selector: 'app-pool-activity-table',
  templateUrl: './pool-activity-table.component.html',
  styleUrls: ['./pool-activity-table.component.scss']
})
export class PoolActivityTableComponent implements OnInit {
  public displayedColumns: string[] = ['name', 'type', 'amount'];

  @Input() transactions?: PoolTransaction[];
  @Output() onBuyIn = new EventEmitter<boolean>;
  @Output() refreshData: EventEmitter<InfiniteScrollCustomEvent> = new EventEmitter<InfiniteScrollCustomEvent>();

  public unfilteredData?: PoolTransaction[];
  private filteredData?: PoolTransaction[];

  ngOnInit() {
    this.unfilteredData = this.transactions;
  }

  buyIn() {
    this.onBuyIn.emit();
  }

  isBuyIn(transactionType: TransactionType) {
    return transactionType === TransactionType.BUY_IN
  }

  isCashOut(transactionType: TransactionType) {
    return transactionType === TransactionType.CASH_OUT
  }

  handleRefresh(event: any) {
    this.refreshData.emit(event);
  }

  getDate(date: string) {
    return new Date(date).toLocaleString(
      [], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'}
    );
  }

  handleSearch(event: any) {
    const searchValue = event.target.value.toLowerCase();
    this.transactions = this.unfilteredData;

    if (!searchValue) {
      return;
    }

    this.filteredData = this.transactions?.filter(
      (transaction: PoolTransaction) => {
        if (!transaction.profile.firstName || !transaction.profile.lastName) {
          return false;
        }
        return transaction.profile.firstName.concat(' ').concat(transaction.profile.lastName).toLowerCase().includes(searchValue);
      }
    );
    this.transactions = this.filteredData;
  }
}
