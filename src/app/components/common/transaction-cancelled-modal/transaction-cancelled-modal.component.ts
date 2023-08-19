import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-transaction-cancelled-modal',
  templateUrl: './transaction-cancelled-modal.component.html',
  styleUrls: ['./transaction-cancelled-modal.component.scss'],
})
export class TransactionCancelledModalComponent {

  constructor(private modalCtrl: ModalController) {}

  dismiss() {
    this.modalCtrl.dismiss(null);
  }
}
