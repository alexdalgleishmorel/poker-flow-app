import { Component, OnDestroy, OnInit } from '@angular/core';

import { PoolService } from './services/pool/pool.service';

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
  constructor(private poolService: PoolService) {
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
      this.poolService.updateNotification.next(this.poolService.updateNotification.getValue()+1);
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
