import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PoolData, PoolService } from 'src/app/services/pool/pool.service';

@Component({
  selector: 'app-join-new-game-modal',
  templateUrl: './join-new-game-modal.component.html',
  styleUrls: ['./join-new-game-modal.component.scss']
})
export class JoinNewGameModalComponent {
  public games: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<JoinNewGameModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private poolService: PoolService,
  ) {
    this.poolService.getPoolsByDeviceID(data.device.id).subscribe((pools: PoolData[]) => {
      this.games = pools;
    });
  }

  cancel() {
    this.dialogRef.close(null);
  }

  joinGame(pool: PoolData) {
    this.dialogRef.close(pool);
  }
}
