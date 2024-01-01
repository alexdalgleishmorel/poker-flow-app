import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { currencyFormatter } from 'src/app/app.component';
import { PoolService } from 'src/app/services/pool/pool.service';

@Component({
  selector: 'app-chip-deposit-modal',
  templateUrl: './chip-deposit-modal.component.html',
  styleUrls: ['./chip-deposit-modal.component.scss']
})
export class ChipDepositModalComponent implements OnInit {
  @Input() denominations: number[] = [];

  public currentDenominationIndex: number = -1;
  public denominationCounts: number[] = [];
  public denominationCountControl: FormControl = new FormControl(0);

  public displayedDenomination: number = 0;
  public displayedCount: number = 0;
  public depositTotal: number = 0;

  public manualInputFormControl: FormControl = new FormControl(0);
  private lastValidInput: number = 0;

  constructor(private poolService: PoolService, private modalCtrl: ModalController) {}

  ngOnInit(): void {
    this.denominations.forEach(() => this.denominationCounts.push(0));
  }

  completeDeposit() {
    this.modalCtrl.dismiss(this.depositTotal);
  }

  cancelDeposit() {
    this.modalCtrl.dismiss(null);
  }

  getFormattedDepositTotal() {
    let total: number = 0;
    this.denominations.forEach((denomination, index) => {
      total += (denomination * this.denominationCounts[index]);
    });
    this.depositTotal = total;
    return currencyFormatter.format(this.depositTotal);
  }

  getRawDepositTotal() {
    let total: number = 0;
    this.denominations.forEach((denomination, index) => {
      total += (denomination * this.denominationCounts[index]);
    });
    return total;
  }

  onSliderChange(event: any) {
    this.denominationCounts[this.currentDenominationIndex] = event.detail.value;
    this.denominationCountControl.setValue(this.denominationCounts[this.currentDenominationIndex]);
  }

  lastDenomination() {
    if (this.currentDenominationIndex !== 0) {
      this.currentDenominationIndex -= 1;
    }
    this.displayedDenomination = this.denominations[this.currentDenominationIndex];
    this.denominationCountControl.setValue(this.denominationCounts[this.currentDenominationIndex]);
  }

  nextDenomination() {
    if (this.currentDenominationIndex < this.denominations.length - 1) {
      this.currentDenominationIndex += 1;
    }
    this.displayedDenomination = this.denominations[this.currentDenominationIndex];
    this.denominationCountControl.setValue(this.denominationCounts[this.currentDenominationIndex]);
  }

  onChipSelect(index: number) {
    this.currentDenominationIndex = index;
    this.displayedDenomination = this.denominations[this.currentDenominationIndex];
    this.denominationCountControl.setValue(this.denominationCounts[this.currentDenominationIndex]);
  }

  getMaximumChipCount() {
    return this.displayedDenomination ? Math.ceil(this.poolService.currentPoolSubject.getValue().available_pot/this.displayedDenomination) : 0;
  }

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

  handleManualFocus() {
    this.manualInputFormControl.setValue(this.denominationCounts[this.currentDenominationIndex]);
  }
}
