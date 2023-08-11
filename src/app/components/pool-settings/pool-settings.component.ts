import { Component, OnChanges, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PoolData, PoolService, PoolUpdateRequest } from 'src/app/services/pool/pool.service';

@Component({
  selector: 'app-pool-settings',
  templateUrl: './pool-settings.component.html',
  styleUrls: ['./pool-settings.component.scss']
})
export class PoolSettingsComponent implements OnInit {
  private setup: boolean = false;
  private poolData?: PoolData;

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

  ngOnInit(): void {
    this.settingsFormGroup.disable();

    this.poolService.poolByID.subscribe((poolData: PoolData) => {
      this.poolData = poolData;

      if (this.poolData) {
        if (this.poolData.admin.id === this.authService.getCurrentUser()?.id) {
          this.settingsFormGroup.enable();
        }

        if (!this.setup) {
          this.setup = true;
          this.buyInEnabledFormControl.setValue(this.poolData.settings.buy_in_enabled);
          this.minBuyInFormControl.setValue(this.poolData.settings.min_buy_in);
          this.maxBuyInFormControl.setValue(this.poolData.settings.max_buy_in);
        }
      }
    });
  }

  onMinBuyInFocusOut() {
    if (!this.minBuyInFormControl.value) this.minBuyInFormControl.setValue(this.poolData?.settings.min_buy_in);
  }

  onMaxBuyInFocusOut() {
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
        .then(() => {
          this.settingsFormGroup.markAsPristine();
        });
    }
  }

  isPoolAdmin() {
    return this.authService.getCurrentUser()?.id === this.poolData?.admin.id;
  }
}