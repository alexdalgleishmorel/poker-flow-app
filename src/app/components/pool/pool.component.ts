import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PoolData, PoolService, TransactionType } from 'src/app/services/pool/pool.service';
import { IonSegment, IonTabs, ModalController, ToastController } from '@ionic/angular';

import { BuyInModalComponent } from '../buy-in-modal/buy-in-modal.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ChipDepositModalComponent } from '../chip-deposit-modal/chip-deposit-modal.component';

@Component({
  selector: 'app-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.scss']
})
export class PoolComponent implements OnInit, AfterViewInit {
  public poolData?: PoolData;
  public disabled: boolean = false;
  public poolID: string = '';

  @ViewChild('tabs') tabs?: IonTabs;
  @ViewChild('segmentBar') segmentBar?: IonSegment;

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
    if (this.poolID) {
      this.poolService.currentPoolID.next(this.poolID);
      this.poolService.poolViewActive.next(this.poolID);
      this.poolService.getPoolByID(this.poolID).subscribe(() => {});
    }

    this.poolService.currentPoolSubject.subscribe(poolData => {
      this.poolData = {...poolData};
      this.disabled = !!this.poolData.settings.expired;
    });
  }

  ngAfterViewInit() {
    this.tabs?.select('pot');
  }

  ionViewWillEnter() {
    if (this.poolID) {
      this.poolService.currentPoolID.next(this.poolID);
      this.poolService.poolViewActive.next(this.poolID);
    }
  }

  ionViewWillLeave() {
    this.poolService.poolViewActive.next('');
    if (this.segmentBar) {
      this.segmentBar.value = 'pot';
    }
  }

  onTabChange(tabName: string) {
    this.tabs?.select(tabName);
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
        availablePot: this.poolData.available_pot,
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
    }).subscribe({
      next: () => this.displayTransactionSuccess('CASH-OUT'),
      error: () => {}
    });
  }

  async displayTransactionSuccess(transactionType: string) {
    const toastButtons = [
      {
        text: 'VIEW',
        handler: () => { this.router.navigate(['/', `pool`, this.poolData?.id, 'activity']); }
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
