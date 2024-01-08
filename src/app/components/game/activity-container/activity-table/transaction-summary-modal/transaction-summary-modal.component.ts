import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { currencyFormatter } from 'src/app/app.component';

import { GameTransaction, TransactionType } from 'src/app/services/game/game.service';

@Component({
  selector: 'app-transaction-summary-modal',
  templateUrl: './transaction-summary-modal.component.html',
  styleUrls: ['./transaction-summary-modal.component.scss'],
})
export class TransactionSummaryModalComponent {
  @Input() transaction?: GameTransaction;
  @Input() denominations: number[] = [];
  @Input() denominationColors: string[] = [];

  constructor(private modalCtrl: ModalController) {}

  /**
   * Closes the modal
   */
  closeModal() {
    this.modalCtrl.dismiss();
  }

  /**
   * Takes a transaction type and returns a representation of its name for the user
   * 
   * @param transactionType The transaction type
   * 
   * @returns {string} The transaction type name representation
   */
  getTransactionRepresentation(transactionType: TransactionType): string {
    if (transactionType === TransactionType.BUY_IN) {
      return 'BUY-IN';
    } 
    if (transactionType === TransactionType.CASH_OUT) {
      return 'CASH-OUT';
    }
    else {
      return 'UNKNOWN TRANSACTION';
    }
  }

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
   * Returns a formatted version of the provided currency value
   * 
   * @param {number} value The value to format 
   * @returns {string} The formatted currency
   */
  getFormattedCurrency(value: number): string {
    return currencyFormatter.format(value);
  }
}
