import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PoolData, PoolService, TransactionType } from 'src/app/services/pool/pool.service';
import { catchError, of } from 'rxjs';
import { IonTabs, ModalController, ToastController } from '@ionic/angular';
import { BuyInModalComponent } from '../buy-in-modal/buy-in-modal.component';
import { ChipWithdrawalModalComponent } from '../chip-withdrawal-modal/chip-withdrawal-modal.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ChipDepositModalComponent } from '../chip-deposit-modal/chip-deposit-modal.component';
import { DeviceService } from 'src/app/services/device/device.service';
import { TransactionCancelledModalComponent } from '../common/transaction-cancelled-modal/transaction-cancelled-modal.component';

@Component({
  selector: 'app-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.scss']
})
export class PoolComponent implements OnInit, AfterViewInit {
  public poolData?: PoolData;
  public disabled: boolean = false;
  public id?: number;

  @ViewChild('tabs') tabs?: IonTabs;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private deviceService: DeviceService,
    private modalCtrl: ModalController,
    private poolService: PoolService,
    private router: Router,
    private toastController: ToastController,
  ) {}

  ngOnInit(): void {
    this.id = Number(this.activatedRoute.snapshot.params['id']);
    if (this.id) {
      this.poolService.currentPoolID.next(this.id);
      this.poolService.poolViewActive.next(this.id);
      this.poolService.getPoolByID(this.id).subscribe(() => {});
    }

    this.poolService.poolByID.subscribe(poolData => {
      this.poolData = {...poolData};
    });
  }

  ngAfterViewInit() {
    this.tabs?.select('pot');
  }

  ionViewWillEnter() {
    if (this.id) {
      this.poolService.currentPoolID.next(this.id);
      this.poolService.poolViewActive.next(this.id);
    }
    this.poolService.newDataRequest.next(true);
  }

  ionViewWillLeave() {
    this.poolService.poolViewActive.next(0);
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
    this.deviceService.connectionCancelled.subscribe(cancelled => {
      if (cancelled) {
        modal.dismiss();
        this.deviceService.connectionCancelled.next(false);
      }
    });

    const deviceWithdrawalRequest = (await modal.onWillDismiss()).data;

    if (!deviceWithdrawalRequest) {
      return;
    }

    // Displaying chip withdrawal modal if buy-in interaction was valid
    modal = await this.modalCtrl.create({
      component: ChipWithdrawalModalComponent,
      componentProps: {
        denominations: this.poolData?.settings.denominations,
        withdrawalRequest: deviceWithdrawalRequest
      }
    });
    modal.present();

    const chipWithdrawalResponse = (await modal.onWillDismiss()).data;

    if (!chipWithdrawalResponse) {
      modal = await this.modalCtrl.create({
        component: TransactionCancelledModalComponent
      });
      modal.present();
      return;
    }

    // Updating database with new transaction
    this.poolService.postTransaction({
      pool_id: this.poolData?.id,
      profile_id: this.authService.getCurrentUser()?.id,
      type: TransactionType.BUY_IN,
      amount: deviceWithdrawalRequest.amount
    }).subscribe(() => {
      this.poolService.getPoolByID(this.id).pipe(catchError(() => of(null)))
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

    // Presenting chip deposit modal
    let modal = await this.modalCtrl.create({
      component: ChipDepositModalComponent,
      componentProps: {
        denominations: this.poolData?.settings.denominations
      }
    });
    modal.present();
    this.deviceService.connectionCancelled.subscribe(cancelled => {
      if (cancelled) {
        modal.dismiss();
        this.deviceService.connectionCancelled.next(false);
      }
    });

    const totalDepositValue = (await modal.onWillDismiss()).data;

    if (!totalDepositValue) {
      if (this.deviceService.isConnected.getValue()) {
        modal = await this.modalCtrl.create({
          component: TransactionCancelledModalComponent
        });
        modal.present();
      }
      return;
    }

    // Updating database with new transaction
    this.poolService.postTransaction({
      pool_id: this.poolData?.id,
      profile_id: this.authService.getCurrentUser()?.id,
      type: TransactionType.CASH_OUT,
      amount: totalDepositValue
    }).subscribe(() => {
      this.poolService.getPoolByID(this.id).pipe(catchError(() => of(null)))
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
