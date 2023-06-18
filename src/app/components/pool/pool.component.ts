import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { POLLING_INTERVAL } from '@constants';
import { ConnectDeviceModalComponent } from 'src/app/components/connect-device-modal/connect-device-modal.component';
import { BuyInModalComponent } from 'src/app/components/buy-in-modal/buy-in-modal.component';
import { ChipDepositModalComponent } from 'src/app/components/chip-deposit-modal/chip-deposit-modal.component';
import { PoolData, PoolService, TransactionType } from 'src/app/services/pool/pool.service';
import { catchError, Subscription, interval, of, startWith, switchMap } from 'rxjs';
import { DeviceWithdrawalRequest } from 'src/app/services/device/device.service';
import { ChipWithdrawalModalComponent } from '../chip-withdrawal-modal/chip-withdrawal-modal.component';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.scss']
})
export class PoolComponent implements OnDestroy {
  public poolData?: PoolData;
  public disabled: boolean = false;
  public id: number;

  private poller: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private dialog: MatDialog,
    private poolService: PoolService,
    private router: Router
  ) {
    this.id = this.activatedRoute.snapshot.params['id'];

    this.poller = interval(POLLING_INTERVAL)
    .pipe(
      startWith(0),
      switchMap(() => this.poolService.getPoolByID(this.id).pipe(catchError(() => of(null))))
    ).subscribe((poolData: PoolData) => { if (poolData) this.poolData = {...poolData}; });

    this.dialog.afterOpened.subscribe(() => {
      this.disabled = true;
    });
    this.dialog.afterAllClosed.subscribe(() => {
      this.disabled = false;
    });
  }

  ngOnDestroy(): void {
    this.poller.unsubscribe();
  }

  /**
   * Connects to a PokerFlow device, validates user buy-in, and commands device to dispense chips
   */
  buyIn() {
    this.dialog.open(ConnectDeviceModalComponent, {
      hasBackdrop: false,
      autoFocus: false,
      data: {
        device_id: this.poolData?.device_id,
        searchMessage: 'Connecting to PokerFlow device',
        cancelEnabled: true
      }
    }).afterClosed().subscribe((deviceConnection) => {
      if (deviceConnection) {
        this.dialog.open(BuyInModalComponent, {
          hasBackdrop: false,
          autoFocus: true,
          data: deviceConnection
        }).afterClosed().subscribe((deviceWithdrawalRequest: DeviceWithdrawalRequest) => {
          if (deviceWithdrawalRequest) {

            this.poolService.postTransaction({
              pool_id: this.id,
              profile_id: this.authService.getCurrentUser()?.id,
              type: TransactionType.BUY_IN,
              amount: deviceWithdrawalRequest.amount
            }).subscribe(() => {
              this.dialog.open(ChipWithdrawalModalComponent, {
                hasBackdrop: false,
                autoFocus: false,
                data: {
                  device_connection: deviceConnection,
                  withdrawal_request: deviceWithdrawalRequest
                }
              });
            });
          }
        });
      }
    });
  }

  /**
   * Connects to a PokerFlow device, and handles chip deposit
   */
  cashOut() {
    this.dialog.open(ConnectDeviceModalComponent, {
      hasBackdrop: false,
      autoFocus: false,
      data: {
        device_id: this.poolData?.device_id,
        searchMessage: 'Connecting to PokerFlow device',
        cancelEnabled: true
      }
    }).afterClosed().subscribe((deviceConnection) => {
      if (deviceConnection) {
        this.dialog.open(ChipDepositModalComponent, {
          hasBackdrop: false,
          autoFocus: false,
          data: deviceConnection
        }).afterClosed().subscribe((cashOutValue: number) => {
          this.poolService.postTransaction({
            pool_id: this.id,
            profile_id: this.authService.getCurrentUser()?.id,
            type: TransactionType.CASH_OUT,
            amount: cashOutValue
          }).subscribe(() => {});
        });
      }
    });
  }

  /**
   * Returns the user back to the PokerFlow hub
   */
  goToHub() {
    this.router.navigate(['/', 'hub']);
  }
}
