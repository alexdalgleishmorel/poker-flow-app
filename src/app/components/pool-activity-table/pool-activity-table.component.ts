import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { TransactionType } from 'src/app/services/pool/pool.service';

@Component({
  selector: 'app-pool-activity-table',
  templateUrl: './pool-activity-table.component.html',
  styleUrls: ['./pool-activity-table.component.scss']
})
export class PoolActivityTableComponent {
  public displayedColumns: string[] = ['name', 'type', 'amount'];

  @Input() dataSource: any[] = [];
  @Output() onBuyIn = new EventEmitter<boolean>;
  @Output() refreshData: EventEmitter<InfiniteScrollCustomEvent> = new EventEmitter<InfiniteScrollCustomEvent>();

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
}
