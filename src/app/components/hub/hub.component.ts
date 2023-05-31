import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SearchDeviceModalComponent } from '../search-device-modal/search-device-modal.component';
import { CreateGameModalComponent } from '../create-game-modal/create-game-modal.component';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { JoinNewGameModalComponent } from '../join-new-game-modal/join-new-game-modal.component';
import { PoolData } from 'src/app/services/pool/pool.service';

@Component({
  selector: 'app-hub',
  templateUrl: './hub.component.html',
  styleUrls: ['./hub.component.scss']
})
export class HubComponent {
  public deviceConnected: boolean = false;
  public hubEnabled: boolean = true;
  
  private connectedDevice: any;

  constructor(
    public dialog: MatDialog,
    private profileService: ProfileService,
    private router: Router
  ) {}

  joinGame() {
    this.router.navigate(['/', 'pool']);
  }

  createGame() {
    this.disableHub();
    let deviceSearchModalRef = this.dialog.open(SearchDeviceModalComponent, {
      hasBackdrop: false,
      autoFocus: false
    });
    deviceSearchModalRef.afterClosed().subscribe((device) => {
      this.enableHub();
      if (device) {
        let createGameModalRef = this.dialog.open(CreateGameModalComponent, {
          data: {
            device: device
          }
        });
        createGameModalRef.afterClosed().subscribe((response) => {
          this.enableHub();
          if (response) {
            this.router.navigate(['/', `pool`, response.id]);
          }
        });
      }
    });
  }

  joinNewGame() {
    this.disableHub();
    let deviceSearchModalRef = this.dialog.open(SearchDeviceModalComponent, {
      hasBackdrop: false,
      autoFocus: false
    });
    deviceSearchModalRef.afterClosed().subscribe((device) => {
      this.enableHub();
      if (device) {
        let joinNewGameModalRef = this.dialog.open(JoinNewGameModalComponent, {
          hasBackdrop: false,
          autoFocus: false,
          data: {
            device: device
          }
        });
        joinNewGameModalRef.afterClosed().subscribe((pool: PoolData) => {
          this.enableHub();
          if (pool) {
            this.router.navigate(['/', `pool`, pool.id]);
          }
        });
      }
    });
  }

  disableHub() {
    this.hubEnabled = false;
  }

  enableHub() {
    this.hubEnabled = true;
  }
}
