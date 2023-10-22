import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DEFAULT_DENOMINATIONS, DEFAULT_MAX_BUY_IN, DEFAULT_MIN_BUY_IN } from '@constants';
import { ModalController } from '@ionic/angular';
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
    has_password: false,
    min_buy_in: DEFAULT_MIN_BUY_IN,
    max_buy_in: DEFAULT_MAX_BUY_IN,
    denominations: DEFAULT_DENOMINATIONS
  };

  constructor(
    private modalCtrl: ModalController,
    private poolService: PoolService,
    private router: Router,
    private _formBuilder: FormBuilder
  ) {
    
    this.minBuyInFormControl.valueChanges.subscribe((value) => {
      this.validateMinBuyIn(value);
      this.validateMaxBuyIn(this.maxBuyInFormControl.value);
      this.poolSettings.min_buy_in = value ? value : DEFAULT_MIN_BUY_IN;
    });

    this.maxBuyInFormControl.valueChanges.subscribe((value) => {
      this.validateMaxBuyIn(value);
      this.validateMinBuyIn(this.minBuyInFormControl.value);
      this.poolSettings.max_buy_in = value ? value : DEFAULT_MAX_BUY_IN;
    });

    this.poolSettings = {
      has_password: false,
      min_buy_in: DEFAULT_MIN_BUY_IN,
      max_buy_in: DEFAULT_MAX_BUY_IN,
      denominations: DEFAULT_DENOMINATIONS.slice(0, DEFAULT_DENOMINATIONS.length)
    }
  }

  validateMinBuyIn(value: number|null) {
    if (!value) {
      return;
    }
    if (this.maxBuyInFormControl.value && value > this.maxBuyInFormControl.value) {
      this.minBuyInFormControl.setErrors({'error': true});
    } else {
      this.minBuyInFormControl.setErrors(null);
    }
  }

  validateMaxBuyIn(value: number|null) {
    if (!value) {
      return;
    }
    if (this.minBuyInFormControl.value && value < this.minBuyInFormControl.value) {
      this.maxBuyInFormControl.setErrors({'error': true});
    } else {
      this.maxBuyInFormControl.setErrors(null);
    }
  }

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

  cancel() {
    this.modalCtrl.dismiss(null);
  }

  trackByFn(index: any, item: any) {
    return index;  
  }

  onMinBuyInFocusOut() {
    if (!this.minBuyInFormControl.value) this.minBuyInFormControl.setValue(DEFAULT_MIN_BUY_IN);
  }

  onMaxBuyInFocusOut() {
    if (!this.maxBuyInFormControl.value) this.maxBuyInFormControl.setValue(DEFAULT_MAX_BUY_IN);
  }

  decimalFilter(event: any) {
    const reg = /^-?\d*(\.\d{0,1})?$/;
    let input = event.target.value + String.fromCharCode(event.charCode);
 
    if (!reg.test(input)) {
        event.preventDefault();
    }
  }
}
