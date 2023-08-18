import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DeviceService } from 'src/app/services/device/device.service';

@Component({
  selector: 'app-chip-deposit-modal',
  templateUrl: './chip-deposit-modal.component.html',
  styleUrls: ['./chip-deposit-modal.component.scss']
})
export class ChipDepositModalComponent implements OnInit {
  @Input() denominations: number[] = [];

  public depositRequestStatus: number[] = [];

  constructor(
    private deviceService: DeviceService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit(): void {
    this.deviceService.depositRequestStatus.subscribe((status: number[]) => {
      this.depositRequestStatus = status;
    });
    this.deviceService.startChipDeposit();
  }

  completeDeposit() {
    this.deviceService.completeChipDeposit();
    this.modalCtrl.dismiss(this.calculateDepositTotal());
  }

  cancelDeposit() {
    this.deviceService.completeChipDeposit();
    this.modalCtrl.dismiss(null);
  }

  calculateDepositTotal(): number {
    let total: number = 0;
    let slot: number = 0;
    this.depositRequestStatus.forEach((denominationCount: number) => {
      total += (denominationCount * this.denominations[slot]);
      slot += 1;
    });
    return total;
  }
}
