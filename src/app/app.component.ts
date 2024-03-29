import { Component, OnDestroy, OnInit } from '@angular/core';

import { GameService } from './services/game/game.service';

export const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(private gameService: GameService) {
    toggleDarkTheme(getPrefersDark());
  }

  ngOnInit() {
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  ngOnDestroy() {
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  }

  private handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      this.gameService.updateGamesListRequest.next(1);
      this.gameService.updateCurrentPoolRequest.next(1);
    }
  }
}

const PREFERS_DARK_COLOR_SCHEME = 'PREFERS_DARK_COLOR_SCHEME';

function getPrefersDarkFromStorage(): boolean {
  return localStorage.getItem(PREFERS_DARK_COLOR_SCHEME) === 'true' ? true : false;
}

export function toggleDarkTheme(enable: boolean) {
  document.body.classList.toggle('dark', enable);
  localStorage.setItem(PREFERS_DARK_COLOR_SCHEME, String(enable));
}

export function getPrefersDark(): boolean {
  return localStorage.getItem(PREFERS_DARK_COLOR_SCHEME) ? getPrefersDarkFromStorage() : window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function getLogoSVGName(prefix: string): string {
  return getPrefersDark() ? prefix.concat('logo-dark.svg') : prefix.concat('logo-light.svg');
}
