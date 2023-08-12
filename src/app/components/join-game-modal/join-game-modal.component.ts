import { Component, EventEmitter, Output } from '@angular/core';
import { PoolData, PoolService } from 'src/app/services/pool/pool.service';
// import { PasswordModalComponent } from '../password-modal/password-modal.component';
import { catchError, firstValueFrom, of, throwError } from 'rxjs';
import { DeviceService, PokerFlowDevice } from 'src/app/services/device/device.service';
import { ModalController } from '@ionic/angular';
import { PasswordModalComponent } from '../common/password-modal/password-modal.component';

@Component({
  selector: 'app-join-game-modal',
  templateUrl: './join-game-modal.component.html',
  styleUrls: ['./join-game-modal.component.scss']
})
export class JoinGameModalComponent {
  public games: any[] = [];
  @Output() modalResult = new EventEmitter<number|null>;

  constructor(
    private deviceService: DeviceService,
    private modalCtrl: ModalController,
    private poolService: PoolService,
  ) {
    this.deviceService.connectToDevice().then((device: PokerFlowDevice|null) => {
      if (device) {
        //this.device.assignDeviceStatus();
        device.status.subscribe(() => {
          if (device.id) {
            this.poolService.getPoolsByDeviceID(device.id).subscribe((pools: PoolData[]) => {
              this.games = pools;
            });
          }
        });
      }
    });
  }

  cancel() {
    this.modalResult.emit(null);
  }

  async joinGame(poolData: PoolData, retry: boolean = false) {
    if (poolData.settings.has_password) {

      const modal = await this.modalCtrl.create({
        component: PasswordModalComponent,
        componentProps: {
          poolName: poolData.name,
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
              this.modalCtrl.dismiss(response);
            }
            else {
              this.joinGame(poolData, true);
            }
          });
      }
    } else {
      const poolID = await firstValueFrom(this.poolService.joinPool(poolData.id));
      this.modalResult.emit(poolID);
    }
  }
}
