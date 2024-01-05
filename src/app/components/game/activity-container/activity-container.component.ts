import { Component, OnInit } from '@angular/core';

import { GameService, GameTransaction } from 'src/app/services/game/game.service';

@Component({
  selector: 'app-activity-container',
  templateUrl: './activity-container.component.html',
  styleUrls: ['./activity-container.component.scss'],
})
export class ActivityContainerComponent  implements OnInit {
  public transactions?: GameTransaction[];

  constructor(private gameService: GameService) {}

  /**
   * Subscribes to the currently displayed game as a data source for the game activity list
   */
  ngOnInit() {
    this.gameService.currentGameSubject.subscribe(gameData => {
      this.transactions = [...gameData.transactions].reverse();
    });
  }
}
