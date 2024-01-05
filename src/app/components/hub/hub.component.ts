import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

import { CreateGameModalComponent } from './create-game-modal/create-game-modal.component';
import { JoinGameModalComponent } from './join-game-modal/join-game-modal.component';
import { PoolData, PoolService } from 'src/app/services/pool/pool.service';

@Component({
  selector: 'app-hub',
  templateUrl: './hub.component.html',
  styleUrls: ['./hub.component.scss']
})
export class HubComponent {
  public disabled: boolean = false;
  public currentList: ListState = ListState.ACTIVE;
  public poolData?: PoolData[];

  readonly ACTIVE: ListState = ListState.ACTIVE;
  readonly PAST: ListState = ListState.PAST;

  constructor(private modalCtrl: ModalController, private poolService: PoolService, private router: Router) {}

  /**
   * Sends an update notification when the view is entered, to ensure proper data is displayed
   */
  ionViewWillEnter() {
    this.poolService.updateNotification.next(1);
  }

  /**
   * Opens a create game modal
   */
  async createGame() {
    const modal = await this.modalCtrl.create({
      component: CreateGameModalComponent,
      cssClass: 'modal-fullscreen'
    });
    modal.present();

    document.querySelector('.modal-fullscreen')?.shadowRoot?.querySelector('.modal-wrapper')?.setAttribute('style', 'width:100%; height:100%;');
  }

  /**
   * Opens a join game modal
   */
  async joinNewGame() {
    const modal = await this.modalCtrl.create({
      component: JoinGameModalComponent,
      cssClass: 'modal-fullscreen'
    });
    modal.present();

    document.querySelector('.modal-fullscreen')?.shadowRoot?.querySelector('.modal-wrapper')?.setAttribute('style', 'width:100%; height:100%;');

    const poolID = (await modal.onWillDismiss()).data;

    if (poolID) {
      this.poolService.joinPool(poolID).then(() => this.router.navigate(['/', `pool`, poolID]));
    }
  }

  /**
   * Updates the currently active list to the given listState
   * 
   * @param {ListState} listState The listState to update to
   */
  updateList(listState: ListState) {
    this.currentList = listState;
  }
}

enum ListState {
  ACTIVE = 'ACTIVE',
  PAST = 'PAST'
}
