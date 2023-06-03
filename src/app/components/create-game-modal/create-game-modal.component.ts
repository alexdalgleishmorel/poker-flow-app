import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PokerFlowDevice } from 'src/app/services/device/device.service';
import { PoolData, PoolService, PoolSettings } from 'src/app/services/pool/pool.service';

@Component({
  selector: 'app-create-game-modal',
  templateUrl: './create-game-modal.component.html',
  styleUrls: ['./create-game-modal.component.scss']
})
export class CreateGameModalComponent {
  public poolName: string = '';
  public poolSettings: PoolSettings = {
    hasPassword: false,
    minBuyIn: 0,
    maxBuyIn: 0,
    denominations: []
  };
  
  private device: PokerFlowDevice;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<CreateGameModalComponent>,
    private poolService: PoolService
  ) {
    this.device = data.device;
  }

  createGame() {
    this.poolService.createPool(
      this.poolName,
      this.device.name,
      this.poolSettings
    ).subscribe((poolCreationResponse) => {
      this.dialogRef.close(poolCreationResponse);
    });
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
