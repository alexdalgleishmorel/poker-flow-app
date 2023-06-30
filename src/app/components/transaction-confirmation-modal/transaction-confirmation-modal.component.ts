import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TransactionType } from 'src/app/services/pool/pool.service';

@Component({
  selector: 'app-transaction-confirmation-modal',
  templateUrl: './transaction-confirmation-modal.component.html',
  styleUrls: ['./transaction-confirmation-modal.component.scss']
})
export class TransactionConfirmationModalComponent {
  constructor(
    public dialogRef: MatDialogRef<TransactionConfirmationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}

  isBuyIn(type: string) {
    return type === TransactionType.BUY_IN;
  }

  isCashOut(type: string) {
    return type === TransactionType.CASH_OUT;
  }

  dismiss() {
    this.dialogRef.close();
  }
}
