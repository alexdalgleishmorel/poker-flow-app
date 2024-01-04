import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { ToastController } from '@ionic/angular';

import { AuthService } from 'src/app/services/auth/auth.service';
import { PoolData, PoolService, PoolUpdateRequest } from 'src/app/services/pool/pool.service';

@Component({
  selector: 'app-game-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class GameSettingsComponent implements OnInit {
  public poolData?: PoolData;

  public buyInEnabledFormControl = new FormControl();
  public minBuyInFormControl = new FormControl();
  public maxBuyInFormControl = new FormControl();
  public settingsFormGroup: FormGroup = this._formBuilder.group({
    buyInEnabledFormControl: this.buyInEnabledFormControl,
    minBuyInFormControl: this.minBuyInFormControl,
    maxBuyInFormControl: this.maxBuyInFormControl
  });

  private formControlNameMappings: any = {
    minBuyInFormControl: 'min_buy_in',
    maxBuyInFormControl: 'max_buy_in',
    buyInEnabledFormControl: 'buy_in_enabled',
  }

  constructor(
    private authService: AuthService, 
    private poolService: PoolService,
    private toastController: ToastController,
    private _formBuilder: FormBuilder
  ) {}

  /**
   * Sets up the settings form group based on pool data
   */
  ngOnInit() {
    this.settingsFormGroup.disable();
    this.subscribeToPoolData();
  }

  /**
   * Subscribes to the current pool data being displayed, initializing the settings based on this data
   */
  subscribeToPoolData() {
    this.poolService.currentPoolSubject.subscribe(poolData => {
      if (poolData.name) {
        this.poolData = poolData;
        if (this.poolData.admin.id === this.authService.getCurrentUser()?.id) {
          this.settingsFormGroup.enable();
        }
        this.populateSettings(this.poolData);
      }
    });
  }

  /**
   * Populates the settings based on the provided pool data
   * 
   * @param {PoolData} poolData The pool data driving the settings
   */
  populateSettings(poolData: PoolData) {
    this.buyInEnabledFormControl.setValue(poolData.settings.buy_in_enabled);
    this.minBuyInFormControl.setValue(poolData.settings.min_buy_in);
    this.maxBuyInFormControl.setValue(poolData.settings.max_buy_in);
  }
  /**
   * Ensures the minimum buy in always has a value after focus out
   */
  onMinBuyInFocusOut() {
    if (!this.minBuyInFormControl.value) {
      this.minBuyInFormControl.setValue(this.poolData?.settings.min_buy_in);
    }
  }

  /**
   * Ensures the maximum buy in always has a value after focus out
   */
  onMaxBuyInFocusOut() {
    if (!this.maxBuyInFormControl.value) {
      this.maxBuyInFormControl.setValue(this.poolData?.settings.max_buy_in);
    }
  }

  /**
   * Saves the pool settings by compiling form controls and their values as key-value pairs
   */
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
        .then(async () => {
          const toast = await this.toastController.create({
            message: `Settings Updated`,
            cssClass: 'centered-text',
            duration: 1000,
            position: 'top',
            color: 'success'
          });
          await toast.present();
          this.settingsFormGroup.markAsPristine();
        });
    }
  }

  /**
   * Resets the settings form to its initial state
   */
  cancelChanges() {
    if (this.poolData) {
      this.populateSettings(this.poolData);
      this.settingsFormGroup.markAsPristine();
    }
  }

  /**
   * @returns {boolean} Whether the current user is the pool admin
   */
  isPoolAdmin = (): boolean => this.authService.getCurrentUser()?.id === this.poolData?.admin.id;
}
