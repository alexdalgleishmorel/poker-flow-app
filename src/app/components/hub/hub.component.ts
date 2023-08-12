import { Component, OnDestroy, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { POLLING_INTERVAL } from '@constants';
// import { CreateGameModalComponent } from 'src/app/components/create-game-modal/create-game-modal.component';
// import { JoinNewGameModalComponent } from 'src/app/components/join-new-game-modal/join-new-game-modal.component';
import { PoolData, PoolService } from 'src/app/services/pool/pool.service';
import { AuthService, Profile } from 'src/app/services/auth/auth.service';
import { Subscription, catchError, interval, startWith, of, switchMap } from 'rxjs';
import { DeviceService, PokerFlowDevice } from 'src/app/services/device/device.service';
import { PoolComponent } from '../pool/pool.component';
import { IonModal } from '@ionic/angular';

@Component({
  selector: 'app-hub',
  templateUrl: './hub.component.html',
  styleUrls: ['./hub.component.scss']
})
export class HubComponent implements OnInit, OnDestroy {
  @ViewChild('createGameModal') createGameModal!: IonModal;
  
  public disabled: boolean = false;
  public poolData?: PoolData[];

  private profile?: Profile;
  private poller?: Subscription;

  constructor(
    private authService: AuthService,
    private deviceService: DeviceService,
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
    this.profile = this.authService.getCurrentUser();

    this.poller = interval(POLLING_INTERVAL)
      .pipe(
        startWith(0),
        switchMap(() => this.poolService.getPoolsByUserID(this.profile?.id).pipe(catchError(() => of(null))))
      ).subscribe((poolData: PoolData[]) => { if (poolData) this.poolData = [...poolData]; });
  }

  ngOnDestroy() {
    this.poller?.unsubscribe();
  }

  ionViewWillEnter() {
    if (this.poller?.closed) {
      this.ngOnInit();
    }
  }

  ionViewWillLeave() {
    this.ngOnDestroy();
  }

  onCreateGameModalResult(createdPoolID: number | null) {
    this.createGameModal.dismiss(null, '');
    if (createdPoolID) {
      this.router.navigate(['/', `pool`, createdPoolID]);
    }
  }

  /**
   * Finds a PokerFlow device, displays available games associated 
   * with that device, and allows the user to join a game
   */
  joinNewGame() {
    /*
    this.deviceService.connectToDevice().then((device: PokerFlowDevice|null) => {
      if (device) {
        this.dialog.open(JoinNewGameModalComponent, {
          hasBackdrop: false,
          autoFocus: false,
          data: {
            device: device
          }
        }).afterClosed().subscribe((poolID: number) => {
          if (poolID) this.router.navigate(['/', `pool`, poolID]);
        });
      }
    });
    */
  }
}
