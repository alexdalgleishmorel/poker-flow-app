import { Component, OnDestroy, OnInit, Pipe, PipeTransform } from '@angular/core';

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
      this.poolService.updateNotification.next(1);
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

@Pipe({
  name: 'thousandSuff'
})
export class ThousandSuffixesPipe implements PipeTransform {
  transform(input: any, args?: any): any {
    var exp, suffixes = ['K', 'M', 'B', 'T', 'P', 'E'];

    if (Number.isNaN(input) || input < 0) {
      return null;
    }

    if (input < 1) {
      return '¢' + (input*100).toFixed(args);
    }

    if (input < 1000) {
      return '$' + input;
    }

    exp = Math.floor(Math.log(input) / Math.log(1000));

    return '$' + (input / Math.pow(1000, exp)).toFixed(args) + suffixes[exp - 1];
  }
}
