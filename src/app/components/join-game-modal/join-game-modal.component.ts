import { Component } from '@angular/core';
import { PoolData, PoolService } from 'src/app/services/pool/pool.service';
import { ModalController } from '@ionic/angular';
import { PasswordModalComponent } from '../common/password-modal/password-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-join-game-modal',
  templateUrl: './join-game-modal.component.html',
  styleUrls: ['./join-game-modal.component.scss']
})
export class JoinGameModalComponent {
  public games: any[] = [];

  constructor(
    private modalCtrl: ModalController,
    private poolService: PoolService,
    private router: Router
  ) {}

  cancel() {
    this.modalCtrl.dismiss(null);
  }

  async joinGame(poolData: PoolData, retry: boolean = false) {
    this.poolService.joinPool(poolData.id).subscribe(() => {
      this.router.navigate(['/', `pool`, poolData.id]);
      this.modalCtrl.dismiss(poolData.id);
    });
  }
}
