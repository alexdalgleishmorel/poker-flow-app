import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

import { currencyFormatter } from 'src/app/app.component';
import { GameService, TransactionType } from 'src/app/services/game/game.service';

@Component({
  selector: 'app-buy-in-modal',
  templateUrl: './buy-in-modal.component.html',
  styleUrls: ['./buy-in-modal.component.scss']
})
export class BuyInModalComponent implements OnInit, AfterViewInit {
  @Input() denominations: number[] = [];
  @Input() maxBuyIn: number = 0;
  @Input() minBuyIn: number = 0;
  @Input() gameID: string = '';
  @Input() userID: number = 0;

  /* Attributes relating to core functionality */
  public assignments: number[] = [];
  public buyInConfirmed: boolean = false;
  public buyInFormControl: FormControl = new FormControl(0);
  public buyInStep: number = 1;
  public form: FormGroup = this._fb.group({ buyIn: this.buyInFormControl });
  public manualInputFormControl: FormControl = new FormControl(0);
  private lastValidBuyIn: number = 0;

  /* Attributes relating to distribution view functionality */
  public distributionView: boolean = false;
  public chipDistributionFormControl: FormControl = new FormControl(0);
  public chipLockStatuses: boolean[] = [];
  public chipDistributionMax: number = 0;
  public selectedSlot: number = -1;
  
  constructor(private cdRef: ChangeDetectorRef, private modalCtrl: ModalController, private gameService: GameService, private _fb: FormBuilder) {}

  /**
   * Performs initial buy-in modal setup
   */
  ngOnInit() {
    this.initializeChipDistribution();
  }

  /**
   * Performs setup after the view has been initialized
   */
  ngAfterViewInit() {
    this.initializeBuyInFormControl();
  }

  /**
   * Initializes the buy-in form control, must be invoked after view initialization
   */
  initializeBuyInFormControl() {
    this.buyInFormControl.setValue(this.minBuyIn);
    this.buyInFormControl.setValidators([
      Validators.required,
      Validators.min(this.minBuyIn), 
      Validators.max(this.maxBuyIn),
      this.buyInValidator()
    ]);
    this.buyInFormControl.updateValueAndValidity();
    this.cdRef.detectChanges();
  }

  /**
   * Initializes attributes to setup for the chip distribution view
   */
  initializeChipDistribution() {
    this.assignments = this.denominations.map(() => 0);
    this.chipLockStatuses = this.denominations.map(() => false);
    this.chipDistributionFormControl.valueChanges.subscribe(value => this.adjustAssignmentDistributions(value));
  }

  /**
   * Closes the modal as a success
   */
  closeWithSuccess() {
    this.modalCtrl.dismiss(true);
  }

  /**
   * Confirms the buy-in by posting it as a transaction
   */
  confirmBuyIn() {
    this.gameService.postTransaction({
      gameID: this.gameID,
      profileID: this.userID,
      type: TransactionType.BUY_IN,
      amount: this.buyInFormControl.value
    }).then(() => this.buyInConfirmed = true);
  }

  /**
   * Closes the modal as a cancellation
   */
  cancelBuyIn() {
    this.modalCtrl.dismiss(null);
  }

  /**
   * Resets all assigned chip values to zero
   */
  resetAssignments() {
    this.assignments.fill(0);
  }

  /**
   * Determines whether the given value can be achieved using the current denominations
   * 
   * @param {number} value The value to achieve
   * 
   * @returns {boolean} Whether the given value can be achieved with the current denominations
   */
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

  /**
   * Creates a validator function for the buyInFormControl
   * 
   * @returns {ValidatorFn} The validator function
   */
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

  /**
   * @returns {string} The error message associated with the buyInFormControl
   */
  getErrorMessage(): string {
    if (this.buyInFormControl.value > this.maxBuyIn) {
      return `Maximum ${currencyFormatter.format(this.maxBuyIn)}`;
    }
    if (this.buyInFormControl.value < this.minBuyIn) {
      return `Minimum ${currencyFormatter.format(this.minBuyIn)}`;
    }
    if (this.buyInFormControl.errors?.['insufficientInventory']) {
      return "Cannot match with available denominations";
    }
    return 'EMPTY';
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

  /**
   * Handles buyInSlider change events
   * 
   * @param {any} event The slider change event 
   */
  onBuyInSliderChange(event: any) {
    if (this.buyInFormControl.value !== event.detail.value) {
      this.buyInFormControl.setValue(event.detail.value);
    }
  }

  /**
   * Enables the chip distribution view
   */
  enableDistributionView() {
    this.distributionView = true;
  }

  /**
   * Handles a given chip index being selected
   * 
   * @param {number} index The index of the selected chip
   */
  onChipSelect(index: number) {
    this.selectedSlot = index;
    this.chipDistributionFormControl.setValue(this.assignments[this.selectedSlot]);
    this.chipDistributionMax = this.buyInFormControl.value/this.denominations[this.selectedSlot];
    this.onChipLockStatusesChange(this.chipLockStatuses);
  }

  /**
   * Handles chipLockStatus changes
   * 
   * @param {boolean} chipLockStatuses A chip lock status array
   */
  onChipLockStatusesChange(chipLockStatuses: boolean[]) {
    this.chipLockStatuses = chipLockStatuses;
    this.chipLockStatuses[this.selectedSlot] ? this.chipDistributionFormControl.disable() : this.chipDistributionFormControl.enable();
  }

  /**
   * Handles distributionSlider change events
   * 
   * @param {any} event The slider change event
   */
  onDistributionSliderChange(event: any) {
    if (this.chipDistributionFormControl.value !== event.detail.value) {
      this.chipDistributionFormControl.setValue(+event.detail.value.toFixed(2));
    }
  }

  /**
   * Adjusts the chip assignments to reach the target chip amount for the currently selected
   * denonmination, changing only the unlocked chip denomination amounts to achieve the target
   * 
   * @param {number} targetChipAmount The target chip count to have for the currently selected denomination
   */
  adjustAssignmentDistributions(targetChipAmount: number) {
    let amountToDistribute = (this.assignments[this.selectedSlot] * this.denominations[this.selectedSlot]) - (targetChipAmount * this.denominations[this.selectedSlot]);
    amountToDistribute = +amountToDistribute.toFixed(2);

    let availableDenominationsIndexes: number[] = [];
    let availableDenominationsQuantities: number[] = [];
    const availableDenominations = this.denominations.filter((value, index) => {
      if ((!this.chipLockStatuses[index]) &&  value !== this.denominations[this.selectedSlot]) {
        if (amountToDistribute < 0 && this.assignments[index] <= 0) {
          return false;
        }
        availableDenominationsIndexes.push(index);
        availableDenominationsQuantities.push(amountToDistribute < 0 ? this.assignments[index] : MAX_DENOM_QUANTITY);
        return true;
      }
      return false;
    });

    if (amountToDistribute !== 0) {
      const result = canSumToTarget(availableDenominations, availableDenominationsQuantities, Math.abs(amountToDistribute));
      if (result.achievable) {
        this.assignments[this.selectedSlot] = targetChipAmount;
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

  /**
   * Handles manual buy-in input events, when the user types their buy-in value
   * 
   * @param {any} event The manual input event
   */
  handleManualBuyIn(event: any) {
    const value = event.target.value;
    const filteredValue = +value.replace(/[^0-9]/g, '');

    if (filteredValue <= this.maxBuyIn) {
      this.buyInFormControl.setValue(filteredValue);
      this.lastValidBuyIn = filteredValue;
    }

    this.manualInputFormControl.setValue(this.lastValidBuyIn ? this.lastValidBuyIn : this.buyInFormControl.value);
  }

  /**
   * Handles setup logic when the user focuses onto the manual buy-in input
   */
  handleManualFocus() {
    this.manualInputFormControl.setValue(this.buyInFormControl.value);
  }
}

/**
 * Determines if a target amount can be achieved using given denominations with limited quantities
 * 
 * @param {number[]} denominations The available denominations to consider
 * @param {number[]} quantities The amount of chips available for each denomination
 * @param {number} target The target amount to be achieved using the denominations
 * 
 * @returns {object} Object describing if the target is achievable, and if so, the required set of denomination amounts
 */
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

const MAX_DENOM_QUANTITY = 1000000;
