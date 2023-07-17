import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { PoolData, PoolService } from 'src/app/services/pool/pool.service';
import { PasswordModalComponent } from '../password-modal/password-modal.component';
import { catchError, of, throwError } from 'rxjs';
import { PokerFlowDevice } from 'src/app/services/device/device.service';

@Component({
  selector: 'app-join-new-game-modal',
  templateUrl: './join-new-game-modal.component.html',
  styleUrls: ['./join-new-game-modal.component.scss']
})
export class JoinNewGameModalComponent {
  public games: any[] = [];
  public disabled: boolean = false;
  private device: PokerFlowDevice = this.data.device;

  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<JoinNewGameModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private poolService: PoolService,
  ) {
    this.device.assignDeviceStatus();
    this.device.status.subscribe(() => {
      if (this.device.id) {
        this.poolService.getPoolsByDeviceID(this.device.id).subscribe((pools: PoolData[]) => {
          this.games = pools;
        });
      }
    });
  }

  cancel() {
    this.dialogRef.close(null);
  }

  joinGame(selectedPool: PoolData, retry: boolean = false) {
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
    } else {
      this.poolService.joinPool(selectedPool).subscribe((response: any) => {
        this.dialogRef.close(response);
      });
    }
  }
}
