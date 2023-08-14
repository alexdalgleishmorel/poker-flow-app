import { Component } from '@angular/core';
import { PoolData, PoolService } from 'src/app/services/pool/pool.service';
import { catchError, of } from 'rxjs';
import { DeviceService, DeviceStatus } from 'src/app/services/device/device.service';
import { ModalController } from '@ionic/angular';
import { PasswordModalComponent } from '../common/password-modal/password-modal.component';

@Component({
  selector: 'app-join-game-modal',
  templateUrl: './join-game-modal.component.html',
  styleUrls: ['./join-game-modal.component.scss']
})
export class JoinGameModalComponent {
  public games: any[] = [];

  constructor(
    private deviceService: DeviceService,
    private modalCtrl: ModalController,
    private poolService: PoolService,
  ) {
      this.deviceService.getDeviceStatus().then((deviceStatus: DeviceStatus) => {
        this.poolService.getPoolsByDeviceID(deviceStatus.id).subscribe((pools: PoolData[]) => {
          this.games = pools;
        });
      });
  }

  cancel() {
    this.modalCtrl.dismiss(null);
  }

  async joinGame(poolData: PoolData, retry: boolean = false) {
    if (poolData.settings.has_password) {

      const modal = await this.modalCtrl.create({
        component: PasswordModalComponent,
        componentProps: {
          retry: retry
        }
      });
      modal.present();

      const password = (await modal.onWillDismiss()).data;

      if (password) {
        this.poolService.joinPool(poolData.id, password)
          .pipe(
            catchError(() => {
              return of({'error': true});
            })
          )
          .subscribe((response: any) => {
            if (!response.error) {
              this.modalCtrl.dismiss(poolData.id);
            }
            else {
              this.joinGame(poolData, true);
            }
          });
      }
    } else {
      this.poolService.joinPool(poolData.id).subscribe(() => {
        this.modalCtrl.dismiss(poolData.id);
      });
    }
  }
}
