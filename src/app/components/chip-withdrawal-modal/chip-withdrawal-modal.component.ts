import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DeviceService, DeviceWithdrawalRequest } from 'src/app/services/device/device.service';

@Component({
  selector: 'app-chip-withdrawal-modal',
  templateUrl: './chip-withdrawal-modal.component.html',
  styleUrls: ['./chip-withdrawal-modal.component.scss']
})
export class ChipWithdrawalModalComponent implements OnInit {
  @Input() denominations: number[] = [];
  @Input() withdrawalRequest?: DeviceWithdrawalRequest;
  public withdrawalRequestStatus: number[] = [];

  private initialWithdrawalRequest: number[] = [];
  private totalChipsRequested: number = 0;

  constructor(
    private deviceService: DeviceService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit(): void {
    if (!this.withdrawalRequest) {
      return;
    }

    this.withdrawalRequest.denominations.forEach((chips: number) => this.totalChipsRequested += chips);
    this.initialWithdrawalRequest = [...this.withdrawalRequest.denominations];
    this.withdrawalRequestStatus = [...this.withdrawalRequest.denominations];

    this.deviceService.withdrawChips(this.withdrawalRequest);

    this.deviceService.withdrawalRequestStatus.subscribe((status: number[]) => {
      if (!status.length) {
        return;
      }
      for (let i = 0; i < this.withdrawalRequest!.denominations.length; i ++) {
        this.withdrawalRequestStatus[i] = this.initialWithdrawalRequest[i] - status[i];
      }
      if (JSON.stringify(this.withdrawalRequestStatus) === JSON.stringify(this.initialWithdrawalRequest)) {
        this.modalCtrl.dismiss(null);
      }
    });
  }

  getChipWithdrawalProgress() {
    if (!this.withdrawalRequestStatus.length || !this.deviceService.withdrawalRequestStatus.getValue().length) {
      return 0;
    }

    let totalChipsRemainingToWithdraw: number = 0;
    this.deviceService.withdrawalRequestStatus.getValue().forEach(
      (chipsRemainingToWithdrawFromSlot: number) => totalChipsRemainingToWithdraw += chipsRemainingToWithdrawFromSlot
    );
    const totalChipsWithdrawn = this.totalChipsRequested - totalChipsRemainingToWithdraw;

    return (totalChipsWithdrawn/this.totalChipsRequested);
  }
}
