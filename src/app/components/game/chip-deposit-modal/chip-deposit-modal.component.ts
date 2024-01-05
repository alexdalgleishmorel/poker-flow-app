import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ModalController } from '@ionic/angular';

import { currencyFormatter } from 'src/app/app.component';
import { GameService } from 'src/app/services/game/game.service';

@Component({
  selector: 'app-chip-deposit-modal',
  templateUrl: './chip-deposit-modal.component.html',
  styleUrls: ['./chip-deposit-modal.component.scss']
})
export class ChipDepositModalComponent implements OnInit {
  @Input() denominations: number[] = [];
  @Input() maximumCashout: number = 0;

  public currentDenominationIndex: number = -1;
  public denominationCountControl: FormControl = new FormControl(0);
  public denominationCounts: number[] = [];
  public disabledInputs: boolean = false;
  public displayedDenomination: number = 0;
  public manualInputFormControl: FormControl = new FormControl(0);
  public totalCashout: number = 0;
  public totalCashoutExceededValue: number = 0;
  private lastValidInput: number = 0;

  constructor(private gameService: GameService, private modalCtrl: ModalController) {}

  /**
   * Initializes required attributes
   */
  ngOnInit() {
    this.initializeDenominationCounts();
  }

  /**
   * Initializes the denominationCounts and subscribes to changes in the relevant formControl
   */
  initializeDenominationCounts() {
    this.denominationCounts = this.denominations.map(() => 0);
    this.denominationCountControl.valueChanges.subscribe(value => {
      if (value !== this.denominationCounts[this.currentDenominationIndex]) {
        this.denominationCounts[this.currentDenominationIndex] = value;
        this.updateTotalCashout();
      }
    });
  }

  /**
   * Closes the modal with the deposit total
   */
  completeDeposit() {
    this.modalCtrl.dismiss(this.totalCashout);
  }

  /**
   * Closes the modal as a cancellation
   */
  cancelDeposit() {
    this.modalCtrl.dismiss(null);
  }

  /**
   * Determines total cashout based on the total amount of each chip denomination
   */
  updateTotalCashout() {
    let total: number = 0;
    this.denominations.forEach((denom, index) => total += denom*this.denominationCounts[index]);
    this.totalCashout = total <= this.maximumCashout ? total : this.maximumCashout;
    this.totalCashoutExceededValue = total <= this.maximumCashout ? 0 : total;
  }

  /**
   * @param {number} value The value to format as a currency
   * 
   * @returns {string} The deposit total of all combined chips, formatted as a currency
   */
  getFormattedCurrency(value: number): string {
    return currencyFormatter.format(value);
  }

  /**
   * Handles slider change events
   * 
   * @param {any} event The slider change event 
   */
  onSliderChange(event: any) {
    this.denominationCountControl.setValue(event.detail.value);
  }

  /**
   * Switches the displayed denomination to the previous denomination in the denominations list
   */
  lastDenomination() {
    if (this.currentDenominationIndex !== 0) {
      this.currentDenominationIndex -= 1;
    }
    this.updateDisplayedDenomination();
  }

  /**
   * Switches the displayed denomination to the next denomination in the denominations list
   */
  nextDenomination() {
    if (this.currentDenominationIndex < this.denominations.length - 1) {
      this.currentDenominationIndex += 1;
    }
    this.updateDisplayedDenomination();
  }

  /**
   * Handles chip selection
   * 
   * @param {number} index The index of the selected chip 
   */
  onChipSelect(index: number) {
    this.currentDenominationIndex = index;
    this.updateDisplayedDenomination();
  }

  /**
   * Updates the displayed denomination and form control based on the currentDenominationIndex
   */
  updateDisplayedDenomination() {
    this.displayedDenomination = this.denominations[this.currentDenominationIndex];
    this.denominationCountControl.setValue(this.denominationCounts[this.currentDenominationIndex]);
  }

  /**
   * @returns {number} The maximum number of chips the user could claim to have for the given denomination
   */
  getMaximumChipCount(): number {
    return this.displayedDenomination ? Math.ceil(this.gameService.currentGameSubject.getValue().availableCashout/this.displayedDenomination) : 0;
  }

  /**
   * Handles manual chip amount input events
   * 
   * @param {any} event The manual input event 
   */
  handleManualInput(event: any) {
    const value = event.target.value;
    const filteredValue = +value.replace(/[^0-9]/g, '');

    if (filteredValue <= this.getMaximumChipCount()) {
      this.denominationCountControl.setValue(filteredValue);
      this.lastValidInput = filteredValue;
    }

    this.manualInputFormControl.setValue(this.lastValidInput ? this.lastValidInput : this.denominationCountControl.value);
    this.denominationCounts[this.currentDenominationIndex] = this.manualInputFormControl.value;
  }

  /**
   * Handles logic when the user focuses on the manual chip amount input
   */
  handleManualFocus() {
    this.manualInputFormControl.setValue(this.denominationCounts[this.currentDenominationIndex]);
  }
}
