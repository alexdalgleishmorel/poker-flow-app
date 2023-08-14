import { AfterViewInit, ChangeDetectorRef, Component, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { DeviceService, DeviceWithdrawalRequest, PokerFlowDevice } from 'src/app/services/device/device.service';

@Component({
  selector: 'app-buy-in-modal',
  templateUrl: './buy-in-modal.component.html',
  styleUrls: ['./buy-in-modal.component.scss']
})
export class BuyInModalComponent implements AfterViewInit {
  @Input() minBuyIn: number = 0;
  @Input() maxBuyIn: number = 0;
  @Input() denominations: number[] = [];
  public assignments: number[] = [];

  public buyInFormControl: FormControl;

  public form: FormGroup;

  public device?: PokerFlowDevice;
  
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private deviceService: DeviceService,
    private modalCtrl: ModalController,
    private _formBuilder: FormBuilder
  ) {

    this.buyInFormControl = new FormControl(``, []);

    this.form = this._formBuilder.group({
      buyIn: this.buyInFormControl
    });

    this.deviceService.connectToDevice().then((device: PokerFlowDevice|null) => {
      if (device) {
        this.device = device;
        //this.device.assignDeviceStatus();
        this.device.status.subscribe(() => {
          if (this.device?.inventory) {
            this.buyInFormControl.updateValueAndValidity();
          }
        });
      }
    });
  }

  ngAfterViewInit(): void {
    this.buyInFormControl.setValidators([
      Validators.required,
      Validators.min(this.minBuyIn), 
      Validators.max(this.maxBuyIn),
      this.buyInValidator()
    ]);
    this.buyInFormControl.updateValueAndValidity();
    this.changeDetectorRef.detectChanges();
  }

  confirmBuyIn() {
    const deviceWithdrawalRequest: DeviceWithdrawalRequest = {
      amount: +this.buyInFormControl.value!,
      denominations: this.assignments
    };
    this.modalCtrl.dismiss(deviceWithdrawalRequest);
  }

  cancelBuyIn() {
    this.modalCtrl.dismiss(null);
  }

  resetAssignments() {
    this.assignments = [];
    this.denominations.forEach(() => this.assignments.push(0));
  }

  totalChipsInInventory(deviceInventory: number[]) {
    let totalChips: number = 0;
    deviceInventory.forEach((inventory) => {
      totalChips += inventory;
    });
    return totalChips;
  }

  inventoryCanSupply(value: number): boolean {
    let buyInToSettle: number = value;
    let inventoryCopy = [...this.device?.inventory!];
    this.resetAssignments();

    while (buyInToSettle > 0 && this.totalChipsInInventory(inventoryCopy) > 0) {
      let slot: number = 0;
      let chipMatch: boolean = false;
      
      this.denominations.forEach((denomination: number) => {

        let availableChips = Math.floor(buyInToSettle/denomination);

        if (inventoryCopy[slot] && availableChips > 0) {
          chipMatch = true;
          this.assignments[slot] += 1;
          inventoryCopy[slot] -= 1;
          buyInToSettle = +(buyInToSettle - denomination).toFixed(2);
        }
        
        slot += 1;
      });
      
      if (!chipMatch) break;
    }

    return buyInToSettle ? false : true;
  }

  buyInValidator(): ValidatorFn {
    return (control:AbstractControl) : ValidationErrors | null => {
      
      const value = control.value;

      if (!this.device) {
        return {'devicConnectionError': true};
      }

      if (!value) {
        return {'required': true};
      }

      if (this.device.inventory && !this.inventoryCanSupply(value)) {
        this.resetAssignments();
        return { 'insufficientInventory': true };
      }
      
      return null;
    }
  }

  decimalFilter(event: any) {
    const reg = /^-?\d*(\.\d{0,1})?$/;
    let input = event.target.value + String.fromCharCode(event.charCode);
 
    if (!reg.test(input)) {
        event.preventDefault();
    }
  }

  onBuyInFocusOut() {
    if (!this.buyInFormControl.value) this.buyInFormControl.setValue(this.minBuyIn.toString());
  }
}
