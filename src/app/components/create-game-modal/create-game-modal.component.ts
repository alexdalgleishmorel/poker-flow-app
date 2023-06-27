import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DEFAULT_DENOMINATIONS, DEFAULT_MAX_BUY_IN, DEFAULT_MIN_BUY_IN } from '@constants';
import { PokerFlowDevice } from 'src/app/services/device/device.service';
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

  public minBuyInFormControl = new FormControl(`${DEFAULT_MIN_BUY_IN}`, [Validators.required]);
  public maxBuyInFormControl = new FormControl(`${DEFAULT_MAX_BUY_IN}`, [Validators.required]);

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

  public poolSettings: PoolSettings;
  private device: PokerFlowDevice;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<CreateGameModalComponent>,
    private poolService: PoolService,
    private _formBuilder: FormBuilder
  ) {

    this.minBuyInFormControl.valueChanges.subscribe((value) => {
      this.poolSettings.min_buy_in = value ? +value : DEFAULT_MIN_BUY_IN;
    });

    this.maxBuyInFormControl.valueChanges.subscribe((value) => {
      this.poolSettings.max_buy_in = value ? +value : DEFAULT_MAX_BUY_IN;
    });

    this.passwordFormControl.valueChanges.subscribe((value) => {
      this.poolSettings.has_password = value ? true : false;
      this.poolSettings.password = value ? value : '';
    }); 

    this.device = data.device;
    this.poolSettings = {
      has_password: false,
      min_buy_in: DEFAULT_MIN_BUY_IN,
      max_buy_in: DEFAULT_MAX_BUY_IN,
      denominations: DEFAULT_DENOMINATIONS.slice(0, this.device.slots)
    }
  }

  createGame() {
    if (!this.mainFormGroup.valid) return;

    this.poolSettings.denominations.sort((a,b)=>a-b);
    this.poolService.createPool(
      this.poolNameFormControl.value!,
      this.device.id,
      this.poolSettings
    ).then((poolCreationResponse) => {
      this.dialogRef.close(poolCreationResponse);
    });
  }

  cancel() {
    this.dialogRef.close(null);
  }

  trackByFn(index: any, item: any) {
    return index;  
  }

  onMinBuyInBlur() {
    if (!this.minBuyInFormControl.value) this.minBuyInFormControl.setValue(`${DEFAULT_MIN_BUY_IN}`);
  }

  onMaxBuyInBlur() {
    if (!this.maxBuyInFormControl.value) this.maxBuyInFormControl.setValue(`${DEFAULT_MAX_BUY_IN}`);
  }
}
