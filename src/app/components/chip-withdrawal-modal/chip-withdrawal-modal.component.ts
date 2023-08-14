import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DeviceService, DeviceWithdrawalRequest, PokerFlowDevice } from 'src/app/services/device/device.service';

@Component({
  selector: 'app-chip-withdrawal-modal',
  templateUrl: './chip-withdrawal-modal.component.html',
  styleUrls: ['./chip-withdrawal-modal.component.scss']
})
export class ChipWithdrawalModalComponent implements OnInit {
  @Input() denominations: number[] = [];
  @Input() withdrawalRequest?: DeviceWithdrawalRequest;
  public device?: PokerFlowDevice;
  public withdrawalRequestStatus: number[] = [];

  private initialWithdrawalRequest: number[] = [];
  private totalChipsRequested: number = 0;

  constructor(
    private deviceService: DeviceService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit(): void {
    if (this.withdrawalRequest) {
      this.withdrawalRequest.denominations.forEach((chips: number) => this.totalChipsRequested += chips);
      this.initialWithdrawalRequest = [...this.withdrawalRequest.denominations];
      this.withdrawalRequestStatus = [...this.withdrawalRequest.denominations];
    }

    this.deviceService.connectToDevice().then((device: PokerFlowDevice|null) => {
      if (device && this.withdrawalRequest) {
        this.device = device;
        this.deviceService.withdrawChips(this.device, this.withdrawalRequest);

        this.device.withdrawalRequestStatus?.subscribe((withdrawalRequestStatus: number[]) => {
          if (!withdrawalRequestStatus.length) {
            return;
          }
          for (let i = 0; i < this.withdrawalRequest!.denominations.length; i ++) {
            this.withdrawalRequestStatus[i] = this.initialWithdrawalRequest[i] - withdrawalRequestStatus[i];
          }
          if (JSON.stringify(this.withdrawalRequestStatus) === JSON.stringify(this.initialWithdrawalRequest)) {
            this.modalCtrl.dismiss(null);
          }
        });
      }
    });
  }

  getChipWithdrawalProgress() {
    if (!this.withdrawalRequestStatus.length || !this.device?.withdrawalRequestStatus?.getValue().length) return 0;

    let totalChipsRemainingToWithdraw: number = 0;
    this.device.withdrawalRequestStatus?.getValue().forEach(
      (chipsRemainingToWithdrawFromSlot: number) => totalChipsRemainingToWithdraw += chipsRemainingToWithdrawFromSlot
    );
    const totalChipsWithdrawn = this.totalChipsRequested - totalChipsRemainingToWithdraw;

    return (totalChipsWithdrawn/this.totalChipsRequested);
  }
}
