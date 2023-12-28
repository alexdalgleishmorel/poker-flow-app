import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PoolData, PoolService, TransactionType } from 'src/app/services/pool/pool.service';
import { ModalController, ToastController } from '@ionic/angular';

import { BuyInModalComponent } from './buy-in-modal/buy-in-modal.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ChipDepositModalComponent } from './chip-deposit-modal/chip-deposit-modal.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.scss']
})
export class PoolComponent implements OnInit {
  public poolData?: PoolData;
  public disabled: boolean = false;
  public poolID: string = '';
  public currentPoolView: PoolView = PoolView.EMPTY;

  private updateSubscription?: Subscription;

  readonly POT: PoolView = PoolView.POT;
  readonly TRANSACTIONS: PoolView = PoolView.TRANSACTIONS;
  readonly SHARE: PoolView = PoolView.SHARE;
  readonly SETTINGS: PoolView = PoolView.SETTINGS;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private modalCtrl: ModalController,
    private poolService: PoolService,
    private router: Router,
    private toastController: ToastController,
  ) {}

  ngOnInit() {
    this.poolID = this.activatedRoute.snapshot.params['id'];

    this.poolService.currentPoolSubject.subscribe(poolData => {
      this.poolData = poolData;
      this.disabled = !!this.poolData.settings.expired;
    });

    this.poolService.getPoolByID(this.poolID).then(poolData => {
      this.poolService.currentPoolSubject.next(poolData);
      this.currentPoolView = this.POT;
    });
  }

  ionViewWillEnter() {
    this.updateSubscription = this.poolService.updateNotification.subscribe(() => {
      this.poolService.getPoolByID(this.poolID).then(poolData => this.poolService.currentPoolSubject.next(poolData));
    });
  }

  ionViewWillLeave() {
    this.updateSubscription?.unsubscribe();
  }

  onPoolViewChange(viewName: PoolView) {
    this.currentPoolView = viewName;
  }

  async buyIn() {
    if (!this.poolData) {
      return;
    }

    // Presenting buy-in modal
    let modal = await this.modalCtrl.create({
      component: BuyInModalComponent,
      componentProps: {
        poolID: this.poolID,
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

  async cashOut() {
    if (!this.poolData) {
      return;
    }

    // Presenting chip deposit modal
    let modal = await this.modalCtrl.create({
      component: ChipDepositModalComponent,
      componentProps: {
        denominations: this.poolData.settings.denominations
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

  async displayTransactionSuccess(transactionType: string) {
    const toastButtons = [
      {
        text: 'VIEW',
        handler: () => {}
      },
      {
        text: 'DISMISS',
        role: 'cancel',
      }
    ];
    const toast = await this.toastController.create({
      cssClass: 'transaction-toast',
      message: `${transactionType} CONFIRMED`,
      duration: 3000,
      position: 'top',
      color: 'success',
      buttons: toastButtons
    });

    await toast.present();
  }

  /**
   * Returns the user back to the hub
   */
  goToHub() {
    this.router.navigate(['/', 'home']);
  }
}

enum PoolView {
  EMPTY = 'EMPTY',
  POT = 'POT',
  TRANSACTIONS = 'TRANSACTIONS',
  SHARE = 'SHARE',
  SETTINGS = 'SETTINGS'
}
