import { Component, EventEmitter, Output } from '@angular/core';
import { PoolData, PoolService } from 'src/app/services/pool/pool.service';
// import { PasswordModalComponent } from '../password-modal/password-modal.component';
import { catchError, of, throwError } from 'rxjs';
import { DeviceService, PokerFlowDevice } from 'src/app/services/device/device.service';

@Component({
  selector: 'app-join-game-modal',
  templateUrl: './join-game-modal.component.html',
  styleUrls: ['./join-game-modal.component.scss']
})
export class JoinGameModalComponent {
  public games: any[] = [];
  public disabled: boolean = false;
  @Output() modalResult = new EventEmitter<number|null>;

  constructor(
    private deviceService: DeviceService,
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

  joinGame(poolID: number, retry: boolean = false) {
    /*
    if (selectedPool.settings.has_password) {
      this.disabled = true;
      this.dialog.open(PasswordModalComponent, {
        hasBackdrop: false,
        autoFocus: false,
        data: {
          poolName: selectedPool.name,
          retry: retry
        }
      }).afterClosed().subscribe((password: string) => {
        this.disabled = false;
          if (password) {
            this.poolService.joinPool(selectedPool, password)
              .pipe(
                catchError(() => {
                  return of({'error': true});
                })
              )
              .subscribe((response: any) => {
                if (!response.error) this.dialogRef.close(response);
                else this.joinGame(selectedPool, true);
              });
          }
        });
    }
    */
    this.poolService.joinPool(poolID).subscribe((poolID: any) => {
      this.modalResult.emit(poolID);
    });
  }
}
