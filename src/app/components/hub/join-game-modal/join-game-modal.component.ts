import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IonInput, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-join-game-modal',
  templateUrl: './join-game-modal.component.html',
  styleUrls: ['./join-game-modal.component.scss'],
})
export class JoinGameModalComponent implements AfterViewInit {

  public poolIDFormControl: FormControl = new FormControl('');

  @ViewChild('input') poolIDInput?: IonInput;

  constructor(private modalCtrl: ModalController) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.poolIDInput?.setFocus();
    }, 500);
  }

  cancel() {
    this.modalCtrl.dismiss();
  }

  joinGame() {
    this.modalCtrl.dismiss(this.poolIDFormControl.getRawValue());
  }
}
