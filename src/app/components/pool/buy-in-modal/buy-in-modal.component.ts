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
  public manualInputFormControl: FormControl = new FormControl(0);
  public buyInStep: number = 1;
  public form: FormGroup;

  public distributionView: boolean = false;
  public chipDistributionFormControl: FormControl = new FormControl(0);
  public chipLockStatuses: boolean[] = [];
  public chipDistributionMax: number = 0;

  public selectedSlot: number = -1;

  private lastValidBuyIn: number = 0;
  
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private modalCtrl: ModalController,
    private poolService: PoolService,
    private _formBuilder: FormBuilder
  ) {
    this.form = this._formBuilder.group({ buyIn: this.buyInFormControl });
  }

  ngOnInit(): void {
    const eligibleDenoms = this.denominations.filter(denom => denom >= 1);
    this.buyInStep = eligibleDenoms.length ? eligibleDenoms[0] : 1;
    this.buyInFormControl.setValue(this.minBuyIn);

    this.chipLockStatuses = this.denominations.map(() => false);
    this.chipDistributionFormControl.valueChanges.subscribe(value => this.adjustAssignmentDistributions(value));
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
    }).then(() => this.buyInConfirmed = true);
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

  onBuyInSliderChange(event: any) {
    if (this.buyInFormControl.value !== event.detail.value) {
      this.buyInFormControl.setValue(event.detail.value);
    }
  }

  enableDistributionView() {
    this.distributionView = true;
  }

  onChipSelect(index: number) {
    this.selectedSlot = index;
    this.chipDistributionFormControl.setValue(this.assignments[this.selectedSlot]);
    this.chipDistributionMax = this.buyInFormControl.value/this.denominations[this.selectedSlot];
    this.onChipLockStatusesChange(this.chipLockStatuses);
  }

  onChipLockStatusesChange(chipLockStatuses: boolean[]) {
    this.chipLockStatuses = chipLockStatuses;
    this.chipLockStatuses[this.selectedSlot] ? this.chipDistributionFormControl.disable() : this.chipDistributionFormControl.enable();
  }

  onDistributionSliderChange(event: any) {
    if (this.chipDistributionFormControl.value !== event.detail.value) {
      this.chipDistributionFormControl.setValue(+event.detail.value.toFixed(2));
    }
  }

  adjustAssignmentDistributions(targetChipCount: number) {
    let amountToDistribute = (this.assignments[this.selectedSlot] * this.denominations[this.selectedSlot]) - (targetChipCount * this.denominations[this.selectedSlot]);
    amountToDistribute = +amountToDistribute.toFixed(2);

    let availableDenominationsIndexes: number[] = [];
    let availableDenominationsQuantities: number[] = [];
    const availableDenominations = this.denominations.filter((value, index) => {
      if ((!this.chipLockStatuses[index]) &&  value !== this.denominations[this.selectedSlot]) {
        if (amountToDistribute < 0 && this.assignments[index] <= 0) {
          return false;
        }
        availableDenominationsIndexes.push(index);
        availableDenominationsQuantities.push(amountToDistribute < 0 ? this.assignments[index] : 10000);
        return true;
      }
      return false;
    });

    if (amountToDistribute !== 0) {
      const result = canSumToTarget(availableDenominations, availableDenominationsQuantities, Math.abs(amountToDistribute));
      if (result.achievable) {
        this.assignments[this.selectedSlot] = targetChipCount;
        availableDenominations.forEach((denom, index) => {
          if (amountToDistribute < 0 && result.distribution) {
            this.assignments[availableDenominationsIndexes[index]] -= result.distribution[index];
          } else if (amountToDistribute > 0 && result.distribution) {
            this.assignments[availableDenominationsIndexes[index]] += result.distribution[index];
          }
        });
      }
    }
  }

  handleManualBuyIn(event: any) {
    const value = event.target.value;
    const filteredValue = +value.replace(/[^0-9]/g, '');

    if (filteredValue <= this.maxBuyIn) {
      this.buyInFormControl.setValue(filteredValue);
      this.lastValidBuyIn = filteredValue;
    }

    this.manualInputFormControl.setValue(this.lastValidBuyIn ? this.lastValidBuyIn : this.buyInFormControl.value);
  }

  handleManualFocus() {
    this.manualInputFormControl.setValue(this.buyInFormControl.value);
  }
}

function canSumToTarget(denominations: number[], quantities: number[], target: number): { achievable: boolean, distribution?: number[] } {
  let scaledDenominations = denominations.map(d => Math.round(d * 100));
  let scaledTarget = Math.round(target * 100);
  
  let dp = new Array(scaledTarget + 1).fill(false);
  let distribution = new Array(scaledTarget + 1).fill(null).map(() => new Array(denominations.length).fill(0));
  
  dp[0] = true;

  for (let i = 0; i < scaledDenominations.length; i++) {
      for (let j = scaledDenominations[i]; j <= scaledTarget; j++) {
          if (dp[j - scaledDenominations[i]] && distribution[j - scaledDenominations[i]][i] < quantities[i]) {
              dp[j] = true;
              let currentDistribution = distribution[j - scaledDenominations[i]].slice();
              currentDistribution[i]++;
              distribution[j] = currentDistribution;
          }
      }
  }

  if (dp[scaledTarget]) {
      return { achievable: true, distribution: distribution[scaledTarget] };
  } else {
      return { achievable: false };
  }
}
