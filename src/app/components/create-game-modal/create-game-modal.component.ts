import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DEFAULT_DENOMINATIONS, DEFAULT_MAX_BUY_IN, DEFAULT_MIN_BUY_IN } from '@constants';
import { PokerFlowDevice } from 'src/app/services/device/device.service';
import { PoolData, PoolService, PoolSettings } from 'src/app/services/pool/pool.service';

@Component({
  selector: 'app-create-game-modal',
  templateUrl: './create-game-modal.component.html',
  styleUrls: ['./create-game-modal.component.scss']
})
export class CreateGameModalComponent {
  public hasError = true;
  public poolName: string = '';
  public poolSettings: PoolSettings;
  
  private device: PokerFlowDevice;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<CreateGameModalComponent>,
    private poolService: PoolService
  ) {
    this.device = data.device;
    this.poolSettings = {
      has_password: false,
      min_buy_in: DEFAULT_MIN_BUY_IN,
      max_buy_in: DEFAULT_MAX_BUY_IN,
      denominations: DEFAULT_DENOMINATIONS.slice(0, this.device.slots)
    }
  }

  createGame() {
    this.poolSettings.has_password = this.poolSettings.password ? true : false; 
    this.poolService.createPool(
      this.poolName,
      this.device.id,
      this.poolSettings
    ).then((poolCreationResponse) => {
      this.dialogRef.close(poolCreationResponse);
    });
  }

  cancel() {
    this.dialogRef.close(null);
  }

  onPoolNameInput() {
    this.hasError = this.poolName ? false : true;
  }

  trackByFn(index: any, item: any) {
    return index;  
  }
}
