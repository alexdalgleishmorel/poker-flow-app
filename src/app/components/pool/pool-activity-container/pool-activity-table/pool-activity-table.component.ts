import { Component, Input, OnInit } from '@angular/core';
import { currencyFormatter } from 'src/app/app.component';

import { PoolTransaction, TransactionType } from 'src/app/services/pool/pool.service';

@Component({
  selector: 'app-pool-activity-table',
  templateUrl: './pool-activity-table.component.html',
  styleUrls: ['./pool-activity-table.component.scss']
})
export class PoolActivityTableComponent implements OnInit {
  @Input() transactions: PoolTransaction[] = [];

  public unfilteredData: PoolTransaction[] = [];
  private filteredData: PoolTransaction[] = [];

  /**
   * Initializes the unfiltered data to be the provided data source
   */
  ngOnInit() {
    this.unfilteredData = this.transactions;
  }

  /**
   * @param {TransactionType} transactionType The transaction type
   * @returns {boolean} Whether the given transaction type is a buy-in
   */
  isBuyIn = (transactionType: TransactionType): boolean => transactionType === TransactionType.BUY_IN;

  /**
   * @param {TransactionType} transactionType The transaction type
   * @returns {boolean} Whether the given transaction type is a cash-out
   */
  isCashOut = (transactionType: TransactionType): boolean => transactionType === TransactionType.CASH_OUT;

  /**
   * @param {string} date A date string 
   * @returns {string} A date formatted to the locale timezone
   */
  getLocaleDateString(date: string): string {
    return new Date(date).toLocaleString(
      [], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'}
    );
  }

  /**
   * Handles search events
   * 
   * @param {any} event The input event, containing the search value
   */
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

  /**
   * Returns a formatted version of the provided currency value
   * 
   * @param {number} value The value to format 
   * @returns {string} The formatted currency
   */
  getFormattedCurrency(value: number): string {
    return currencyFormatter.format(value);
  }
}
