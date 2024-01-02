import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { DEFAULT_DENOMINATIONS, DEFAULT_MAX_BUY_IN } from '@constants';

@Component({
  selector: 'app-chip-select',
  templateUrl: './chip-select.component.html',
  styleUrls: ['./chip-select.component.scss']
})
export class ChipSelectComponent implements OnChanges {
  @Input() denominations: number[] = DEFAULT_DENOMINATIONS;
  @Input() maxBuyIn: number = DEFAULT_MAX_BUY_IN;
  @Output() denominationsChange = new EventEmitter<number[]>;

  public chipDenominationControl: FormControl;
  public selectedSlot: number = 0;

  constructor() {
    this.chipDenominationControl = new FormControl(this.denominations[0], this.denominationValidator());
    this.subscribeToDenominationChanges();
  }

  /**
   * Subscribes to chip denomination changes, which handles any errors then emits the new denominations
   */
  subscribeToDenominationChanges() {
    this.chipDenominationControl.valueChanges.subscribe((value) => {
      value = Number(value);
      if (this.chipDenominationControl.errors) {
        this.denominations[this.selectedSlot] = DEFAULT_DENOMINATIONS[this.selectedSlot];
      } else {
        this.denominations[this.selectedSlot] = value;
      }
      this.denominationsChange.emit(this.denominations);
    });
  }

  /**
   * Handles a chip being selected
   * 
   * @param {number} index The index of the selected chip 
   */
  chipSelect(index: number) {
    index = index >= this.denominations.length ? this.denominations.length-1 : index;
    this.selectedSlot = index;
    this.chipDenominationControl.setValue(this.denominations[this.selectedSlot]);
  }

  /**
   * A filter that ensures the user can only provide up to 2 decimal places for chip denominations
   * 
   * @param event The event containing the input to filter
   */
  decimalFilter(event: any) {
    const reg = /^-?\d*(\.\d{0,2})?$/;
    let input = event.target.value + String.fromCharCode(event.charCode);
 
    if (!reg.test(input)) {
      event.preventDefault();
    }
  }

  /**
   * Provides a denomination validator, which enforces that denominations meet a set of standards
   * 
   * @returns {ValidatorFn} The validation function
   */
  denominationValidator(): ValidatorFn {
    return (control:AbstractControl) : ValidationErrors | null => {
      
      const value = Number(control.value);
      if (!value) {
        // Denominations are required
        return {'required': true};
      }
      if (value > 1000 && value % 1000 !== 0) {
        // Large denominations (above $1000) must be a multiple of $1000
        return {'badLargeMultipleError': true};
      }
      if (value < 1 && !Number.isInteger(1/value)) {
        // Denominations less than 1 must be able to add to $1
        return {'badFractionalMultipleError': true};
      }
      if (value > 1 && !Number.isInteger(value)) {
        // Denominations greater than 1 can't have decimal values
        return {'notMultipleOfOneError': true};
      }
      
      return null;
    }
  }

  /**
   * Ensures that validation messages appear as soon as user input is detected
   */
  onFocus = () => this.chipDenominationControl.markAsTouched();

  /**
   * Ensures chip denominations always have a value when its input loses focus
   */
  onFocusOut() {
    if (!this.chipDenominationControl.value) {
      this.chipDenominationControl.setValue(DEFAULT_DENOMINATIONS[this.selectedSlot%DEFAULT_DENOMINATIONS.length]);
    }
  }

  /**
   * Updates form validity when changes are detected
   */
  ngOnChanges() {
    this.chipDenominationControl.updateValueAndValidity();
  }

  /**
   * @returns {string} The relevant error message relating to the chip denomination validation
   */
  getErrorMessage(): string {
    if (this.chipDenominationControl.errors?.['badLargeMultipleError']) {
      return 'Must be a multiple of $1000';
    }
    if (this.chipDenominationControl.errors?.['badFractionalMultipleError']) {
      return 'Must sum to $1';
    }
    if (this.chipDenominationControl.errors?.['notMultipleOfOneError']) {
      return 'Must be a multiple of $1';
    }
    return 'Required';
  }

  /**
   * Removes the selected chip from the set of denominations
   * 
   * @param {number} index The index of the chip to remove 
   */
  removeChip(index: number) {
    this.denominations.splice(index, 1);
    this.chipSelect(this.selectedSlot);
  }

  /**
   * Adds a new chip to the set of denominations
   */
  addChip() {
    this.denominations.push(DEFAULT_DENOMINATIONS[this.denominations.length%DEFAULT_DENOMINATIONS.length]);
    this.chipSelect(this.denominations.length-1);
  }
}
