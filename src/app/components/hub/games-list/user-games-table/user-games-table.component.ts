import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { InfiniteScrollCustomEvent } from '@ionic/angular';

import { GameData } from 'src/app/services/game/game.service';

@Component({
  selector: 'app-user-games-table',
  templateUrl: './user-games-table.component.html',
  styleUrls: ['./user-games-table.component.scss']
})
export class UserGamesTableComponent implements OnInit {
  @Input() dataSource: GameData[] = [];
  @Input() disabled: boolean = false;
  @Input() noNewData: boolean = false;
  @Output() getMoreData: EventEmitter<InfiniteScrollCustomEvent> = new EventEmitter<InfiniteScrollCustomEvent>();

  public displayedColumns: string[] = [];
  public unfilteredData: GameData[] = [];
  private filteredData: GameData[] = [];

  constructor(private router: Router) {}

  /**
   * Initializes the unfiltered data to be the provided data source
   */
  ngOnInit() {
    this.unfilteredData = this.dataSource;
  }

  /**
   * Navigates the user to the selected game
   * 
   * @param {GameData} gameData The game data associated with the selected game
   */
  openGame(gameData: GameData) {
    this.router.navigate(['/', `game`, gameData.id]);
  }

  /**
   * Handles infinite scroll events
   * 
   * @param {any} event The infinite scroll event
   */
  onInfiniteScroll(event: any) {
    this.getMoreData.emit(event as InfiniteScrollCustomEvent);
  }

  /**
   * Handles search events
   * 
   * @param {any} event The input event, containing the search value
   */
  handleSearch(event: any) {
    const searchValue = event.target.value.toLowerCase();
    this.dataSource = this.unfilteredData;

    if (!searchValue) {
      return;
    }

    this.filteredData = this.dataSource.filter(gameData => gameData.name.toLowerCase().includes(searchValue));
    this.dataSource = this.filteredData;
  }
}
