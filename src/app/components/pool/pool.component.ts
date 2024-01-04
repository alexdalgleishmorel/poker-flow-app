import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { BuyInModalComponent } from './buy-in-modal/buy-in-modal.component';
import { ChipDepositModalComponent } from './chip-deposit-modal/chip-deposit-modal.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PoolData, PoolService, TransactionType } from 'src/app/services/pool/pool.service';

@Component({
  selector: 'app-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.scss']
})
export class PoolComponent implements OnInit {
  public currentView: View = View.EMPTY;
  public disabled: boolean = false;
  public poolData?: PoolData;

  private updateSubscription?: Subscription;

  readonly POT: View = View.POT;
  readonly TRANSACTIONS: View = View.TRANSACTIONS;
  readonly SHARE: View = View.SHARE;
  readonly SETTINGS: View = View.SETTINGS;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private modalCtrl: ModalController,
    private poolService: PoolService,
    private router: Router,
    private toastController: ToastController,
  ) {}

  /**
   * Initializes data using the ID provided in the URL
   */
  ngOnInit() {
    this.initPoolDataAndSubscribeToChanges(this.getID());
  }

  /**
   * @returns {string} The ID from the URL
   */
  getID(): string {
    return this.activatedRoute.snapshot.params['id'];
  }

  /**
   * Retrieves the pool data related to the given ID, and subscribes to updates to this data
   * 
   * @param {string} id The pool ID used for data retrieval
   */
  initPoolDataAndSubscribeToChanges(id: string) {
    this.poolService.currentPoolSubject.subscribe(poolData => {
      this.poolData = poolData;
      this.disabled = !!this.poolData.settings.expired;
    });
    this.poolService.getPoolByID(id).then(poolData => {
      this.poolService.currentPoolSubject.next(poolData);
      this.currentView = this.POT;
    });
  }

  /**
   * Subscribes to update notifications, which trigger a new data request for the current pool data
   */
  ionViewWillEnter() {
    this.updateSubscription = this.poolService.updateNotification.subscribe(() => {
      this.poolService.getPoolByID(this.getID()).then(poolData => this.poolService.currentPoolSubject.next(poolData));
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
  onPoolViewChange(viewName: View) {
    this.currentView = viewName;
  }

  /**
   * Opens the buy-in modal in fullscreen
   */
  async buyIn() {
    if (!this.poolData) {
      return;
    }

    // Presenting buy-in modal
    let modal = await this.modalCtrl.create({
      component: BuyInModalComponent,
      componentProps: {
        poolID: this.poolData.id,
        userID: this.authService.getCurrentUser()?.id,
        minBuyIn: this.poolData.settings.min_buy_in,
        maxBuyIn: this.poolData.settings.max_buy_in,
        denominations: this.poolData.settings.denominations
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
    if (!this.poolData) {
      return;
    }

    // Presenting chip deposit modal
    let modal = await this.modalCtrl.create({
      component: ChipDepositModalComponent,
      componentProps: {
        denominations: this.poolData.settings.denominations,
        maximumCashout: this.poolData.available_pot
      },
      cssClass: 'modal-fullscreen'
    });
    modal.present();

    document.querySelector('.modal-fullscreen')?.shadowRoot?.querySelector('.modal-wrapper')?.setAttribute('style', 'width:100%; height:100%;');

    const totalDepositValue = (await modal.onWillDismiss()).data;

    if (!totalDepositValue) {
      return;
    }

    // Updating database with new transaction
    this.poolService.postTransaction({
      pool_id: this.poolData?.id,
      profile_id: this.authService.getCurrentUser()?.id,
      type: TransactionType.CASH_OUT,
      amount: totalDepositValue
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
