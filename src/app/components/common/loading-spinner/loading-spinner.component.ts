import { Component } from '@angular/core';

import { getLogoSVGName } from 'src/app/app.component';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss'],
})
export class LoadingSpinnerComponent {
  constructor() {}

  /**
   * @param {string} prefix The path to the assets directory containing the logo
   * @returns {string} The full file path of the logo, based on light or dark theme
   */
  getLogoName = (prefix: string): string => getLogoSVGName(prefix);
}
