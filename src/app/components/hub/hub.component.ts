import { Component, ViewChild } from '@angular/core';
import { PoolData, PoolService } from 'src/app/services/pool/pool.service';
import { AlertController, IonModal, ModalController } from '@ionic/angular';
import { CreateGameModalComponent } from '../create-game-modal/create-game-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hub',
  templateUrl: './hub.component.html',
  styleUrls: ['./hub.component.scss']
})
export class HubComponent {
  @ViewChild('createGameModal') createGameModal!: IonModal;
  
  public disabled: boolean = false;
  public poolData?: PoolData[];

  constructor(
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private poolService: PoolService,
    private router: Router
  ) {}

  ionViewWillEnter() {
    this.poolService.newDataRequest.next(true);
  }

  /**
   * Finds a PokerFlow device, creates a new game associated
   * with that device and navigates to its pool view
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
   * Finds a PokerFlow device, displays available games associated 
   * with that device, and allows the user to join a game
   */
  async joinNewGame() {
    const alert = await this.alertCtrl.create({
      buttons: ['CANCEL', 'JOIN'],
      backdropDismiss: false,
      inputs: [
        {
          placeholder: 'Pool ID',
          cssClass: 'centered-text',
          attributes: {
            maxlength: 8
          },
        },
      ],
      message: 'Please provide a pool ID',
    });
    alert.present();

    const poolID = (await alert.onWillDismiss()).data.values[0];

    if (poolID) {
      this.poolService.getPoolByID(poolID).subscribe({
        next: () => {
          this.router.navigate(['/', `pool`, poolID]);
        },
        error: () => {}
      });
    }
  }
}
