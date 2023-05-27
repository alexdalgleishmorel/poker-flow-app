import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ConnectDeviceModalComponent } from '../connect-device-modal/connect-device-modal.component';

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

  constructor(
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private router: Router
  ) {
    this.id = this.activatedRoute.snapshot.params['id'];
  }

  buyIn() {
    this.disabled = true;
    let buyInModalRef = this.dialog.open(ConnectDeviceModalComponent, {
      hasBackdrop: false,
      autoFocus: false
    });
    buyInModalRef.afterClosed().subscribe(() => {
      this.disabled = false;
    });
  }

  goToHub() {
    this.router.navigate(['/', 'hub']);
  }
}
