import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { ToastController } from '@ionic/angular';

import { AuthService } from 'src/app/services/auth/auth.service';
import { GameData, GameService, GameUpdateRequest } from 'src/app/services/game/game.service';

@Component({
  selector: 'app-game-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class GameSettingsComponent implements OnInit {
  public gameData?: GameData;

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

  private lastCheckedMinBuyIn: number = 0;
  private lastCheckedMaxBuyIn: number = 0;

  constructor(
    private authService: AuthService, 
    private gameService: GameService,
    private toastController: ToastController,
    private _formBuilder: FormBuilder
  ) {}

  /**
   * Sets up the settings form group based on game data
   */
  ngOnInit() {
    this.settingsFormGroup.disable();
    this.subscribeToGameData();
  }

  /**
   * Subscribes to the current game data being displayed, initializing the settings based on this data
   */
  subscribeToGameData() {
    this.gameService.currentGameSubject.subscribe(gameData => {
      if (gameData.name) {
        this.gameData = gameData;
        if (gameData.admin.id === this.authService.getCurrentUser()?.id) {
          this.settingsFormGroup.enable();
        }
        this.populateSettings(gameData);
      }
    });
  }

  /**
   * Populates the settings based on the provided game data
   * 
   * @param {GameData} gameData The game data driving the settings
   */
  populateSettings(gameData: GameData) {
    this.buyInEnabledFormControl.setValue(gameData.settings.buyInEnabled);
    this.minBuyInFormControl.setValue(gameData.settings.minBuyIn);
    this.maxBuyInFormControl.setValue(gameData.settings.maxBuyIn);
    this.subscribeToMinMaxBuyInChanges();
  }

  /**
   * Subscribes to changes in the min and max buy-in values, cross-checking them against each-other as well
   */
  subscribeToMinMaxBuyInChanges() {
    this.minBuyInFormControl.valueChanges.subscribe(value => {
      if (value !== this.lastCheckedMinBuyIn) {
        value = Number(value);
        this.validateMinBuyIn(value);
        this.validateMaxBuyIn(this.maxBuyInFormControl.value);
        this.lastCheckedMinBuyIn = value;
        if (value) {
          this.minBuyInFormControl.setValue(value);
        }
      }
    });
    this.maxBuyInFormControl.valueChanges.subscribe(value => {
      if (value !== this.lastCheckedMaxBuyIn) {
        value = Number(value);
        this.validateMaxBuyIn(value);
        this.validateMinBuyIn(this.minBuyInFormControl.value);
        this.lastCheckedMaxBuyIn = value;
        if (value) {
          this.maxBuyInFormControl.setValue(value);
        }
      }
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
      this.minBuyInFormControl.setErrors({'required': true});
      return;
    }
    if (this.maxBuyInFormControl.value && value > this.maxBuyInFormControl.value) {
      this.minBuyInFormControl.setErrors({'conflict': true});
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
      this.minBuyInFormControl.setErrors({'required': true});
      return;
    }
    if (this.minBuyInFormControl.value && value < this.minBuyInFormControl.value) {
      this.maxBuyInFormControl.setErrors({'conflict': true});
    } else {
      this.maxBuyInFormControl.setErrors(null);
    }
  }

  /**
   * @param {number} index Describes whether it is the minimum or maximum buy-in control
   * 
   * @returns {string} The relevant error message relating to the minimum or maximum buy-in controls
   */
  getErrorMessage(index: number): string {
    const control = !index ? this.minBuyInFormControl : this.maxBuyInFormControl;
    if (control.errors?.['conflict']) {
      return `Conflicts with ${!index ? 'maximum' : 'minimum'} buy-in`;
    }
    if (control.errors?.['required']) {
      return 'Required';
    }
    return '';
  }

  /**
   * Ensures that validation messages appear as soon as user input is detected
   * 
   * @param {FormControl} control The formControl assocaited with the input
   */
  onFocus = (control: FormControl) => control.markAsTouched();

  /**
   * Ensures the minimum buy in always has a value after focus out
   */
  onMinBuyInFocusOut() {
    if (!this.minBuyInFormControl.value) {
      this.minBuyInFormControl.setValue(this.gameData?.settings.minBuyIn);
    }
  }

  /**
   * Ensures the maximum buy in always has a value after focus out
   */
  onMaxBuyInFocusOut() {
    if (!this.maxBuyInFormControl.value) {
      this.maxBuyInFormControl.setValue(this.gameData?.settings.maxBuyIn);
    }
  }

  /**
   * Saves the game settings by compiling form controls and their values as key-value pairs
   */
  saveSettings() {
    if (this.gameData) {
      let updateRequests: GameUpdateRequest[] = [];
      Object.keys(this.settingsFormGroup.controls).forEach(controlName => {
        updateRequests.push({
          attribute: this.formControlNameMappings[controlName],
          value: this.settingsFormGroup.controls[controlName].value,
        });
      });
      this.gameService.updateGameSettings(this.gameData.id, updateRequests)
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
    if (this.gameData) {
      this.populateSettings(this.gameData);
      this.settingsFormGroup.markAsPristine();
    }
  }

  /**
   * @returns {boolean} Whether the current user is the game admin
   */
  isGameAdmin = (): boolean => this.authService.getCurrentUser()?.id === this.gameData?.admin.id;

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
