import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Socket } from 'ngx-socket-io';

import { ApiService } from '../api/api.service';
import { AuthService, Profile } from '../auth/auth.service';
import { EMPTY_GAME_DATA } from '@constants';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  public colorThemeSubject: Subject<number> = new Subject<number>();
  public currentGameSubject: BehaviorSubject<GameData> = new BehaviorSubject<GameData>(EMPTY_GAME_DATA);
  public updateNotification: Subject<number> = new Subject<number>();

  constructor(private apiService: ApiService, private authService: AuthService, private socket: Socket) {
    this.socket.on('game_updated', () => this.updateNotification.next(1));
  }

  /**
   * @param {number} userID The user ID used to search for games
   * @param {number} itemOffset The starting index to retrieve found games from
   * @param {number} itemsPerPage The maximum number of games to retrieve at once
   * @param {boolean} active Whether to retrieve active games or expired games
   * 
   * @returns {Promise<any>} Promise containing a list of games
   */
  getGamesByUserID(userID: number, itemOffset: number, itemsPerPage: number, active: boolean): Promise<any> {
    if (!userID) {
      return Promise.resolve();
    }
    return this.apiService.get(`/game/${active ? 'active' : 'expired'}/user/${userID}`, {
      params: { itemOffset: itemOffset, itemsPerPage: itemsPerPage }
    });
  }

  /**
   * @param {string} gameID The ID of the game data to retrieve
   * 
   * @returns {Promise<any>} Promise containing game data
   */
  getGameByID(gameID: string): Promise<any> {
    if (!gameID) {
      return Promise.resolve();
    };
    
    return this.apiService.get(`/game/${gameID}`);
  }

  /**
   * Creates a new game based on the provided configurations
   * 
   * @param {string} name The name of the game to create 
   * @param {GameSettings} settings The settings associated with the game
   *  
   * @returns {Promise<any>} Promise containing the game data
   */
  createGame(name: string, settings: GameSettings, adminID: number): Promise<any> {
    const gameCreationRequest: GameCreationRequest = {
      name: name,
      settings: settings,
      adminID: adminID
    };

    return this.apiService.post('/game/create', gameCreationRequest);
  }

  /**
   * Updates the game data based on the provided key-pair values, using the provided game ID
   * 
   * @param {string} gameID The ID of the game being updated
   * @param {GameUpdateRequest[]} updateRequests An array of key-pair values of game attributes to update
   * 
   * @returns {Promise<any>}
   */
  updateGameSettings(gameID: string, updateRequests: GameUpdateRequest[]): Promise<any> {
    return this.apiService.post('/game/settings/update', {
      gameID: gameID,
      update_requests: updateRequests
    });
  }

  /**
   * Adds the provided user to the provided game
   * 
   * @param {string} gameID The ID of the game being joined
   * @param {number} userID The ID of the user
   *  
   * @returns {Promise<any>}
   */
  joinGame(gameID: string, userID: number): Promise<any> {
    const gameJoinRequest: GameJoinRequest = {
      gameID: gameID,
      profileID: userID
    };
    return this.apiService.post('/game/join', gameJoinRequest);
  }

  /**
   * Posts the provided transaction
   * 
   * @param {GameTransactionRequest} gameTransactionRequest The game transaction data
   * 
   * @returns {Promise<any>}
   */
  postTransaction(gameTransactionRequest: GameTransactionRequest): Promise<any> {
    return this.apiService.post(`/game/transaction/create`, gameTransactionRequest);
  }
}

export interface GameData {
  name: string;
  dateCreated: string;
  id: string;
  availableCashout: number;
  memberIDs: number[];
  contributors: GameMember[];
  transactions: GameTransaction[];
  admin: Profile;
  settings: GameSettings;
}

export interface GameMember {
  profile: Profile;
  contribution: number;
}

export enum TransactionType {
  BUY_IN = 'BUY_IN',
  CASH_OUT = 'CASH_OUT'
}

export interface GameTransaction {
  id: number;
  profile: Profile;
  date: string;
  type: TransactionType;
  amount: number;
  denominations: number[];
}

export interface GameTransactionRequest {
  gameID: string;
  profileID: number;
  type: TransactionType;
  amount: number;
  denominations: number[];
}

export interface GameSettings {
  minBuyIn: number;
  maxBuyIn: number;
  denominations: number[];
  denominationColors: string[];
  buyInEnabled: boolean;
  expired: boolean;
}

export interface GameCreationRequest {
  name: string;
  settings: GameSettings;
  adminID: number;
}

export interface GameUpdateRequest {
  attribute: string;
  value: any;
}

export interface GameJoinRequest {
  gameID: string;
  profileID: number;
}
