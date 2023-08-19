import { Component, ViewChild } from '@angular/core';
import { PoolData } from 'src/app/services/pool/pool.service';
import { IonModal, ModalController } from '@ionic/angular';
import { CreateGameModalComponent } from '../create-game-modal/create-game-modal.component';
import { JoinGameModalComponent } from '../join-game-modal/join-game-modal.component';
import { DeviceService } from 'src/app/services/device/device.service';

@Component({
  selector: 'app-hub',
  templateUrl: './hub.component.html',
  styleUrls: ['./hub.component.scss']
})
export class HubComponent {
  @ViewChild('createGameModal') createGameModal!: IonModal;
  @ViewChild('joinGameModal') joinGameModal!: IonModal;
  
  public disabled: boolean = false;
  public poolData?: PoolData[];

  constructor(
    private deviceService: DeviceService,
    private modalCtrl: ModalController,
  ) {}

  /**
   * Finds a PokerFlow device, creates a new game associated
   * with that device and navigates to its pool view
   */
  async createGame() {
    const modal = await this.modalCtrl.create({
      component: CreateGameModalComponent
    });
    modal.present();
    this.deviceService.connectionCancelled.subscribe(cancelled => {
      if (cancelled) {
        modal.dismiss();
        this.deviceService.connectionCancelled.next(false);
      }
    });
  }

  /**
   * Finds a PokerFlow device, displays available games associated 
   * with that device, and allows the user to join a game
   */
  async joinNewGame() {
    const modal = await this.modalCtrl.create({
      component: JoinGameModalComponent
    });
    modal.present();
    this.deviceService.connectionCancelled.subscribe(cancelled => {
      if (cancelled) {
        modal.dismiss();
        this.deviceService.connectionCancelled.next(false);
      }
    });
  }
}
