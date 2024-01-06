import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

import { DEFAULT_DENOMINATION_COLORS, DEFAULT_DENOMINATION_COUNT, DEFAULT_DENOMINATIONS, DEFAULT_MAX_BUY_IN, DEFAULT_MIN_BUY_IN } from '@constants';
import { GameService, GameSettings } from 'src/app/services/game/game.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-create-game-modal',
  templateUrl: './create-game-modal.component.html',
  styleUrls: ['./create-game-modal.component.scss']
})
export class CreateGameModalComponent {
  public gameNameFormControl = new FormControl('', [Validators.required]);
  public gameNameFormGroup: FormGroup = this._formBuilder.group({
    gameName: this.gameNameFormControl,
  });

  public minBuyInFormControl = new FormControl(DEFAULT_MIN_BUY_IN, [Validators.required]);
  public maxBuyInFormControl = new FormControl(DEFAULT_MAX_BUY_IN, [Validators.required]);
  public buyInFormGroup: FormGroup = this._formBuilder.group({
    minBuyInFormControl: this.minBuyInFormControl,
    maxBuyInFormControl: this.maxBuyInFormControl
  });

  public mainFormGroup: FormGroup = this._formBuilder.group({
    gameNameFormGroup: this.gameNameFormGroup,
    buyInFormGroup: this.buyInFormGroup
  });

  public gameSettings: GameSettings = {
    minBuyIn: DEFAULT_MIN_BUY_IN,
    maxBuyIn: DEFAULT_MAX_BUY_IN,
    denominations: DEFAULT_DENOMINATIONS.slice(0, DEFAULT_DENOMINATION_COUNT),
    denominationColors: DEFAULT_DENOMINATION_COLORS.slice(0, DEFAULT_DENOMINATION_COUNT),
    buyInEnabled: true,
    expired: false
  };

  constructor(
    private authService: AuthService,
    private modalCtrl: ModalController,
    private gameService: GameService,
    private router: Router,
    private _formBuilder: FormBuilder
  ) {
    this.subscribeToMinMaxBuyInChanges();
  }

  /**
   * Subscribes to changes in the min and max buy-in values, cross-checking them against each-other as well
   */
  subscribeToMinMaxBuyInChanges() {
    this.minBuyInFormControl.valueChanges.subscribe(value => {
      value = Number(value);
      this.validateMinBuyIn(value);
      this.validateMaxBuyIn(this.maxBuyInFormControl.value);
      this.gameSettings.minBuyIn = value ? value : DEFAULT_MIN_BUY_IN;
    });
    this.maxBuyInFormControl.valueChanges.subscribe(value => {
      value = Number(value);
      this.validateMaxBuyIn(value);
      this.validateMinBuyIn(this.minBuyInFormControl.value);
      this.gameSettings.maxBuyIn = value ? value : DEFAULT_MAX_BUY_IN;
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
   * Creates a game based on the combined form values, navigating to the new game if successful
   */
  createGame() {
    const userID = this.authService.getCurrentUser()?.id;

    if (!this.mainFormGroup.valid || !userID) {
      return;
    }

    this.gameSettings.denominations.sort((a,b)=>a-b);
    this.gameService.createGame(
      this.gameNameFormControl.value!,
      this.gameSettings,
      userID
    ).then(gameData => {
      this.router.navigate(['/', `game`, gameData.id]);
      this.modalCtrl.dismiss(gameData);
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
