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
    has_password: false,
    min_buy_in: 5,
    max_buy_in: 100,
    denominations: '',
    password: ''
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
    this.poolSettings.has_password = this.poolSettings.password ? true : false; 
    this.poolService.createPool(
      this.poolName,
      this.device.id,
      this.poolSettings
    ).subscribe((poolCreationResponse) => {
      this.dialogRef.close(poolCreationResponse);
    });
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
