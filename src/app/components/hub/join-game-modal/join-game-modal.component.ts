import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-join-game-modal',
  templateUrl: './join-game-modal.component.html',
  styleUrls: ['./join-game-modal.component.scss'],
})
export class JoinGameModalComponent {

  public poolIDFormControl: FormControl = new FormControl('');

  constructor(private modalCtrl: ModalController) {}

  cancel() {
    this.modalCtrl.dismiss();
  }

  joinGame() {
    this.modalCtrl.dismiss(this.poolIDFormControl.getRawValue());
  }
}
