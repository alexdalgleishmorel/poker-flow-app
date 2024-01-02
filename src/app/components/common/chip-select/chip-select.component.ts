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
  @Output() denominationsChange = new EventEmitter<number[]>;
  @Input() maxBuyIn: number = DEFAULT_MAX_BUY_IN;
  public selectedSlot: number = 0;

  public chipDenominationControl: FormControl;

  constructor() {
    this.chipDenominationControl = new FormControl(this.denominations[0], this.denominationValidator());

    this.chipDenominationControl.valueChanges.subscribe((value) => {
      if (this.chipDenominationControl.errors) {
        this.denominations[this.selectedSlot] = DEFAULT_DENOMINATIONS[this.selectedSlot];
      } else {
        this.denominations[this.selectedSlot] = value;
      }
      this.denominationsChange.emit(this.denominations);
    });
  }

  chipSelect(index: number) {
    index = index >= this.denominations.length ? this.denominations.length-1 : index;
    this.selectedSlot = index;
    this.chipDenominationControl.setValue(this.denominations[this.selectedSlot]);
  }

  decimalFilter(event: any) {
    const reg = /^-?\d*(\.\d{0,2})?$/;
    let input = event.target.value + String.fromCharCode(event.charCode);
 
    if (!reg.test(input)) {
        event.preventDefault();
    }
  }

  denominationValidator(): ValidatorFn {
    return (control:AbstractControl) : ValidationErrors | null => {
      
      const value = control.value;
      if (!value) {
        return {'required': true};
      }
      if (value > 1000 && value % 1000 !== 0) {
        return {'badLargeMultipleError': true};
      }
      if (value < 1 && !Number.isInteger(1/value)) {
        return {'badFractionalMultipleError': true};
      }
      if (value > 1 && !Number.isInteger(value)) {
        return {'notMultipleOfOneError': true};
      }
      
      return null;
    }
  }

  onFocus = () => this.chipDenominationControl.markAsTouched();

  onFocusOut() {
    if (!this.chipDenominationControl.value) {
      this.chipDenominationControl.setValue(DEFAULT_DENOMINATIONS[this.selectedSlot%DEFAULT_DENOMINATIONS.length]);
    }
  }

  ngOnChanges() {
    this.chipDenominationControl.updateValueAndValidity();
  }

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

  removeChip(index: number) {
    this.denominations.splice(index, 1);
    this.chipSelect(this.selectedSlot);
  }

  addChip() {
    this.denominations.push(DEFAULT_DENOMINATIONS[this.denominations.length%DEFAULT_DENOMINATIONS.length]);
    this.chipSelect(this.denominations.length-1);
  }
}
