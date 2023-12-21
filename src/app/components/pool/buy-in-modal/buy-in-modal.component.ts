import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { currencyFormatter } from 'src/app/app.component';
import { PoolService, TransactionType } from 'src/app/services/pool/pool.service';

@Component({
  selector: 'app-buy-in-modal',
  templateUrl: './buy-in-modal.component.html',
  styleUrls: ['./buy-in-modal.component.scss']
})
export class BuyInModalComponent implements OnInit, AfterViewInit {
  @Input() poolID: string = '';
  @Input() userID: number = 0;
  @Input() minBuyIn: number = 0;
  @Input() maxBuyIn: number = 0;
  @Input() denominations: number[] = [];
  public buyInConfirmed: boolean = false;

  public assignments: number[] = [];
  public buyInFormControl: FormControl = new FormControl(0);
  public buyInStep: number = 1;
  public form: FormGroup;
  
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private modalCtrl: ModalController,
    private poolService: PoolService,
    private _formBuilder: FormBuilder
  ) {
    this.form = this._formBuilder.group({
      buyIn: this.buyInFormControl
    });
  }

  ngOnInit(): void {
    const eligibleDenoms = this.denominations.filter(denom => denom >= 1);
    this.buyInStep = eligibleDenoms.length ? eligibleDenoms[0] : 1;
    this.buyInFormControl.setValue(this.minBuyIn);
  }

  ngAfterViewInit(): void {
    this.buyInFormControl.setValidators([
      Validators.required,
      Validators.min(this.minBuyIn), 
      Validators.max(this.maxBuyIn),
      this.buyInValidator()
    ]);
    this.buyInFormControl.updateValueAndValidity();
    this.changeDetectorRef.detectChanges();
  }

  closeWithSuccess() {
    this.modalCtrl.dismiss(true);
  }

  confirmBuyIn() {
    this.poolService.postTransaction({
      pool_id: this.poolID,
      profile_id: this.userID,
      type: TransactionType.BUY_IN,
      amount: this.buyInFormControl.value
    }).subscribe({
      next: () => this.buyInConfirmed = true,
      error: () => {}
    });
  }

  cancelBuyIn() {
    this.modalCtrl.dismiss(null);
  }

  resetAssignments() {
    this.assignments = [];
    this.denominations.forEach(() => this.assignments.push(0));
  }

  canAssignChips(value: number): boolean {
    let buyInToSettle: number = value;
    this.resetAssignments();

    if (value > this.maxBuyIn || value < this.minBuyIn) {
      return false;
    }

    while (buyInToSettle > 0) {
      let slot: number = 0;
      let chipMatch: boolean = false;
      
      this.denominations.forEach((denomination: number) => {

        let availableChips = Math.floor(buyInToSettle/denomination);

        if (availableChips > 0) {
          chipMatch = true;
          this.assignments[slot] += 1;
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

      if (!value) {
        return {'required': true};
      }

      if (!this.canAssignChips(value)) {
        this.resetAssignments();
        return { 'insufficientInventory': true };
      }
      
      return null;
    }
  }

  getErrorMessage(): string {
    if (this.buyInFormControl.value > this.maxBuyIn) {
      return `Maximum ${currencyFormatter.format(this.maxBuyIn)}`;
    }
    if (this.buyInFormControl.value < this.minBuyIn) {
      return `Minimum ${currencyFormatter.format(this.minBuyIn)}`;
    }
    return '';
  }

  decimalFilter(event: any) {
    const reg = /^-?\d*(\.\d{0,1})?$/;
    let input = event.target.value + String.fromCharCode(event.charCode);
 
    if (!reg.test(input)) {
        event.preventDefault();
    }
  }

  getFormattedCurrency(value: number) {
    return currencyFormatter.format(value);
  }

  onSliderChange(event: any) {
    if (this.buyInFormControl.value !== event.detail.value) {
      this.buyInFormControl.setValue(event.detail.value);
    }
  }
}