import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PoolData, PoolService, TransactionType } from 'src/app/services/pool/pool.service';
import { catchError, of } from 'rxjs';
import { IonTabs, ModalController, ToastController } from '@ionic/angular';
import { BuyInModalComponent } from '../buy-in-modal/buy-in-modal.component';
import { AuthService } from 'src/app/services/auth/auth.service';

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

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private modalCtrl: ModalController,
    private poolService: PoolService,
    private router: Router,
    private toastController: ToastController,
  ) {}

  ngOnInit(): void {
    this.poolID = this.activatedRoute.snapshot.params['id'];
    if (this.poolID) {
      this.poolService.currentPoolID.next(this.poolID);
      this.poolService.poolViewActive.next(this.poolID);
      this.poolService.getPoolByID(this.poolID).subscribe(() => {});
    }

    this.poolService.poolByID.subscribe(poolData => {
      this.poolData = {...poolData};
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
    this.poolService.newDataRequest.next(true);
  }

  ionViewWillLeave() {
    this.poolService.poolViewActive.next('');
  }

  onTabChange(tabName: string) {
    this.tabs?.select(tabName);
  }

  /**
   * Handles chip withdrawal
   */
  async buyIn() {
    if (!this.poolData) {
      return;
    }

    // Presenting buy-in modal
    let modal = await this.modalCtrl.create({
      component: BuyInModalComponent,
      componentProps: {
        minBuyIn: this.poolData?.settings.min_buy_in,
        maxBuyIn: this.poolData?.settings.max_buy_in,
        denominations: this.poolData?.settings.denominations
      }
    });
    modal.present();

    const deviceWithdrawalRequest = (await modal.onWillDismiss()).data;

    if (!deviceWithdrawalRequest) {
      return;
    }

    // Updating database with new transaction
    this.poolService.postTransaction({
      pool_id: this.poolData?.id,
      profile_id: this.authService.getCurrentUser()?.id,
      type: TransactionType.BUY_IN,
      amount: deviceWithdrawalRequest.amount
    }).subscribe(() => {
      this.poolService.getPoolByID(this.poolID).pipe(catchError(() => of(null)))
        .subscribe((poolData: PoolData) => { 
          this.poolData = {...poolData};
          this.displayTransactionSuccess('BUY-IN');
        });
    });
  }

  /**
   * Handles chip deposit
   */
  async cashOut() {
    if (!this.poolData) {
      return;
    }

    let totalDepositValue = 10;

    // Updating database with new transaction
    this.poolService.postTransaction({
      pool_id: this.poolData?.id,
      profile_id: this.authService.getCurrentUser()?.id,
      type: TransactionType.CASH_OUT,
      amount: totalDepositValue
    }).subscribe(() => {
      this.poolService.getPoolByID(this.poolID).pipe(catchError(() => of(null)))
        .subscribe((poolData: PoolData) => { 
          this.poolData = {...poolData};
          this.displayTransactionSuccess('CASH-OUT');
        });
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
   * Returns the user back to the PokerFlow hub
   */
  goToHub() {
    this.router.navigate(['/', 'home']);
  }

  onSettingsChange(settingUpdateInProgress: boolean) {
    this.disabled = settingUpdateInProgress;
  }
}
