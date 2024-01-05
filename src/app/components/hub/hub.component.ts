import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

import { CreateGameModalComponent } from './create-game-modal/create-game-modal.component';
import { JoinGameModalComponent } from './join-game-modal/join-game-modal.component';
import { GameData, GameService } from 'src/app/services/game/game.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-hub',
  templateUrl: './hub.component.html',
  styleUrls: ['./hub.component.scss']
})
export class HubComponent {
  public disabled: boolean = false;
  public currentList: ListState = ListState.ACTIVE;
  public gameData?: GameData[];

  readonly ACTIVE: ListState = ListState.ACTIVE;
  readonly PAST: ListState = ListState.PAST;

  constructor(
    private authService: AuthService, 
    private modalCtrl: ModalController, 
    private gameService: GameService, 
    private router: Router
  ) {}

  /**
   * Sends an update notification when the view is entered, to ensure proper data is displayed
   */
  ionViewWillEnter() {
    this.gameService.updateNotification.next(1);
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

    const gameID = (await modal.onWillDismiss()).data;
    const userID = this.authService.getCurrentUser()?.id;

    if (gameID && userID) {
      this.gameService.joinGame(gameID, userID).then(() => this.router.navigate(['/', `game`, gameID]));
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
