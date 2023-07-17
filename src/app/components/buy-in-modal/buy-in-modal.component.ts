import { Component, Inject, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DeviceWithdrawalRequest, PokerFlowDevice } from 'src/app/services/device/device.service';

@Component({
  selector: 'app-buy-in-modal',
  templateUrl: './buy-in-modal.component.html',
  styleUrls: ['./buy-in-modal.component.scss']
})
export class BuyInModalComponent {
  private minBuyIn: number = this.data.poolSettings.min_buy_in;
  private maxBuyIn: number = this.data.poolSettings.max_buy_in;
  public denominations: number[] = this.data.poolSettings.denominations;
  public assignments: number[] = [];

  public buyInFormControl = new FormControl(
    `${this.minBuyIn}`, [
      Validators.required, 
      Validators.min(this.minBuyIn), 
      Validators.max(this.maxBuyIn),
      this.buyInValidator()
    ]
  );

  public form: FormGroup = this._formBuilder.group({
    buyIn: this.buyInFormControl
  });

  public device: PokerFlowDevice = this.data.device;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<BuyInModalComponent>,
    private _formBuilder: FormBuilder
  ) {
    this.buyInFormControl.setErrors({'required': true});
    this.device.assignDeviceStatus();
    this.device.status.subscribe(() => {
      if (this.device.inventory) {
        this.buyInFormControl.updateValueAndValidity();
      }
    });
  }

  confirmBuyIn() {
    const deviceWithdrawalRequest: DeviceWithdrawalRequest = {
      amount: +this.buyInFormControl.value!,
      denominations: this.assignments
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

  inventoryCanSupply(value: number): boolean {
    let buyInToSettle: number = value;
    let inventoryCopy = [...this.device.inventory!];
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

      if (!value || !this.device) return null;

      if (this.device.inventory &&!this.inventoryCanSupply(value)) {
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
