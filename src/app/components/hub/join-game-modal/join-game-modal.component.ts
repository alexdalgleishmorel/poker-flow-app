import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-join-game-modal',
  templateUrl: './join-game-modal.component.html',
  styleUrls: ['./join-game-modal.component.scss'],
})
export class JoinGameModalComponent {
  public gameIDFormControl: FormControl = new FormControl('');

  constructor(private modalCtrl: ModalController) {}

  /**
   * Closes the modal with no data
   */
  cancel() {
    this.modalCtrl.dismiss();
  }

  /**
   * Closes the modal with the gameID value
   */
  closeWithGameID() {
    this.modalCtrl.dismiss(this.gameIDFormControl.getRawValue());
  }
}
