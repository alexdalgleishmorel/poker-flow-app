import { Component, Input, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';

import { AuthService } from 'src/app/services/auth/auth.service';
import { GameData, GameService } from 'src/app/services/game/game.service';

@Component({
  selector: 'app-games-list',
  templateUrl: './games-list.component.html',
  styleUrls: ['./games-list.component.scss'],
})
export class GamesListComponent implements OnInit {
  @Input() activeGames: boolean = true;

  public games?: GameData[];
  public noNewData: boolean = false;

  private itemOffset: number = 0;
  private itemsPerPage: number = 15;

  constructor(private authService: AuthService, private gameService: GameService) {}

  /**
   * Initializes the list data, subscribes to data updates and re-initializes the list in those cases
   */
  ngOnInit() {
    this.initializeData();
    this.gameService.updateGamesListRequest.subscribe(() => this.initializeData());
  }

  /**
   * Removes existing data and resets the item offset, then requests new data
   */
  initializeData() {
    this.games = undefined;
    this.itemOffset = 0;
    this.getData();
  }

  /**
   * Gets data to populate the list
   * 
   * @param {any} event An optional infinite scroll event, if it is the source of the data request 
   */
  public getData(event?: InfiniteScrollCustomEvent) {
    const userID = this.authService.getCurrentUser()?.id;
    if (!userID) {
      return;
    }
    this.gameService.getGamesByUserID(userID, this.itemOffset, this.itemsPerPage, this.activeGames)
      .then(games => {
        this.games = this.games ? [...this.games.concat(games)] : games;
        this.itemOffset += games.length;
        if (!games.length) {
          this.noNewData = true;
        }
        if (event) {
          event.target.complete();
        }
      });
  }
}
