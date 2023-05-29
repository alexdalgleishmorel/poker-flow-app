import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ConnectDeviceModalComponent } from '../connect-device-modal/connect-device-modal.component';
import { BuyInModalComponent } from '../buy-in-modal/buy-in-modal.component';
import { PokerFlowDevice } from 'src/app/services/device/device.service';

@Component({
  selector: 'app-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.scss']
})
export class PoolComponent {
  public buyInEnabled: boolean;
  public cashOutEnabled: boolean;
  public id: string;
  public disabled: boolean = false;
  public device: PokerFlowDevice;

  constructor(
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private router: Router
  ) {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.device = {name: 'mock_device_name'};
    this.buyInEnabled = true;
    this.cashOutEnabled = false;
  }

  buyIn() {
    this.disabled = true;
    let connectDeviceModal = this.dialog.open(ConnectDeviceModalComponent, {
      hasBackdrop: false,
      autoFocus: false,
      data: {
        device: this.device,
        searchMessage: 'Connecting to PokerFlow device',
        cancelEnabled: true
      }
    });
    connectDeviceModal.afterClosed().subscribe((deviceConnection) => {
      if (deviceConnection) {
        let buyInModal = this.dialog.open(BuyInModalComponent, {
          hasBackdrop: false,
          autoFocus: false,
          data: deviceConnection
        });
        buyInModal.afterClosed().subscribe((buyIn) => {
          if (buyIn !== 0) {
            let withdrawChipsModal = this.dialog.open(ConnectDeviceModalComponent, {
              hasBackdrop: false,
              autoFocus: false,
              data: {
                device: this.device,
                searchMessage: 'Your chips are now being dispensed',
                cancelEnabled: false
              }
            });
            withdrawChipsModal.afterClosed().subscribe((success) => {
              this.buyInEnabled = false;
              this.cashOutEnabled = true;
              this.disabled = false;
            });
          } else {
            this.disabled = false;
          }
        });
      } else {
        this.disabled = false;
      }
    });
  }

  cashOut() {
    this.disabled = true;
    let connectDeviceModal = this.dialog.open(ConnectDeviceModalComponent, {
      hasBackdrop: false,
      autoFocus: false,
      data: {
        device: this.device,
        searchMessage: 'Connecting to PokerFlow device',
        cancelEnabled: true
      }
    });
    connectDeviceModal.afterClosed().subscribe((deviceConnection) => {
      if (deviceConnection) {
      } else {
        this.disabled = false;
      }
    });
  }

  goToHub() {
    this.router.navigate(['/', 'hub']);
  }
}
