import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PoolData, PoolService, PoolUpdateRequest } from 'src/app/services/pool/pool.service';

@Component({
  selector: 'app-pool-settings-view',
  templateUrl: './pool-settings-view.component.html',
  styleUrls: ['./pool-settings-view.component.scss']
})
export class PoolSettingsViewComponent implements OnChanges {
  @Input() poolData?: PoolData;
  @Output() poolDataChange = new EventEmitter<PoolData>();
  private setup: boolean = false;

  private formControlNameMappings: any = {
    minBuyInFormControl: 'min_buy_in',
    maxBuyInFormControl: 'max_buy_in',
    buyInEnabledFormControl: 'buy_in_enabled',
  }

  public minBuyInFormControl = new FormControl();
  public maxBuyInFormControl = new FormControl();
  public buyInEnabledFormControl = new FormControl();

  public settingsFormGroup: FormGroup = this._formBuilder.group({
    buyInEnabledFormControl: this.buyInEnabledFormControl,
    minBuyInFormControl: this.minBuyInFormControl,
    maxBuyInFormControl: this.maxBuyInFormControl
  });

  constructor(
    private authService: AuthService,
    private poolService: PoolService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnChanges(): void {
    if (this.poolData) {
      if (this.poolData.admin.id !== this.authService.getCurrentUser()?.id) this.settingsFormGroup.disable();

      if (!this.setup) {
        this.setup = true;
        this.buyInEnabledFormControl.setValue(this.poolData.settings.buy_in_enabled);
        this.minBuyInFormControl.setValue(this.poolData.settings.min_buy_in);
        this.maxBuyInFormControl.setValue(this.poolData.settings.max_buy_in);
      }
    }
  }

  onMinBuyInBlur() {
    if (!this.minBuyInFormControl.value) this.minBuyInFormControl.setValue(this.poolData?.settings.min_buy_in);
  }

  onMaxBuyInBlur() {
    if (!this.maxBuyInFormControl.value) this.maxBuyInFormControl.setValue(this.poolData?.settings.max_buy_in);
  }

  saveSettings() {
    if (this.poolData) {
      let updateRequests: PoolUpdateRequest[] = [];
      Object.keys(this.settingsFormGroup.controls).forEach(controlName => {
        updateRequests.push({
          attribute: this.formControlNameMappings[controlName],
          value: this.settingsFormGroup.controls[controlName].value,
        });
      });
      this.poolService.updatePoolSettings(this.poolData.id, updateRequests)
        .then((poolData: any) => {
          this.poolDataChange.emit(poolData);
          this.settingsFormGroup.markAsPristine();
        });
    }
  }
}
