import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { POLLING_INTERVAL } from '@constants';
// import { BuyInModalComponent } from 'src/app/components/buy-in-modal/buy-in-modal.component';
// import { ChipDepositModalComponent } from 'src/app/components/chip-deposit-modal/chip-deposit-modal.component';
import { PoolData, PoolService, TransactionType } from 'src/app/services/pool/pool.service';
import { catchError, Subscription, interval, of, startWith, switchMap, throwError } from 'rxjs';
import { DeviceService, DeviceWithdrawalRequest, PokerFlowDevice } from 'src/app/services/device/device.service';
// import { ChipWithdrawalModalComponent } from '../chip-withdrawal-modal/chip-withdrawal-modal.component';
import { AuthService } from 'src/app/services/auth/auth.service';
// import { TransactionConfirmationModalComponent } from '../transaction-confirmation-modal/transaction-confirmation-modal.component';

@Component({
  selector: 'app-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.scss']
})
export class PoolComponent implements OnInit, OnDestroy {
  public poolData?: PoolData;
  public disabled: boolean = false;
  public id?: number;

  private poller?: Subscription;
  private subscriptions = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    // private authService: AuthService,
    // private deviceService: DeviceService,
    // private dialog: MatDialog,
    private poolService: PoolService,
    private router: Router
  ) {
    /*
    this.dialog.afterOpened.subscribe(() => {
      this.disabled = true;
    });
    this.dialog.afterAllClosed.subscribe(() => {
      this.disabled = false;
    });
    */
  }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params['id'];

    this.poller = interval(POLLING_INTERVAL)
      .pipe(
        startWith(0),
        switchMap(() => this.poolService.getPoolByID(this.id).pipe(catchError(() => of(null))))
      ).subscribe((poolData: PoolData) => { 
        if (poolData) {
          this.poolData = {...poolData};
          if (!this.poolService.poolViewActive.getValue()) {
            this.poolService.poolViewActive.next(this.poolData.id);
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.poller?.unsubscribe();
  }

  ionViewWillEnter() {
    if (this.poller?.closed) {
      this.ngOnInit();
    }
  }

  ionViewWillLeave() {
    this.poolService.poolViewActive.next(0);
    this.ngOnDestroy();
  }

  /**
   * Connects to a PokerFlow device, validates user buy-in, and commands device to dispense chips
   */
  buyIn() {
    /*
    this.deviceService.connectToDevice(this.poolData!.device_id).then((device: PokerFlowDevice | null) => {
      if (device) {
        this.dialog.open(BuyInModalComponent, {
          hasBackdrop: false,
          autoFocus: true,
          data: {
            device: device,
            poolSettings: this.poolData?.settings
          }
        }).afterClosed().subscribe((deviceWithdrawalRequest: DeviceWithdrawalRequest) => {
          if (deviceWithdrawalRequest) {
            this.dialog.open(ChipWithdrawalModalComponent, {
              hasBackdrop: false,
              autoFocus: false,
              data: {
                device: device,
                denominations: this.poolData?.settings.denominations,
                withdrawal_request: deviceWithdrawalRequest
              }
            }).afterClosed()
              .pipe(
                catchError((error) => {
                  return throwError(() => new Error(error))
                })
              )
              .subscribe(() => {
                this.poolService.postTransaction({
                  pool_id: this.id,
                  profile_id: this.authService.getCurrentUser()?.id,
                  type: TransactionType.BUY_IN,
                  amount: deviceWithdrawalRequest.amount
                }).subscribe((transactionResponse: any) => {
                  this.poolService.getPoolByID(this.id).pipe(catchError(() => of(null)))
                    .subscribe((poolData: PoolData) => { if (poolData) this.poolData = {...poolData}; });
                  this.dialog.open(TransactionConfirmationModalComponent, {
                    hasBackdrop: false,
                    autoFocus: false,
                    data: {
                      type: TransactionType.BUY_IN,
                      amount: transactionResponse.amount,
                      denominations: this.poolData?.settings.denominations,
                      assignments: deviceWithdrawalRequest.denominations
                    }
                  });
                });
              });
          }
        });
      }
    });
    */
  }

  /**
   * Connects to a PokerFlow device, and handles chip deposit
   */
  cashOut() {
    /*
    this.deviceService.connectToDevice(this.poolData!.device_id).then((device: PokerFlowDevice | null) => {
      if (device) {
        this.dialog.open(ChipDepositModalComponent, {
          hasBackdrop: false,
          autoFocus: false,
          data: {
            device: device,
            denominations: this.poolData?.settings.denominations
          }
        }).afterClosed()
          .pipe(
            catchError((error) => {
              return throwError(() => new Error(error))
            })
          )
          .subscribe((cashOutValue: number) => {
            this.poolService.postTransaction({
              pool_id: this.id,
              profile_id: this.authService.getCurrentUser()?.id,
              type: TransactionType.CASH_OUT,
              amount: cashOutValue
            }).subscribe((transactionResponse: any) => {
              this.poolService.getPoolByID(this.id).pipe(catchError(() => of(null)))
                .subscribe((poolData: PoolData) => { if (poolData) this.poolData = {...poolData}; });
              this.dialog.open(TransactionConfirmationModalComponent, {
                hasBackdrop: false,
                autoFocus: false,
                data: {
                  type: TransactionType.CASH_OUT,
                  amount: transactionResponse.amount,
                  denominations: this.poolData?.settings.denominations,
                  assignments: device.depositRequestStatus?.getValue()
                }
              });
            });
          });
      }
    });
    */
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
