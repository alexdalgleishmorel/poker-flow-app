import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
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
    this.selectedSlot = index;
    this.chipDenominationControl.setValue(this.denominations[this.selectedSlot]);
  }

  decimalFilter(event: any) {
    const reg = /^-?\d*(\.\d{0,1})?$/;
    let input = event.target.value + String.fromCharCode(event.charCode);
 
    if (!reg.test(input)) {
        event.preventDefault();
    }
  }

  denominationValidator(): ValidatorFn {
    return (control:AbstractControl) : ValidationErrors | null => {
      
      const value = control.value;

      if (value > 1000 && value % 1000 !== 0) {
        return {'badMultipleError': true};
      }

      if (value > this.maxBuyIn) {
        return {'maxBuyInError': true};
      }
      
      return null;
    }
  }

  onFocusOut() {
    if (!this.chipDenominationControl.value) this.chipDenominationControl.setValue(DEFAULT_DENOMINATIONS[this.selectedSlot]);
  }

  ngOnChanges() {
    this.chipDenominationControl.updateValueAndValidity();
  }

  getErrorMessage(): string {
    if (this.chipDenominationControl.errors?.['badMultipleError']) {
      return 'Must be a multiple of $1000';
    }
    if (this.chipDenominationControl.errors?.['maxBuyInError']) {
      return 'Exceeds max buy-in';
    }
    return 'Required';
  }
}
