import { Component, EventEmitter, Input, Output } from '@angular/core';
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

  buyIn() {
    this.onBuyIn.emit();
  }

  isBuyIn(transactionType: TransactionType) {
    return transactionType === TransactionType.BUY_IN
  }

  isCashOut(transactionType: TransactionType) {
    return transactionType === TransactionType.CASH_OUT
  }
}
