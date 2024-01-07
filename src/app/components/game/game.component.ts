import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { BuyInModalComponent } from './buy-in-modal/buy-in-modal.component';
import { ChipDepositModalComponent } from './chip-deposit-modal/chip-deposit-modal.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GameData, GameService, TransactionType } from 'src/app/services/game/game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  public currentView: View = View.EMPTY;
  public disabled: boolean = false;
  public gameData?: GameData;

  private updateSubscription?: Subscription;

  readonly POT: View = View.POT;
  readonly TRANSACTIONS: View = View.TRANSACTIONS;
  readonly SHARE: View = View.SHARE;
  readonly SETTINGS: View = View.SETTINGS;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private modalCtrl: ModalController,
    private gameService: GameService,
    private router: Router,
    private toastController: ToastController,
  ) {}

  /**
   * Initializes data using the ID provided in the URL
   */
  ngOnInit() {
    this.initGameDataAndSubscribeToChanges(this.getID());
  }

  /**
   * @returns {string} The ID from the URL
   */
  getID(): string {
    return this.activatedRoute.snapshot.params['id'];
  }

  /**
   * Retrieves the game data related to the given ID, and subscribes to updates to this data
   * 
   * @param {string} id The game ID used for data retrieval
   */
  initGameDataAndSubscribeToChanges(id: string) {
    this.gameService.currentGameSubject.subscribe(gameData => {
      this.gameData = gameData;
      this.disabled = !!gameData.settings.expired;
    });
    this.gameService.getGameByID(id).then(gameData => {
      this.gameService.currentGameSubject.next(gameData);
      this.currentView = this.POT;
    });
  }

  /**
   * Subscribes to update notifications, which trigger a new data request for the current game data
   */
  ionViewWillEnter() {
    this.updateSubscription = this.gameService.updateNotification.subscribe(() => {
      this.gameService.getGameByID(this.getID()).then(gameData => this.gameService.currentGameSubject.next(gameData));
    });
  }

  /**
   * Unsubscribes from update notifications when the view is left
   */
  ionViewWillLeave() {
    this.updateSubscription?.unsubscribe();
  }

  /**
   * Handles changing the current view
   * 
   * @param {View} viewName The view to update to
   */
  onGameViewChange(viewName: View) {
    this.currentView = viewName;
  }

  /**
   * Opens the buy-in modal in fullscreen
   */
  async buyIn() {
    if (!this.gameData) {
      return;
    }

    // Presenting buy-in modal
    let modal = await this.modalCtrl.create({
      component: BuyInModalComponent,
      componentProps: {
        gameID: this.gameData.id,
        userID: this.authService.getCurrentUser()?.id,
        minBuyIn: this.gameData.settings.minBuyIn,
        maxBuyIn: this.gameData.settings.maxBuyIn,
        denominations: this.gameData.settings.denominations,
        denominationColors: this.gameData.settings.denominationColors
      },
      cssClass: 'modal-fullscreen'
    });
    modal.present();

    document.querySelector('.modal-fullscreen')?.shadowRoot?.querySelector('.modal-wrapper')?.setAttribute('style', 'width:100%; height:100%;');

    const success = (await modal.onWillDismiss()).data;

    if (success) {
      this.displayTransactionSuccess('BUY-IN');
    }
  }

  /**
   * Opens the cashout modal in fullscreen, posting a new transaction if the modal returns a cashout value
   */
  async cashOut() {
    if (!this.gameData) {
      return;
    }

    // Presenting chip deposit modal
    let modal = await this.modalCtrl.create({
      component: ChipDepositModalComponent,
      componentProps: {
        denominations: this.gameData.settings.denominations,
        denominationColors: this.gameData.settings.denominationColors,
        maximumCashout: this.gameData.availableCashout
      },
      cssClass: 'modal-fullscreen'
    });
    modal.present();

    document.querySelector('.modal-fullscreen')?.shadowRoot?.querySelector('.modal-wrapper')?.setAttribute('style', 'width:100%; height:100%;');

    const result = (await modal.onWillDismiss()).data;
    const userID = this.authService.getCurrentUser()?.id;

    if (!result.totalDepositValue || !userID) {
      return;
    }

    // Updating database with new transaction
    this.gameService.postTransaction({
      gameID: this.gameData?.id,
      profileID: userID,
      type: TransactionType.CASH_OUT,
      amount: result.totalDepositValue,
      denominations: result.denominations
    }).then(() => this.displayTransactionSuccess('CASH-OUT'));
  }

  /**
   * Displays a success message for the given transaction type
   * 
   * @param {string} transactionType The type of the transaction to display
   */
  async displayTransactionSuccess(transactionType: string) {
    const toast = await this.toastController.create({
      cssClass: 'centered-text',
      message: `${transactionType} CONFIRMED`,
      duration: 1000,
      position: 'top',
      color: 'success'
    });

    await toast.present();
  }

  /**
   * Navigates the user to the hub
   */
  goToHub() {
    this.router.navigate(['/', 'home']);
  }
}

enum View {
  EMPTY = 'EMPTY',
  POT = 'POT',
  TRANSACTIONS = 'TRANSACTIONS',
  SHARE = 'SHARE',
  SETTINGS = 'SETTINGS'
}
