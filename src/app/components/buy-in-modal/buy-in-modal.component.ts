import { Component, Inject, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DEFAULT_DENOMINATIONS, DEFAULT_MAX_BUY_IN, DEFAULT_MIN_BUY_IN } from '@constants';
import { DeviceWithdrawalRequest, PokerFlowDevice } from 'src/app/services/device/device.service';

@Component({
  selector: 'app-buy-in-modal',
  templateUrl: './buy-in-modal.component.html',
  styleUrls: ['./buy-in-modal.component.scss']
})
export class BuyInModalComponent {
  private minBuyIn: number = DEFAULT_MIN_BUY_IN;
  private maxBuyIn: number = DEFAULT_MAX_BUY_IN;
  public denominations: number[];
  public assignments: number[] = [];

  public form: FormGroup;
  public buyInFormControl = new FormControl(
    `${this.minBuyIn}`, [
      Validators.required, 
      Validators.min(this.minBuyIn), 
      Validators.max(this.maxBuyIn),
      this.buyInValidator()
    ]
  );

  private buyInValue: number = 0;
  private device: PokerFlowDevice;
  private deviceInventory?: number[];
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<BuyInModalComponent>,
    private _formBuilder: FormBuilder
  ) {
    this.denominations = this.data.poolSettings.denominations;
    this.minBuyIn, this.maxBuyIn = this.data.poolSettings.min_buy_in, this.data.poolSettings.max_buy_in;
    this.device = this.data.device;
    this.deviceInventory = this.device.connection?.getInventory();
    this.form = this._formBuilder.group({
      buyIn: this.buyInFormControl
    });
  }

  confirmBuyIn() {
    const deviceWithdrawalRequest: DeviceWithdrawalRequest = {
      amount: this.buyInValue,
      denominations: []
    };
    this.dialogRef.close(deviceWithdrawalRequest);
  }

  cancelBuyIn() {
    this.dialogRef.close(null);
  }

  resetAssignments() {
    this.assignments = [];
    this.denominations.forEach(() => this.assignments.push(0));
  }

  totalChipsInInventory(deviceInventory: number[]) {
    let totalChips: number = 0;
    deviceInventory.forEach((inventory) => {
      totalChips += inventory;
    });
    return totalChips;
  }

  inventoryCanSupply(buyIn: number): boolean {
    let buyInToSettle: number = buyIn;
    let inventoryCopy = [...this.deviceInventory!];
    this.resetAssignments();

    while (buyInToSettle > 0 && this.totalChipsInInventory(inventoryCopy) > 0) {
      let slot: number = 0;
      let chipMatch: boolean = false;
      
      this.denominations.forEach((denomination: number) => {

        let availableChips = Math.floor(buyInToSettle/denomination);

        if (inventoryCopy[slot] && availableChips > 0) {
          chipMatch = true;
          this.assignments[slot] += 1;
          inventoryCopy[slot] -= 1;
          buyInToSettle = +(buyInToSettle - denomination).toFixed(2);
        }
        
        slot += 1;
      });
      
      if (!chipMatch) break;
    }

    return buyInToSettle ? false : true;
  }

  buyInValidator(): ValidatorFn {
    return (control:AbstractControl) : ValidationErrors | null => {
      
      const value = control.value;

      if (!value || !this.deviceInventory) return null;

      if (!this.inventoryCanSupply(value)) {
        this.resetAssignments();
        return { 'insufficientInventory': true };
      }
      
      return null;
    }
  }

  decimalFilter(event: any) {
    const reg = /^-?\d*(\.\d{0,1})?$/;
    let input = event.target.value + String.fromCharCode(event.charCode);
 
    if (!reg.test(input)) {
        event.preventDefault();
    }
  }

  onBlur() {
    if (!this.buyInFormControl.value) this.buyInFormControl.setValue(this.minBuyIn.toString());
  }
}
