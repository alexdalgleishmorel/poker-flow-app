import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PoolData, PoolService } from 'src/app/services/pool/pool.service';

@Component({
  selector: 'app-create-game-modal',
  templateUrl: './create-game-modal.component.html',
  styleUrls: ['./create-game-modal.component.scss']
})
export class CreateGameModalComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<CreateGameModalComponent>,
    private poolService: PoolService
  ) {}

  createGame() {
    this.poolService.createPool().subscribe((poolCreationResponse) => {
      this.dialogRef.close(poolCreationResponse);
    });
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
