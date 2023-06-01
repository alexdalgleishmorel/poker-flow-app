import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { POLLING_INTERVAL } from '@constants';
import { CreateGameModalComponent } from 'src/app/components/create-game-modal/create-game-modal.component';
import { SearchDeviceModalComponent } from 'src/app/components/search-device-modal/search-device-modal.component';
import { JoinNewGameModalComponent } from 'src/app/components/join-new-game-modal/join-new-game-modal.component';
import { PoolData, PoolService } from 'src/app/services/pool/pool.service';
import { Profile, ProfileService } from 'src/app/services/profile/profile.service';
import { Subscription, interval, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-hub',
  templateUrl: './hub.component.html',
  styleUrls: ['./hub.component.scss']
})
export class HubComponent implements OnDestroy {
  public disabled: boolean = true;
  public poolData?: PoolData[];

  private profile: Profile;
  private poller: Subscription;

  constructor(
    private dialog: MatDialog,
    private poolService: PoolService,
    private profileService: ProfileService,
    private router: Router
  ) {
    this.dialog.afterOpened.subscribe(() => {
      this.disabled = true;
    });
    this.dialog.afterAllClosed.subscribe(() => {
      this.disabled = false;
    });

    this.profile = this.profileService.getProfile();

    this.poller = interval(POLLING_INTERVAL)
    .pipe(
      startWith(0),
      switchMap(() => this.poolService.getPoolsByUserID(this.profile.email))
    ).subscribe((poolData: PoolData[]) => {
      this.poolData = {...poolData};
    });

    this.poolService.getPoolsByUserID(this.profile.email).subscribe((data: PoolData[]) => {
      this.poolData = data;
    });
  }

  ngOnDestroy(): void {
    this.poller.unsubscribe();
  }

  /**
   * Finds a PokerFlow device, creates a new game associated
   * with that device and navigates to its pool view
   */
  createGame() {
    this.dialog.open(SearchDeviceModalComponent, {
      hasBackdrop: false,
      autoFocus: false
    }).afterClosed().subscribe((device: any) => {
      if (device) {
        this.dialog.open(CreateGameModalComponent, {
          hasBackdrop: false,
          autoFocus: false,
          data: {
            device: device
          }
        }).afterClosed().subscribe((poolCreationResponse: PoolData) => {
          if (poolCreationResponse) {
            this.router.navigate(['/', `pool`, poolCreationResponse.id]);
          }
        });
      }
    });
  }

  /**
   * Finds a PokerFlow device, displays available games associated 
   * with that device, and allows the user to join a game
   */
  joinNewGame() {
    this.dialog.open(SearchDeviceModalComponent, {
      hasBackdrop: false,
      autoFocus: false
    }).afterClosed().subscribe((device) => {
      if (device) {
        this.dialog.open(JoinNewGameModalComponent, {
          hasBackdrop: false,
          autoFocus: false,
          data: {
            device: device
          }
        }).afterClosed().subscribe((pool: PoolData) => {
          if (pool) {
            this.router.navigate(['/', `pool`, pool.id]);
          }
        });
      }
    });
  }
}
