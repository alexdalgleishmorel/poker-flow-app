import { Component, OnInit } from '@angular/core';

import { currencyFormatter } from 'src/app/app.component';
import { GameData, GameMember, GameService } from 'src/app/services/game/game.service';

@Component({
  selector: 'app-chart-container',
  templateUrl: './chart-container.component.html',
  styleUrls: ['./chart-container.component.scss'],
})
export class ChartContainerComponent implements OnInit {
  public gameData?: GameData;
  public gameTotal: number = 0;

  constructor(private gameService: GameService) {}

  /**
   * Subscribes to game data and any updates it may receive
   */
  ngOnInit() {
    this.subscribeToGameData();
  }

  /**
   * Subscribes to the current game data being displayed, adjusting the game total and available cashout accordingly
   */
  subscribeToGameData() {
    this.gameService.currentGameSubject.subscribe(gameData => {
      this.gameData = gameData ? {...gameData} : this.gameData;
      this.gameTotal = 0;
      this.gameData?.contributors.forEach((contributor: GameMember) => {
        this.gameTotal += contributor.contribution;
      });
    });
  }

  /**
   * @returns {string} A currency representation of the total pot
   */
  getTotalPotRepresentation(): string {
    return currencyFormatter.format(this.gameTotal);
  }

  /**
   * @returns {string} A currency representation of the available cashout
   */
  getAvailableCashoutRepresentation(): string {
    return currencyFormatter.format(this.gameData?.availableCashout || 0);
  }
}
