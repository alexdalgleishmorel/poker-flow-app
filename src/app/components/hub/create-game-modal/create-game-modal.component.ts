import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

import { DEFAULT_DENOMINATION_COUNT, DEFAULT_DENOMINATIONS, DEFAULT_MAX_BUY_IN, DEFAULT_MIN_BUY_IN } from '@constants';
import { PoolService, PoolSettings } from 'src/app/services/pool/pool.service';

@Component({
  selector: 'app-create-game-modal',
  templateUrl: './create-game-modal.component.html',
  styleUrls: ['./create-game-modal.component.scss']
})
export class CreateGameModalComponent {
  public poolNameFormControl = new FormControl('', [Validators.required]);
  public poolNameFormGroup: FormGroup = this._formBuilder.group({
    poolName: this.poolNameFormControl,
  });

  public minBuyInFormControl = new FormControl(DEFAULT_MIN_BUY_IN, [Validators.required]);
  public maxBuyInFormControl = new FormControl(DEFAULT_MAX_BUY_IN, [Validators.required]);
  public buyInFormGroup: FormGroup = this._formBuilder.group({
    minBuyInFormControl: this.minBuyInFormControl,
    maxBuyInFormControl: this.maxBuyInFormControl
  });

  public mainFormGroup: FormGroup = this._formBuilder.group({
    poolNameFormGroup: this.poolNameFormGroup,
    buyInFormGroup: this.buyInFormGroup
  });

  public poolSettings: PoolSettings = {
    min_buy_in: DEFAULT_MIN_BUY_IN,
    max_buy_in: DEFAULT_MAX_BUY_IN,
    denominations: DEFAULT_DENOMINATIONS.slice(0, DEFAULT_DENOMINATION_COUNT)
  };

  constructor(
    private modalCtrl: ModalController,
    private poolService: PoolService,
    private router: Router,
    private _formBuilder: FormBuilder
  ) {
    this.subscribeToMinMaxBuyInChanges();
  }

  /**
   * Subscribes to changes in the min and max buy-in values, cross-checking them against each-other as well
   */
  subscribeToMinMaxBuyInChanges() {
    this.minBuyInFormControl.valueChanges.subscribe((value) => {
      value = Number(value);
      this.validateMinBuyIn(value);
      this.validateMaxBuyIn(this.maxBuyInFormControl.value);
      this.poolSettings.min_buy_in = value ? value : DEFAULT_MIN_BUY_IN;
    });
    this.maxBuyInFormControl.valueChanges.subscribe((value) => {
      value = Number(value);
      this.validateMaxBuyIn(value);
      this.validateMinBuyIn(this.minBuyInFormControl.value);
      this.poolSettings.max_buy_in = value ? value : DEFAULT_MAX_BUY_IN;
    });
  }

  /**
   * Validates the minimum buy-in value
   * 
   * @param {number|null} value The value to validate
   */
  validateMinBuyIn(value: number|null) {
    value = Number(value);
    if (!value) {
      return;
    }
    if (this.maxBuyInFormControl.value && value > this.maxBuyInFormControl.value) {
      this.minBuyInFormControl.setErrors({'error': true});
    } else {
      this.minBuyInFormControl.setErrors(null);
    }
  }

  /**
   * Validates the maximum buy-in value
   * 
   * @param {number|null} value The value to validate
   */
  validateMaxBuyIn(value: number|null) {
    value = Number(value);
    if (!value) {
      return;
    }
    if (this.minBuyInFormControl.value && value < this.minBuyInFormControl.value) {
      this.maxBuyInFormControl.setErrors({'error': true});
    } else {
      this.maxBuyInFormControl.setErrors(null);
    }
  }

  /**
   * Creates a game based on the combined form values, navigating to the new game if successful
   */
  createGame() {
    if (!this.mainFormGroup.valid) {
      return;
    }

    this.poolSettings.denominations.sort((a,b)=>a-b);
    this.poolService.createPool(
      this.poolNameFormControl.value!,
      this.poolSettings
    ).then((poolData: any) => {
      this.router.navigate(['/', `pool`, poolData.id]);
      this.modalCtrl.dismiss(poolData);
    });
  }

  /**
   * Closes the modal
   */
  cancel() {
    this.modalCtrl.dismiss(null);
  }

  /**
   * Ensures that validation messages appear as soon as user input is detected
   * 
   * @param {FormControl} control The formControl assocaited with the input
   */
  onFocus = (control: FormControl) => control.markAsTouched();

  /**
   * Handles when the minimum buy-in input loses focus
   */
  onMinBuyInFocusOut() {
    if (!this.minBuyInFormControl.value) this.minBuyInFormControl.setValue(DEFAULT_MIN_BUY_IN);
  }

  /**
   * Handles when the maximum buy-in input loses focus
   */
  onMaxBuyInFocusOut() {
    if (!this.maxBuyInFormControl.value) this.maxBuyInFormControl.setValue(DEFAULT_MAX_BUY_IN);
  }

  /**
   * A filter that ensures the user can only provide positive integers (no decimals)
   * 
   * @param event The event containing the input to filter
   */
  decimalFilter(event: any) {
    const reg = /^\d*$/;
    let input = event.target.value + String.fromCharCode(event.charCode);

    if (!reg.test(input)) {
      event.preventDefault();
    }
  }
}
