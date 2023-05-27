import { Component } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SearchDeviceModalComponent } from '../search-device-modal/search-device-modal.component';
import { CreateGameModalComponent } from '../create-game-modal/create-game-modal.component';
import { ProfileService } from 'src/app/services/profile/profile.service';

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

  createNewGame() {
    this.disableHub();
    let createGameModalRef = this.dialog.open(CreateGameModalComponent, {
    });
    createGameModalRef.afterClosed().subscribe((response) => {
      this.enableHub();
      this.router.navigate(['/', `pool`, response.id]);
    });
  }

  connectToDevice() {
    this.disableHub();
    let deviceSearchModalRef = this.dialog.open(SearchDeviceModalComponent, {
      hasBackdrop: false,
      autoFocus: false
    });
    deviceSearchModalRef.afterClosed().subscribe((device) => {
      this.enableHub();
      if (device) {
        this.deviceConnected = true;
        this.connectedDevice = device;
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
