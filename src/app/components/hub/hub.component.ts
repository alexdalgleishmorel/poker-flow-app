import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

import { PoolData, PoolService } from 'src/app/services/pool/pool.service';
import { CreateGameModalComponent } from '../create-game-modal/create-game-modal.component';
import { JoinGameModalComponent } from '../join-game-modal/join-game-modal.component';

@Component({
  selector: 'app-hub',
  templateUrl: './hub.component.html',
  styleUrls: ['./hub.component.scss']
})
export class HubComponent {
  public disabled: boolean = false;
  public poolData?: PoolData[];
  public currentList: string = 'active';

  constructor(private modalCtrl: ModalController, private poolService: PoolService, private router: Router) {}

  async createGame() {
    const modal = await this.modalCtrl.create({
      component: CreateGameModalComponent,
      cssClass: 'modal-fullscreen'
    });
    modal.present();

    document.querySelector('.modal-fullscreen')?.shadowRoot?.querySelector('.modal-wrapper')?.setAttribute('style', 'width:100%; height:100%;');
  }

  async joinNewGame() {
    const modal = await this.modalCtrl.create({
      component: JoinGameModalComponent,
      cssClass: 'modal-fullscreen'
    });
    modal.present();

    document.querySelector('.modal-fullscreen')?.shadowRoot?.querySelector('.modal-wrapper')?.setAttribute('style', 'width:100%; height:100%;');

    const poolID = (await modal.onWillDismiss()).data;

    if (poolID) {
      this.poolService.joinPool(poolID).subscribe({
        next: () => {
          this.router.navigate(['/', `pool`, poolID]);
        },
        error: () => {}
      });
    }
  }

  updateList(listName: string) {
    this.currentList = listName;
  }
}
