import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { COLOR_GROUPS } from '@constants';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
})
export class ColorPickerComponent {
  public colorGroups: ColorGroup[] = COLOR_GROUPS;

  constructor(private modalCtrl: ModalController) {}

  /**
   * Closes the modal without having a color chosen
   */
  closeModalWithNoColor() {
    this.modalCtrl.dismiss();
  }

  /**
   * Closes the modal with the selected color as its data
   * 
   * @param color The selected color
   */
  closeModalWithColor(color: string) {
    this.modalCtrl.dismiss(color);
  }
}

interface ColorGroup {
  name: string;
  shades: string[];
}
