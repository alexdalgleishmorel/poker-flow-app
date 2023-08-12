import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DEFAULT_DENOMINATIONS, DEFAULT_MAX_BUY_IN, DEFAULT_MIN_BUY_IN } from '@constants';
import { DeviceService, PokerFlowDevice } from 'src/app/services/device/device.service';
import { PoolService, PoolSettings } from 'src/app/services/pool/pool.service';

@Component({
  selector: 'app-create-game-modal',
  templateUrl: './create-game-modal.component.html',
  styleUrls: ['./create-game-modal.component.scss']
})
export class CreateGameModalComponent {
  @Output() modalResult = new EventEmitter<number|null>;

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

  public passwordFormControl = new FormControl('');

  public passwordFormGroup: FormGroup = this._formBuilder.group({
    passwordFormControl: this.passwordFormControl
  });

  public mainFormGroup: FormGroup = this._formBuilder.group({
    poolNameFormGroup: this.poolNameFormGroup,
    buyInFormGroup: this.buyInFormGroup,
    passwordFormGroup: this.passwordFormGroup
  });

  public poolSettings: PoolSettings = {
    has_password: false,
    min_buy_in: DEFAULT_MIN_BUY_IN,
    max_buy_in: DEFAULT_MAX_BUY_IN,
    denominations: DEFAULT_DENOMINATIONS
  };
  public device?: PokerFlowDevice;

  constructor(
    private deviceService: DeviceService,
    private poolService: PoolService,
    private _formBuilder: FormBuilder
  ) {

    this.deviceService.connectToDevice().then((device: PokerFlowDevice|null) => {
      if (device) {
        this.device = device;
        //this.device.assignDeviceStatus();
        this.device.status.subscribe(() => {
          if (device.id) {
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
        
            this.passwordFormControl.valueChanges.subscribe((value) => {
              this.poolSettings.has_password = value ? true : false;
              this.poolSettings.password = value ? value : '';
            });
        
            this.poolSettings = {
              has_password: false,
              min_buy_in: DEFAULT_MIN_BUY_IN,
              max_buy_in: DEFAULT_MAX_BUY_IN,
              denominations: DEFAULT_DENOMINATIONS.slice(0, device.slots)
            }
          }
        });
      }
    });
  }

  validateMinBuyIn(value: number|null) {
    console.log('min validate');
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
    console.log('max validate');
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
    if (!this.mainFormGroup.valid || !this.device) {
      return;
    }

    this.poolSettings.denominations.sort((a,b)=>a-b);
    this.poolService.createPool(
      this.poolNameFormControl.value!,
      this.device.id!,
      this.poolSettings
    ).then((poolCreationResponse: any) => {
      this.modalResult.emit(poolCreationResponse.id);
    });
  }

  cancel() {
    this.modalResult.emit(null);
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
}
