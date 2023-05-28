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
  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  isLinear = false;

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
  }

  buyIn() {
    this.disabled = true;
    let connectDeviceModal = this.dialog.open(ConnectDeviceModalComponent, {
      hasBackdrop: false,
      autoFocus: false,
      data: this.device
    });
    connectDeviceModal.afterClosed().subscribe((deviceConnection) => {
      let buyInModal = this.dialog.open(BuyInModalComponent, {
        hasBackdrop: false,
        data: deviceConnection
      });
    });
  }

  goToHub() {
    this.router.navigate(['/', 'hub']);
  }
}
