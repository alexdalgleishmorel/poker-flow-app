import { Component, Input, OnChanges } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PoolData } from 'src/app/services/pool/pool.service';

@Component({
  selector: 'app-pool-settings-view',
  templateUrl: './pool-settings-view.component.html',
  styleUrls: ['./pool-settings-view.component.scss']
})
export class PoolSettingsViewComponent implements OnChanges {
  @Input() poolData?: PoolData;
  private setup: boolean = false;

  public minBuyInFormControl = new FormControl('');
  public maxBuyInFormControl = new FormControl('');
  public buyInEnabledFormControl = new FormControl();

  public settingsFormGroup: FormGroup = this._formBuilder.group({
    buyInEnabledFormControl: this.buyInEnabledFormControl,
    minBuyInFormControl: this.minBuyInFormControl,
    maxBuyInFormControl: this.maxBuyInFormControl
  });

  constructor(
    private authService: AuthService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnChanges(): void {
    if (this.poolData) {
      if (this.poolData.admin.id !== this.authService.getCurrentUser()?.id) this.settingsFormGroup.disable();

      if (!this.setup) {
        this.setup = true;
        this.buyInEnabledFormControl.setValue(true);
        this.minBuyInFormControl.setValue(this.poolData.settings.min_buy_in.toString());
        this.maxBuyInFormControl.setValue(this.poolData.settings.max_buy_in.toString());
      }
    }
  }

  onMinBuyInBlur() {
    if (!this.minBuyInFormControl.value) this.minBuyInFormControl.setValue(this.poolData?.settings.min_buy_in.toString()!);
  }

  onMaxBuyInBlur() {
    if (!this.maxBuyInFormControl.value) this.maxBuyInFormControl.setValue(this.poolData?.settings.max_buy_in.toString()!);
  }

  saveSettings() {
    this.settingsFormGroup.markAsPristine();
  }
}
