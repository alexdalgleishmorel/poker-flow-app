import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DeviceService, PokerFlowDevice } from 'src/app/services/device/device.service';

@Component({
  selector: 'app-chip-deposit-modal',
  templateUrl: './chip-deposit-modal.component.html',
  styleUrls: ['./chip-deposit-modal.component.scss']
})
export class ChipDepositModalComponent implements OnInit {
  @Input() denominations: number[] = [];

  public depositInProgress: boolean = true;
  public depositRequestStatus: number[] = [];
  public device?: PokerFlowDevice;

  constructor(
    private deviceService: DeviceService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit(): void {
    this.deviceService.connectToDevice().then((device: PokerFlowDevice|null) => {
      if (device) {
        this.device = device;
        this.device.startChipDeposit();
        this.device.depositRequestStatus?.subscribe((status: number[]) => {
          this.depositRequestStatus = status;
        });
      }
    });
  }

  completeDeposit() {
    if (this.device) {
      this.depositInProgress = false;
      this.device.completeChipDeposit();
      this.modalCtrl.dismiss(this.calculateDepositTotal());
    }
  }

  cancelDeposit() {
    this.modalCtrl.dismiss(null);
  }

  calculateDepositTotal(): number {
    if (!this.device) {
      return 0;
    }

    let total: number = 0;
    let slot: number = 0;
    this.device.depositRequestStatus?.getValue().forEach((denominationCount: number) => {
      total += (denominationCount * this.denominations[slot]);
      slot += 1;
    });
    return total;
  }
}
