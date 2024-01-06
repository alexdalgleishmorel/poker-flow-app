import { Component, Input, OnInit } from '@angular/core';
import { currencyFormatter } from 'src/app/app.component';

import { GameTransaction, TransactionType } from 'src/app/services/game/game.service';

@Component({
  selector: 'app-activity-table',
  templateUrl: './activity-table.component.html',
  styleUrls: ['./activity-table.component.scss']
})
export class ActivityTableComponent implements OnInit {
  @Input() transactions: GameTransaction[] = [];

  public filteredData: GameTransaction[] = [];
  public unfilteredData: GameTransaction[] = [];

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
      this.filteredData = this.unfilteredData;
      return;
    }

    this.filteredData = this.transactions?.filter(
      (transaction: GameTransaction) => {
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
