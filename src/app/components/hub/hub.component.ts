import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { POLLING_INTERVAL } from '@constants';
import { PoolData, PoolService } from 'src/app/services/pool/pool.service';
import { AuthService, Profile } from 'src/app/services/auth/auth.service';
import { Subscription, catchError, interval, startWith, of, switchMap } from 'rxjs';
import { DeviceService } from 'src/app/services/device/device.service';
import { IonModal, ModalController } from '@ionic/angular';
import { CreateGameModalComponent } from '../create-game-modal/create-game-modal.component';
import { JoinGameModalComponent } from '../join-game-modal/join-game-modal.component';

@Component({
  selector: 'app-hub',
  templateUrl: './hub.component.html',
  styleUrls: ['./hub.component.scss']
})
export class HubComponent implements OnInit, OnDestroy {
  @ViewChild('createGameModal') createGameModal!: IonModal;
  @ViewChild('joinGameModal') joinGameModal!: IonModal;
  
  public disabled: boolean = false;
  public poolData?: PoolData[];

  private profile?: Profile;
  private poller?: Subscription;

  constructor(
    private authService: AuthService,
    private modalCtrl: ModalController,
    private poolService: PoolService,
  ) {}

  ngOnInit(): void {
    this.profile = this.authService.getCurrentUser();

    this.poller = interval(POLLING_INTERVAL)
      .pipe(
        startWith(0),
        switchMap(() => this.poolService.getPoolsByUserID(this.profile?.id).pipe(catchError(() => of(null))))
      ).subscribe((poolData: PoolData[]) => { if (poolData) this.poolData = [...poolData]; });
  }

  ngOnDestroy() {
    this.poller?.unsubscribe();
  }

  ionViewWillEnter() {
    if (this.poller?.closed) {
      this.ngOnInit();
    }
  }

  ionViewWillLeave() {
    this.ngOnDestroy();
  }

  /**
   * Finds a PokerFlow device, creates a new game associated
   * with that device and navigates to its pool view
   */
  async createGame() {
    const modal = await this.modalCtrl.create({
      component: CreateGameModalComponent
    });
    modal.present();
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
  }
}
