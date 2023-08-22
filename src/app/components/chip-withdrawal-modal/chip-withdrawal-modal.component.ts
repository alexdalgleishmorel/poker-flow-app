import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
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
  public status: number[] = [];
  public progressPercentage: number = 0;
  public remainingChips: number = 1;

  private initialWithdrawalRequest: number[] = [];
  private totalChipsRequested: number = 0;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private deviceService: DeviceService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit(): void {
    if (!this.withdrawalRequest) {
      return;
    }

    this.withdrawalRequest.denominations.forEach((chips: number) => this.totalChipsRequested += chips);
    this.remainingChips = this.totalChipsRequested;

    this.initialWithdrawalRequest = [...this.withdrawalRequest.denominations];
    this.status = Array<number>(this.withdrawalRequest.denominations.length).fill(0);

    this.deviceService.withdrawChips(this.withdrawalRequest);

    this.deviceService.withdrawalRequestStatus.subscribe((status: number[]) => {
      if (!status.length) {
        return;
      }

      let remainingChips = 0;
      this.status = status.map((value, index) => {
        remainingChips += value;
        return this.initialWithdrawalRequest[index] - value;
      });
      this.remainingChips = remainingChips;

      this.progressPercentage = 1 - (remainingChips / this.totalChipsRequested);

      this.changeDetectorRef.detectChanges();
    });
  }

  dismissWithSuccess() {
    this.modalCtrl.dismiss(true);
  }

  cancel() {
    this.modalCtrl.dismiss(false);
  }
}
